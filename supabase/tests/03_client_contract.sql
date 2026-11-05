\set QUIET 1
insert into auth.users(id,email) values
 ('00000000-0000-0000-0000-00000000000f','founder@t.test'),
 ('00000000-0000-0000-0000-0000000000a1','u1@t.test');
insert into public.platform_administrators(user_id,role) values ('00000000-0000-0000-0000-00000000000f','founder');
set role authenticated; select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-0000000000a1',false) \gset
\echo '--- client-shaped insert (no user_id / ticket_number / author_id)'
insert into public.support_tickets(category,subject,platform,language,source) values ('bug','s','ios','fr','web');
insert into public.support_messages(ticket_id,body) select id,'b' from public.support_tickets;
select ticket_number, source, requester_email from public.support_tickets;
\echo '--- support_me for normal user (expect NULL)'
select support_me() is null as is_null;
\echo '--- normal user reading role table (expect 0 rows)'
select count(*) from public.support_role_permissions;
\echo '--- founder'
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-00000000000f',false) \gset
select support_me()->>'role' role, (select count(*) from public.support_role_permissions) role_rows;
select count(*) staff_visible from public.support_staff_list();
reset role;
\echo '--- existing tables untouched: platform_administrators rows'
select count(*) from public.platform_administrators;
delete from public.support_tickets; delete from public.platform_administrators; delete from public.support_audit_log;
delete from public.profiles where email like '%@t.test'; delete from auth.users where email like '%@t.test';
