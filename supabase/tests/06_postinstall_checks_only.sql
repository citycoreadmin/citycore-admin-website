-- READ-ONLY, SINGLE QUERY: post-install verification of support v2 on STAGING. Paste all and click Run.
-- Every row must have ok = true. Returns schema metadata only; changes nothing.
select * from (
  select 1 as n, 'v2 marker present on support_tickets' as check_name,
    coalesce(obj_description(to_regclass('public.support_tickets'), 'pg_class'), '') = 'citycore-support:v2' as ok
  union all select 2, 'all 6 support tables exist with RLS enabled',
    (select count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r' and c.relrowsecurity
       and c.relname in ('support_role_permissions','support_tickets','support_messages','support_attachments','support_notifications','support_audit_log')) = 6
  union all select 3, 'anon has no privileges on support tables',
    not exists (select 1 from information_schema.role_table_grants where table_schema='public' and table_name like 'support\_%' escape '\' and grantee in ('anon','PUBLIC'))
  union all select 4, 'authenticated cannot INSERT/DELETE tickets or read the audit table directly',
    not has_table_privilege('authenticated','public.support_tickets','insert') and not has_table_privilege('authenticated','public.support_tickets','delete')
    and not has_table_privilege('authenticated','public.support_audit_log','select')
  union all select 5, 'every SECURITY DEFINER support function pins search_path',
    not exists (select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname like 'support\_%' escape '\' and p.prosecdef and coalesce(p.proconfig::text,'') not like '%search_path%')
  union all select 6, 'anon/PUBLIC cannot execute any support function',
    not exists (select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname like 'support\_%' escape '\' and (has_function_privilege('anon', p.oid, 'execute') or has_function_privilege('public', p.oid, 'execute')))
  union all select 7, 'authenticated cannot execute internal/trigger functions',
    not exists (select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public'
      and p.proname in ('support_role','support_audit','support_wants_notification','support_before_ticket_insert','support_before_ticket_update','support_after_ticket_update','support_before_message_insert','support_after_message_insert','support_before_attachment_insert')
      and has_function_privilege('authenticated', p.oid, 'execute'))
  union all select 8, 'bucket support-attachments is private, 50MB, 8 mime types, no SVG',
    exists (select 1 from storage.buckets where id='support-attachments' and public = false and file_size_limit = 52428800
      and cardinality(allowed_mime_types) = 8 and not ('image/svg+xml' = any(allowed_mime_types)))
  union all select 9, '3 permissive + 5 restrictive support_objects_* storage policies',
    (select count(*) from pg_policies where schemaname='storage' and tablename='objects' and policyname like 'support\_objects\_%' escape '\' and permissive='PERMISSIVE') = 3
    and (select count(*) from pg_policies where schemaname='storage' and tablename='objects' and policyname like 'support\_objects\_guard\_%' escape '\' and permissive='RESTRICTIVE') = 5
  union all select 10, 'no permissive UPDATE/ALL storage policy for the support bucket by name',
    not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname like 'support\_objects\_%' escape '\' and permissive='PERMISSIVE' and cmd in ('UPDATE','ALL'))
  union all select 11, 'role permission seed: 5 roles, none grants assign/view_audit by default',
    (select count(*) from public.support_role_permissions) = 5
    and not exists (select 1 from public.support_role_permissions where (permissions->>'assign')::boolean or (permissions->>'view_audit')::boolean)
  union all select 12, 'ticket-number sequence is not usable by clients',
    not has_sequence_privilege('authenticated','public.support_ticket_seq','usage') and not has_sequence_privilege('anon','public.support_ticket_seq','usage')
  union all select 13, 'realtime publication includes the 3 support tables',
    (select count(*) from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename in ('support_messages','support_tickets','support_notifications')) = 3
  union all select 14, 'definer-function owner can read storage.objects (needed by attachment checks)',
    has_table_privilege(current_user, 'storage.objects', 'select')
  union all select 15, 'existing app tables untouched: profiles/platform_administrators have no support triggers',
    not exists (select 1 from pg_trigger t where not t.tgisinternal and t.tgrelid in ('public.profiles'::regclass, 'public.platform_administrators'::regclass) and t.tgname like 'support\_%' escape '\')
) c order by n;
