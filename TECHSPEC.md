# Technical Spec — Portfolio "Letterboxd-inspired"

Turunan teknis dari `PRDspec.md`. Stack: **Next.js (React) + Framer Motion/GSAP + Supabase**.

## 1. Stack & Alasan
| Layer | Pilihan | Kenapa |
|---|---|---|
| Frontend framework | Next.js (App Router) | SSR/SSG buat SEO portfolio, routing bawaan buat halaman detail project, gampang deploy ke Vercel |
| Styling | Tailwind CSS + CSS variables untuk design tokens | Cepat implementasi tema warna Letterboxd sebagai custom tokens, konsisten di seluruh komponen |
| Animasi | Framer Motion (utama) + GSAP (untuk scroll-timeline/efek kompleks kalau perlu) | Framer Motion pas untuk animasi komponen React (hover, page transition, stagger); GSAP dipakai kalau butuh scroll-triggered animation yang lebih rumit (ScrollTrigger) |
| Backend/Data | Supabase (Postgres + Auth + Storage) | Serverless, ada Auth siap pakai buat login admin, Storage buat cover image project, REST/JS client gampang dipakai dari Next.js |
| Hosting | Vercel (frontend) + Supabase cloud (backend) | Cocok banget dengan Next.js, deploy otomatis dari GitHub |

## 2. Arsitektur Tinggi
```
[Next.js App]
   ├─ Public pages (SSG/ISR) → fetch data dari Supabase saat build/revalidate
   ├─ Admin page (/admin) → protected by Supabase Auth, form CRUD project
   └─ API routes (opsional, jika perlu proxy) → Supabase client bisa langsung dipanggil dari client component juga

[Supabase]
   ├─ Auth → single admin user
   ├─ Postgres table: projects
   └─ Storage bucket: project-covers
```

## 3. Struktur Folder (Next.js App Router)
```
src/
├─ app/
│  ├─ layout.tsx                 # theme provider, font, global animation wrapper
│  ├─ page.tsx                   # Hero + Project Grid (landing)
│  ├─ projects/[slug]/page.tsx   # Detail project (film-wipe transition)
│  ├─ about/page.tsx             # About / diary timeline
│  ├─ admin/
│  │  ├─ page.tsx                # login
│  │  └─ dashboard/page.tsx      # CRUD project (form sederhana, UI boleh brutal)
│  └─ api/ (opsional)
├─ components/
│  ├─ hero/HeroReveal.tsx
│  ├─ project/PosterCard.tsx
│  ├─ project/ProjectGrid.tsx
│  ├─ project/RatingDots.tsx
│  ├─ layout/FilmStripDivider.tsx
│  ├─ layout/PageTransition.tsx
│  └─ ui/ (button, tag, dsb — Tailwind based)
├─ lib/
│  ├─ supabase/client.ts
│  ├─ supabase/queries.ts        # getProjects(), getProjectBySlug(), etc.
│  └─ animations/variants.ts     # Framer Motion variants reusable
├─ styles/
│  └─ tokens.css                 # CSS variables warna Letterboxd
```

## 4. Design Tokens (dari PRD)
```css
:root {
  --bg-base: #14181c;
  --bg-elevated: #1c2228;
  --accent-orange: #ff8000;
  --accent-green: #00e054;
  --accent-blue: #40bcf4;
  --text-primary: #ffffff;
  --text-muted: #93a1ab;
}
```
Dipakai lewat Tailwind `theme.extend.colors` supaya tetap bisa pakai utility class (`bg-base`, `text-accent-orange`, dll).

## 5. Data Model (Supabase — table `projects`)
| Kolom | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `id` | uuid (PK) | auto | `default gen_random_uuid()` |
| `slug` | text (unique, indexed) | ya | untuk URL `/projects/[slug]`, auto-generate dari `title` di frontend/admin form, bisa di-override |
| `title` | text | ya | maks ~80 karakter (validasi di form admin) |
| `description` | text | ya | boleh markdown sederhana kalau mau rich text |
| `cover_url` | text | ya | path/URL dari Supabase Storage bucket `project-covers` |
| `gallery` | text[] | tidak | array URL screenshot tambahan |
| `tech_stack` | text[] | ya | array tag, misal `['Next.js','Supabase']` — dipakai juga untuk mapping warna genre-tag |
| `category` | text (enum via check constraint) | ya | `'hackathon' \| 'academic' \| 'work' \| 'personal'` |
| `rating` | int (1–5) | tidak | ditampilkan sebagai dots, default `null` (tidak tampil dots kalau kosong) |
| `year` | int | ya | dipakai untuk sort & filter |
| `links` | jsonb | tidak | `{ "demo": "", "github": "" }`, key opsional |
| `is_published` | boolean | ya | default `false` — hanya row `true` yang di-fetch oleh public queries |
| `created_at` | timestamptz | auto | `default now()` |
| `updated_at` | timestamptz | auto | update via trigger `on update` |

**RLS (Row Level Security) policies:**
```sql
-- Read: publik hanya bisa baca yang published
create policy "public_read_published"
on projects for select
to anon
using (is_published = true);

-- Write: hanya authenticated admin (single user, dicek via auth.uid())
create policy "admin_write"
on projects for all
to authenticated
using (auth.uid() = 'ADMIN_USER_ID')
with check (auth.uid() = 'ADMIN_USER_ID');
```
Storage bucket `project-covers`: public read, write hanya `authenticated`.

## 6. Pendekatan Animasi (detail per elemen, selaras timing PRD §6)
| Elemen | Teknik | Parameter kunci |
|---|---|---|
| Hero text reveal | Framer Motion `variants` + `staggerChildren`, split teks per kata | `transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.08 }` |
| Hero background dots bergerak | Framer Motion `animate` dengan array keyframes posisi + random `delay` per dot | `transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' }`, matikan `repeat` saat reduced-motion |
| Poster hover — lift & shadow | Framer Motion `whileHover={{ y: -8, boxShadow: ... }}` | `transition: { duration: 0.22, ease: 'easeOut' }` |
| Poster hover — tilt 3D | `onMouseMove` hitung offset cursor → `rotateX`/`rotateY`, pakai `useSpring` | `stiffness: 150, damping: 15`, clamp max ±8° |
| Poster hover — cover zoom | `whileHover={{ scale: 1.05 }}` pada elemen `<img>` di dalam card | `transition: { duration: 0.3 }` |
| Overlay info | `initial={{ opacity: 0, y: 10 }}`, `whileHover parent → animate child` | `duration: 0.2, delay: 0.05` |
| Scroll-reveal staggered | `whileInView` + `viewport={{ once: true, amount: 0.2 }}`, index-based delay | `duration: 0.45, staggerChildren: 0.1` |
| Filter grid re-layout | `layout` prop di `PosterCard` (auto-animate via FLIP), `AnimatePresence` untuk exit item yang di-filter out | `layout transition: { duration: 0.35, ease: 'easeInOut' }` |
| Page/film-wipe transition | `AnimatePresence mode="wait"` di root layout, custom variant `clipPath` | exit `0.25s` + enter `0.25s`, `ease: [0.65, 0, 0.35, 1]` |
| Cursor custom (opsional) | Elemen `<motion.div>` fixed, posisi update via `mousemove` listener + `useMotionValue`/`useSpring` | disable di `(pointer: coarse)` media query |
| Reduced motion fallback | Cek `window.matchMedia('(prefers-reduced-motion: reduce)')` sekali di root, simpan ke context/hook `useReducedMotion()` dari Framer Motion | Semua `transition` durasi kompleks di-override jadi `duration: 0.15`, matikan `repeat`/`tilt`/`particle` |

## 7. Alur Admin (CRUD sederhana, sesuai PRD §8 — sengaja minimal)
1. `/admin` → login via Supabase Auth (email+password, single user).
2. `/admin/dashboard` → tabel list project (kolom: title, category, year, is_published, aksi edit/hapus) + tombol "Tambah Project".
3. Form tambah/edit berisi field sesuai tabel §5: title (required, maxlength 80), slug (auto dari title, editable), description (textarea), cover upload (required, ke bucket `project-covers`), gallery upload (opsional, multi-file), tech_stack (input tag/multi-select), category (dropdown enum), rating (slider 1–5, opsional/nullable), year (number input), links.demo & links.github (url input, opsional), is_published (toggle).
4. Validasi minimal di form: required field tidak boleh kosong, `year` harus angka 4 digit, URL field divalidasi format URL sederhana (tidak perlu validasi berat).
5. Submit → langsung `insert`/`update` ke Supabase via client SDK, tidak perlu API route custom kecuali butuh validasi tambahan.
6. Toggle `is_published` = cara termudah "publish/unpublish" tanpa hapus data — draft project tidak akan muncul di query publik (lihat RLS §5).
7. UI admin boleh pakai komponen bawaan/plain (tidak perlu styling sebagus halaman publik) — prioritas fungsi jalan, bukan estetika.

## 8. Urutan Eksekusi (scaffold)
1. Setup Next.js + Tailwind + design tokens.
2. Setup Supabase project (table `projects`, Storage bucket, Auth).
3. Bangun komponen statis dulu (Hero, PosterCard, Grid) pakai dummy data.
4. Tambah animasi (Framer Motion variants) ke komponen yang sudah jadi.
5. Sambungkan ke Supabase (fetch data asli, ganti dummy).
6. Bangun halaman admin (CRUD).
7. Detail project page + page transition.
8. Polish: responsive, reduced-motion, SEO metadata, deploy ke Vercel.

---
*Siap discaffold. Bilang aja mau mulai dari step mana — misal langsung generate boilerplate Next.js + Tailwind + tokens, atau mulai dari komponen `PosterCard` dulu.*
