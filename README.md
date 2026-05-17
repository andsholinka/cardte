# Cardte

Aplikasi PWA sederhana untuk menyimpan kartu bank dan kartu member favoritmu di satu tempat. Datamu disimpan **lokal di perangkat** menggunakan `localStorage` — tidak ada server, tidak ada database.

## Fitur

- Daftar lengkap bank Indonesia (BCA, Mandiri, BRI, BNI, BTN, CIMB, Danamon, dll.)
- Kartu member retail/F&B/lifestyle (Alfamart, MAP, Starbucks, Uniqlo, Matahari, ACE, dll.)
- Tambah kartu kustom dengan warna pilihan
- Detail kartu dengan barcode visual
- Ekspor/impor data dalam format JSON
- PWA: installable, offline-ready, mobile-first
- Dark theme dengan layout grid 3 kolom (mengikuti referensi)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript + TailwindCSS
- `@ducanh2912/next-pwa` untuk service worker
- `lucide-react` untuk ikon
- Tanpa database, tanpa autentikasi

## Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Build

```bash
npm run build
npm run start
```

## Catatan PWA

- File SVG di `public/icons/icon.svg` digunakan sebagai ikon utama.
- Untuk dukungan PWA penuh di iOS/Android, tambahkan PNG `icon-192.png` dan `icon-512.png` di `public/icons/`.
- Service worker di-disable di mode `development`. Test PWA dengan `npm run build && npm run start`.

## Struktur

```
src/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx           # Tab Cards
│  ├─ offers/page.tsx    # Tab Offers
│  └─ account/page.tsx   # Tab Account
├─ components/
│  ├─ BottomNav.tsx
│  ├─ CardTile.tsx
│  ├─ AddCardSheet.tsx
│  ├─ CardDetailSheet.tsx
│  └─ CustomCardSheet.tsx
├─ data/catalog.ts       # Daftar bank & merchant
└─ lib/
   ├─ storage.ts         # localStorage hook
   └─ utils.ts
```
