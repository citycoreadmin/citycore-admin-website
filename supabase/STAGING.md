# Staging deployment and test plan (nothing here touches production)

## Rules
- Use a **separate** Supabase project (or a Supabase branch) for staging. Never point `js/config.js` at production until approved.
- Only the project URL and the **anon/publishable** key go in `js/config.js`. Service-role keys never go in this repo or the browser.
- Do not apply the migration to production without explicit approval.

## Staging status and steps
1. The owner reported applying `CityCoreSchema.sql` and `FixAdminPanelRLS.sql`. Read-only checks confirmed the
   `create_admin_panel` description/game-name mapping and execution privileges. Invitation functions, policies,
   index and column were also reported present; these checks do not prove every statement of
   `SecurePanelInvitations.sql` ran or that every policy definition matches the file.
2. The owner reported that the checked moderation columns and functions are absent. Do not assume
   `ProductionModerationRLS.sql` ran; review its remaining objects before proposing it. It is not a direct
   prerequisite of the support migration. The extra `Citicore admin website` table remains unexplained; do not alter it.
3. Before any support migration, confirm the staging project identity against the released app configuration,
   inspect existing `support_*` objects and the `support-attachments` bucket, and verify the prerequisites in
   `migrations/20261105000000_support_system.sql`. Do not assume `IF NOT EXISTS` reconciles an existing object.
   The migration changes support policies/triggers and may add tables to the Realtime publication. Review it and
   obtain approval for staging before the owner applies it; never apply it to production without separate approval.
4. After application, verify the support objects, RLS, private bucket and actual authenticated table grants.
   The migration relies on default privileges for some table SELECT and INSERT access, which may vary by project.
   Confirm the Realtime publication and use only synthetic staging accounts, including two users and separate
   founder and staff accounts. Do not run scratch database seed/cleanup scripts on a shared project.
5. Deploy the existing `username-sign-in` Edge Function to staging only (JWT verification off, as in the app repo).
   Configure staging Auth URLs for the exact local origin and a separate staging Google OAuth client. Keep support
   reply email delivery disabled; Auth confirmation and password-reset emails are separate from support reply email.
6. Copy `js/config.local.example.js` to `js/config.local.js`, set only the staging URL and publishable/anon key,
   and serve the site on `localhost` or `127.0.0.1`. The override is ignored by git and loaded only on those hosts.
   Never paste keys into chat or put privileged keys in browser files. Run the real staging checklist below.
7. Production configuration, database changes, public hosting and deployment require separate explicit approval.

## Automated SQL checks (local throwaway Postgres, already passing)
`tests/00_supabase_stub.sql` emulates Supabase roles/auth/storage. The scripts `01_seed_users.sql`, `02_rls_behaviour.sql`, `03_client_contract.sql`
are for an isolated scratch database loaded with the app schema, not the live staging project: they create and delete data. They cover cross-user isolation, role permissions, founder-only RPCs, notifications,
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
  compatibility is confirmed. The schema is designed to allow a compatible iOS client to use the same session and RLS;
  app integration and real-device notification behavior are not yet verified.
