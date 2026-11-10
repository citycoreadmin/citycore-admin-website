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
- Restrictive storage guards (AND-ed with all other policies) stop any other storage policy from opening the support bucket.
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

## Final staging installation procedure (owner runs each step; stop at the first problem)
Target project reference: **kzwivydbwjewmtaxgiul** (matches `EXPECTED_PROJECT_REF` in `js/config.local.js`).

0. **Identity.** In the dashboard, check the project reference in the URL (`/project/kzwivydbwjewmtaxgiul`) and the project name
   `citycore-admin-staging`. It must differ from the reference in the iOS app's release configuration (compare references only).
1. **Preflight (done once: 13/13 true).** Re-run `tests/05b_preinstall_checks_only.sql` immediately before installing.
2. **Review existing Storage policies.** Run (its own query):
   `select policyname, permissive, cmd, roles, qual, with_check from pg_policies where schemaname='storage' and tablename='objects';`
   Send me the result. v2 adds RESTRICTIVE guards that AND with every other policy, so no existing policy can open `support-attachments`.
   Other policies still matter for other buckets (look for `true` or a missing `bucket_id` condition) but do not block this install.
3. **Privilege pre-check (read-only).**
   `select current_user, (select rolbypassrls from pg_roles where rolname = current_user) as bypass_rls, has_table_privilege(current_user,'storage.objects','select') as can_read_objects;`
   Expect `can_read_objects = true` (the attachment checks run as this role).
4. **Backup.** Dashboard -> Database -> Backups: confirm a recent backup exists (Pro plan) or take one (or `supabase db dump` with your own
   DB password, never shared). Without backups: the install only ADDS support objects (no existing table is altered) and
   `rollback_staging_support_v2.sql` removes them. Staging holds no production data.
5. **Install.** SQL Editor -> new query -> paste `migrations/20261105000000_support_system.sql` -> Run once. The editor may show a
   "destructive operation" confirmation because the script has `drop policy/trigger if exists`; they only target support objects.
   Expected: "Success. No rows returned." Any error rolls the whole transaction back; send me the message and do not retry blindly.
6. **Post-install checks.** Run `tests/06_postinstall_checks_only.sql`: all 15 rows must be `true`. Re-run `05b`: only row 13 should now be `false`.
7. **Storage metadata check.** With two synthetic users, upload one image from the widget on `localhost`, then run
   `select name, owner_id, metadata from storage.objects where bucket_id='support-attachments' order by created_at desc limit 3;`
   Expect `metadata` to contain `mimetype` and `size` matching the file, and `owner_id` = the uploader. If saving the attachment fails with
   "does not match the stored object", stop and report; the trigger needs adjusting.
8. Run the **manual checklist** below with synthetic accounts (founder, `admin_1`, two normal users). Grant platform roles only via your existing process.
9. **Edge Function / Auth URLs** (staging only): deploy `username-sign-in`; add the exact local origin to Auth redirect URLs. Keep `support-reply-email` disabled.
10. Production, public hosting and deployment each require separate explicit approval.

## Rollback (staging only)
Run `supabase/rollback_staging_support_v2.sql` (refuses unless the v2 marker exists; one transaction). It drops only support_* tables and
functions, the sequence, the `support_objects_*` policies and the Realtime entries, and deletes support data. Then empty and delete the
`support-attachments` bucket in Dashboard -> Storage (Supabase blocks direct SQL deletes on storage tables). It never touches `profiles`,
`platform_administrators`, `audit_logs`, `notifications` or `"Citicore admin website"`. Afterwards `05b` is 13/13 true again.
Verified locally: rollback, then reinstall succeeds.

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
