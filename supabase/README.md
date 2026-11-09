# CityCore Admin support backend (NOT applied)

`migrations/20261105000000_support_system.sql` is **additive** and re-runnable. It adds `support_*` tables, functions,
policies and a private `support-attachments` bucket, and **reuses** the existing `profiles`, `platform_administrators`
and `platform_role` (no second account or staff system). It never writes to existing tables.

- Identity: Supabase Auth + `profiles` (email, username via the existing `username-sign-in` function, Google).
- Staff: any `platform_administrators` row. `founder` has every support permission; `admin_1`..`admin_5` get permissions from
  `support_role_permissions` (seeded identically; no admin_1..admin_5 ranking is defined in the app). Only the founder can edit those
  permissions (`support_set_role_permissions`). The website never assigns or changes platform roles.
- Tickets carry `source` (`web` / `ios`) so the iOS app can share the same tickets, messages, attachments and statuses.
- `support_notifications` is separate from the app's `notifications` table, which is left untouched.
- `support_audit_log` is separate from the app's `audit_logs` and readable only via `support_audit_list()`.

Before applying anywhere, follow `STAGING.md`. Do not apply to production without approval. Put only `SUPABASE_URL` and
the **anon** key in `js/config.js`; never a service-role key.

Security model: RLS everywhere; users see only their own tickets/messages/attachments/notifications; staff access and
permissions (`reply`, `assign`, `change_status`, `view_stats`, `view_audit`) are enforced in policies and triggers; changes
are written to `support_audit_log` by triggers; attachments are private and served via short-lived signed URLs.

GitHub Pages is static, so Supabase (Auth, Postgres/RLS, Storage, Realtime) is the backend.
Support notifications are implemented but not yet verified against real staging or integrated into the iOS app.
`functions/support-reply-email` is an inactive scaffold for optional email on staff replies.
