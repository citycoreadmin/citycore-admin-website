-- CityCore Admin support system.
-- ADDITIVE ONLY: creates new support_* objects. Does not alter or drop existing tables,
-- users, profiles, roles or data. Review against your existing schema BEFORE applying,
-- and apply to a staging project first.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- staff / roles
create table if not exists public.support_staff (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  role        text not null check (role in ('founder','admin','agent')),
  permissions jsonb not null default '{"reply":true,"assign":false,"change_status":true,"view_stats":true,"view_audit":false}'::jsonb,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create or replace function public.support_is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.support_staff where user_id = auth.uid() and active);
$$;

create or replace function public.support_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.support_staff where user_id = auth.uid() and active;
$$;

-- Founder has every permission; others need the flag.
create or replace function public.support_can(perm text)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((
    select s.role = 'founder' or coalesce((s.permissions ->> perm)::boolean, false)
    from public.support_staff s where s.user_id = auth.uid() and s.active
  ), false);
$$;

-- ---------------------------------------------------------------- tickets
create sequence if not exists public.support_ticket_seq start 1001;

create table if not exists public.support_tickets (
  id              uuid primary key default gen_random_uuid(),
  ticket_number   text not null unique,
  user_id         uuid not null references auth.users(id) on delete cascade,
  requester_email text,
  category        text not null check (category in
    ('account','payment','technical','report_user','feedback','bug','admin_panel','other')),
  subject         text not null check (char_length(subject) between 1 and 200),
  priority        text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  status          text not null default 'open' check (status in ('open','pending','in_progress','resolved','closed')),
  assigned_to     uuid references auth.users(id) on delete set null,
  platform        text,
  language        text check (language in ('en','fr','ht')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists support_tickets_user_idx   on public.support_tickets (user_id, updated_at desc);
create index if not exists support_tickets_status_idx on public.support_tickets (status, category, priority);

create table if not exists public.support_messages (
  id         uuid primary key default gen_random_uuid(),
  ticket_id  uuid not null references public.support_tickets(id) on delete cascade,
  author_id  uuid not null references auth.users(id) on delete cascade,
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

create table if not exists public.support_notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  ticket_id  uuid not null references public.support_tickets(id) on delete cascade,
  kind       text not null default 'staff_reply',
  read       boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists support_notifications_user_idx on public.support_notifications (user_id, read, created_at desc);

create table if not exists public.support_audit_log (
  id         bigint generated always as identity primary key,
  actor_id   uuid references auth.users(id) on delete set null,
  actor_email text,
  action     text not null,
  ticket_id  uuid references public.support_tickets(id) on delete set null,
  details    jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- triggers
create or replace function public.support_before_ticket_insert()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.ticket_number := 'CC-' || nextval('public.support_ticket_seq');
  new.user_id := auth.uid();
  new.status := 'open';
  new.assigned_to := null;
  new.priority := 'normal';
  new.requester_email := (select email from auth.users where id = auth.uid());
  new.created_at := now();
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists support_before_ticket_insert on public.support_tickets;
create trigger support_before_ticket_insert before insert on public.support_tickets
  for each row execute function public.support_before_ticket_insert();

-- Staff may only change status/priority/assignment; identity fields are immutable.
create or replace function public.support_before_ticket_update()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.id <> old.id or new.user_id <> old.user_id or new.ticket_number <> old.ticket_number
     or new.category <> old.category or new.subject <> old.subject
     or new.created_at <> old.created_at or new.requester_email is distinct from old.requester_email then
    raise exception 'immutable ticket field';
  end if;
  if coalesce(current_setting('support.internal', true), '') = '1' then
    new.updated_at := now();
    return new;
  end if;
  if new.status is distinct from old.status and not public.support_can('change_status') then
    raise exception 'not allowed to change status';
  end if;
  if (new.assigned_to is distinct from old.assigned_to or new.priority is distinct from old.priority)
     and not public.support_can('assign') then
    raise exception 'not allowed to assign or prioritise';
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
  if new.status is distinct from old.status then
    insert into public.support_audit_log(actor_id, actor_email, action, ticket_id, details)
    values (auth.uid(), (select email from auth.users where id = auth.uid()), 'status_changed', new.id,
            jsonb_build_object('from', old.status, 'to', new.status));
  end if;
  if new.assigned_to is distinct from old.assigned_to then
    insert into public.support_audit_log(actor_id, actor_email, action, ticket_id, details)
    values (auth.uid(), (select email from auth.users where id = auth.uid()), 'assigned', new.id,
            jsonb_build_object('from', old.assigned_to, 'to', new.assigned_to));
  end if;
  if new.priority is distinct from old.priority then
    insert into public.support_audit_log(actor_id, actor_email, action, ticket_id, details)
    values (auth.uid(), (select email from auth.users where id = auth.uid()), 'priority_changed', new.id,
            jsonb_build_object('from', old.priority, 'to', new.priority));
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
  if new.is_staff and not public.support_can('reply') then
    raise exception 'not allowed to reply';
  end if;
  if not new.is_staff and t.status = 'closed' then
    raise exception 'ticket is closed';
  end if;
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
    update public.support_tickets set status = 'pending', updated_at = now()
      where id = t.id and status in ('open','in_progress');
  else
    update public.support_tickets set status = 'open', updated_at = now()
      where id = t.id and status in ('pending','resolved');
    update public.support_tickets set updated_at = now() where id = t.id;
  end if;
  perform set_config('support.internal', '', true);
  insert into public.support_audit_log(actor_id, actor_email, action, ticket_id, details)
  select auth.uid(), (select email from auth.users where id = auth.uid()), 'staff_reply', t.id, '{}'::jsonb
  where new.is_staff;
  return new;
end $$;
drop trigger if exists support_after_message_insert on public.support_messages;
create trigger support_after_message_insert after insert on public.support_messages
  for each row execute function public.support_after_message_insert();

-- ---------------------------------------------------------------- RPCs
-- Staff management is founder-only and always audited.
create or replace function public.support_set_staff(p_email text, p_role text, p_permissions jsonb, p_active boolean default true)
returns void language plpgsql security definer set search_path = public as $$
declare uid uuid;
begin
  if public.support_role() is distinct from 'founder' then raise exception 'founder only'; end if;
  if p_role not in ('founder','admin','agent') then raise exception 'invalid role'; end if;
  select id into uid from auth.users where lower(email) = lower(p_email);
  if uid is null then raise exception 'no user with that email'; end if;
  insert into public.support_staff(user_id, email, role, permissions, active)
  values (uid, lower(p_email), p_role, coalesce(p_permissions, '{}'::jsonb), p_active)
  on conflict (user_id) do update
    set role = excluded.role, permissions = excluded.permissions, active = excluded.active, email = excluded.email;
  insert into public.support_audit_log(actor_id, actor_email, action, details)
  values (auth.uid(), (select email from auth.users where id = auth.uid()), 'staff_changed',
          jsonb_build_object('email', lower(p_email), 'role', p_role, 'active', p_active, 'permissions', p_permissions));
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
    'last_7_days',(select count(*) from public.support_tickets where created_at > now() - interval '7 days')
  );
end $$;

revoke all on function public.support_set_staff(text,text,jsonb,boolean) from public, anon;
revoke all on function public.support_stats() from public, anon;
grant execute on function public.support_set_staff(text,text,jsonb,boolean) to authenticated;
grant execute on function public.support_stats() to authenticated;

-- ---------------------------------------------------------------- RLS
alter table public.support_staff         enable row level security;
alter table public.support_tickets       enable row level security;
alter table public.support_messages      enable row level security;
alter table public.support_attachments   enable row level security;
alter table public.support_notifications enable row level security;
alter table public.support_audit_log     enable row level security;

-- staff table: staff can read (to assign tickets); only the RPC (security definer) writes.
create policy staff_read on public.support_staff for select to authenticated
  using (public.support_is_staff() or user_id = auth.uid());

-- tickets
create policy tickets_select on public.support_tickets for select to authenticated
  using (user_id = auth.uid() or public.support_is_staff());
create policy tickets_insert on public.support_tickets for insert to authenticated
  with check (user_id = auth.uid());
create policy tickets_staff_update on public.support_tickets for update to authenticated
  using (public.support_is_staff()) with check (public.support_is_staff());

-- messages
create policy messages_select on public.support_messages for select to authenticated
  using (exists (select 1 from public.support_tickets t
                 where t.id = ticket_id and (t.user_id = auth.uid() or public.support_is_staff())));
create policy messages_insert on public.support_messages for insert to authenticated
  with check (exists (select 1 from public.support_tickets t
                      where t.id = ticket_id and (t.user_id = auth.uid() or public.support_can('reply'))));

-- attachments
create policy attachments_select on public.support_attachments for select to authenticated
  using (exists (select 1 from public.support_tickets t
                 where t.id = ticket_id and (t.user_id = auth.uid() or public.support_is_staff())));
create policy attachments_insert on public.support_attachments for insert to authenticated
  with check (exists (select 1 from public.support_messages m
                      join public.support_tickets t on t.id = m.ticket_id
                      where m.id = message_id and m.ticket_id = support_attachments.ticket_id
                        and m.author_id = auth.uid()
                        and (t.user_id = auth.uid() or public.support_can('reply'))));

-- notifications: owner only
create policy notifications_select on public.support_notifications for select to authenticated
  using (user_id = auth.uid());
create policy notifications_update on public.support_notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- audit log: read-only for staff with view_audit; written only by triggers/RPCs.
create policy audit_select on public.support_audit_log for select to authenticated
  using (public.support_can('view_audit'));

-- Column-level hardening: clients can never write these tables beyond the policies above.
revoke update on public.support_tickets from authenticated;
grant  update (status, priority, assigned_to) on public.support_tickets to authenticated;
revoke update on public.support_notifications from authenticated;
grant  update (read) on public.support_notifications to authenticated;
revoke insert, update, delete on public.support_staff, public.support_audit_log from authenticated, anon;
revoke all on public.support_staff, public.support_tickets, public.support_messages,
  public.support_attachments, public.support_notifications, public.support_audit_log from anon;

-- ---------------------------------------------------------------- storage
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('support-attachments', 'support-attachments', false, 52428800,
        array['image/jpeg','image/png','image/gif','image/webp','image/heic','video/mp4','video/quicktime','video/webm'])
on conflict (id) do nothing;

-- Object path convention: <ticket_id>/<random>-<filename>
create policy support_objects_read on storage.objects for select to authenticated
  using (bucket_id = 'support-attachments' and exists (
    select 1 from public.support_tickets t
    where t.id::text = (storage.foldername(name))[1]
      and (t.user_id = auth.uid() or public.support_is_staff())));
create policy support_objects_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'support-attachments' and exists (
    select 1 from public.support_tickets t
    where t.id::text = (storage.foldername(name))[1]
      and (t.user_id = auth.uid() or public.support_can('reply'))));

-- ---------------------------------------------------------------- realtime
alter publication supabase_realtime add table public.support_messages, public.support_tickets, public.support_notifications;

-- ---------------------------------------------------------------- bootstrap founder (run manually)
-- insert into public.support_staff(user_id, email, role, permissions)
-- select id, email, 'founder', '{}'::jsonb from auth.users where email = 'YOUR_FOUNDER_EMAIL';
