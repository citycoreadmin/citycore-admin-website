# Staging deployment and test plan (nothing here touches production)

## Rules
- Use a **separate** Supabase project (or a Supabase branch) for staging. Never point `js/config.js` at production until approved.
- Only the project URL and the **anon/publishable** key go in `js/config.js`. Service-role keys never go in this repo or the browser.
- Do not apply the migration to production without explicit approval.

## Steps
1. Create the staging project and load the existing schema (`pg_dump --schema-only` of production, or the app's `CityCoreSchema.sql` /
   `RepairExistingProductionSchema.sql`). Create 1 founder + a few `platform_administrators` rows (`admin_1`..`admin_5`) and 2 normal users.
2. Apply `migrations/20261105000000_support_system.sql` (safe to re-run).
3. Deploy the existing `username-sign-in` Edge Function to staging (JWT verification off, as in the app repo).
4. Auth settings (staging): Site URL = staging site; add the staging site to Redirect URLs; enable the Google provider with a staging OAuth client.
5. Copy `js/config.js` to a local, uncommitted override with the staging URL + anon key and serve the site locally or on a staging host.
6. Run the checklist below. Production values to add later (needs approval): Site URL `https://citycoreadmin.com`, the same URL in
   Redirect URLs, and the Google OAuth authorised origin/redirect.

## Automated SQL checks (local throwaway Postgres, already passing)
`tests/00_supabase_stub.sql` emulates Supabase roles/auth/storage. Then run `01_seed_users.sql`, `02_rls_behaviour.sql`, `03_client_contract.sql`
against a scratch database loaded with the app schema. They cover cross-user isolation, role permissions, founder-only RPCs, notifications,
audit log, closed-ticket rules, storage policies and anon denial. These emulate Supabase; confirm on the real staging project too.

## Manual checklist on real staging
- [ ] Sign in with email, with username (Edge Function) and with Google; password reset email arrives and returns to the site.
- [ ] Existing profile/role is recognised: founder sees all tabs, `admin_N` sees tabs per its support permissions, a normal user is denied `/staff.html`.
- [ ] User A cannot read/reply to User B's ticket, messages, attachments or signed URLs.
- [ ] Image and video upload works; objects are private (direct URL without a signed token fails); signed URL expires.
- [ ] Staff reply creates a notification and the user's widget updates in realtime; status moves to Pending.
- [ ] Founder edits per-role support permissions; non-founder cannot. Platform roles are unchanged afterwards.
- [ ] iOS app still signs in and its existing screens/notifications behave exactly as before.
- [ ] Desktop, iPhone (390px) and iPad (820px) layouts.

## Not activated
- `functions/support-reply-email`: email on staff reply. Disabled unless `SUPPORT_EMAIL_ENABLED=true`; no webhook exists.
- Writing support events into the app's existing `notifications` table (server-scoped, owner-select only in the app schema). Left alone until
  compatibility is confirmed. iOS can already read `support_notifications` / tickets with the same Supabase session under the same RLS.
