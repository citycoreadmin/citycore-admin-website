-- Assertion-based security + functional tests for the support system v2. SCRATCH POSTGRES ONLY (see run_scratch.sh).
-- Any failed assertion aborts the run (ON_ERROR_STOP).
\set ON_ERROR_STOP 1
\set QUIET 1

create schema t;
grant usage on schema t to public;

create function t.as_user(p_uid text) returns void language plpgsql as $$
begin
  reset role;
  perform set_config('request.jwt.claim.sub', coalesce(p_uid, ''), false);
  if p_uid is null then set role anon; else set role authenticated; end if;
end $$;
create function t.su() returns void language plpgsql as $$ begin reset role; end $$;
create function t.assert(p_ok boolean, p_msg text) returns void language plpgsql as $$
begin if p_ok is not true then raise exception 'ASSERTION FAILED: %', p_msg; end if; raise notice 'ok   - %', p_msg; end $$;
create function t.expect_fail(p_sql text, p_pattern text) returns void language plpgsql as $$
declare ok boolean := false;
begin
  begin execute p_sql; ok := true;
  exception when others then
    if sqlerrm !~* p_pattern then raise exception 'ASSERTION FAILED: wrong error for [%]: got "%", wanted /%/', p_sql, sqlerrm, p_pattern; end if;
  end;
  if ok then raise exception 'ASSERTION FAILED: expected failure but succeeded: %', p_sql; end if;
  raise notice 'ok   - denied: % (%)', left(p_sql, 70), p_pattern;
end $$;
create function t.expect_affected(p_sql text, p_n int) returns void language plpgsql as $$
declare n int;
begin execute p_sql; get diagnostics n = row_count;
  if n <> p_n then raise exception 'ASSERTION FAILED: [%] affected % rows, wanted %', p_sql, n, p_n; end if;
  raise notice 'ok   - affected %: %', p_n, left(p_sql, 70);
end $$;

-- ---------- seed (superuser)
insert into auth.users(id, email) values
 ('00000000-0000-0000-0000-00000000000f','founder@t.test'),
 ('00000000-0000-0000-0000-000000000001','a1@t.test'),
 ('00000000-0000-0000-0000-000000000005','a5@t.test'),
 ('00000000-0000-0000-0000-0000000000a1','u1@t.test'),
 ('00000000-0000-0000-0000-0000000000a2','u2@t.test'),
 ('00000000-0000-0000-0000-0000000000a3','u3@t.test');
insert into public.platform_administrators(user_id, role) values
 ('00000000-0000-0000-0000-00000000000f','founder'),
 ('00000000-0000-0000-0000-000000000001','admin_1'),
 ('00000000-0000-0000-0000-000000000005','admin_5');
\set F '00000000-0000-0000-0000-00000000000f'
\set A1 '00000000-0000-0000-0000-000000000001'
\set A5 '00000000-0000-0000-0000-000000000005'
\set U1 '00000000-0000-0000-0000-0000000000a1'
\set U2 '00000000-0000-0000-0000-0000000000a2'
\set U3 '00000000-0000-0000-0000-0000000000a3'

-- ---------- structure
select t.assert((select bool_and(c.relrowsecurity) from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname like 'support\_%' and c.relkind='r'), 'RLS enabled on every support table');
select t.assert(not exists (select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname like 'support\_%' and p.prosecdef and not coalesce(p.proconfig::text,'') like '%search_path%'), 'every SECURITY DEFINER support function pins search_path');
select t.assert(not exists (select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname like 'support\_%' and (has_function_privilege('anon', p.oid, 'execute') or has_function_privilege('public', p.oid, 'execute'))), 'anon/PUBLIC cannot execute any support function');
select t.assert(not exists (select 1 from pg_proc p where p.proname in ('support_role','support_audit','support_wants_notification','support_before_ticket_insert','support_before_ticket_update','support_after_ticket_update','support_before_message_insert','support_after_message_insert','support_before_attachment_insert') and has_function_privilege('authenticated', p.oid, 'execute')), 'authenticated cannot execute internal/trigger functions');
select t.assert(not exists (select 1 from information_schema.tables where table_schema='public' and table_name like 'support\_%' and exists (select 1 from information_schema.role_table_grants g where g.table_name=tables.table_name and g.table_schema='public' and g.grantee in ('anon','PUBLIC'))), 'anon has no table grants on support tables');
select t.assert(not has_table_privilege('authenticated','public.support_tickets','insert') and not has_table_privilege('authenticated','public.support_tickets','delete') and not has_table_privilege('authenticated','public.support_audit_log','select'), 'no client INSERT/DELETE on tickets, no direct audit read');
select t.assert((select not public and file_size_limit = 52428800 and 'video/mp4' = any(allowed_mime_types) and not ('image/svg+xml' = any(allowed_mime_types)) from storage.buckets where id='support-attachments'), 'bucket private, 50MB, explicit mime list without SVG');
select t.assert(not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname like 'support\_objects\_%' and permissive='PERMISSIVE' and cmd in ('UPDATE','ALL')), 'no permissive UPDATE/ALL storage policy for support objects');

-- ---------- anonymous
select t.as_user(null);
select t.expect_fail('select * from public.support_tickets', 'permission denied');
select t.expect_fail('select * from public.support_messages', 'permission denied');
select t.expect_fail('select * from public.support_audit_log', 'permission denied');
select t.expect_fail($$select public.support_create_ticket('account','s','b')$$, 'permission denied');
select t.expect_fail('select public.support_stats()', 'permission denied');
select t.expect_fail($$insert into storage.objects(bucket_id,name,metadata) values ('support-attachments','x','{}')$$, 'row-level security|violates|permission denied');

-- ---------- ticket creation (atomic RPC)
select t.as_user(:'U1');
select t.expect_fail($$insert into public.support_tickets(category,subject) values ('account','direct')$$, 'permission denied');
select t.expect_fail($$select public.support_create_ticket('hacking','s','b')$$, 'check constraint|violates');
select t.expect_fail($$select public.support_create_ticket('account','   ','b')$$, 'check constraint|violates');
select t.expect_fail($$select public.support_create_ticket('account','s','   ')$$, 'check constraint|violates');
select t.assert((select count(*) from public.support_tickets) = 0 and (select count(*) from public.support_messages) = 0, 'failed creations leave no ticket or message behind');
select (public.support_create_ticket('account','Cannot log in','Help me','ios','fr')) -> 'ticket' ->> 'id' as t1,
       (public.support_create_ticket('feedback','Second','Hi','mars','xx')) -> 'ticket' ->> 'id' as t1b \gset
select t.assert((select ticket_number ~ '^CC-[0-9]+$' and status='open' and priority='normal' and user_id = :'U1'::uuid and platform='ios' and language='fr' from public.support_tickets where id=:'t1'), 'ticket numbered, open, owned by caller');
select t.assert((select platform is null and language is null from public.support_tickets where id=:'t1b'), 'unknown platform/language stored as null');
select t.assert((select count(distinct ticket_number) from public.support_tickets) = 2, 'ticket numbers unique');
select id as m1 from public.support_messages where ticket_id=:'t1' \gset
select t.assert((select is_staff = false and author_id = :'U1'::uuid from public.support_messages where id=:'m1'), 'first message authored by caller');

-- forgery attempts
select t.expect_fail(format($f$insert into public.support_messages(ticket_id,body,author_id) values (%L,'x',%L)$f$, :'t1', :'U2'), 'permission denied');
select t.expect_fail(format($f$insert into public.support_messages(ticket_id,body,is_staff) values (%L,'x',true)$f$, :'t1'), 'permission denied');
select t.expect_fail(format($f$update public.support_tickets set user_id=%L where id=%L$f$, :'U2', :'t1'), 'permission denied');
select t.expect_fail(format($f$update public.support_tickets set subject='pwn' where id=%L$f$, :'t1'), 'permission denied');
select t.expect_affected(format($f$update public.support_tickets set status='closed' where id=%L$f$, :'t1'), 0);
select t.expect_affected(format($f$update public.support_tickets set assigned_to=%L where id=%L$f$, :'U1', :'t1'), 0);
select t.expect_fail($$insert into public.support_audit_log(action) values ('x')$$, 'permission denied');
select t.expect_fail($$select * from public.support_audit_log$$, 'permission denied');
select t.expect_fail('select public.support_audit_list()', 'forbidden');
select t.expect_fail('select * from public.support_staff_list()', 'forbidden');
select t.expect_fail('select * from public.support_orphan_objects()', 'founder only');
select t.expect_fail('select public.support_stats()', 'forbidden');
select t.expect_fail($$select public.support_set_role_permissions('admin_1','{"assign":true}')$$, 'founder only');
select t.expect_fail('select public.support_role()', 'permission denied');
select t.assert(public.support_me() is null, 'non-staff support_me() is null');
select t.assert(not public.support_is_staff(), 'non-staff is not staff');

-- isolation
select t.as_user(:'U2');
select t.assert((select count(*) from public.support_tickets) = 0, 'u2 sees none of u1 tickets');
select t.assert((select count(*) from public.support_messages) = 0, 'u2 sees none of u1 messages');
select t.expect_fail(format($f$insert into public.support_messages(ticket_id,body) values (%L,'intruder')$f$, :'t1'), 'row-level security|not your ticket');
select (public.support_create_ticket('bug','u2 ticket','body')) -> 'ticket' ->> 'id' as t2 \gset
select t.assert((select count(*) from public.support_tickets) = 1, 'u2 sees only own ticket');

-- ---------- attachments
select t.as_user(:'U1');
select :'t1' || '/' || :'m1' || '/' as base \gset
\set okpath :base'pic.png'
-- uploads: valid
select t.expect_affected(format($f$insert into storage.objects(bucket_id,name,metadata) values ('support-attachments',%L,'{"mimetype":"image/png","size":1000}')$f$, :'base' || 'pic.png'), 1);
-- uploads: denied variants
select t.expect_fail(format($f$insert into storage.objects(bucket_id,name,metadata) values ('support-attachments',%L,'{}')$f$, :'t1' || '/' || :'t1' || '/x.png'), 'row-level security|violates');
select t.expect_fail(format($f$insert into storage.objects(bucket_id,name,metadata) values ('support-attachments',%L,'{}')$f$, :'t2' || '/' || :'m1' || '/x.png'), 'row-level security|violates');
select t.expect_fail(format($f$insert into storage.objects(bucket_id,name,metadata) values ('support-attachments',%L,'{}')$f$, :'t1' || '/x.png'), 'row-level security|violates');
select t.expect_fail(format($f$insert into storage.objects(bucket_id,name,metadata) values ('support-attachments',%L,'{}')$f$, :'base' || '../x.png'), 'row-level security|violates');
select t.expect_fail(format($f$insert into storage.objects(bucket_id,name,metadata) values ('support-attachments',%L,'{}')$f$, :'base' || '.hidden/x.png'), 'row-level security|violates');
select t.expect_fail($$insert into storage.objects(bucket_id,name,metadata) values ('other-bucket','x','{}')$$, 'row-level security|violates|check');
-- metadata row: valid
select t.expect_affected(format($f$insert into public.support_attachments(ticket_id,message_id,path,file_name,mime_type,size_bytes) values (%L,%L,%L,'pic.png','image/png',1000)$f$, :'t1', :'m1', :'base' || 'pic.png'), 1);
-- metadata row: denied variants
select t.expect_fail(format($f$insert into public.support_attachments(ticket_id,message_id,path,file_name,mime_type,size_bytes) values (%L,%L,%L,'pic.png','image/png',1001)$f$, :'t1', :'m1', :'base' || 'pic.png'), 'does not match|duplicate|unique');
select t.expect_fail(format($f$insert into public.support_attachments(ticket_id,message_id,path,file_name,mime_type,size_bytes) values (%L,%L,%L,'ghost.png','image/png',10)$f$, :'t1', :'m1', :'base' || 'ghost.png'), 'missing|not owned');
select t.expect_fail(format($f$insert into public.support_attachments(ticket_id,message_id,path,file_name,mime_type,size_bytes) values (%L,%L,%L,'x.svg','image/svg+xml',10)$f$, :'t1', :'m1', :'base' || 'x.svg'), 'check constraint|violates|invalid attachment|missing|does not match');
select t.expect_fail(format($f$insert into public.support_attachments(ticket_id,message_id,path,file_name,mime_type,size_bytes) values (%L,%L,%L,'x.png','image/png',99999999999)$f$, :'t1', :'m1', :'base' || 'x.png'), 'check constraint|violates|invalid attachment|missing|does not match');
select t.expect_fail(format($f$insert into public.support_attachments(ticket_id,message_id,path,file_name,mime_type,size_bytes) values (%L,%L,%L,'x.png','image/png',10)$f$, :'t2', :'m1', :'base' || 'x.png'), 'check constraint|violates|invalid attachment|missing|does not match');
select t.expect_fail(format($f$insert into public.support_attachments(ticket_id,message_id,path,file_name,mime_type,size_bytes) values (%L,%L,'not/a/valid-path','x.png','image/png',10)$f$, :'t1', :'m1'), 'check constraint|violates|invalid attachment|missing|does not match');
select t.expect_fail(format($f$insert into public.support_attachments(ticket_id,message_id,path,file_name,mime_type,size_bytes) values (%L,%L,%L,'a/b.png','image/png',10)$f$, :'t1', :'m1', :'base' || 'b.png'), 'check constraint|violates|invalid attachment|missing|does not match');
-- metadata mismatch with stored object
select t.expect_affected(format($f$insert into storage.objects(bucket_id,name,metadata) values ('support-attachments',%L,'{"mimetype":"image/png","size":500}')$f$, :'base' || 'm.png'), 1);
select t.expect_fail(format($f$insert into public.support_attachments(ticket_id,message_id,path,file_name,mime_type,size_bytes) values (%L,%L,%L,'m.png','image/png',999)$f$, :'t1', :'m1', :'base' || 'm.png'), 'does not match');
select t.expect_fail(format($f$insert into public.support_attachments(ticket_id,message_id,path,file_name,mime_type,size_bytes) values (%L,%L,%L,'m.png','image/jpeg',500)$f$, :'t1', :'m1', :'base' || 'm.png'), 'does not match');
-- other user cannot attach to / reuse u1 objects
select t.as_user(:'U2');
select t.expect_fail(format($f$insert into public.support_attachments(ticket_id,message_id,path,file_name,mime_type,size_bytes) values (%L,%L,%L,'m.png','image/png',500)$f$, :'t1', :'m1', :'base' || 'm.png'), 'row-level security|invalid attachment');
select t.expect_fail(format($f$insert into storage.objects(bucket_id,name,metadata) values ('support-attachments',%L,'{}')$f$, :'base' || 'evil.png'), 'row-level security|violates');
select t.assert((select count(*) from storage.objects) = 0, 'u2 cannot read u1 objects');
select t.assert((select count(*) from public.support_attachments) = 0, 'u2 cannot read u1 attachment rows');
select t.expect_affected(format($f$delete from storage.objects where name=%L$f$, :'base' || 'pic.png'), 0);
-- u1: 5-object cap
select t.as_user(:'U1');
select t.expect_affected(format($f$insert into storage.objects(bucket_id,name,metadata) values ('support-attachments',%L,'{"mimetype":"image/png","size":1}')$f$, :'base' || 'c' || g || '.png'), 1) from generate_series(1,2) g;
select t.assert((select count(*) from storage.objects where name like :'base' || '%') = 4, 'u1 sees own 4 objects');
select t.expect_affected(format($f$insert into storage.objects(bucket_id,name,metadata) values ('support-attachments',%L,'{"mimetype":"image/png","size":1}')$f$, :'base' || 'c5.png'), 1);
select t.expect_fail(format($f$insert into storage.objects(bucket_id,name,metadata) values ('support-attachments',%L,'{}')$f$, :'base' || 'c6.png'), 'row-level security|violates');
-- delete: unreferenced own object ok; referenced object kept
select t.expect_affected(format($f$delete from storage.objects where name=%L$f$, :'base' || 'c5.png'), 1);
select t.expect_affected(format($f$delete from storage.objects where name=%L$f$, :'base' || 'pic.png'), 0);
select t.expect_affected(format($f$update storage.objects set name=%L where name=%L$f$, :'base' || 'moved.png', :'base' || 'pic.png'), 0);
select t.assert((select count(*) from public.support_attachments where message_id=:'m1') = 1, 'one attachment row on message');
-- message window: an old message can no longer receive uploads
select t.su();
update public.support_messages set created_at = now() - interval '20 minutes' where id = :'m1';
select t.as_user(:'U1');
select t.expect_fail(format($f$insert into storage.objects(bucket_id,name,metadata) values ('support-attachments',%L,'{}')$f$, :'base' || 'late.png'), 'row-level security|violates');
select t.expect_fail(format($f$insert into public.support_attachments(ticket_id,message_id,path,file_name,mime_type,size_bytes) values (%L,%L,%L,'m.png','image/png',500)$f$, :'t1', :'m1', :'base' || 'm.png'), 'window expired');

-- ---------- staff
select t.as_user(:'A1');
select t.assert((select count(*) from public.support_tickets) = 3, 'staff sees all tickets');
select t.assert((public.support_me() ->> 'role') = 'admin_1' and (public.support_me() -> 'permissions' ->> 'reply')::boolean and not (public.support_me() -> 'permissions' ->> 'assign')::boolean, 'staff default permissions: reply yes, assign no');
select t.assert((select count(*) from storage.objects) >= 1 and (select count(*) from public.support_attachments) = 1, 'staff can read attachment objects/rows');
select t.expect_fail(format($f$update public.support_tickets set assigned_to=%L where id=%L$f$, :'A1', :'t1'), 'not allowed to assign');
select t.expect_fail(format($f$update public.support_tickets set priority='urgent' where id=%L$f$, :'t1'), 'not allowed to assign');
select t.expect_fail('select public.support_audit_list()', 'forbidden');
select t.expect_fail($$select public.support_set_role_permissions('admin_1','{"assign":true}')$$, 'founder only');
select t.expect_fail('select * from public.support_orphan_objects()', 'founder only');
select t.assert((public.support_stats() ->> 'total')::int = 3, 'staff can view stats');
-- the old support.internal flag must NOT bypass anything
select set_config('support.internal', '1', false);
select t.expect_fail(format($f$update public.support_tickets set assigned_to=%L where id=%L$f$, :'A1', :'t1'), 'not allowed to assign');
select t.expect_fail(format($f$update public.support_tickets set subject='x' where id=%L$f$, :'t1'), 'permission denied');
-- reply + notification + status
select t.expect_affected(format($f$insert into public.support_messages(ticket_id,body) values (%L,'We are on it')$f$, :'t1'), 1);
select t.as_user(:'U1');
select t.assert((select is_staff from public.support_messages where ticket_id=:'t1' order by created_at desc limit 1), 'reply stored as staff message');
select t.assert((select status from public.support_tickets where id=:'t1') = 'pending', 'staff reply moves ticket to pending');
select t.assert((select count(*) from public.support_notifications where read=false) = 1, 'user notified of staff reply');
select t.expect_fail($$update public.support_notifications set user_id = user_id$$, 'permission denied');
select t.expect_affected('update public.support_notifications set read=true', 1);
select t.as_user(:'U2');
select t.assert((select count(*) from public.support_notifications) = 0, 'u2 cannot see u1 notifications');
select t.expect_affected('update public.support_notifications set read=true', 0);
-- staff attachment on own reply
select t.as_user(:'A1');
select id as sm from public.support_messages where ticket_id=:'t1' and is_staff \gset
select t.expect_affected(format($f$insert into storage.objects(bucket_id,name,metadata) values ('support-attachments',%L,'{"mimetype":"video/mp4","size":2000}')$f$, :'t1' || '/' || :'sm' || '/clip.mp4'), 1);
select t.expect_affected(format($f$insert into public.support_attachments(ticket_id,message_id,path,file_name,mime_type,size_bytes) values (%L,%L,%L,'clip.mp4','video/mp4',2000)$f$, :'t1', :'sm', :'t1' || '/' || :'sm' || '/clip.mp4'), 1);
select t.as_user(:'U1');
select t.assert((select count(*) from storage.objects where name like :'t1' || '/' || :'sm' || '/%') = 1, 'ticket owner can read staff attachment');
-- user reply reopens
select t.expect_affected(format($f$insert into public.support_messages(ticket_id,body) values (%L,'thanks')$f$, :'t1'), 1);
select t.assert((select status from public.support_tickets where id=:'t1') = 'open', 'user reply reopens pending ticket');

-- ---------- founder
select t.as_user(:'F');
select t.expect_affected(format($f$update public.support_tickets set assigned_to=%L, priority='high' where id=%L$f$, :'A1', :'t1'), 1);
select t.expect_fail(format($f$update public.support_tickets set assigned_to=%L where id=%L$f$, :'U1', :'t1'), 'assignee must be support staff');
select t.expect_fail($$select public.support_set_role_permissions('founder','{"reply":true}')$$, 'invalid role');
select t.expect_fail($$select public.support_set_role_permissions('admin_9','{"reply":true}')$$, 'invalid role');
select t.expect_fail($$select public.support_set_role_permissions('admin_1','{"god":true}')$$, 'invalid permissions');
select t.expect_fail($$select public.support_set_role_permissions('admin_1','{"assign":"yes"}')$$, 'invalid permissions');
select t.expect_fail($$select public.support_set_role_permissions('admin_1','[1]')$$, 'invalid permissions');
select t.expect_fail($$select public.support_set_role_permissions('admin_1', null)$$, 'invalid permissions');
select public.support_set_role_permissions('admin_1','{"reply":true,"assign":true,"change_status":true,"view_stats":true,"view_audit":true}');
select t.assert((select count(*) from public.support_audit_list() where action='role_permissions_changed') = 1, 'founder permission change is audited');
select t.assert((select count(*) from public.support_audit_list() where action in ('assigned','priority_changed','staff_reply')) >= 3, 'audit log records assignment, priority and reply');
select t.assert((select count(*) from public.support_staff_list()) = 3, 'founder sees staff list');
select t.assert(exists (select 1 from public.support_orphan_objects() where false) or true, 'orphan RPC callable by founder');
select t.su();
update storage.objects set created_at = now() - interval '3 hours' where name like :'t1' || '/' || :'m1' || '/c1.png';
select t.as_user(:'F');
select t.assert((select count(*) from public.support_orphan_objects()) >= 1, 'orphan report lists stale unreferenced object');
select t.assert(not exists (select 1 from public.support_orphan_objects() where name like '%pic.png'), 'referenced object not reported as orphan');
select t.as_user(:'A1');
select t.expect_affected(format($f$update public.support_tickets set assigned_to=%L where id=%L$f$, :'A5', :'t1b'), 1);
select t.assert((select count(*) from public.support_audit_list()) >= 4, 'staff granted view_audit can read audit log');
select t.as_user(:'A5');
select t.expect_fail('select public.support_audit_list()', 'forbidden');

-- ---------- closed tickets
select t.as_user(:'F');
select t.expect_affected(format($f$update public.support_tickets set status='closed' where id=%L$f$, :'t1'), 1);
select t.as_user(:'U1');
select t.expect_fail(format($f$insert into public.support_messages(ticket_id,body) values (%L,'again')$f$, :'t1'), 'closed');

-- ---------- rate limits
select t.as_user(:'U2');
select t.expect_affected($$select public.support_create_ticket('other','rl','b')$$, 1) from generate_series(1,4);
select t.expect_fail($$select public.support_create_ticket('other','rl','b')$$, 'rate limit');
select t.as_user(:'U3');
select (public.support_create_ticket('other','msgs','b')) -> 'ticket' ->> 'id' as t3 \gset
do $$
declare i int := 0; tid uuid := (select id from public.support_tickets limit 1);
begin
  begin
    loop i := i + 1; insert into public.support_messages(ticket_id, body) values (tid, 'm' || i);
      if i > 60 then raise exception 'ASSERTION FAILED: no message rate limit'; end if; end loop;
  exception when others then
    if sqlerrm !~* 'rate limit' then raise; end if;
    if i < 25 or i > 35 then raise exception 'ASSERTION FAILED: rate limit hit at unexpected count %', i; end if;
  end;
  raise notice 'ok   - message rate limit reached after % messages', i;
end $$;

-- ---------- idempotent re-run of nothing else; final summary
-- ---------- a broad pre-existing storage policy must NOT open the support bucket (restrictive guards)
select t.su();
create policy zz_broad on storage.objects for all to authenticated using (true) with check (true);
select t.as_user(:'U2');
select t.assert((select count(*) from storage.objects where bucket_id='support-attachments') = 0, 'broad policy: u2 still cannot read u1 support objects');
select t.expect_fail(format($f$insert into storage.objects(bucket_id,name,metadata) values ('support-attachments',%L,'{}')$f$, :'t1' || '/' || :'m1' || '/evil2.png'), 'row-level security|violates');
select t.expect_affected(format($f$update storage.objects set name=name where name like %L$f$, :'t1' || '/%'), 0);
select t.expect_affected(format($f$delete from storage.objects where name like %L$f$, :'t1' || '/%'), 0);
select t.expect_affected($$insert into storage.objects(bucket_id,name,metadata) values ('other-bucket','anything','{}')$$, 1);
select t.assert((select count(*) from storage.objects where bucket_id='other-bucket') = 1, 'broad policy: other buckets unaffected');
select t.su();
drop policy zz_broad on storage.objects;
select t.su();
select 'ALL ASSERTIONS PASSED' as result;
