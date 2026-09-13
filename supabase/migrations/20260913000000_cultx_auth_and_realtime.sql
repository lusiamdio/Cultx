-- Run this migration in the Cultx Supabase project before deploying the client.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'farmer' check (role in ('farmer', 'cooperative', 'buyer', 'agribusiness', 'logistics', 'finance', 'government', 'researcher', 'input_supplier', 'superadmin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null default 'important',
  title text not null,
  message text not null,
  action_label text,
  target_view text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);



create policy "Users can read their own profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "Users can update their own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "Users can read their notifications" on public.notifications for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can mark their notifications read" on public.notifications for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);


create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, role) values (new.id, coalesce(new.raw_user_meta_data ->> 'role', 'farmer')) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter publication supabase_realtime add table public.notifications;
