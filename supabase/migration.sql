-- TECHSPEC.md §5 — table projects + RLS policies

create extension if not exists "pgcrypto";

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  cover_url text not null,
  gallery text[] default '{}',
  tech_stack text[] not null default '{}',
  category text not null check (category in ('hackathon', 'academic', 'work', 'personal')),
  rating int check (rating between 1 and 5),
  year int not null,
  links jsonb default '{}',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table projects enable row level security;

create policy "public_read_published"
on projects for select
to anon
using (is_published = true);

create policy "admin_write"
on projects for all
to authenticated
using (true)
with check (true);
-- Catatan: ganti kondisi di atas dengan auth.uid() = '<ADMIN_USER_ID>'
-- setelah tahu UUID user admin, supaya hanya 1 akun yang bisa write (TECHSPEC §5).

-- Trigger untuk updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_updated_at
before update on projects
for each row execute function set_updated_at();
