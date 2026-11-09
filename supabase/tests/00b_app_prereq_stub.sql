-- Minimal stand-in for the app tables the support migration depends on (scratch DBs only).
-- To test against the real app schema instead, load CityCoreSchema.sql (set CITYCORE_APP_SCHEMA in run_scratch.sh).
create type public.platform_role as enum ('admin_1','admin_2','admin_3','admin_4','admin_5','founder');
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null, display_name text not null default '',
  notification_preferences jsonb not null default '{}'::jsonb);
create table public.platform_administrators (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role public.platform_role not null, assigned_by uuid, created_at timestamptz not null default now());
create function public.is_platform_admin() returns boolean language sql stable security definer as
  $$ select exists (select 1 from public.platform_administrators where user_id = auth.uid()) $$;
create function public.t_new_user() returns trigger language plpgsql security definer as $$
begin insert into public.profiles(id, email, display_name) values (new.id, new.email, split_part(new.email,'@',1)); return new; end $$;
create trigger t_new_user after insert on auth.users for each row execute function public.t_new_user();
