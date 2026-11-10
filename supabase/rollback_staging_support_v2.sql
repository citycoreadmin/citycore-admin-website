-- STAGING-ONLY ROLLBACK of the support v2 install. Run ONLY on the website staging project, ONLY if you decide to remove it.
-- Removes support_* objects and the support_objects_* storage policies. Does NOT touch profiles, platform_administrators,
-- audit_logs, notifications, public."Citicore admin website" or any other app object. Support data (tickets, messages) is deleted.
-- The storage bucket is NOT removed here (Supabase blocks direct SQL deletes on storage tables): afterwards, empty and delete the
-- bucket `support-attachments` in Dashboard -> Storage.
begin;

do $$ begin
  if coalesce(obj_description(to_regclass('public.support_tickets'), 'pg_class'), '') <> 'citycore-support:v2' then
    raise exception 'refusing: support v2 is not installed here (marker missing)';
  end if;
end $$;

drop policy if exists support_objects_read         on storage.objects;
drop policy if exists support_objects_insert       on storage.objects;
drop policy if exists support_objects_delete       on storage.objects;
drop policy if exists support_objects_guard_select on storage.objects;
drop policy if exists support_objects_guard_insert on storage.objects;
drop policy if exists support_objects_guard_update on storage.objects;
drop policy if exists support_objects_guard_delete on storage.objects;
drop policy if exists support_objects_guard_anon   on storage.objects;

do $$
declare tbl text;
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    foreach tbl in array array['support_messages','support_tickets','support_notifications'] loop
      if exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename=tbl) then
        execute format('alter publication supabase_realtime drop table public.%I', tbl);
      end if;
    end loop;
  end if;
end $$;

drop table if exists public.support_attachments, public.support_messages, public.support_notifications,
  public.support_audit_log, public.support_tickets, public.support_role_permissions cascade;
drop sequence if exists public.support_ticket_seq;

drop function if exists
  public.support_is_staff(), public.support_role(), public.support_can(text), public.support_audit(text, uuid, jsonb),
  public.support_before_ticket_insert(), public.support_before_ticket_update(), public.support_after_ticket_update(),
  public.support_before_message_insert(), public.support_after_message_insert(), public.support_before_attachment_insert(),
  public.support_create_ticket(text, text, text, text, text), public.support_me(), public.support_staff_list(),
  public.support_set_role_permissions(text, jsonb), public.support_stats(), public.support_audit_list(),
  public.support_orphan_objects(), public.support_wants_notification(uuid, text), public.support_can_upload(text),
  public.support_can_read_object(text), public.support_object_unreferenced(text);

commit;
