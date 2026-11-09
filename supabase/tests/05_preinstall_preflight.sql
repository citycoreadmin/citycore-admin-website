-- READ-ONLY pre-install gate for the website STAGING project. Run in the staging SQL Editor BEFORE the support migration.
-- Result: one row per check. Install only when EVERY row has ok = true. Schema metadata only; no user data is returned.
-- Safe when support objects do not exist yet. Row 13 turns false once the v2 support system is installed, so a repeat
-- install is stopped by this gate; rows 8-11 turn false for any support_* object, bucket or policy that is not v2.
with m as (
  select coalesce(obj_description(to_regclass('public.support_tickets'), 'pg_class'), '') = 'citycore-support:v2' as v2_installed
)
select * from (
  select 1 as n, 'public.profiles exists' as check_name, to_regclass('public.profiles') is not null as ok
  union all select 2, 'public.platform_administrators exists', to_regclass('public.platform_administrators') is not null
  union all select 3, 'profiles has id/email/display_name/notification_preferences',
    (select count(*) from information_schema.columns where table_schema='public' and table_name='profiles' and column_name in ('id','email','display_name','notification_preferences')) = 4
  union all select 4, 'platform_administrators has user_id/role',
    (select count(*) from information_schema.columns where table_schema='public' and table_name='platform_administrators' and column_name in ('user_id','role')) = 2
  union all select 5, 'platform_role enum has admin_1..admin_5 + founder',
    (select count(*) from pg_enum e join pg_type t on t.oid=e.enumtypid join pg_namespace n on n.oid=t.typnamespace
     where n.nspname='public' and t.typname='platform_role' and e.enumlabel in ('admin_1','admin_2','admin_3','admin_4','admin_5','founder')) = 6
  union all select 6, 'auth.uid() exists', to_regprocedure('auth.uid()') is not null
  union all select 7, 'storage.objects has owner_id and metadata',
    (select count(*) from information_schema.columns where table_schema='storage' and table_name='objects' and column_name in ('owner_id','metadata')) = 2
  union all select 8, 'no conflicting support_* relations (or v2 already installed)',
    (select v2_installed from m) or not exists (select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname like 'support\_%' escape '\' and c.relkind in ('r','p','v','m','f','S'))
  union all select 9, 'no conflicting support_* functions (or v2 already installed)',
    (select v2_installed from m) or not exists (select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname like 'support\_%' escape '\')
  union all select 10, 'no support-attachments bucket yet (or v2 already installed)',
    (select v2_installed from m) or not exists (select 1 from storage.buckets where id='support-attachments' or name='support-attachments')
  union all select 11, 'no support_objects_* storage policies yet (or v2 already installed)',
    (select v2_installed from m) or not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname like 'support\_objects\_%' escape '\')
  union all select 12, 'is_platform_admin() exists (app dependency, informational)', to_regprocedure('public.is_platform_admin()') is not null
  union all select 13, 'support v2 NOT already installed (false = do not install again)', not (select v2_installed from m)
) c order by n;

-- Informational: other policies on storage.objects (they combine with ours with OR; review any broad ones).
select policyname, cmd, roles, qual, with_check
from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname not like 'support\_objects\_%' escape '\';
