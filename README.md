# 🔒 FILLTECH INTERNAL DOCUMENTATION

**Project Owner:** Frengki Simatupang
**Last Updated:** November 2025
**Status:** Production Ready (v1.0)

---

## 1. 🛠️ Tech Stack & Versi
Penting untuk maintenance di masa depan.
* **Framework:** Laravel 10.x / 11.x
* **Frontend:** React 18 + Inertia.js 2.0
* **CSS:** Tailwind CSS + Headless UI
* **Database:** PostgreSQL (Production/Local)
* **PDF Engine:** barryvdh/laravel-dompdf
* **Runtime:** PHP 8.2+, Node.js 18+

---

## 2. 🏗️ Arsitektur & Struktur Kode

Aplikasi menggunakan pola **Monolith MVC** dengan pemisahan folder Controller berdasarkan **Role**.

### Peta Controller (`app/Http/Controllers/`)
* **`Admin/`**: Logika untuk Administrator (CRUD Master Data, Verifikasi, Laporan).
* **`Client/`**: Logika untuk Pelanggan (Lihat Tagihan, Upload Bukti, Komplain).
* **`Teknisi/`**: Logika untuk Pekerja Lapangan (Absensi, Tugas, Alat).
* **`Auth/`**: Logika Login/Register (termasuk pemisahan Login Admin & User Biasa).
* **`DashboardController.php`**: *Single Point of Entry* untuk mengarahkan user ke dashboard yang sesuai role-nya.

### Middleware Khusus
* **`RequireClockIn`**: Mencegah teknisi mengakses menu Tugas/Alat jika belum melakukan Clock-In hari ini.
* **`SecurityHeaders`**: Mengatur CSP dan header keamanan (Mode Strict di Production, Longgar di Local).

---

## 3. 🧠 Logika Bisnis Utama (Core Business Logic)

Bagian ini menjelaskan alur kompleks yang terjadi di balik layar.

### A. Alur Pendaftaran & Langganan
1.  Client Register -> Masuk ke `users` (Role: client).
2.  Client pilih paket di `/subscribe` -> Masuk ke tabel `subscriptions` (Status: `pending`).
3.  Notifikasi sistem dikirim ke Admin.

### B. Alur Verifikasi Pembayaran (Automated Chain)
Logic ini ada di `PaymentVerificationController@approvePayment`.
Ketika Admin klik **"Terima"**, sistem melakukan **Database Transaction** yang memicu 5 hal sekaligus:
1.  Update `payments.status` -> `verified`.
2.  Update `invoices.status` -> `paid`.
3.  Jika ini pembayaran instalasi -> Update `subscriptions.status` -> `active`.
4.  **Auto-Create Task:** Membuat tugas `installation` baru untuk teknisi (Status: `assigned`, Priority: `high`).
5.  Kirim Notifikasi WA ke Client.

### C. Automasi Tagihan Bulanan
* **File:** `app/Console/Commands/GenerateMonthlyInvoices.php`
* **Jadwal:** Berjalan setiap tanggal 1 pukul 01:00 (via Scheduler).
* **Logic:** Mencari semua `Subscription` aktif, lalu membuat `Invoice` tipe `monthly` untuk bulan berjalan. Menggunakan `chunk(100)` untuk hemat memori.

### D. Absensi Teknisi
* Teknisi **WAJIB** Clock-In untuk membuka menu lain.
* Keterlambatan dihitung otomatis di Model `Attendance` (Accessor `is_late`) jika Clock-In > 08:00 WIB.

---

## 4. 🚀 Deployment Cheat Sheet (Railway)

Panduan cepat jika harus deploy ulang atau pindah server.

### Environment Variables (Production)
Pastikan variabel ini ada di Railway:
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=[https://domain-anda-di-railway.app](https://domain-anda-di-railway.app)
DB_CONNECTION=pgsql
# ... (Kredensial DB dari Railway Reference) ...