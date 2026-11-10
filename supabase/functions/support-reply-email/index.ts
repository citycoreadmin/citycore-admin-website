// OPTIONAL and INACTIVE by default. Not deployed, not wired to any webhook.
//
// Purpose: email the requester when staff reply (a row is inserted into public.support_notifications).
// To activate (after approval): deploy this function, set the secrets below, then create a Database Webhook on
// INSERT of public.support_notifications that calls it with the header `x-webhook-secret`.
//
// Required secrets (set in Supabase, never in this repo):
//   SUPPORT_EMAIL_ENABLED=true   (any other value => the function does nothing)
//   SUPPORT_WEBHOOK_SECRET       (shared with the webhook)
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY  (provided by Supabase to Edge Functions)
//   RESEND_API_KEY, SUPPORT_EMAIL_FROM       (or swap sendEmail() for your provider)
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (Deno.env.get("SUPPORT_EMAIL_ENABLED") !== "true") return new Response("disabled", { status: 200 });
  if (req.method !== "POST") return new Response("method not allowed", { status: 405 });
  if (req.headers.get("x-webhook-secret") !== Deno.env.get("SUPPORT_WEBHOOK_SECRET")) {
    return new Response("unauthorized", { status: 401 });
  }

  const payload = await req.json().catch(() => null);
  const rec = payload?.record;
  if (!rec?.user_id || !rec?.ticket_id) return new Response("bad request", { status: 400 });

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });
  const { data: profile } = await admin.from("profiles").select("email, preferred_language").eq("id", rec.user_id).maybeSingle();
  const { data: ticket } = await admin.from("support_tickets").select("ticket_number").eq("id", rec.ticket_id).maybeSingle();
  if (!profile?.email || !ticket) return new Response("skipped", { status: 200 });
  const { data: allowed } = await admin.rpc("support_wants_notification", { p_user: rec.user_id, p_channel: "email" });
  if (allowed === false) return new Response("opted out", { status: 200 });

  const lang = String(profile.preferred_language ?? "en").slice(0, 2);
  const copy: Record<string, { subject: string; body: string }> = {
    en: { subject: "CityCore Admin Support replied", body: "Support replied to your ticket. Open the app or citycoreadmin.com to read it." },
    fr: { subject: "Le support CityCore Admin a répondu", body: "Le support a répondu à votre ticket. Ouvrez l'app ou citycoreadmin.com pour le lire." },
    // Haitian Creole needs native review before activation.
    ht: { subject: "Sipò CityCore Admin reponn", body: "Sipò a reponn tikè w la. Louvri app la oswa citycoreadmin.com pou li l." },
  };
  const c = copy[lang] ?? copy.en;
  // Never include message text: the email only points the user back to the authenticated ticket.
  await sendEmail(profile.email, `${c.subject} (${ticket.ticket_number})`, c.body);
  return new Response("sent", { status: 200 });
});

async function sendEmail(to: string, subject: string, text: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: Deno.env.get("SUPPORT_EMAIL_FROM"), to, subject, text }),
  });
  if (!res.ok) console.error("[SupportEmail] provider error", res.status);
}
