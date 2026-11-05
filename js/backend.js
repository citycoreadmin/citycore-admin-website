// Backend adapter. Uses Supabase when js/config.js has credentials; otherwise a local
// DEMO backend (localStorage) so every feature can be exercised without touching production.
const CFG = window.CITYCORE_CONFIG || {};
export const isDemo = !(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY);
const MAX_BYTES = (CFG.MAX_ATTACHMENT_MB || 50) * 1024 * 1024;

export function validateFiles(files) {
  for (const f of files) {
    if (!/^(image|video)\//.test(f.type) || f.size > MAX_BYTES || f.size === 0) return false;
  }
  return true;
}
const safeName = n => n.replace(/[^\w.\-]+/g, "_").slice(0, 100);
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random());

/* ============================================================== DEMO */
const DB_KEY = "cc_demo_db", SESSION_KEY = "cc_demo_session";
export const PLATFORM_ROLES = ["admin_5", "admin_4", "admin_3", "admin_2", "admin_1"];
// Mirrors the seeded defaults in the SQL migration (admin_5 = highest level below founder).
const DEFAULT_ROLE_PERMS = {
  admin_5: { reply: true, assign: true, change_status: true, view_stats: true, view_audit: true },
  admin_4: { reply: true, assign: true, change_status: true, view_stats: true, view_audit: true },
  admin_3: { reply: true, assign: true, change_status: true, view_stats: true, view_audit: false },
  admin_2: { reply: true, assign: false, change_status: true, view_stats: true, view_audit: false },
  admin_1: { reply: true, assign: false, change_status: false, view_stats: false, view_audit: false }
};
const ALL_PERMS = { reply: true, assign: true, change_status: true, view_stats: true, view_audit: true };

function loadDb() {
  let db = null;
  try { db = JSON.parse(localStorage.getItem(DB_KEY)); } catch { /* ignore */ }
  if (!db) {
    db = { seq: 1000, users: {}, tickets: [], messages: [], notifications: [], audit: [],
      staff: { "founder@demo.test": { role: "founder" } }, rolePerms: DEFAULT_ROLE_PERMS };
  }
  return db;
}
const saveDb = db => { localStorage.setItem(DB_KEY, JSON.stringify(db)); };

function demoBackend() {
  const listeners = new Set();
  const emit = () => listeners.forEach(f => f());
  window.addEventListener("storage", e => { if (e.key === DB_KEY || e.key === SESSION_KEY) emit(); });
  const me = () => { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; } };
  const requireUser = () => { const u = me(); if (!u) throw new Error("auth"); return u; };
  const staffEntry = (db, u) => (u && db.staff[u.email]) || null;
  const permsOf = (db, s) => (s.role === "founder" ? ALL_PERMS : (db.rolePerms || DEFAULT_ROLE_PERMS)[s.role] || {});
  const can = (db, u, perm) => { const s = staffEntry(db, u); return !!s && !!permsOf(db, s)[perm]; };
  const audit = (db, u, action, ticket_id, details = {}) =>
    db.audit.unshift({ id: uuid(), actor_email: u.email, action, ticket_id: ticket_id || null, details, created_at: new Date().toISOString() });
  const canSee = (db, u, t) => t.user_id === u.id || !!staffEntry(db, u);

  const fileToRecord = f => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res({ id: uuid(), name: f.name, mime: f.type, size: f.size, url: r.result });
    r.onerror = rej;
    r.readAsDataURL(f);
  });
  const view = (db, m) => ({ ...m, attachments: m.attachments || [] });

  return {
    mode: "demo",
    async init() {},
    onChange(cb) { listeners.add(cb); return () => listeners.delete(cb); },
    async getUser() { return me(); },
    hasGoogle: false,
    async signIn(identifier, pw) {
      const db = loadDb(); let email = identifier.trim().toLowerCase();
      if (!email.includes("@")) email = Object.keys(db.users).find(e => e.split("@")[0] === email) || email;
      const u = db.users[email];
      if (!u || u.pw !== pw) throw new Error("Invalid email or password");
      localStorage.setItem(SESSION_KEY, JSON.stringify({ id: u.id, email })); emit();
    },
    async signUp(email, pw) {
      const db = loadDb(); email = email.trim().toLowerCase();
      if (pw.length < 6) throw new Error("Password must be at least 6 characters");
      if (db.users[email]) throw new Error("Account already exists");
      db.users[email] = { id: uuid(), pw }; saveDb(db);
      localStorage.setItem(SESSION_KEY, JSON.stringify({ id: db.users[email].id, email })); emit();
    },
    async signInWithGoogle() { throw new Error("Google sign-in is not available in demo mode"); },
    async resetPassword() {},
    async signOut() { localStorage.removeItem(SESSION_KEY); emit(); },
    async staffRole() {
      const db = loadDb(), u = me(); const s = staffEntry(db, u);
      return s ? { role: s.role, permissions: permsOf(db, s) } : null;
    },

    async createTicket({ category, subject, body, files = [], platform, language }) {
      const db = loadDb(), u = requireUser();
      if (!subject.trim() || !body.trim()) throw new Error("required");
      if (!validateFiles(files)) throw new Error("file");
      const now = new Date().toISOString();
      const t = { id: uuid(), ticket_number: "CC-" + (++db.seq), user_id: u.id, requester_email: u.email, category,
        subject: subject.trim().slice(0, 200), priority: "normal", status: "open", assigned_to: null, platform, language, source: "web",
        created_at: now, updated_at: now };
      db.tickets.push(t);
      db.messages.push({ id: uuid(), ticket_id: t.id, author_id: u.id, is_staff: false, body: body.trim(), created_at: now,
        attachments: await Promise.all(files.map(fileToRecord)) });
      saveDb(db); emit(); return t;
    },
    async myTickets() {
      const db = loadDb(), u = requireUser();
      return db.tickets.filter(t => t.user_id === u.id).sort((a, b) => b.updated_at.localeCompare(a.updated_at));
    },
    async ticketDetail(id) {
      const db = loadDb(), u = requireUser();
      const t = db.tickets.find(x => x.id === id);
      if (!t || !canSee(db, u, t)) throw new Error("not found");
      return { ticket: t, messages: db.messages.filter(m => m.ticket_id === id).map(m => view(db, m)) };
    },
    async reply(ticketId, body, files = []) {
      const db = loadDb(), u = requireUser();
      const t = db.tickets.find(x => x.id === ticketId);
      if (!t || !canSee(db, u, t)) throw new Error("not found");
      if (!body.trim()) throw new Error("required");
      if (!validateFiles(files)) throw new Error("file");
      const isStaff = !!staffEntry(db, u) && t.user_id !== u.id;
      if (isStaff && !can(db, u, "reply")) throw new Error("forbidden");
      if (!isStaff && t.status === "closed") throw new Error("closed");
      const now = new Date().toISOString();
      db.messages.push({ id: uuid(), ticket_id: t.id, author_id: u.id, is_staff: isStaff, body: body.trim(), created_at: now,
        attachments: await Promise.all(files.map(fileToRecord)) });
      if (isStaff) {
        db.notifications.push({ id: uuid(), user_id: t.user_id, ticket_id: t.id, read: false, created_at: now });
        if (["open", "in_progress"].includes(t.status)) t.status = "pending";
        audit(db, u, "staff_reply", t.id);
      } else if (["pending", "resolved"].includes(t.status)) t.status = "open";
      t.updated_at = now; saveDb(db); emit();
    },
    async notifications() {
      const db = loadDb(), u = requireUser();
      return db.notifications.filter(n => n.user_id === u.id).sort((a, b) => b.created_at.localeCompare(a.created_at))
        .map(n => ({ ...n, ticket_number: (db.tickets.find(t => t.id === n.ticket_id) || {}).ticket_number }));
    },
    async markNotificationsRead() {
      const db = loadDb(), u = requireUser();
      db.notifications.forEach(n => { if (n.user_id === u.id) n.read = true; }); saveDb(db); emit();
    },

    /* staff */
    async allTickets({ status, category, priority, assigned, q } = {}) {
      const db = loadDb(), u = requireUser(); if (!staffEntry(db, u)) throw new Error("forbidden");
      q = (q || "").toLowerCase().trim();
      return db.tickets.filter(t =>
        (!status || t.status === status) && (!category || t.category === category) && (!priority || t.priority === priority) &&
        (!assigned || (assigned === "none" ? !t.assigned_to : t.assigned_to === assigned)) &&
        (!q || [t.ticket_number, t.subject, t.requester_email].some(v => (v || "").toLowerCase().includes(q)) ||
          db.messages.some(m => m.ticket_id === t.id && m.body.toLowerCase().includes(q))))
        .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
    },
    async updateTicket(id, patch) {
      const db = loadDb(), u = requireUser(); if (!staffEntry(db, u)) throw new Error("forbidden");
      const t = db.tickets.find(x => x.id === id); if (!t) throw new Error("not found");
      const ok = { status: "change_status", priority: "assign", assigned_to: "assign" };
      for (const k of Object.keys(patch)) {
        if (!ok[k]) throw new Error("forbidden field");
        if (t[k] !== patch[k] && !can(db, u, ok[k])) throw new Error("forbidden");
        if (k === "assigned_to" && patch[k] && !Object.keys(db.staff).some(e => (db.users[e] || {}).id === patch[k])) throw new Error("assignee must be support staff");
        if (t[k] !== patch[k]) {
          audit(db, u, k === "status" ? "status_changed" : k === "priority" ? "priority_changed" : "assigned", t.id, { from: t[k], to: patch[k] });
          t[k] = patch[k];
        }
      }
      t.updated_at = new Date().toISOString(); saveDb(db); emit();
    },
    async staffList() {
      const db = loadDb(), u = requireUser(); if (!staffEntry(db, u)) throw new Error("forbidden");
      return Object.entries(db.staff).map(([email, st]) => ({ user_id: (db.users[email] || {}).id || email, email, role: st.role, permissions: permsOf(db, st) }));
    },
    async rolePermissions() {
      const db = loadDb(), u = requireUser(); if (!staffEntry(db, u)) throw new Error("forbidden");
      return db.rolePerms || DEFAULT_ROLE_PERMS;
    },
    async setRolePermissions(role, permissions) {
      const db = loadDb(), u = requireUser();
      const s = staffEntry(db, u); if (!s || s.role !== "founder") throw new Error("forbidden");
      if (!PLATFORM_ROLES.includes(role)) throw new Error("founder permissions are fixed");
      db.rolePerms = { ...(db.rolePerms || DEFAULT_ROLE_PERMS), [role]: Object.fromEntries(Object.keys(ALL_PERMS).map(k => [k, !!permissions[k]])) };
      audit(db, u, "role_permissions_changed", null, { role }); saveDb(db); emit();
    },
    // DEMO ONLY: stands in for the existing platform_administrators table so staff flows can be tested.
    // The real website never assigns platform roles.
    async demoGrantRole(email, role) {
      const db = loadDb(), u = requireUser();
      const s = staffEntry(db, u); if (!s || s.role !== "founder") throw new Error("forbidden");
      email = email.trim().toLowerCase();
      if (!db.users[email]) throw new Error("no user with that email");
      db.staff[email] = { role }; saveDb(db); emit();
    },
    async stats() {
      const db = loadDb(), u = requireUser(); if (!can(db, u, "view_stats")) throw new Error("forbidden");
      const count = k => db.tickets.reduce((a, t) => (a[t[k]] = (a[t[k]] || 0) + 1, a), {});
      return { total: db.tickets.length, by_status: count("status"), by_category: count("category"),
        unassigned: db.tickets.filter(t => !t.assigned_to && !["resolved", "closed"].includes(t.status)).length,
        last_7_days: db.tickets.filter(t => Date.now() - Date.parse(t.created_at) < 7 * 864e5).length };
    },
    async auditLog() {
      const db = loadDb(), u = requireUser(); if (!can(db, u, "view_audit")) throw new Error("forbidden");
      return db.audit.slice(0, 200);
    }
  };
}

/* ============================================================== SUPABASE */
async function supabaseBackend() {
  const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
  const sb = createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true } });
  const listeners = new Set();
  const emit = () => listeners.forEach(f => f());
  const must = ({ data, error }) => { if (error) throw new Error(error.message); return data; };
  let user = null;
  const refreshUser = async () => { const { data } = await sb.auth.getSession(); user = data.session ? data.session.user : null; };

  async function uploadFiles(ticketId, messageId, files) {
    for (const f of files) {
      const path = `${ticketId}/${uuid()}-${safeName(f.name)}`;
      const up = await sb.storage.from(CFG.ATTACHMENT_BUCKET).upload(path, f, { contentType: f.type, upsert: false });
      if (up.error) throw new Error(up.error.message);
      must(await sb.from("support_attachments").insert({ ticket_id: ticketId, message_id: messageId, path, file_name: f.name, mime_type: f.type, size_bytes: f.size }));
    }
  }
  async function addMessage(ticketId, body, files) {
    const m = must(await sb.from("support_messages").insert({ ticket_id: ticketId, body: body.trim() }).select().single());
    await uploadFiles(ticketId, m.id, files);
  }

  const api = {
    mode: "supabase",
    async init() {
      await refreshUser();
      sb.auth.onAuthStateChange(async () => { await refreshUser(); emit(); });
      sb.channel("cc-support").on("postgres_changes", { event: "*", schema: "public", table: "support_messages" }, emit)
        .on("postgres_changes", { event: "*", schema: "public", table: "support_tickets" }, emit)
        .on("postgres_changes", { event: "*", schema: "public", table: "support_notifications" }, emit).subscribe();
    },
    onChange(cb) { listeners.add(cb); return () => listeners.delete(cb); },
    async getUser() { return user ? { id: user.id, email: user.email } : null; },
    hasGoogle: true,
    // Accepts an email or a CityCore username (resolved by the existing `username-sign-in` Edge Function).
    async signIn(identifier, password) {
      identifier = identifier.trim();
      if (identifier.includes("@")) must(await sb.auth.signInWithPassword({ email: identifier, password }));
      else {
        let res;
        try {
          res = await fetch(`${CFG.SUPABASE_URL}/functions/v1/username-sign-in`, {
            method: "POST",
            headers: { "Content-Type": "application/json", apikey: CFG.SUPABASE_ANON_KEY },
            body: JSON.stringify({ username: identifier, password })
          });
        } catch { throw new Error("Network error"); }
        if (!res.ok) throw new Error("Invalid username or password");
        const tok = await res.json();
        must(await sb.auth.setSession({ access_token: tok.access_token, refresh_token: tok.refresh_token }));
      }
      await refreshUser();
    },
    async signInWithGoogle() {
      must(await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: location.href.split("#")[0] } }));
    },
    async resetPassword(email) {
      must(await sb.auth.resetPasswordForEmail(email.trim(), { redirectTo: location.origin + "/" }));
    },
    async signUp(email, password) {
      const d = must(await sb.auth.signUp({ email, password }));
      if (!d.session) throw new Error("Check your email to confirm your account, then sign in.");
      await refreshUser();
    },
    async signOut() { await sb.auth.signOut(); user = null; },
    async staffRole() {
      if (!user) return null;
      return must(await sb.rpc("support_me"));
    },
    async createTicket({ category, subject, body, files = [], platform, language }) {
      if (!subject.trim() || !body.trim()) throw new Error("required");
      if (!validateFiles(files)) throw new Error("file");
      const t = must(await sb.from("support_tickets").insert({ category, subject: subject.trim().slice(0, 200), platform, language, source: "web" }).select().single());
      await addMessage(t.id, body, files);
      return t;
    },
    async myTickets() {
      return must(await sb.from("support_tickets").select("*").eq("user_id", user.id).order("updated_at", { ascending: false }));
    },
    async ticketDetail(id) {
      const ticket = must(await sb.from("support_tickets").select("*").eq("id", id).single());
      const msgs = must(await sb.from("support_messages").select("*").eq("ticket_id", id).order("created_at"));
      const atts = must(await sb.from("support_attachments").select("*").eq("ticket_id", id));
      const messages = [];
      for (const m of msgs) {
        const attachments = [];
        for (const a of atts.filter(x => x.message_id === m.id)) {
          const s = await sb.storage.from(CFG.ATTACHMENT_BUCKET).createSignedUrl(a.path, 300);
          if (!s.error) attachments.push({ id: a.id, name: a.file_name, mime: a.mime_type, url: s.data.signedUrl });
        }
        messages.push({ ...m, attachments });
      }
      return { ticket, messages };
    },
    async reply(ticketId, body, files = []) {
      if (!body.trim()) throw new Error("required");
      if (!validateFiles(files)) throw new Error("file");
      await addMessage(ticketId, body, files);
    },
    async notifications() {
      const rows = must(await sb.from("support_notifications").select("*, support_tickets(ticket_number)").order("created_at", { ascending: false }).limit(50));
      return rows.map(n => ({ ...n, ticket_number: n.support_tickets && n.support_tickets.ticket_number }));
    },
    async markNotificationsRead() { must(await sb.from("support_notifications").update({ read: true }).eq("user_id", user.id).eq("read", false)); },

    async allTickets({ status, category, priority, assigned, q } = {}) {
      let query = sb.from("support_tickets").select("*").order("updated_at", { ascending: false }).limit(500);
      if (status) query = query.eq("status", status);
      if (category) query = query.eq("category", category);
      if (priority) query = query.eq("priority", priority);
      if (assigned === "none") query = query.is("assigned_to", null); else if (assigned) query = query.eq("assigned_to", assigned);
      q = (q || "").trim().replace(/[%,()*]/g, " ");
      if (q) {
        const { data: hits } = await sb.from("support_messages").select("ticket_id").ilike("body", `%${q}%`).limit(200);
        const ids = [...new Set((hits || []).map(h => h.ticket_id))];
        const or = [`ticket_number.ilike.%${q}%`, `subject.ilike.%${q}%`, `requester_email.ilike.%${q}%`];
        if (ids.length) or.push(`id.in.(${ids.join(",")})`);
        query = query.or(or.join(","));
      }
      return must(await query);
    },
    async updateTicket(id, patch) { must(await sb.from("support_tickets").update(patch).eq("id", id)); },
    async staffList() { return must(await sb.rpc("support_staff_list")); },
    async rolePermissions() {
      const rows = must(await sb.from("support_role_permissions").select("role,permissions"));
      return Object.fromEntries(rows.map(r => [r.role, r.permissions]));
    },
    async setRolePermissions(role, permissions) {
      must(await sb.rpc("support_set_role_permissions", { p_role: role, p_permissions: permissions }));
    },
    async stats() { return must(await sb.rpc("support_stats")); },
    async auditLog() { return must(await sb.rpc("support_audit_list")); }
  };
  return api;
}

export const backend = isDemo ? demoBackend() : await supabaseBackend();
await backend.init();
