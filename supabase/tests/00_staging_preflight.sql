-- READ-ONLY preflight. Run only in the citycore-admin-staging SQL Editor.
-- Expected before loading CityCoreSchema.sql: Supabase built-ins exist, while
-- CityCore core tables/functions and all support_* objects are absent.
select
  to_regclass('public.profiles') is not null as profiles_exists,
  to_regclass('public.platform_administrators') is not null as platform_administrators_exists,
  exists (
    select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'platform_role'
  ) as platform_role_exists,
  to_regprocedure('public.is_platform_admin()') is not null as is_platform_admin_exists,
  to_regclass('auth.users') is not null as auth_users_exists,
  to_regclass('storage.objects') is not null as storage_objects_exists;

select schemaname, tablename
from pg_tables
where schemaname = 'public' and tablename like 'support_%'
order by tablename;
