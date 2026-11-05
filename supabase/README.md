# CityCore Admin support backend (NOT applied)

`migrations/20261105000000_support_system.sql` is **additive** (new `support_*` tables, functions, policies, a private
`support-attachments` bucket). It does not touch existing users, profiles, roles or data. It was written without access to
your Supabase project, so before applying:

1. Run it on a **staging/branch** project first and compare against your existing schema (support, roles, profiles tables).
   If you already have equivalent tables, adapt instead of duplicating.
2. Bootstrap the founder (SQL at the bottom of the migration). Only the founder can add staff (`support_set_staff` RPC).
3. Put `SUPABASE_URL` and the **anon** key in `js/config.js`. Never use the service-role key in the browser.
4. Enable email/password auth in Supabase Auth and add your site URL to the allowed redirect URLs.

Security model: RLS everywhere; users see only their own tickets/messages/attachments/notifications; staff access and
fine-grained permissions (`reply`, `assign`, `change_status`, `view_stats`, `view_audit`) are enforced in policies and
triggers; staff and ticket changes are written to `support_audit_log` by triggers; attachments are private and served via
short-lived signed URLs.

GitHub Pages is static, so no separate server is needed: Supabase (Auth, Postgres/RLS, Storage, Realtime) is the backend.
Email notifications on staff replies would need an Edge Function (not included); in-app notifications work today.
