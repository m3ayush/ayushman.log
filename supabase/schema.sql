-- ============================================================================
--  Daily Journal — database schema
--  Run this once in the Supabase SQL editor (Dashboard → SQL → New query).
--  IMPORTANT: replace the email below if your admin email is different. It must
--  match ADMIN_EMAIL in your .env.local.
-- ============================================================================

create extension if not exists pgcrypto;

-- ── posts ───────────────────────────────────────────────────────────────────
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  title        text        not null,
  slug         text        not null unique,
  description  text        not null default '',
  content      text        not null default '',           -- Markdown source
  tags         text[]      not null default '{}',
  hero_image   text,
  status       text        not null default 'draft'
                 check (status in ('draft', 'published')),
  is_public    boolean     not null default false,        -- public/private, separate from draft
  pub_datetime timestamptz,                               -- set on first publish
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists posts_status_pub_idx
  on public.posts (status, pub_datetime desc);
create index if not exists posts_tags_idx
  on public.posts using gin (tags);

-- keep updated_at fresh on every write
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table public.posts enable row level security;

-- Anyone (even logged-out visitors) may READ entries that are BOTH published
-- and public. Private or draft entries are invisible to the public.
drop policy if exists "public read published" on public.posts;
create policy "public read published"
  on public.posts for select
  using (status = 'published' and is_public = true);

-- The owner (matching email) has full read/write on everything, incl. drafts.
-- 👇 REPLACE with your own email before running this file.
drop policy if exists "admin full access" on public.posts;
create policy "admin full access"
  on public.posts for all
  using (auth.jwt() ->> 'email' = 'you@example.com')
  with check (auth.jwt() ->> 'email' = 'you@example.com');
