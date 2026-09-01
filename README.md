# Portfolio (Letterboxd-inspired) — Scaffold

Sesuai `PRDspec.md` & `TECHSPEC.md`. Stack: Next.js + Tailwind + Framer Motion + Supabase.

## Setup

```bash
npm install
cp .env.local.example .env.local   # isi dengan kredensial Supabase kamu
npm run dev
```

## Supabase

1. Buat project baru di [supabase.com](https://supabase.com).
2. Jalankan `supabase/migration.sql` di SQL editor Supabase (bikin table `projects` + RLS).
3. Buat Storage bucket bernama `project-covers` (public read).
4. Buat 1 user admin lewat Supabase Auth, lalu update policy `admin_write` di migration
   dengan UUID user tersebut (lihat catatan di file SQL).
5. Isi `.env.local` dengan Project URL & anon key dari Settings > API.

## Struktur

Lihat `TECHSPEC.md` §3 untuk penjelasan struktur folder lengkap.

- `src/lib/data/dummyProjects.ts` — dummy data, dipakai sebelum Supabase disambung.
  Ganti pemanggilan `dummyProjects` di `src/app/page.tsx` dan
  `src/app/projects/[slug]/page.tsx` dengan `getProjects()` / `getProjectBySlug()`
  dari `src/lib/supabase/queries.ts` begitu Supabase sudah siap.
- Cover image dummy (`/dummy/poster-*.jpg`) belum disertakan — taruh file gambar
  kamu sendiri di `public/dummy/`, atau langsung ganti `cover_url` di dummy data.

## Yang masih perlu dilengkapi manual

- Upload cover image di form admin (`src/app/admin/dashboard/page.tsx`) — saat ini
  `cover_url` masih kosong, perlu ditambahkan `supabase.storage.from('project-covers').upload(...)`.
- Font display (`Space Grotesk`) & body (`Inter`) belum di-load — tambahkan via
  `next/font` di `src/app/layout.tsx`.
- Konten About/diary timeline (`src/app/about/page.tsx`) masih placeholder.
