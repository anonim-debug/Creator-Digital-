# Creator Digital

Website tools AI, portofolio, dan website builder — otomatis dari daftar sampai bayar.

## Stack
- Next.js (frontend + backend)
- Firebase (Authentication + Firestore)
- Midtrans (payment gateway)
- Google Gemini (AI)

## Cara jalankan
1. `npm install`
2. Salin `.env.example` jadi `.env.local`, isi semua kunci API
3. `npm run dev`

## Struktur
- `app/` — semua halaman & API
- `lib/` — koneksi Firebase
- `firestore-rules.txt` — aturan keamanan database
