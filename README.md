# Daily Journal

A personal, public journal / work-log — inspired by the look & feel of
[steipete.me](https://steipete.me), but with a **private admin panel** instead of
committing Markdown files.

- **You** log in with a magic link, write in Markdown, hit **Publish**, and it goes live.
- **Everyone else** can read (and share) your posts — but never edit them.

Built with **Next.js 16 · Supabase (Postgres + Auth) · Tailwind v4 · TypeScript**.

---

## How it works

| Route              | Who        | What                                            |
| ------------------ | ---------- | ----------------------------------------------- |
| `/`                | Public     | Journal feed (published entries, newest first)  |
| `/posts/[slug]`    | Public     | A single entry (rendered Markdown + share)      |
| `/tags`, `/tags/x` | Public     | Browse by tag                                   |
| `/about`           | Public     | About page with your photo                      |
| `/rss.xml`         | Public     | RSS feed                                        |
| `/login`           | You        | Magic-link sign-in                              |
| `/admin`           | You only   | Dashboard: list, edit, delete                   |
| `/admin/new`       | You only   | Write a new entry (Markdown + live preview)     |
| `/admin/edit/[id]` | You only   | Edit an entry                                   |

Access is enforced in **two layers**: `middleware.ts` bounces non-owners away from
`/admin`, and Supabase **Row Level Security** blocks any write that isn't from your
email — so even a leaked anon key can't edit your posts.

---

## Setup (≈5 minutes)

### 1. Install

```bash
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project** (free tier is fine).
2. Open **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and **Run**.
   - ⚠️ The SQL has a placeholder owner email (`you@example.com`) in the RLS
     policy — replace it with your own email before running.
3. In **Project Settings → API**, copy the **Project URL** and the **anon public** key.

### 3. Configure email auth

In Supabase → **Authentication → URL Configuration**, add your site URL(s) to
**Redirect URLs**, e.g. `http://localhost:3000/**` for dev (and your prod domain later).

### 4. Environment variables

Copy `.env.example` → `.env.local` and fill it in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
ADMIN_EMAIL=you@example.com                  # the only account allowed to write
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Run

```bash
npm run dev
```

Open http://localhost:3000, go to **/login**, enter your email, click the link in your
inbox, and you land in **/admin**. Write your first entry and **Publish**.

---

## Deploying (Vercel)

1. Push this folder to a GitHub repo.
2. Import it in [Vercel](https://vercel.com) and add the same four env vars
   (set `NEXT_PUBLIC_SITE_URL` to your real domain).
3. Add your production URL to Supabase **Redirect URLs**.

---

## Make it yours

- **Name, tagline, nav, social links:** `lib/site.ts`
- **Colors / fonts / theme:** `app/globals.css` (light + dark tokens)
- **Your photo:** replace `public/avatar.jpg`
