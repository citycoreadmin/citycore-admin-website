-- CityCore Admin support system, v2 (hardened). The website and the iOS app share one account system.
--
-- REUSES existing objects (never recreated or altered):
--   auth.users, public.profiles, public.platform_administrators (+ platform_role enum).
-- ADDS only support_* objects. No existing rows are modified.
-- NOT APPLIED ANYWHERE YET. Install in STAGING first, after supabase/tests/05_preinstall_preflight.sql is all-clear.
--
-- Safety model
--   * Fresh install only. A preflight block aborts if any support_* object exists that is not marked v2, if a prerequisite
--     is missing, or if a 'support-attachments' bucket already exists unmarked. Re-running a v2 install is allowed.
--   * Runs in one transaction: any failure rolls everything back.
--   * Clients get explicit, minimal grants. Nothing relies on default privileges.
--   * Tickets are created only through support_create_ticket() (ticket + first message are atomic).
--   * Attachment objects are bound to ticket/message/user by path, and metadata rows are verified against the stored object.

begin;

-- ------------------------------------------------------------------ preflight (fails closed)
do $$
declare
  v2 constant text := 'citycore-support:v2';
  r record;
  tickets_marker text;
begin
  if to_regclass('public.profiles') is null or to_regclass('public.platform_administrators') is null then
    raise exception 'prerequisite missing: public.profiles / public.platform_administrators (install CityCoreSchema.sql first)';
  end if;
  for r in select * from (values ('profiles','id'),('profiles','email'),('profiles','display_name'),('profiles','notification_preferences'),
                                 ('platform_administrators','user_id'),('platform_administrators','role')) v(tbl, col) loop
    if not exists (select 1 from information_schema.columns c where c.table_schema = 'public' and c.table_name = r.tbl and c.column_name = r.col) then
      raise exception 'prerequisite missing: column public.%.%', r.tbl, r.col;
    end if;
  end loop;
  if (select count(*) from pg_enum e join pg_type t on t.oid = e.enumtypid join pg_namespace n on n.oid = t.typnamespace
      where n.nspname = 'public' and t.typname = 'platform_role'
        and e.enumlabel in ('admin_1','admin_2','admin_3','admin_4','admin_5','founder')) <> 6 then
    raise exception 'prerequisite missing: public.platform_role must contain admin_1..admin_5 and founder';
  end if;
  if to_regprocedure('auth.uid()') is null or to_regclass('storage.objects') is null or to_regclass('storage.buckets') is null then
    raise exception 'prerequisite missing: Supabase auth/storage objects (is this a Supabase project?)';
  end if;
  if not exists (select 1 from information_schema.columns where table_schema = 'storage' and table_name = 'objects' and column_name = 'owner_id')
     or not exists (select 1 from information_schema.columns where table_schema = 'storage' and table_name = 'objects' and column_name = 'metadata') then
    raise exception 'prerequisite missing: storage.objects.owner_id / metadata';
  end if;

  tickets_marker := coalesce(obj_description(to_regclass('public.support_tickets'), 'pg_class'), '');
  for r in select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
           where n.nspname = 'public' and c.relname like 'support\_%' escape '\' and c.relkind in ('r','p','v','m','f','S')
             and coalesce(obj_description(c.oid, 'pg_class'), '') <> v2
             and not (c.relkind = 'S' and exists (select 1 from pg_depend d where d.objid = c.oid and d.deptype in ('a','i'))) loop
    raise exception 'conflict: public.% already exists and is not a v2 support object; review it manually (nothing was changed)', r.relname;
  end loop;
  if tickets_marker <> v2 and exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                                      where n.nspname = 'public' and p.proname like 'support\_%' escape '\') then
    raise exception 'conflict: support_* functions already exist without a v2 install; review manually (nothing was changed)';
  end if;
  if tickets_marker <> v2 and exists (select 1 from storage.buckets where id = 'support-attachments' or name = 'support-attachments') then
    raise exception 'conflict: storage bucket support-attachments already exists; review it manually (nothing was changed)';
  end if;
  if tickets_marker <> v2 and exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname like 'support\_objects\_%' escape '\') then
    raise exception 'conflict: storage policies named support_objects_* already exist; review manually (nothing was changed)';
  end if;
end $$;

-- ------------------------------------------------------------------ permissions
-- Support permissions are derived from the EXISTING platform role. `founder` always has all.
create table if not exists public.support_role_permissions (
  role        public.platform_role primary key,
  permissions jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);
-- No admin_1..admin_5 hierarchy is defined anywhere in the app or schema, so no ranking is assumed:
-- all five roles start identical and conservative. The Founder tunes them via support_set_role_permissions().
insert into public.support_role_permissions (role, permissions)
select r, '{"reply":true,"assign":false,"change_status":true,"view_stats":true,"view_audit":false}'::jsonb
from unnest(array['admin_1','admin_2','admin_3','admin_4','admin_5']::public.platform_role[]) r
on conflict (role) do nothing;

create or replace function public.support_is_staff()
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select exists (select 1 from public.platform_administrators where user_id = auth.uid());
$$;

create or replace function public.support_role()
returns text language sql stable security definer set search_path = public, pg_temp as $$
  select role::text from public.platform_administrators where user_id = auth.uid();
$$;

create or replace function public.support_can(perm text)
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select coalesce((
    select a.role = 'founder'
        or coalesce((select (p.permissions ->> perm)::boolean from public.support_role_permissions p where p.role = a.role), false)
    from public.platform_administrators a where a.user_id = auth.uid()
  ), false);
$$;

-- ------------------------------------------------------------------ tables
create sequence if not exists public.support_ticket_seq start 1001;

create table if not exists public.support_tickets (
  id              uuid primary key default gen_random_uuid(),
  ticket_number   text not null unique,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  requester_email text,
  category        text not null check (category in
    ('account','payment','technical','report_user','feedback','bug','admin_panel','other')),
  subject         text not null check (char_length(subject) between 1 and 200 and btrim(subject) <> ''),
  priority        text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  status          text not null default 'open' check (status in ('open','pending','in_progress','resolved','closed')),
  assigned_to     uuid references public.profiles(id) on delete set null,
  platform        text check (platform in ('all','ios','ipados','android','web')),
  language        text check (language in ('en','fr','ht')),
  source          text not null default 'web' check (source in ('web','ios')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists support_tickets_user_idx   on public.support_tickets (user_id, updated_at desc);
create index if not exists support_tickets_status_idx on public.support_tickets (status, category, priority);

create table if not exists public.support_messages (
  id         uuid primary key default gen_random_uuid(),
  ticket_id  uuid not null references public.support_tickets(id) on delete cascade,
  author_id  uuid not null references public.profiles(id) on delete cascade,
  is_staff   boolean not null default false,
  body       text not null check (char_length(body) between 1 and 5000 and btrim(body) <> ''),
  created_at timestamptz not null default now()
);
create index if not exists support_messages_ticket_idx on public.support_messages (ticket_id, created_at);
create index if not exists support_messages_author_idx on public.support_messages (author_id, created_at desc);

-- Attachment object path is always <ticket uuid>/<message uuid>/<safe file name>; it must match this row.
create table if not exists public.support_attachments (
  id         uuid primary key default gen_random_uuid(),
  ticket_id  uuid not null references public.support_tickets(id) on delete cascade,
  message_id uuid not null references public.support_messages(id) on delete cascade,
  path       text not null unique,
  file_name  text not null check (char_length(file_name) between 1 and 200 and file_name !~ '[[:cntrl:]/\\]'),
  mime_type  text not null check (mime_type in
    ('image/jpeg','image/png','image/gif','image/webp','image/heic','video/mp4','video/quicktime','video/webm')),
  size_bytes bigint not null check (size_bytes between 1 and 52428800),
  created_at timestamptz not null default now(),
  constraint support_attachments_path_shape check (
    path ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[A-Za-z0-9_-][A-Za-z0-9._-]{0,159}$'
    and split_part(path, '/', 1) = ticket_id::text and split_part(path, '/', 2) = message_id::text)
);
create index if not exists support_attachments_msg_idx on public.support_attachments (message_id);

-- Separate from any app `notifications` table.
create table if not exists public.support_notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  ticket_id  uuid not null references public.support_tickets(id) on delete cascade,
  kind       text not null default 'staff_reply',
  read       boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists support_notifications_user_idx on public.support_notifications (user_id, read, created_at desc);

-- Dedicated audit log; does not touch the panel-scoped public.audit_logs used by the iOS app.
create table if not exists public.support_audit_log (
  id          bigint generated always as identity primary key,
  actor_id    uuid references public.profiles(id) on delete set null,
  actor_email text,
  action      text not null,
  ticket_id   uuid references public.support_tickets(id) on delete set null,
  details     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------------ helpers / triggers
create or replace function public.support_audit(p_action text, p_ticket uuid, p_details jsonb)
returns void language sql security definer set search_path = public, pg_temp as $$
  insert into public.support_audit_log(actor_id, actor_email, action, ticket_id, details)
  values (auth.uid(), (select email from public.profiles where id = auth.uid()), p_action, p_ticket, coalesce(p_details, '{}'::jsonb));
$$;

create or replace function public.support_before_ticket_insert()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  new.ticket_number := 'CC-' || nextval('public.support_ticket_seq');
  new.user_id := auth.uid();
  new.status := 'open';
  new.assigned_to := null;
  new.priority := 'normal';
  new.requester_email := (select email from public.profiles where id = auth.uid());
  new.created_at := now();
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists support_before_ticket_insert on public.support_tickets;
create trigger support_before_ticket_insert before insert on public.support_tickets
  for each row execute function public.support_before_ticket_insert();

-- pg_trigger_depth() > 1 means this update was made by another trigger of this system (message insert) or by a
-- foreign-key action, never directly by a client. Unlike a settable configuration flag, a client cannot forge it.
create or replace function public.support_before_ticket_update()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if pg_trigger_depth() > 1 then
    new.updated_at := now();
    return new;
  end if;
  if new.id <> old.id or new.user_id <> old.user_id or new.ticket_number <> old.ticket_number
     or new.category <> old.category or new.subject <> old.subject or new.source <> old.source
     or new.created_at <> old.created_at or new.requester_email is distinct from old.requester_email
     or new.platform is distinct from old.platform or new.language is distinct from old.language then
    raise exception 'immutable ticket field';
  end if;
  if new.status is distinct from old.status and not public.support_can('change_status') then
    raise exception 'not allowed to change status';
  end if;
  if (new.assigned_to is distinct from old.assigned_to or new.priority is distinct from old.priority)
     and not public.support_can('assign') then
    raise exception 'not allowed to assign or prioritise';
  end if;
  if new.assigned_to is not null and new.assigned_to is distinct from old.assigned_to
     and not exists (select 1 from public.platform_administrators where user_id = new.assigned_to) then
    raise exception 'assignee must be support staff';
  end if;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists support_before_ticket_update on public.support_tickets;
create trigger support_before_ticket_update before update on public.support_tickets
  for each row execute function public.support_before_ticket_update();

create or replace function public.support_after_ticket_update()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if pg_trigger_depth() > 1 then return new; end if;
  if new.status is distinct from old.status then
    perform public.support_audit('status_changed', new.id, jsonb_build_object('from', old.status, 'to', new.status));
  end if;
  if new.assigned_to is distinct from old.assigned_to then
    perform public.support_audit('assigned', new.id, jsonb_build_object('from', old.assigned_to, 'to', new.assigned_to));
  end if;
  if new.priority is distinct from old.priority then
    perform public.support_audit('priority_changed', new.id, jsonb_build_object('from', old.priority, 'to', new.priority));
  end if;
  return new;
end $$;
drop trigger if exists support_after_ticket_update on public.support_tickets;
create trigger support_after_ticket_update after update on public.support_tickets
  for each row execute function public.support_after_ticket_update();

create or replace function public.support_before_message_insert()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
declare t public.support_tickets;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  select * into t from public.support_tickets where id = new.ticket_id;
  if t.id is null then raise exception 'ticket not found'; end if;
  new.author_id := auth.uid();
  new.is_staff := public.support_is_staff() and t.user_id <> auth.uid();
  if new.is_staff then
    if not public.support_can('reply') then raise exception 'not allowed to reply'; end if;
  else
    if t.user_id <> auth.uid() then raise exception 'not your ticket'; end if;
    if t.status = 'closed' then raise exception 'ticket is closed'; end if;
    if (select count(*) from public.support_messages where author_id = auth.uid() and created_at > now() - interval '10 minutes') >= 30 then
      raise exception 'rate limit: too many messages, try again later';
    end if;
  end if;
  new.created_at := now();
  return new;
end $$;
drop trigger if exists support_before_message_insert on public.support_messages;
create trigger support_before_message_insert before insert on public.support_messages
  for each row execute function public.support_before_message_insert();

create or replace function public.support_after_message_insert()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
declare t public.support_tickets;
begin
  select * into t from public.support_tickets where id = new.ticket_id;
  if new.is_staff then
    insert into public.support_notifications(user_id, ticket_id) values (t.user_id, t.id);
    update public.support_tickets set status = 'pending' where id = t.id and status in ('open','in_progress');
    update public.support_tickets set updated_at = now() where id = t.id;
    perform public.support_audit('staff_reply', t.id, '{}'::jsonb);
  else
    update public.support_tickets set status = 'open' where id = t.id and status in ('pending','resolved');
    update public.support_tickets set updated_at = now() where id = t.id;
  end if;
  return new;
end $$;
drop trigger if exists support_after_message_insert on public.support_messages;
create trigger support_after_message_insert after insert on public.support_messages
  for each row execute function public.support_after_message_insert();

-- Attachment rows are only accepted for a real, recent, own message and a real, own, matching stored object.
create or replace function public.support_before_attachment_insert()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
declare m public.support_messages; o record;
begin
  select * into m from public.support_messages where id = new.message_id;
  if m.id is null or m.ticket_id <> new.ticket_id or m.author_id is distinct from auth.uid() then
    raise exception 'invalid attachment message';
  end if;
  if m.created_at < now() - interval '15 minutes' then raise exception 'attachment window expired'; end if;
  if (select count(*) from public.support_attachments where message_id = new.message_id) >= 5 then
    raise exception 'too many attachments on this message';
  end if;
  select * into o from storage.objects where bucket_id = 'support-attachments' and name = new.path;
  if o.id is null or o.owner_id is distinct from auth.uid()::text then
    raise exception 'attachment object missing or not owned by you';
  end if;
  if (o.metadata ->> 'mimetype') is distinct from new.mime_type or ((o.metadata ->> 'size')::bigint) is distinct from new.size_bytes then
    raise exception 'attachment metadata does not match the stored object';
  end if;
  return new;
end $$;
drop trigger if exists support_before_attachment_insert on public.support_attachments;
create trigger support_before_attachment_insert before insert on public.support_attachments
  for each row execute function public.support_before_attachment_insert();

-- ------------------------------------------------------------------ RPCs
-- Ticket + first message in ONE transaction: a failure cannot leave an empty ticket behind.
create or replace function public.support_create_ticket(
  p_category text, p_subject text, p_body text, p_platform text default null, p_language text default null)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare t public.support_tickets; m public.support_messages;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not exists (select 1 from public.profiles where id = auth.uid()) then raise exception 'profile missing'; end if;
  if (select count(*) from public.support_tickets where user_id = auth.uid() and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'rate limit: too many new tickets, try again later';
  end if;
  if (select count(*) from public.support_tickets where user_id = auth.uid() and status in ('open','pending','in_progress')) >= 20 then
    raise exception 'too many open tickets';
  end if;
  insert into public.support_tickets (category, subject, platform, language, source)
  values (p_category, left(btrim(coalesce(p_subject, '')), 200),
          case when p_platform in ('all','ios','ipados','android','web') then p_platform end,
          case when p_language in ('en','fr','ht') then p_language end, 'web')
  returning * into t;
  insert into public.support_messages (ticket_id, body) values (t.id, btrim(coalesce(p_body, ''))) returning * into m;
  select * into t from public.support_tickets where id = t.id;
  return jsonb_build_object('ticket', to_jsonb(t), 'message_id', m.id);
end $$;

create or replace function public.support_me()
returns jsonb language sql stable security definer set search_path = public, pg_temp as $$
  select case when a.user_id is null then null else jsonb_build_object(
    'user_id', a.user_id, 'role', a.role::text,
    'permissions', jsonb_build_object(
      'reply',         public.support_can('reply'),
      'assign',        public.support_can('assign'),
      'change_status', public.support_can('change_status'),
      'view_stats',    public.support_can('view_stats'),
      'view_audit',    public.support_can('view_audit'))) end
  from (select 1) x left join public.platform_administrators a on a.user_id = auth.uid();
$$;

-- Staff directory for the assignee picker (staff only).
create or replace function public.support_staff_list()
returns table (user_id uuid, email text, display_name text, role text, permissions jsonb)
language plpgsql stable security definer set search_path = public, pg_temp as $$
begin
  if not public.support_is_staff() then raise exception 'forbidden'; end if;
  return query
    select a.user_id, p.email, p.display_name, a.role::text,
           case when a.role = 'founder' then '{"reply":true,"assign":true,"change_status":true,"view_stats":true,"view_audit":true}'::jsonb
                else coalesce(rp.permissions, '{}'::jsonb) end
    from public.platform_administrators a
    join public.profiles p on p.id = a.user_id
    left join public.support_role_permissions rp on rp.role = a.role
    order by a.role, p.display_name;
end $$;

-- Founder edits what each EXISTING platform role may do in support. Roles themselves are not changed here.
create or replace function public.support_set_role_permissions(p_role text, p_permissions jsonb)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare clean jsonb;
begin
  if public.support_role() is distinct from 'founder' then raise exception 'founder only'; end if;
  if p_role is null or p_role not in ('admin_1','admin_2','admin_3','admin_4','admin_5') then raise exception 'invalid role'; end if;
  if p_permissions is null or jsonb_typeof(p_permissions) <> 'object'
     or exists (select 1 from jsonb_each(p_permissions) e
                where e.key not in ('reply','assign','change_status','view_stats','view_audit') or jsonb_typeof(e.value) <> 'boolean') then
    raise exception 'invalid permissions';
  end if;
  select jsonb_object_agg(k, coalesce((p_permissions ->> k)::boolean, false))
    into clean from unnest(array['reply','assign','change_status','view_stats','view_audit']) k;
  insert into public.support_role_permissions(role, permissions) values (p_role::public.platform_role, clean)
  on conflict (role) do update set permissions = excluded.permissions, updated_at = now();
  perform public.support_audit('role_permissions_changed', null, jsonb_build_object('role', p_role, 'permissions', clean));
end $$;

create or replace function public.support_stats()
returns jsonb language plpgsql stable security definer set search_path = public, pg_temp as $$
begin
  if not public.support_can('view_stats') then raise exception 'forbidden'; end if;
  return jsonb_build_object(
    'total',      (select count(*) from public.support_tickets),
    'by_status',  coalesce((select jsonb_object_agg(status, c) from (select status, count(*) c from public.support_tickets group by 1) s), '{}'),
    'by_category',coalesce((select jsonb_object_agg(category, c) from (select category, count(*) c from public.support_tickets group by 1) s), '{}'),
    'unassigned', (select count(*) from public.support_tickets where assigned_to is null and status not in ('resolved','closed')),
    'last_7_days',(select count(*) from public.support_tickets where created_at > now() - interval '7 days'));
end $$;

create or replace function public.support_audit_list()
returns setof public.support_audit_log language plpgsql stable security definer set search_path = public, pg_temp as $$
begin
  if not public.support_can('view_audit') then raise exception 'forbidden'; end if;
  return query select * from public.support_audit_log order by created_at desc limit 200;
end $$;

-- Read-only: stored objects older than an hour that no attachment row references (failed or abandoned uploads).
-- Founder only. Deleting them is a manual Storage action; nothing is deleted here.
create or replace function public.support_orphan_objects()
returns table (name text, created_at timestamptz, size_bytes bigint)
language plpgsql stable security definer set search_path = public, pg_temp as $$
begin
  if public.support_role() is distinct from 'founder' then raise exception 'founder only'; end if;
  return query
    select o.name, o.created_at, (o.metadata ->> 'size')::bigint
    from storage.objects o
    where o.bucket_id = 'support-attachments' and o.created_at < now() - interval '1 hour'
      and not exists (select 1 from public.support_attachments a where a.path = o.name)
    order by o.created_at limit 500;
end $$;

-- Future-compat with profiles.notification_preferences (unused by any trigger yet; email stays disabled).
create or replace function public.support_wants_notification(p_user uuid, p_channel text default 'in_app')
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select coalesce((
    select case
      when jsonb_typeof(p.notification_preferences -> 'support') = 'boolean' then (p.notification_preferences ->> 'support')::boolean
      when jsonb_typeof(p.notification_preferences -> 'support') = 'object'
        then coalesce((p.notification_preferences -> 'support' ->> p_channel)::boolean, true)
      else true end
    from public.profiles p where p.id = p_user), true);
$$;

-- ------------------------------------------------------------------ storage helper predicates (used by policies)
-- Object path: <ticket uuid>/<message uuid>/<file>. Both uuids must exist and relate to each other.
create or replace function public.support_can_upload(p_name text)
returns boolean language plpgsql stable security definer set search_path = public, pg_temp as $$
declare parts text[]; m public.support_messages; t public.support_tickets;
begin
  if auth.uid() is null or p_name is null
     or p_name !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[A-Za-z0-9_-][A-Za-z0-9._-]{0,159}$' then
    return false;
  end if;
  parts := string_to_array(p_name, '/');
  select * into m from public.support_messages where id = parts[2]::uuid;
  if m.id is null or m.ticket_id::text <> parts[1] or m.author_id <> auth.uid() or m.created_at < now() - interval '15 minutes' then
    return false;
  end if;
  select * into t from public.support_tickets where id = m.ticket_id;
  if not (t.user_id = auth.uid() or public.support_can('reply')) then return false; end if;
  return (select count(*) from storage.objects o
          where o.bucket_id = 'support-attachments' and o.name like parts[1] || '/' || parts[2] || '/%') < 5;
end $$;

create or replace function public.support_can_read_object(p_name text)
returns boolean language plpgsql stable security definer set search_path = public, pg_temp as $$
declare parts text[];
begin
  if auth.uid() is null or p_name is null
     or p_name !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[A-Za-z0-9_-][A-Za-z0-9._-]{0,159}$' then
    return false;
  end if;
  parts := string_to_array(p_name, '/');
  return exists (select 1 from public.support_tickets t where t.id = parts[1]::uuid and (t.user_id = auth.uid() or public.support_is_staff()));
end $$;

-- Lets an uploader remove their own object ONLY while no attachment row references it (client-side cleanup).
create or replace function public.support_object_unreferenced(p_name text)
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select p_name is not null and not exists (select 1 from public.support_attachments a where a.path = p_name);
$$;

-- ------------------------------------------------------------------ RLS
alter table public.support_role_permissions enable row level security;
alter table public.support_tickets          enable row level security;
alter table public.support_messages         enable row level security;
alter table public.support_attachments      enable row level security;
alter table public.support_notifications    enable row level security;
alter table public.support_audit_log        enable row level security;

drop policy if exists role_perms_read on public.support_role_permissions;
create policy role_perms_read on public.support_role_permissions for select to authenticated using (public.support_is_staff());

drop policy if exists tickets_select on public.support_tickets;
create policy tickets_select on public.support_tickets for select to authenticated
  using (user_id = auth.uid() or public.support_is_staff());
-- No client INSERT policy or grant: tickets are created only by support_create_ticket().
drop policy if exists tickets_insert on public.support_tickets;
drop policy if exists tickets_staff_update on public.support_tickets;
create policy tickets_staff_update on public.support_tickets for update to authenticated
  using (public.support_is_staff()) with check (public.support_is_staff());

drop policy if exists messages_select on public.support_messages;
create policy messages_select on public.support_messages for select to authenticated
  using (exists (select 1 from public.support_tickets t where t.id = ticket_id and (t.user_id = auth.uid() or public.support_is_staff())));
drop policy if exists messages_insert on public.support_messages;
create policy messages_insert on public.support_messages for insert to authenticated
  with check (exists (select 1 from public.support_tickets t where t.id = ticket_id and (t.user_id = auth.uid() or public.support_can('reply'))));

drop policy if exists attachments_select on public.support_attachments;
create policy attachments_select on public.support_attachments for select to authenticated
  using (exists (select 1 from public.support_tickets t where t.id = ticket_id and (t.user_id = auth.uid() or public.support_is_staff())));
drop policy if exists attachments_insert on public.support_attachments;
create policy attachments_insert on public.support_attachments for insert to authenticated
  with check (exists (select 1 from public.support_messages m join public.support_tickets t on t.id = m.ticket_id
                      where m.id = message_id and m.ticket_id = support_attachments.ticket_id and m.author_id = auth.uid()
                        and (t.user_id = auth.uid() or public.support_can('reply'))));

drop policy if exists notifications_select on public.support_notifications;
create policy notifications_select on public.support_notifications for select to authenticated using (user_id = auth.uid());
drop policy if exists notifications_update on public.support_notifications;
create policy notifications_update on public.support_notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- audit log has no client policy or grant: it is readable only through support_audit_list() (permission-checked).

-- ------------------------------------------------------------------ explicit grants (do not rely on default privileges)
revoke all on public.support_role_permissions, public.support_tickets, public.support_messages, public.support_attachments,
  public.support_notifications, public.support_audit_log from public, anon, authenticated;
grant select on public.support_role_permissions, public.support_tickets, public.support_messages,
  public.support_attachments, public.support_notifications to authenticated;
grant update (status, priority, assigned_to) on public.support_tickets to authenticated;
grant insert (ticket_id, body) on public.support_messages to authenticated;
grant insert (ticket_id, message_id, path, file_name, mime_type, size_bytes) on public.support_attachments to authenticated;
grant update (read) on public.support_notifications to authenticated;
revoke all on sequence public.support_ticket_seq from public, anon, authenticated;

-- Functions: no PUBLIC/anon execute anywhere; only what clients or policies need is granted to authenticated.
revoke all on function
  public.support_is_staff(), public.support_role(), public.support_can(text), public.support_audit(text, uuid, jsonb),
  public.support_before_ticket_insert(), public.support_before_ticket_update(), public.support_after_ticket_update(),
  public.support_before_message_insert(), public.support_after_message_insert(), public.support_before_attachment_insert(),
  public.support_create_ticket(text, text, text, text, text), public.support_me(), public.support_staff_list(),
  public.support_set_role_permissions(text, jsonb), public.support_stats(), public.support_audit_list(),
  public.support_orphan_objects(), public.support_wants_notification(uuid, text), public.support_can_upload(text),
  public.support_can_read_object(text), public.support_object_unreferenced(text)
  from public, anon, authenticated;
grant execute on function
  public.support_is_staff(), public.support_can(text), public.support_create_ticket(text, text, text, text, text),
  public.support_me(), public.support_staff_list(), public.support_set_role_permissions(text, jsonb), public.support_stats(),
  public.support_audit_list(), public.support_orphan_objects(), public.support_can_upload(text),
  public.support_can_read_object(text), public.support_object_unreferenced(text)
  to authenticated;

-- ------------------------------------------------------------------ storage (private bucket)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('support-attachments', 'support-attachments', false, 52428800,
        array['image/jpeg','image/png','image/gif','image/webp','image/heic','video/mp4','video/quicktime','video/webm'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists support_objects_read on storage.objects;
create policy support_objects_read on storage.objects for select to authenticated
  using (bucket_id = 'support-attachments' and public.support_can_read_object(name));
drop policy if exists support_objects_insert on storage.objects;
create policy support_objects_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'support-attachments' and public.support_can_upload(name));
drop policy if exists support_objects_delete on storage.objects;
create policy support_objects_delete on storage.objects for delete to authenticated
  using (bucket_id = 'support-attachments' and owner_id = auth.uid()::text and public.support_object_unreferenced(name));
-- No UPDATE policy: stored objects cannot be overwritten or renamed by clients.

-- RESTRICTIVE guards: policies are OR-ed, so any broader pre-existing or future policy on storage.objects could open this
-- bucket. Restrictive policies are AND-ed with every permissive one, so nothing can grant access to support-attachments
-- except the rules above. They do not change access to any other bucket (condition is true for them).
drop policy if exists support_objects_guard_select on storage.objects;
create policy support_objects_guard_select on storage.objects as restrictive for select to authenticated
  using (bucket_id <> 'support-attachments' or public.support_can_read_object(name));
drop policy if exists support_objects_guard_insert on storage.objects;
create policy support_objects_guard_insert on storage.objects as restrictive for insert to authenticated
  with check (bucket_id <> 'support-attachments' or public.support_can_upload(name));
drop policy if exists support_objects_guard_update on storage.objects;
create policy support_objects_guard_update on storage.objects as restrictive for update to authenticated
  using (bucket_id <> 'support-attachments') with check (bucket_id <> 'support-attachments');
drop policy if exists support_objects_guard_delete on storage.objects;
create policy support_objects_guard_delete on storage.objects as restrictive for delete to authenticated
  using (bucket_id <> 'support-attachments' or (owner_id = auth.uid()::text and public.support_object_unreferenced(name)));
drop policy if exists support_objects_guard_anon on storage.objects;
create policy support_objects_guard_anon on storage.objects as restrictive for all to anon
  using (bucket_id <> 'support-attachments') with check (bucket_id <> 'support-attachments');

-- ------------------------------------------------------------------ realtime
do $$
declare tbl text;
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    foreach tbl in array array['support_messages','support_tickets','support_notifications'] loop
      if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = tbl) then
        execute format('alter publication supabase_realtime add table public.%I', tbl);
      end if;
    end loop;
  end if;
end $$;

-- ------------------------------------------------------------------ v2 marker (lets a re-run pass the preflight)
comment on table public.support_role_permissions is 'citycore-support:v2';
comment on table public.support_tickets          is 'citycore-support:v2';
comment on table public.support_messages         is 'citycore-support:v2';
comment on table public.support_attachments      is 'citycore-support:v2';
comment on table public.support_notifications    is 'citycore-support:v2';
comment on table public.support_audit_log        is 'citycore-support:v2';
comment on sequence public.support_ticket_seq    is 'citycore-support:v2';

commit;
