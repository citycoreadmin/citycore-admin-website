-- Read-only inventory for the VERIFIED staging project, before or after support installation.
-- Does not establish project identity: check the project reference in the dashboard first.
-- Output is schema metadata, not user records. Review/redact results before sharing.

-- Prerequisite columns and types. Missing rows indicate missing columns.
select table_schema, table_name, column_name, data_type, udt_schema, udt_name, is_nullable
from information_schema.columns
where table_schema = 'public'
  and ((table_name = 'profiles' and column_name in ('id', 'email', 'display_name', 'notification_preferences'))
    or (table_name = 'platform_administrators' and column_name in ('user_id', 'role')))
order by table_name, column_name;

select t.typname, e.enumlabel, e.enumsortorder
from pg_type t join pg_namespace n on n.oid = t.typnamespace
join pg_enum e on e.enumtypid = t.oid
where n.nspname = 'public' and t.typname = 'platform_role'
order by e.enumsortorder;

-- Support relations, RLS status, and effective table-level grants (including PUBLIC).
select c.relname, c.relkind, c.relrowsecurity, c.relforcerowsecurity,
       has_table_privilege('anon', c.oid, 'SELECT') as anon_select,
       has_table_privilege('anon', c.oid, 'INSERT') as anon_insert,
       has_table_privilege('authenticated', c.oid, 'SELECT') as auth_select,
       has_table_privilege('authenticated', c.oid, 'INSERT') as auth_insert,
       has_table_privilege('authenticated', c.oid, 'UPDATE') as auth_table_update,
       has_table_privilege('authenticated', c.oid, 'DELETE') as auth_delete
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname like 'support\_%' escape '\'
  and c.relkind in ('r', 'p', 'v', 'm', 'f')
order by c.relname;

-- Column grants matter when table-level UPDATE is false.
select c.relname as table_name, a.attname as column_name,
       has_column_privilege('authenticated', c.oid, a.attname, 'UPDATE') as auth_update
from pg_class c join pg_namespace n on n.oid = c.relnamespace
join pg_attribute a on a.attrelid = c.oid
where n.nspname = 'public' and c.relname in ('support_tickets', 'support_notifications')
  and c.relkind in ('r', 'p') and a.attnum > 0 and not a.attisdropped
order by c.relname, a.attnum;

-- All support policies and ALL Storage object policies, including non-support policies
-- that might also permit access to the support bucket.
select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where (schemaname = 'public' and tablename like 'support\_%' escape '\')
   or (schemaname = 'storage' and tablename = 'objects')
order by schemaname, tablename, policyname;

-- Existing support function signatures, owner, security mode, search path, and execute grants.
select n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) as arguments,
       pg_get_userbyid(p.proowner) as owner, p.prosecdef as security_definer,
       p.proconfig as settings,
       has_function_privilege('anon', p.oid, 'EXECUTE') as anon_execute,
       has_function_privilege('authenticated', p.oid, 'EXECUTE') as auth_execute
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname like 'support\_%' escape '\'
order by p.proname, arguments;

-- Inventory related triggers, constraints, indexes, and the ticket sequence.
select c.relname as table_name, t.tgname, pg_get_triggerdef(t.oid) as definition
from pg_trigger t join pg_class c on c.oid = t.tgrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname like 'support\_%' escape '\'
  and not t.tgisinternal
order by c.relname, t.tgname;

select c.relname as table_name, con.conname, pg_get_constraintdef(con.oid) as definition
from pg_constraint con join pg_class c on c.oid = con.conrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname like 'support\_%' escape '\'
order by c.relname, con.conname;

select tablename, indexname, indexdef from pg_indexes
where schemaname = 'public' and tablename like 'support\_%' escape '\'
order by tablename, indexname;

select to_regclass('public.support_ticket_seq') as ticket_sequence;
select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets where id = 'support-attachments' or name = 'support-attachments';

select pubname, schemaname, tablename from pg_publication_tables
where pubname = 'supabase_realtime' and schemaname = 'public'
  and tablename like 'support\_%' escape '\'
order by tablename;
