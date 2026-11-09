// Copy this file to config.local.js for local staging only.
// config.local.js is ignored by git. Never put a service-role key here.
window.CITYCORE_CONFIG = {
  SUPABASE_URL: "https://YOUR-STAGING-REF.supabase.co",
  EXPECTED_PROJECT_REF: "YOUR-STAGING-REF", // must equal the subdomain above, or the backend stays disabled
  SUPABASE_ANON_KEY: "YOUR_STAGING_PUBLISHABLE_OR_ANON_KEY",
  ATTACHMENT_BUCKET: "support-attachments",
  MAX_ATTACHMENT_MB: 50
};
