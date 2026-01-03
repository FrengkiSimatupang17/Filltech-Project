# 📡 PT. FILLTECH BERKAH BERSAMA PROJECT DOCUMENTATION (ISP)

![Laravel](https://img.shields.io/badge/Backend-Laravel_10-FF2D20?style=for-the-badge&logo=laravel)
![React](https://img.shields.io/badge/Frontend-React_Inertia-61DAFB?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql)
![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)
![Coverage](https://img.shields.io/badge/Tests-44_PASSED-brightgreen?style=for-the-badge)

**Project Owner:** Frengki Simatupang  
**Last Updated:** Januari 2026  
**Version:** 1.2.0 (Stable - Hybrid Billing & Geofencing)

---

## 📖 Ringkasan Project
**Filltech System** adalah aplikasi manajemen ISP (Internet Service Provider) berbasis web yang dirancang untuk menangani operasional end-to-end, mulai dari pendaftaran pelanggan, penagihan otomatis (billing), manajemen teknisi lapangan, hingga pelaporan keuangan.

Aplikasi ini menggunakan arsitektur **Monolith Modern** dengan **Inertia.js**, memberikan pengalaman SPA (Single Page Application) tanpa kerumitan API terpisah.

---

## 🛠️ Tech Stack

### Backend
* **Framework:** Laravel 10.x
* **Language:** PHP 8.1+
* **Database:** PostgreSQL (Production) / SQLite (Testing)
* **Authentication:** Laravel Breeze (Modified for Multi-role)
* **PDF Generator:** Barryvdh DomPDF
* **Excel Export:** Maatwebsite Excel

### Frontend
* **Framework:** React.js
* **Bridge:** Inertia.js
* **Styling:** Tailwind CSS + DaisyUI/Flowbite
* **Icons:** Heroicons
* **State Management:** React Hooks standard

---

## 🚀 Fitur Utama & Logika Bisnis

### 1. 💰 Hybrid Billing System
Sistem penagihan cerdas yang menghitung tagihan berdasarkan pemakaian nyata.
* **Logika Prorata:** Menghitung tagihan harian dengan presisi tinggi jika pelanggan berhenti/mulai di tengah bulan.
* **Pembulatan:** Otomatis membulatkan total tagihan ke 500 rupiah terdekat untuk memudahkan pembayaran tunai.
* **Invoice Generator:** Otomatis membuat Invoice PDF profesional dengan detail paket dan status pembayaran.

### 2. 👷 Portal Teknisi & Absensi (Geofencing)
Modul khusus untuk karyawan lapangan.
* **Absensi Lokasi:** Teknisi hanya bisa *Clock In* jika berada dalam radius **100 meter** dari kantor (Koordinat terkunci di Controller).
* **Status Keterlambatan:** Otomatis menandai "Late" dan menghitung menit keterlambatan jika absen di atas jam **08:00 WIB**.
* **Manajemen Tugas:** Teknisi menerima tiket gangguan, melakukan perbaikan, dan mengunggah bukti foto perbaikan.
* **Logistik:** Pencatatan pengambilan dan pengembalian alat (Equipment Log).

### 3. 👥 Manajemen Pelanggan (Client)
* **ID Unik Otomatis:** Generate ID pelanggan berdasarkan lokasi rumah (Format: `TGL-RW-RT-NO`).
* **Middleware Profil:** Memaksa pelanggan melengkapi data (No HP, Alamat, Koordinat) sebelum bisa mengakses fitur lain.
* **Self-Service:** Pelanggan bisa download invoice, upload bukti bayar, dan melihat status paket sendiri.

### 4. 📊 Laporan & Admin Panel
* **Financial Report:** Export pendapatan bulanan ke Excel.
* **Attendance Report:** Rekap kehadiran teknisi (Masuk, Pulang, Telat, Lokasi).
* **Activity Log:** Mencatat siapa melakukan apa (Audit Trail) untuk keamanan data.

---

## ⚙️ Instalasi & Setup Lokal

Ikuti langkah ini untuk menjalankan project di komputer lokal.

### Prasyarat
* PHP >= 8.1
* Composer
* Node.js & NPM
* PostgreSQL

### Langkah-langkah
1.  **Clone Repository**
    ```bash
    git clone [https://github.com/username/filltech-project.git](https://github.com/username/filltech-project.git)
    cd filltech-project
    ```

2.  **Install Dependencies**
    ```bash
    composer install
    npm install
    ```

3.  **Environment Setup**
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```
    *Edit file `.env` dan sesuaikan kredensial Database PostgreSQL Anda.*

4.  **Database Migration & Seeding**
    ```bash
    php artisan migrate --seed
    ```
    *User default:*
    * Admin: `admin@example.com` / `password`
    * Teknisi: `teknisi@example.com` / `password`

5.  **Storage Link (Penting untuk Foto/Avatar)**
    ```bash
    php artisan storage:link
    ```

6.  **Jalankan Aplikasi**
    ```bash
    npm run dev
    php artisan serve
    ```

---

## 🧪 Testing & Quality Assurance

Project ini memiliki cakupan test yang luas (Unit & Feature) untuk memastikan kestabilan fitur vital.

**Cara Menjalankan Test:**
```bash
php artisan test
```

**Modul yang Ditest:**

| Modul | Deskripsi | Status | | :--- | :--- | :--- | | Billing (Unit) | Validasi rumus matematika tarif harian & pembulatan. | ✅ PASS |
| Auth Flow | Login, Register, Reset Password, Role Redirection. | ✅ PASS |
| Profile Logic | Generate ID Unik, Validasi kelengkapan profil. | ✅ PASS |
| Invoice PDF | Validasi akses download (Authorization Policy). | ✅ PASS |
| Attendance | Validasi akses export laporan (Admin Only). | ✅ PASS |
| Equipment | Mencegah stok alat menjadi negatif. | ✅ PASS |

---

## 📂 Struktur Database Penting

1. users: Menyimpan data Admin, Teknisi, dan Client (dibedakan kolom role).
2. subscriptions: Menyimpan langganan aktif paket internet user.
3. invoices: Tagihan bulanan (relasi ke users dan subscriptions).
4. payments: Bukti bayar yang diupload user.
5. attendances: Data absen teknisi (clock_in, clock_out, lat/long, status_arrival).
6. equipment_logs: Riwayat keluar masuk barang inventaris.

---

## 🚀 Deployment (Production)

Untuk deploy ke VPS atau Railway:

1. Pastikan variabel .env production diset (APP_ENV=production, APP_DEBUG=false).

2. alankan optimasi:
```bash
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

3. Jalankan migrasi database:
```bash
php artisan migrate --force
```

---

## 📄 Lisensi

Project ini adalah properti intelektual Frengki Simatupang. Dilarang mendistribusikan ulang tanpa izin.