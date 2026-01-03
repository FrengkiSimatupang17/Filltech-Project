# 📡 FILLTECH PROJECT DOCUMENTATION

![Laravel](https://img.shields.io/badge/Backend-Laravel_10-FF2D20?style=for-the-badge&logo=laravel)
![React](https://img.shields.io/badge/Frontend-React_Inertia-61DAFB?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql)
![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)
![Billing](https://img.shields.io/badge/Billing-Hybrid_System-gold?style=for-the-badge)

**Project Owner:** Frengki Simatupang  
**Last Updated:** Januari 2026  
**Version:** 1.2.0 (Stable - Hybrid Billing)

---

## 📋 Daftar Isi
1. [Tech Stack](#1-tech-stack)
2. [Arsitektur Sistem](#2-arsitektur-sistem)
3. [Fitur & Logika Bisnis Utama](#3-fitur--logika-bisnis-utama-core-logic)
4. [Instalasi & Setup Lokal](#4-instalasi--setup-lokal)
5. [Testing & Quality Assurance](#5-testing--quality-assurance)
6. [Panduan Import Data Pelanggan](#6-panduan-import-data-pelanggan)
7. [Deployment](#7-deployment)

---

## 1. 🛠️ Tech Stack
Project ini dibangun dengan arsitektur **Monolith Modern** menggunakan Inertia.js untuk pengalaman SPA (Single Page Application).

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | Laravel 10.x | Core Backend Framework |
| **Frontend** | React 18 + Inertia.js | Tanpa API terpisah, routing via Laravel |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Database** | PostgreSQL | Support JSON column & advanced indexing |
| **Auth** | Laravel Breeze + Socialite | Login biasa & Google Login |
| **Billing Logic** | Custom Service Class | Perhitungan Prorata Presisi Tinggi |
| **Logging** | spatie/laravel-activitylog | Audit Trail aktivitas user |

---

## 2. 🏗️ Arsitektur Sistem

Struktur folder controller dipisahkan berdasarkan **Role** untuk keamanan, dan logika perhitungan dipisah ke **Service Class**.

### 📂 Struktur Logic
* **`app/Http/Controllers/`**: Menangani Request & Response.
    * `Admin/`: Akses penuh (Master Data, Stok, Billing).
    * `Teknisi/`: Akses lapangan (Tugas, Absensi).
    * `Client/`: Akses pelanggan (Tagihan, Profil).
* **`app/Services/`**: Menangani Logika Matematika Kompleks.
    * `BillingCalculator.php`: Otak perhitungan biaya prorata dengan presisi desimal dan pembulatan akhir.

### 🛡️ Middleware Khusus
1. **`role:admin|teknisi|client`**: Membatasi akses URL.
2. **`clock_in`**: Teknisi wajib absensi sebelum akses tugas.
3. **`profile.complete`**: Wajib lengkapi alamat sebelum masuk dashboard.

---

## 3. 🧠 Fitur & Logika Bisnis Utama (Core Logic)

Sistem ini dirancang dengan strategi bisnis untuk meminimalisir kerugian operasional (Churn Rate).

### A. 💰 Hybrid Billing System (Strategi Keuangan)
Sistem tagihan menggunakan pendekatan **Full Payment di Awal** untuk menutupi biaya instalasi, dan **Prorata di Bulan Kedua**.

* **Bulan 1 (Instalasi):**
    * User membayar **FULL 1 Bulan** + Biaya Instalasi (Include).
    * *Alasan:* Mitigasi risiko jika pelanggan berhenti berlangganan di bulan pertama.
* **Bulan 2 (Penyesuaian):**
    * Sistem Scheduler menghitung sisa hari (misal tgl 15 - 30) agar tagihan bulan berikutnya jatuh di tanggal 1.
    * Menggunakan `BillingCalculator` dengan rumus presisi.
* **Rumus Prorata (Bulan ke-2):**
    * `(Harga Paket / 30) * Sisa Hari`.
    * Hasil akhir dibulatkan ke atas (kelipatan 500) untuk kerapian administrasi.

### B. 🆔 Smart ID Generation
Menangani pendaftaran via Google yang seringkali tanpa alamat.
* **Logic:** ID Unik (`RW-RT`) hanya digenerate saat user mengisi alamat lengkap.
* **Format:** `ddmmyy-RW[rw]-RT[rt]-[blok].[no_rumah]`
* **Self-Healing:** Jika ada ID cacat (RW kosong), sistem otomatis memperbaikinya saat user update profil.

### C. 📦 Manajemen Stok (Inventory Safety)
* **Atomic Transaction:** Menggunakan `DB::beginTransaction()`. Stok tidak akan berkurang/tambah jika pencatatan log gagal.
* **Validasi:** Admin tidak bisa input stok negatif.

### D. 🔧 Keamanan Operasional Teknisi
* **Task Isolation:** Teknisi tidak bisa saling bajak tugas.
* **Evidence Upload:** Bukti foto wajib ada saat penyelesaian tugas.

---

## 4. 💻 Instalasi & Setup Lokal

1. **Clone & Install**
   ```bash
   git clone [https://github.com/FrengkiSimatupang17/Filltech-Project.git](https://github.com/FrengkiSimatupang17/Filltech-Project.git)
   cd Filltech-Project
   composer install
   npm install


2. **Environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   # Setup DB di .env lalu:
   php artisan migrate --seed

3. **Run App**
   Terminal 1: php artisan serve
   Terminal 2: npm run dev


---

## 5. ✅ Testing & Quality Assurance
Project ini dilengkapi dengan 38 Automated Tests untuk menjamin kestabilan. Test mencakup Unit Test dan Feature Test.

1. **Cara Menjalankan Test**
   ```bash
   php artisan test

2. **Cakupan Test Utama**
   Modul,Deskripsi Test,Status

   Billing (Unit),Verifikasi rumus matematika Prorata & Pembulatan 500.,✅ PASS

   User Profile,Cek logika ID Unik (Register Null -> Update Generate).,✅ PASS

   Equipment,Cek validasi stok negatif & pencatatan log admin.,✅ PASS

   Technician,Cek keamanan akses tugas & upload foto bukti.,✅ PASS

---

## 6. 📂 Panduan Import Data Pelanggan
Jika Anda memiliki data pelanggan lama (Excel/CSV), gunakan fitur Seeder khusus yang sudah disiapkan.

1. Siapkan File CSV Pastikan format CSV sesuai (ID, Nama, Alamat, dll).
2. Simpan File Letakkan file di storage/app/clients.csv.
3. Jalankan Command
   ```bash
   php artisan db:seed --class=ImportClientSeeder

---

## 7. 🚀 Deployment (Railway/VPS)

1. **Environment Variables Wajib (Production)**
   Pastikan variabel ini diset di server:

   APP_ENV=production
   APP_DEBUG=false
   APP_URL=[https://domain-anda.com](https://domain-anda.com)
   DB_CONNECTION=pgsql
   # ... Credential Database ...

2. **Build Command**
   Saat deploy, pastikan perintah ini dijalankan:
   ```bash
   composer install --no-dev --optimize-autoloader
   php artisan migrate --force
   npm run build
   php artisan config:cache
   php artisan route:cache

---


Filltech Project Internal Documentation Hak Cipta © 2026 Frengki Simatupang.