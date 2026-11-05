\set ON_ERROR_STOP 0
\set QUIET 1
delete from public.support_tickets;
delete from public.platform_administrators;
delete from public.profiles where email like '%@t.test';
delete from auth.users where email like '%@t.test';
insert into auth.users(id,email) values
 ('00000000-0000-0000-0000-00000000000f','founder@t.test'),
 ('00000000-0000-0000-0000-000000000001','a1@t.test'),
 ('00000000-0000-0000-0000-000000000005','a5@t.test'),
 ('00000000-0000-0000-0000-0000000000a1','u1@t.test'),
 ('00000000-0000-0000-0000-0000000000a2','u2@t.test');
select id,email from auth.users where email like '%@t.test' order by 1;
select count(*) as profiles_auto_created from public.profiles where email like '%@t.test';
