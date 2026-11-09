# Staging-only installation plan for the support system (v2)

Nothing here touches production or the App Store backend. Every SQL step is run **manually by the owner**, one at a time,
in the **website staging project** only, after its project reference has been checked against the one expected in
`js/config.local.js` (`EXPECTED_PROJECT_REF`). Never paste keys into chat; only the staging publishable/anon key belongs in the
git-ignored `js/config.local.js`. No service-role key ever goes in the repo or browser.

## What v2 changed (vs. the unapplied v1)
- Tickets are created only by `support_create_ticket()` (ticket + first message are atomic); direct INSERT on tickets is revoked.
- Storage objects must live at `<ticket>/<message>/<file>`. Upload is allowed only for the author of that message, on a ticket they
  own (or staff with `reply`), within 15 minutes of the message, max 5 objects per message. No overwrite or rename (no UPDATE policy).
- An attachment row is accepted only if the object exists, is owned by the caller, and its stored mime type and size match the row.
  Path must match `ticket_id` / `message_id`; mime allowlist excludes SVG; 50 MB cap; max 5 per message.
- The client removes uploaded objects if any attachment fails. `support_orphan_objects()` (founder, read-only) reports leftovers.
- Forgeable `support.internal` setting removed; internal updates are recognised by trigger depth.
- Explicit grants: table/column-level grants only, `anon` and `PUBLIC` have nothing; trigger/internal functions are not executable by clients.
- Rate limits: 5 new tickets/hour, 20 open tickets, 30 messages/10 min per user.
- `support_set_role_permissions` validates role (admin_1..5) and payload (five known boolean keys). Founder only.
- The migration runs in one transaction and **aborts** if any support object, bucket or `support_objects_*` policy already exists
  (unless already v2), or a prerequisite is missing.
- Auth callback in the browser is synchronous (no deadlock risk); partial attachment failures show a notice instead of losing the message.

## Automated evidence (no Supabase needed)
- `supabase/tests/run_scratch.sh` — on a throwaway local Postgres: fresh install, ~110 security/functional assertions
  (`10_security_functional.sql`), idempotent re-run, and the conflict guards. It refuses any non-local host.
- `node --test tests/js/` — secrets scan, i18n parity, auth-callback check, mime allowlist parity, demo-backend isolation and role tests.
These use a Supabase **emulation**; they do not prove real Supabase Auth/Storage/Realtime behaviour. Step 5 below does.

## Recorded staging finding: `public."Citicore admin website"`
Read-only checks by the owner: RLS enabled, no estimate (`approximate_rows = -1`), exact count 0 rows, columns `id bigint` and
`created_at timestamptz`, with its primary-key index and id sequence. Origin unknown (likely a dashboard-created placeholder).
It does not match `support_%`, is not referenced by the migration or the website, and is **left untouched**: do not drop, alter or
grant on it. With RLS on and no policies it is already inaccessible to `anon`/`authenticated`.

## Installation order (owner, staging project only)
1. **Identity.** Dashboard → Project Settings → General: compare the project reference with `EXPECTED_PROJECT_REF` and confirm it is
   *different* from the reference in the iOS app's release configuration (compare references only; never share keys).
2. **Read-only gate.** Run `supabase/tests/05_preinstall_preflight.sql`. Install only if every `ok` is `true`.
   Row 13 is `true` only while the v2 support system is NOT installed; `false` there means it is already installed, so do not install again.
   If any is `false`, stop and share the result row (not data); do not drop or alter anything to "make it pass".
   Optionally run `supabase/tests/04_support_readonly_inventory.sql` for the full inventory.
3. **Back up** staging (Database → Backups, or a dump) if it holds anything you care about.
4. **Install.** Paste `supabase/migrations/20261105000000_support_system.sql` into the SQL Editor and run it once. It is one
   transaction; an error rolls everything back. Expected: "Success. No rows returned."
5. **Verify on real Supabase** (synthetic accounts only: founder, an `admin_1`, two normal users):
   - Re-run `04_support_readonly_inventory.sql`; confirm RLS on, bucket private, no `anon` grants.
   - **Storage metadata check (unverified assumption):** the attachment trigger compares the row's `mime_type`/`size_bytes` with
     `storage.objects.metadata->>'mimetype'` / `'size'`. Upload one image from the widget; if saving the attachment fails with
     "does not match the stored object", report it and do not retry blindly — the trigger needs adjusting, not the data.
   - Run the manual checklist below.
6. **Edge Function / Auth URLs** (staging only): deploy `username-sign-in`, add the exact local origin to Auth redirect URLs.
   Keep `support-reply-email` disabled.
7. Production, public hosting and deployment each require separate explicit approval.

## Rollback (staging)
Only if step 4 succeeded and you want to remove it (staging, synthetic data only): drop the `support_*` tables, functions and the
`support_objects_*` storage policies, then empty and delete the `support-attachments` bucket from the Storage UI. Ask for the exact
statements first; do not run ad-hoc drops.

## Manual checklist on real staging
- [ ] Sign in with email, with username (Edge Function), with Google; password reset returns to the site.
- [ ] Founder sees all tabs; `admin_N` sees tabs per its support permissions; a normal user is denied `/staff.html`.
- [ ] User A cannot read/reply to User B's ticket, messages, attachments or signed URLs.
- [ ] Image and video upload works; direct bucket URL fails; signed URL expires; SVG/HTML are rejected.
- [ ] A forced failed upload (e.g. disconnect mid-upload) leaves the message saved, shows the notice, and no attachment row.
- [ ] Staff reply creates a notification, the user's widget updates in realtime, status becomes Pending.
- [ ] Founder edits per-role permissions; non-founder cannot. Platform roles are unchanged afterwards.
- [ ] iOS app still signs in and its screens/notifications are unchanged.
- [ ] Desktop, iPhone (390px), iPad (820px).

## Not activated
- `functions/support-reply-email` (disabled unless `SUPPORT_EMAIL_ENABLED=true`; no webhook).
- Writing support events into the app's `notifications` table.
- Founder-only deletion/cleanup of orphan objects (report only).
