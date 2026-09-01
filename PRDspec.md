# PRD — Portfolio "Letterboxd-inspired" (Agadape)

## 1. Ringkasan & Visi
Portofolio pribadi yang mengadopsi bahasa visual **Letterboxd** — gelap, sinematik, aksen warna cerah, layout ala grid poster/diary — tapi jauh lebih *hidup*. Kalau Letterboxd itu statis dan formal, versi ini harus terasa seperti nonton trailer: ada gerakan, transisi, micro-interaction, tapi tetap enak dipakai untuk keperluan profesional (dilihat recruiter, panitia hackathon, dsb).

**Analogi produk:** Portfolio project = "film" di dalam diary. Setiap project ditampilkan seperti entry film: poster/cover, "rating" (tingkat kompleksitas/kepuasan pribadi), "watched date" (tanggal dikerjakan), genre (tech stack sebagai "genre").

## 2. Tujuan (Goals)
- Menunjukkan identitas personal (developer sistem informasi web, suka eksplorasi hackathon & blockchain/GIS) dengan cara yang berkesan, bukan template portfolio generik.
- Frontend jadi prioritas utama — harus terasa *fun*, dinamis, dan tetap kredibel sebagai portfolio profesional.
- Backend cukup minimal: satu tempat untuk input/kelola data project tanpa perlu edit kode setiap kali update.

## 3. Non-Goals
- Bukan clone fitur sosial Letterboxd (tidak perlu follow, review orang lain, watchlist, dsb).
- Bukan CMS full-fledged — backend hanya untuk kebutuhan pribadi (single-user, tanpa multi-role, tanpa moderasi konten).
- Tidak perlu real-time sync antar device (backend dipakai sesekali saat update data, bukan dashboard live).

## 4. Target Audience
- Recruiter / hiring manager yang scroll cepat (harus "wow" dalam 5 detik pertama).
- Panitia/juri hackathon & kompetisi yang cek portfolio sebelum submission.
- Sesama developer/komunitas yang menemukan portfolio via link (GitHub, LinkedIn, dsb).

## 4.1 User Stories & Acceptance Criteria

| # | Sebagai... | Saya ingin... | Kriteria Diterima (Acceptance Criteria) |
|---|---|---|---|
| US-1 | Pengunjung baru | Langsung paham ini portfolio siapa & apa spesialisasinya dalam <5 detik | Hero menampilkan nama + tagline + 1 CTA yang terlihat tanpa scroll (above the fold) di semua breakpoint |
| US-2 | Recruiter | Bisa scan cepat daftar project tanpa harus klik satu-satu | Grid poster menampilkan minimal judul, tech-stack tag, tahun langsung di card (tanpa perlu hover) |
| US-3 | Juri hackathon | Filter project berdasarkan kategori (hackathon) | Filter berfungsi tanpa reload halaman, grid re-layout dengan animasi <400ms |
| US-4 | Pengunjung mobile | Pengalaman tetap smooth walau tanpa hover | Semua interaksi hover punya alternatif tap/scroll-triggered di breakpoint <768px |
| US-5 | Pemilik (admin) | Menambah project baru tanpa edit kode | Form admin submit → project baru muncul di grid publik dalam ≤1 menit (tanpa deploy ulang) |
| US-6 | Pengunjung dengan motion sensitivity | Tidak terganggu animasi berlebihan | `prefers-reduced-motion: reduce` mematikan animasi non-esensial (parallax, tilt, particle), transisi disederhanakan jadi fade simpel |
| US-7 | Pengunjung | Baca detail satu project lengkap dengan link ke demo/repo | Halaman detail memuat deskripsi, tech stack, minimal 1 link aktif (demo/GitHub), dan tidak ada broken image |

## 5. Tema Visual (diadaptasi dari Letterboxd)

### 5.1 Palet Warna
| Token | Hex | Fungsi |
|---|---|---|
| `--bg-base` | `#14181c` | Background utama (dark, hampir hitam kehijauan) |
| `--bg-elevated` | `#1c2228` | Card/section background |
| `--accent-orange` | `#ff8000` | CTA utama, highlight rating tinggi, hover state |
| `--accent-green` | `#00e054` | Sukses, tag "completed", link aktif |
| `--accent-blue` | `#40bcf4` | Info, tag skill/tech, secondary highlight |
| `--text-primary` | `#ffffff` | Teks utama |
| `--text-muted` | `#9ab` (abu kebiruan) | Teks sekunder/caption |

Gradasi 3 warna aksen (orange → green → blue) dipakai sebagai signature elemen: garis progress, loading state, border-glow saat hover — mirip logo "3 lingkaran" Letterboxd, bisa dijadikan motif dots/avatar frame yang berulang di seluruh situs.

### 5.2 Tipografi
- Heading: sans-serif tebal, sedikit condensed (kesan "judul film") — misal Archivo Black / Space Grotesk Bold.
- Body: sans-serif netral yang nyaman dibaca (Inter / General Sans).

### 5.3 Motif & Elemen Sinematik
- **Poster grid**: project ditampilkan sebagai grid kartu vertikal ala poster film (aspect ratio card ~2:3, seperti poster film sungguhan), bukan list horizontal biasa. Gap antar card 16–24px, radius sudut 8–12px.
- **Film strip / sprocket holes**: dekorasi tipis (baris lubang kecil bulat, ~6–8px diameter, spacing konsisten) di divider antar section — dipakai sebagai SVG/CSS pattern berulang, warna `--text-muted` dengan opacity rendah (~15–20%) supaya tidak mengganggu.
- **Rating dots**: 5 dots per project, dots terisi = `--accent-orange`, dots kosong = outline `--text-muted`. Saat hover, dots yang belum terisi ikut menyala redup (preview interaktif), transisi 150ms.
- **Diary/timeline view**: opsi alternatif melihat project berdasarkan urutan waktu (vertikal timeline dengan garis penghubung bertema 3 warna aksen gradient), tiap entry = tanggal + judul + thumbnail kecil.
- **Letterboxd-style crop/vignette**: gambar cover project dikasih `radial-gradient` vignette gelap di tepi (opacity ~30–40% di sudut) supaya menyatu ke `--bg-base`.
- **Genre tag styling**: tech-stack tag ditampilkan sebagai pill kecil, warna border mengikuti kategori (misal frontend = `--accent-blue`, backend = `--accent-green`, blockchain/khusus = `--accent-orange`) — bukan warna acak, harus konsisten per kategori di seluruh situs.

## 6. Animasi & Interaksi (poin pembeda dari Letterboxd yang statis)

| Elemen | Perilaku | Durasi & Easing (acuan) | Trigger |
|---|---|---|---|
| Hero text reveal | Teks nama/tagline muncul per kata dengan mask/slide-up dari bawah | 500–700ms per kata, `ease-out`, stagger 60–100ms antar kata | Sekali saat page load |
| Hero background dots | Dots kecil (3 warna aksen) melayang perlahan, gerakan acak/organik | Loop lambat, 6–10s per siklus, `ease-in-out` | Otomatis, terus berjalan (dijeda di reduced-motion) |
| Poster hover — lift | Card naik sedikit (translateY -6 s/d -10px) + shadow membesar | 200–250ms, `ease-out` | Mouse enter (desktop) |
| Poster hover — tilt 3D | `rotateX`/`rotateY` max ±6–8° mengikuti posisi cursor relatif ke card | Real-time follow, damping ringan (spring, stiffness ~150) | `onMouseMove` (desktop) |
| Poster hover — cover zoom | Cover image scale 1 → 1.05 | 300ms, `ease-out` | Bersamaan dengan lift |
| Overlay info muncul | Info (tech stack, tahun, link) fade+slide-up dari bawah card | 200ms, delay 50ms setelah lift mulai | Bersamaan hover |
| Scroll-reveal section | Fade-up (opacity 0→1, translateY 20px→0) per item, staggered | 400–500ms per item, stagger 80–120ms, `ease-out` | `whileInView`, trigger sekali (`once: true`) |
| Filter grid re-layout | Card yang tersisa reposisi halus, card yang hilang fade-out dulu | 300–400ms, `ease-in-out`, layout animation (FLIP-style) | Klik filter |
| Page/detail transition | "Film-wipe": clip-path menyapu dari satu sisi menutupi layar lalu membuka di halaman baru | 400–600ms total (exit 250ms + enter 250ms) | Navigasi ke `/projects/[slug]` |
| Cursor custom (opsional) | Cursor default diganti dot kecil bertema, membesar saat hover elemen interaktif | Instant follow + scale transition 150ms | Desktop only, disable di touch device |
| Easter egg (opsional) | Klik logo/avatar → animasi kecil (misal 3 dots berputar sekali, atau confetti warna aksen) | 600–800ms, one-shot | Klik, tidak berulang otomatis |

**Prinsip animasi:**
- Semua animasi non-esensial (particle, tilt, parallax) **wajib** dimatikan/disederhanakan saat `prefers-reduced-motion: reduce` — fallback ke fade sederhana 150ms atau tanpa animasi sama sekali.
- Animasi tidak boleh memblokir interaksi — elemen tetap bisa diklik/dibaca meski animasi belum selesai (gunakan `pointer-events` dengan hati-hati, hindari animasi yang mengunci scroll).
- Prioritas performa: animasi hanya menyentuh `transform` dan `opacity` (GPU-accelerated), hindari animasi yang memicu reflow (`width`, `height`, `top`, `left`) kecuali benar-benar perlu.
- Target frame rate: 60fps di device kelas menengah; kalau ada penurunan performa nyata, animasi kompleks (tilt 3D, particle) boleh disederhanakan dulu untuk mobile.

## 7. Struktur Halaman / Fitur Frontend (prioritas utama)

### 7.1 Landing / Hero
- Nama, tagline singkat ("developer web-based information systems"), CTA ke project grid & contact.
- Elemen visual bertema dots/film 3 warna aksen bergerak.

### 7.2 Project Grid ("My Watched Films" style)
- Grid poster project, tiap card: cover, judul, tech-stack tag (warna sesuai kategori), rating dot, tahun.
- Filter/sort: by tech stack, by tahun, by tipe (hackathon / akademik / kerja).
- Klik card → detail project (modal atau halaman terpisah dengan transisi film-wipe).

### 7.3 Detail Project
- Deskripsi, peran, tech stack, tautan (demo/GitHub), gallery screenshot dengan layout ala "film stills".
- Opsional: "rating" pribadi (misal tingkat kepuasan/kompleksitas) ditampilkan sebagai dots — bukan rating publik.

### 7.4 About / Diary
- Bio singkat, perjalanan (bisa disajikan sebagai "diary timeline" — event akademik, hackathon, milestone).
- Bisa reuse motif timeline dari Letterboxd diary.

### 7.5 Contact / Footer
- Link sosial, email, resume/CV download, footer dengan motif film-strip tipis.

## 8. Backend (sengaja simple/brutal — bukan prioritas)
Tujuan: satu tempat input data project supaya frontend nggak hardcoded.

- **Scope minimal:**
  - Auth super simple (single admin, misal password/PIN atau login lewat provider yang sudah ada).
  - CRUD project dengan field berikut:

| Field | Wajib? | Tipe/Format | Catatan |
|---|---|---|---|
| Judul | Wajib | Teks, maks ~80 karakter | Ditampilkan di poster & detail |
| Slug/URL | Otomatis dari judul | Teks (kebab-case) | Bisa di-override manual kalau perlu |
| Deskripsi | Wajib | Teks panjang (rich text opsional) | Untuk halaman detail |
| Cover image | Wajib | Upload file atau URL | Rasio disarankan 2:3 (poster) |
| Gallery/screenshot | Opsional | Multi-upload/URL | Untuk halaman detail |
| Tech stack | Wajib | Array tag (multi-select/free text) | Menentukan warna genre-tag |
| Kategori | Wajib | Enum: hackathon / akademik / kerja / personal | Untuk filter |
| Rating/kompleksitas | Opsional | Angka 1–5 | Ditampilkan sebagai dots |
| Tahun | Wajib | Angka (YYYY) | Untuk sort & filter |
| Link demo | Opsional | URL | |
| Link repo/GitHub | Opsional | URL | |
| Status tampil | Opsional | Boolean (published/draft) | Biar bisa nyiapin data dulu sebelum tayang |

  - Endpoint publik (read-only) yang dikonsumsi frontend untuk render grid & detail — hanya mengembalikan project dengan status `published`.
- **Yang sengaja TIDAK dikerjakan detail dulu:** desain database yang rapi, admin panel yang cantik, validasi kompleks, role/permission — cukup fungsional, boleh "brutal" secara UI selama datanya bisa masuk & ke-fetch dengan benar.
- **Rekomendasi teknis ringan** (silakan sesuaikan): REST/JSON API sederhana + storage (bisa headless CMS ringan, atau backend custom minimal) — keputusan stack detail menyusul, tidak jadi fokus PRD ini.

## 9. Non-Functional Requirements
- **Performance**: animasi tidak boleh bikin lag di device medium; lazy-load gambar poster.
- **Responsive**: grid poster tetap enak di mobile (kolom menyesuaikan, hover-effect diganti tap-effect).
- **Accessibility**: kontras teks vs background dark tetap memenuhi standar keterbacaan; sediakan `prefers-reduced-motion` fallback.
- **SEO dasar**: meta title/description per halaman, OG image untuk share link portfolio.

## 10. Metodologi/Roadmap
1. **Fase 1 — Fondasi visual**: setup design tokens (warna, tipografi), layout dasar hero + grid.
2. **Fase 2 — Animasi & interaksi**: hover effect poster, scroll-reveal, transisi halaman.
3. **Fase 3 — Detail project & about/diary**.
4. **Fase 4 — Backend minimal + integrasi data dinamis**.
5. **Fase 5 — Polish**: responsive, accessibility, SEO, easter egg opsional.

## 11. Metrik Keberhasilan (subjektif, portfolio pribadi)
- Kesan pertama "beda dari portfolio kebanyakan" saat dilihat orang lain.
- Waktu update project baru cepat (tinggal input lewat backend, tidak edit kode).
- Tetap terasa profesional meski playful — tidak mengorbankan kredibilitas untuk kesan "fun".

---
*Catatan: dokumen ini adalah spec tingkat produk (PRD), belum menentukan pilihan framework/library spesifik. Keputusan stack teknis (React/Vue/Svelte, backend framework, dsb.) bisa dibahas terpisah setelah arah desain & fitur ini disepakati.*
