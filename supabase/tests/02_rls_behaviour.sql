\set QUIET 1
insert into public.platform_administrators(user_id,role) values
 ('00000000-0000-0000-0000-00000000000f','founder'),
 ('00000000-0000-0000-0000-000000000005','admin_5'),
 ('00000000-0000-0000-0000-000000000001','admin_1');

\echo '--- u1 creates ticket'
set role authenticated; select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-0000000000a1',false);
insert into public.support_tickets(user_id,category,subject) values ('00000000-0000-0000-0000-0000000000a2','bug','hello');
select ticket_number,status,user_id=auth.uid() as owner_forced from public.support_tickets;
insert into public.support_messages(ticket_id,body) select id,'first' from public.support_tickets;

\echo '--- u2 sees 0 tickets/messages, cannot reply'
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-0000000000a2',false);
select count(*) tickets from public.support_tickets;
select count(*) msgs from public.support_messages;
insert into public.support_messages(ticket_id,body) select id,'intrude' from public.support_tickets;
insert into public.support_messages(ticket_id,body) values (gen_random_uuid(),'x');
update public.support_tickets set status='closed';
select * from public.support_stats();
select * from public.support_audit_list();

\echo '--- u1 cannot change status / escalate'
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-0000000000a1',false);
update public.support_tickets set status='resolved';
update public.support_tickets set subject='hack';
select status from public.support_tickets;

\echo '--- admin_1 (uniform defaults): reply + status + stats allowed; assign + audit not'
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
select count(*) sees from public.support_tickets;
insert into public.support_messages(ticket_id,body) select id,'staff hi' from public.support_tickets;
update public.support_tickets set status='resolved';
select * from public.support_stats();

\echo '--- notification + status pending'
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-0000000000a1',false);
select status from public.support_tickets;
select count(*) notifs from public.support_notifications;
update public.support_notifications set read=true;
select count(*) unread from public.support_notifications where not read;

\echo '--- founder tunes admin_5 (no ranking assumed): assign + audit'
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-00000000000f',false);
select support_set_role_permissions('admin_5','{"reply":true,"assign":true,"change_status":true,"view_stats":true,"view_audit":true}');
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
select role, support_can('assign') admin1_assign, support_can('view_audit') admin1_audit from (select support_role() role) x;
\echo '--- admin_5: change status, assign, stats, audit'
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000005',false);
update public.support_tickets set status='in_progress', assigned_to='00000000-0000-0000-0000-000000000001';
update public.support_tickets set assigned_to='00000000-0000-0000-0000-0000000000a2';
select status,assigned_to is not null assigned from public.support_tickets;
select (support_stats())->>'total' total;
select action from public.support_audit_list() order by id;
select count(*) from public.support_staff_list();
select support_set_role_permissions('admin_1','{"reply":true}');

\echo '--- founder: set permissions'
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-00000000000f',false);
select support_set_role_permissions('admin_1','{"reply":true,"change_status":true}');
select support_set_role_permissions('founder','{}');
select support_me()->>'role' as role;

\echo '--- u1 closed ticket cannot reply'
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-00000000000f',false);
update public.support_tickets set status='closed';
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-0000000000a1',false);
insert into public.support_messages(ticket_id,body) select id,'again' from public.support_tickets;

\echo '--- storage policies'
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-0000000000a1',false);
insert into storage.objects(bucket_id,name) select 'support-attachments', id::text||'/a.png' from public.support_tickets;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-0000000000a2',false);
insert into storage.objects(bucket_id,name) select 'support-attachments', id::text||'/b.png' from (select '00000000-0000-0000-0000-000000000000'::uuid id) x;
select count(*) other_user_visible from storage.objects;

\echo '--- anon denied'
\echo '--- notification_preferences helper'
reset role;
select support_wants_notification('00000000-0000-0000-0000-0000000000a1') as default_allowed;
update public.profiles set notification_preferences='{"support":{"email":false}}' where id='00000000-0000-0000-0000-0000000000a1';
select support_wants_notification('00000000-0000-0000-0000-0000000000a1','email') as email_off, support_wants_notification('00000000-0000-0000-0000-0000000000a1','in_app') as in_app_on;
set role anon;
select count(*) from public.support_tickets;
reset role;
select 'cleanup';
delete from public.support_tickets; delete from storage.objects where bucket_id='support-attachments';
delete from public.platform_administrators where user_id::text like '00000000-0000-0000-0000-0000000000%';
delete from public.support_audit_log;
delete from public.profiles where email like '%@t.test'; delete from auth.users where email like '%@t.test';
