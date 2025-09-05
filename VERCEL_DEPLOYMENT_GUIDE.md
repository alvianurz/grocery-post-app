# Panduan Deployment ke Vercel

Panduan ini menjelaskan cara deploy aplikasi Grocery POS ke Vercel dengan database eksternal.

## Prasyarat

1. Akun Vercel (https://vercel.com)
2. Akun GitHub dengan repository yang berisi kode aplikasi
3. Database PostgreSQL yang dapat diakses secara online (Supabase, Railway, Neon, dll)

## Langkah-langkah Deployment

### 1. Siapkan Database Eksternal

Anda memerlukan database PostgreSQL yang dapat diakses dari internet. Beberapa opsi yang direkomendasikan:

- **Supabase** (Gratis tier tersedia)
- **Railway** (Gratis tier tersedia)
- **Neon** (Gratis tier tersedia)
- **Vercel Postgres** (Jika menggunakan plan Pro)

Setelah membuat database, catat connection string yang diberikan.

### 2. Perbarui Repository GitHub

Kami telah memperbarui kode untuk memperbaiki masalah build time. Pastikan repository GitHub Anda memiliki perubahan terbaru:

```bash
git pull origin main
```

### 3. Deploy ke Vercel

1. Masuk ke dashboard Vercel (https://vercel.com/dashboard)
2. Klik "New Project"
3. Pilih repository GitHub Anda (`alvianurz/grocery-post-app`)
4. Klik "Import"
5. Di halaman konfigurasi:
   - Framework Preset: Next.js
   - Root Directory: . (root)
   - Build Command: next build
   - Output Directory: .next

### 4. Konfigurasi Environment Variables

Di halaman konfigurasi project Vercel, tambahkan environment variables berikut:

```env
# Database Configuration
DATABASE_URL=connection_string_dari_database_anda

# Authentication
BETTER_AUTH_SECRET=buat_secret_key_yang_aman_32_karakter
BETTER_AUTH_URL=https://nama-project-anda.vercel.app
NEXT_PUBLIC_BETTER_AUTH_URL=https://nama-project-anda.vercel.app
```

### 5. Deploy Project

Klik "Deploy" dan tunggu proses build selesai.

### 6. Inisialisasi Database

Setelah deployment berhasil, Anda perlu menginisialisasi database dengan schema:

1. Install dependencies lokal:
   ```bash
   npm install
   ```

2. Jalankan perintah untuk push schema ke database:
   ```bash
   npm run db:push
   ```

### 7. Buat User Admin

Buat user admin untuk mengakses dashboard:

```bash
npm run setup:admin
```

Atau buat user melalui UI aplikasi.

## Troubleshooting

### Error Build

Jika terjadi error saat build, pastikan:
1. Semua environment variables telah dikonfigurasi dengan benar
2. Connection string database valid dan dapat diakses
3. Secret key untuk auth telah dibuat

### Database Connection Error

Jika aplikasi tidak dapat terhubung ke database:
1. Pastikan connection string benar
2. Periksa apakah database dapat diakses dari internet
3. Verifikasi firewall settings jika menggunakan database self-hosted

## Tips Tambahan

1. **Gunakan Preview Deployments**: Vercel menyediakan preview deployments untuk setiap pull request
2. **Environment Variables terpisah**: Gunakan environment variables berbeda untuk preview dan production
3. **Custom Domain**: Tambahkan custom domain di pengaturan project Vercel
4. **Monitoring**: Aktifkan logging dan monitoring untuk production deployment

## Referensi

- [Dokumentasi Vercel](https://vercel.com/docs)
- [Next.js Deployment ke Vercel](https://nextjs.org/docs/deployment)