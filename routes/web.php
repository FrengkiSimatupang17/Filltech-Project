<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Admin\PackageController;
use App\Http\Controllers\Admin\ClientManagementController;
use App\Http\Controllers\Admin\TechnicianManagementController;
use App\Http\Controllers\Admin\SubscriptionManagementController;
use App\Http\Controllers\Admin\PaymentVerificationController;
use App\Http\Controllers\Admin\TaskManagementController;
use App\Http\Controllers\Admin\EquipmentController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\AdminAttendanceController;
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\Client\SubscriptionController;
use App\Http\Controllers\Client\InvoiceController;
use App\Http\Controllers\Client\PaymentController;
use App\Http\Controllers\Client\ComplaintController;
use App\Http\Controllers\Teknisi\TaskController as TeknisiTaskController;
use App\Http\Controllers\Teknisi\AttendanceController;
use App\Http\Controllers\Teknisi\EquipmentLogController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- PUBLIC ROUTES ---

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'packages' => App\Models\Package::orderBy('price', 'asc')->get(),
    ]);
});

// --- SOCIALITE AUTH ---

Route::get('/auth/google/redirect', [SocialiteController::class, 'redirectToGoogle'])->name('socialite.google.redirect');
Route::get('/auth/google/callback', [SocialiteController::class, 'handleGoogleCallback'])->name('socialite.google.callback');

// --- AUTHENTICATED ROUTES ---

Route::middleware(['auth', 'verified'])->group(function () {

    // 1. GROUP PROFILE (TIDAK BOLEH KENA MIDDLEWARE 'profile.complete')
    // Agar user yang dilempar karena data belum lengkap tetap bisa akses halaman ini untuk edit data.
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    // Route khusus untuk redirect dari middleware (jika diperlukan)
    Route::get('/profile/complete', [ProfileController::class, 'edit'])->name('profile.complete');

    // 2. GROUP YANG MEMBUTUHKAN DATA LENGKAP
    // Semua route di dalam sini akan dicek: Apakah Alamat/No HP sudah diisi?
    Route::middleware(['profile.complete'])->group(function () {
        
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
        Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');

        // --- ADMIN ROUTES ---
        // (Middleware profile.complete aman disini karena logic-nya hanya mencegat role 'client')
        Route::middleware(['can:is-admin'])->prefix('admin')->name('admin.')->group(function () {
            
            // Master Data
            Route::resource('packages', PackageController::class)->except(['show']);
            Route::resource('clients', ClientManagementController::class)->except(['show']);
            Route::resource('technicians', TechnicianManagementController::class)->except(['show', 'create', 'edit']);
            Route::resource('equipment', EquipmentController::class)->except(['show']);

            // Business Logic
            Route::get('subscriptions', [SubscriptionManagementController::class, 'index'])->name('subscriptions.index');
            Route::post('subscriptions/{subscription}/invoice', [SubscriptionManagementController::class, 'storeInstallationInvoice'])->name('subscriptions.storeInvoice');

            Route::get('payments', [PaymentVerificationController::class, 'index'])->name('payments.index');
            Route::patch('payments/{payment}', [PaymentVerificationController::class, 'update'])->name('payments.update');

            Route::get('tasks', [TaskManagementController::class, 'index'])->name('tasks.index');
            Route::patch('tasks/{task}', [TaskManagementController::class, 'update'])->name('tasks.update');

            // Reporting & Logs
            Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
            Route::get('reports/export', [ReportController::class, 'export'])->name('reports.export');
            
            // Laporan Absensi
            Route::get('attendance-report', [AdminAttendanceController::class, 'index'])->name('attendance.report.index');
            Route::get('attendance-report/export', [AdminAttendanceController::class, 'exportPdf'])->name('attendance.report.export');

            Route::get('activity-log', [ActivityLogController::class, 'index'])->name('activity-log.index');
        });

        // --- CLIENT ROUTES ---
        // (Wajib kena middleware profile.complete)
        Route::middleware(['can:is-client'])->prefix('client')->name('client.')->group(function () {
            Route::get('subscribe', [SubscriptionController::class, 'index'])->name('subscribe.index');
            Route::post('subscribe', [SubscriptionController::class, 'store'])->name('subscribe.store');
            Route::get('invoices', [InvoiceController::class, 'index'])->name('invoices.index');
            Route::post('payments', [PaymentController::class, 'store'])->name('payments.store');
            Route::get('complaints', [ComplaintController::class, 'index'])->name('complaints.index');
            Route::post('complaints', [ComplaintController::class, 'store'])->name('complaints.store');
        });

        // --- TEKNISI ROUTES ---
        Route::middleware(['can:is-teknisi'])->prefix('teknisi')->name('teknisi.')->group(function () {
            
            // GROUP KHUSUS: WAJIB CLOCK-IN DULU
            Route::middleware(['clock_in'])->group(function () {
                Route::get('tasks', [TeknisiTaskController::class, 'index'])->name('tasks.index');
                Route::patch('tasks/{task}', [TeknisiTaskController::class, 'update'])->name('tasks.update');
                
                Route::get('equipment', [EquipmentLogController::class, 'index'])->name('equipment.index');
                Route::post('equipment', [EquipmentLogController::class, 'store'])->name('equipment.store');
                Route::patch('equipment/{equipmentLog}', [EquipmentLogController::class, 'update'])->name('equipment.update');
            });

            // ABSENSI (Bebas akses agar bisa melakukan Clock-In)
            Route::get('attendance', [AttendanceController::class, 'index'])->name('attendance.index');
            Route::post('attendance', [AttendanceController::class, 'store'])->name('attendance.store');
        });

        Route::get('/fix-data-grafik', function () {
    // Cari semua invoice yg statusnya 'paid' TAPI tanggal bayarnya masih kosong
    $affected = \App\Models\Invoice::where('status', 'paid')
        ->whereNull('paid_at')
        ->update(['paid_at' => now()]); // Isi paksa dengan tanggal hari ini
        
    return "Data diperbaiki: $affected transaksi. Silakan refresh dashboard.";
        });
    });
});

require __DIR__.'/auth.php';