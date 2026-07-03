-- ============================================================================
--  Migration: add public/private visibility (separate from draft/published)
--  Run this ONCE in the Supabase SQL editor before deploying the new code.
-- ============================================================================

-- 1. New flag. Defaults to private.
alter table public.posts
  add column if not exists is_public boolean not null default false;

-- 2. Keep any entries that are ALREADY live visible (so nothing disappears).
update public.posts set is_public = true where status = 'published';

-- 3. The public may now only read entries that are BOTH published AND public.
drop policy if exists "public read published" on public.posts;
create policy "public read published"
  on public.posts for select
  using (status = 'published' and is_public = true);
