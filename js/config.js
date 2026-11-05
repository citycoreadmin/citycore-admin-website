// Public configuration only. The Supabase anon key is safe to ship in the browser
// because access is enforced by Row Level Security. NEVER put a service-role key here.
// Leave both empty to run in local DEMO mode (data stays in this browser only).
window.CITYCORE_CONFIG = {
  SUPABASE_URL: "",
  SUPABASE_ANON_KEY: "",
  ATTACHMENT_BUCKET: "support-attachments",
  MAX_ATTACHMENT_MB: 50
};
