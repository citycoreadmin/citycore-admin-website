-- CityCore Admin support system (website + iOS share one account system).
--
-- REUSES existing objects (never recreated or altered):
--   auth.users, public.profiles, public.platform_administrators (+ platform_role enum),
--   public.is_platform_admin().
-- ADDS only support_* objects. Re-runnable (idempotent). No existing rows are modified.
-- Review in STAGING before production.

-- ------------------------------------------------------------------ permissions
-- Support permissions are derived from the EXISTING platform role. `founder` always has all.
create table if not exists public.support_role_permissions (
  role        public.platform_role primary key,
  permissions jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);
-- ASSUMPTION (confirm): admin_5 is the most senior non-founder level, admin_1 the least.
insert into public.support_role_permissions (role, permissions) values
  ('admin_5', '{"reply":true,"assign":true,"change_status":true,"view_stats":true,"view_audit":true}'),
  ('admin_4', '{"reply":true,"assign":true,"change_status":true,"view_stats":true,"view_audit":true}'),
  ('admin_3', '{"reply":true,"assign":true,"change_status":true,"view_stats":true,"view_audit":false}'),
  ('admin_2', '{"reply":true,"assign":false,"change_status":true,"view_stats":true,"view_audit":false}'),
  ('admin_1', '{"reply":true,"assign":false,"change_status":false,"view_stats":false,"view_audit":false}')
on conflict (role) do nothing;

create or replace function public.support_is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.platform_administrators where user_id = auth.uid());
$$;

create or replace function public.support_role()
returns text language sql stable security definer set search_path = public as $$
  select role::text from public.platform_administrators where user_id = auth.uid();
$$;

create or replace function public.support_can(perm text)
returns boolean language sql stable security definer set search_path = public as $$
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
  subject         text not null check (char_length(subject) between 1 and 200),
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
  body       text not null check (char_length(body) between 1 and 5000),
  created_at timestamptz not null default now()
);
create index if not exists support_messages_ticket_idx on public.support_messages (ticket_id, created_at);

create table if not exists public.support_attachments (
  id         uuid primary key default gen_random_uuid(),
  ticket_id  uuid not null references public.support_tickets(id) on delete cascade,
  message_id uuid not null references public.support_messages(id) on delete cascade,
  path       text not null unique,
  file_name  text not null,
  mime_type  text not null check (mime_type like 'image/%' or mime_type like 'video/%'),
  size_bytes bigint not null check (size_bytes between 1 and 52428800),
  created_at timestamptz not null default now()
);
create index if not exists support_attachments_msg_idx on public.support_attachments (message_id);

-- Separate from any app `notifications` table (it may not exist in every environment).
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
returns void language sql security definer set search_path = public as $$
  insert into public.support_audit_log(actor_id, actor_email, action, ticket_id, details)
  values (auth.uid(), (select email from public.profiles where id = auth.uid()), p_action, p_ticket, coalesce(p_details, '{}'::jsonb));
$$;
revoke all on function public.support_audit(text, uuid, jsonb) from public, anon, authenticated;

create or replace function public.support_before_ticket_insert()
returns trigger language plpgsql security definer set search_path = public as $$
begin
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

create or replace function public.support_before_ticket_update()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if coalesce(current_setting('support.internal', true), '') = '1' then
    new.updated_at := now();
    return new;
  end if;
  if new.id <> old.id or new.user_id <> old.user_id or new.ticket_number <> old.ticket_number
     or new.category <> old.category or new.subject <> old.subject or new.source <> old.source
     or new.created_at <> old.created_at or new.requester_email is distinct from old.requester_email then
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
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if coalesce(current_setting('support.internal', true), '') = '1' then return new; end if;
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
returns trigger language plpgsql security definer set search_path = public as $$
declare t public.support_tickets;
begin
  select * into t from public.support_tickets where id = new.ticket_id;
  new.author_id := auth.uid();
  new.is_staff := public.support_is_staff() and t.user_id <> auth.uid();
  if new.is_staff and not public.support_can('reply') then raise exception 'not allowed to reply'; end if;
  if not new.is_staff and t.status = 'closed' then raise exception 'ticket is closed'; end if;
  new.created_at := now();
  return new;
end $$;
drop trigger if exists support_before_message_insert on public.support_messages;
create trigger support_before_message_insert before insert on public.support_messages
  for each row execute function public.support_before_message_insert();

create or replace function public.support_after_message_insert()
returns trigger language plpgsql security definer set search_path = public as $$
declare t public.support_tickets;
begin
  select * into t from public.support_tickets where id = new.ticket_id;
  perform set_config('support.internal', '1', true);
  if new.is_staff then
    insert into public.support_notifications(user_id, ticket_id) values (t.user_id, t.id);
    update public.support_tickets set status = 'pending' where id = t.id and status in ('open','in_progress');
    update public.support_tickets set updated_at = now() where id = t.id;
  else
    update public.support_tickets set status = 'open' where id = t.id and status in ('pending','resolved');
    update public.support_tickets set updated_at = now() where id = t.id;
  end if;
  perform set_config('support.internal', '', true);
  if new.is_staff then perform public.support_audit('staff_reply', t.id, '{}'::jsonb); end if;
  return new;
end $$;
drop trigger if exists support_after_message_insert on public.support_messages;
create trigger support_after_message_insert after insert on public.support_messages
  for each row execute function public.support_after_message_insert();

-- ------------------------------------------------------------------ RPCs
create or replace function public.support_me()
returns jsonb language sql stable security definer set search_path = public as $$
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
language plpgsql stable security definer set search_path = public as $$
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
returns void language plpgsql security definer set search_path = public as $$
declare clean jsonb;
begin
  if public.support_role() is distinct from 'founder' then raise exception 'founder only'; end if;
  if p_role = 'founder' then raise exception 'founder permissions are fixed'; end if;
  select coalesce(jsonb_object_agg(k, coalesce((p_permissions ->> k)::boolean, false)), '{}')
    into clean from unnest(array['reply','assign','change_status','view_stats','view_audit']) k;
  insert into public.support_role_permissions(role, permissions) values (p_role::public.platform_role, clean)
  on conflict (role) do update set permissions = excluded.permissions, updated_at = now();
  perform public.support_audit('role_permissions_changed', null, jsonb_build_object('role', p_role, 'permissions', clean));
end $$;

create or replace function public.support_stats()
returns jsonb language plpgsql stable security definer set search_path = public as $$
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
returns setof public.support_audit_log language plpgsql stable security definer set search_path = public as $$
begin
  if not public.support_can('view_audit') then raise exception 'forbidden'; end if;
  return query select * from public.support_audit_log order by created_at desc limit 200;
end $$;

revoke all on function public.support_me(), public.support_staff_list(), public.support_set_role_permissions(text,jsonb),
  public.support_stats(), public.support_audit_list() from public, anon;
grant execute on function public.support_me(), public.support_staff_list(), public.support_set_role_permissions(text,jsonb),
  public.support_stats(), public.support_audit_list() to authenticated;

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
drop policy if exists tickets_insert on public.support_tickets;
create policy tickets_insert on public.support_tickets for insert to authenticated with check (user_id = auth.uid());
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

-- audit log has no client policy: it is readable only through support_audit_list() (permission-checked).

-- column-level hardening
revoke all on public.support_role_permissions, public.support_tickets, public.support_messages, public.support_attachments,
  public.support_notifications, public.support_audit_log from anon;
revoke insert, update, delete on public.support_role_permissions from authenticated;
revoke all on public.support_audit_log from authenticated;
revoke update, delete on public.support_messages, public.support_attachments from authenticated;
revoke delete on public.support_tickets, public.support_notifications from authenticated;
revoke update on public.support_tickets from authenticated;
grant  update (status, priority, assigned_to) on public.support_tickets to authenticated;
revoke update on public.support_notifications from authenticated;
grant  update (read) on public.support_notifications to authenticated;

-- ------------------------------------------------------------------ storage (private bucket)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('support-attachments', 'support-attachments', false, 52428800,
        array['image/jpeg','image/png','image/gif','image/webp','image/heic','video/mp4','video/quicktime','video/webm'])
on conflict (id) do nothing;

drop policy if exists support_objects_read on storage.objects;
create policy support_objects_read on storage.objects for select to authenticated
  using (bucket_id = 'support-attachments' and exists (
    select 1 from public.support_tickets t where t.id::text = (storage.foldername(name))[1]
      and (t.user_id = auth.uid() or public.support_is_staff())));
drop policy if exists support_objects_insert on storage.objects;
create policy support_objects_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'support-attachments' and exists (
    select 1 from public.support_tickets t where t.id::text = (storage.foldername(name))[1]
      and (t.user_id = auth.uid() or public.support_can('reply'))));

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
