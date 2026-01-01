<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotificationController;

// --- ADMIN CONTROLLERS ---
use App\Http\Controllers\Admin\PackageController;
use App\Http\Controllers\Admin\ClientManagementController;
use App\Http\Controllers\Admin\TechnicianManagementController;
use App\Http\Controllers\Admin\SubscriptionManagementController;
use App\Http\Controllers\Admin\PaymentVerificationController;
use App\Http\Controllers\Admin\TaskManagementController;
use App\Http\Controllers\Admin\EquipmentController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\AttendanceController as AdminAttendanceController; // Alias agar tidak bentrok

// --- CLIENT CONTROLLERS ---
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\Client\SubscriptionController;
use App\Http\Controllers\Client\InvoiceController;
use App\Http\Controllers\Client\PaymentController;
use App\Http\Controllers\Client\ComplaintController;

// --- TEKNISI CONTROLLERS ---
use App\Http\Controllers\Teknisi\TaskController as TeknisiTaskController; // Alias agar tidak bentrok
use App\Http\Controllers\Teknisi\AttendanceController as TeknisiAttendanceController; // Alias agar tidak bentrok
use App\Http\Controllers\Teknisi\EquipmentLogController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'packages' => \App\Models\Package::orderBy('price', 'asc')->get(),
    ]);
});

// Socialite (Google Login)
Route::get('/auth/google/redirect', [SocialiteController::class, 'redirectToGoogle'])->name('socialite.google.redirect');
Route::get('/auth/google/callback', [SocialiteController::class, 'handleGoogleCallback'])->name('socialite.google.callback');

// Authenticated Routes
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Profile Management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/profile/complete', [ProfileController::class, 'edit'])->name('profile.complete');

    // Dashboard & Core Features (Require Profile Complete)
    Route::middleware(['profile.complete'])->group(function () {
        
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        
        // Notifications
        Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
        Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');

        // --- ADMIN ROUTES ---
        Route::middleware(['can:is-admin'])->prefix('admin')->name('admin.')->group(function () {
            // Master Data
            Route::resource('packages', PackageController::class)->except(['show']);
            Route::resource('clients', ClientManagementController::class)->except(['show']);
            Route::resource('technicians', TechnicianManagementController::class)->except(['show', 'create', 'edit']);
            
            // Equipment Management
            Route::resource('equipment', EquipmentController::class)->except(['show']);
            // [TAMBAHAN BARU] Route untuk Admin Restock Barang
            Route::post('equipment/{equipment}/restock', [EquipmentController::class, 'restock'])->name('equipment.restock');

            // Transaksi & Verifikasi
            Route::get('subscriptions', [SubscriptionManagementController::class, 'index'])->name('subscriptions.index');
            Route::post('subscriptions/{subscription}/invoice', [SubscriptionManagementController::class, 'storeInstallationInvoice'])->name('subscriptions.storeInvoice');
            Route::get('payments', [PaymentVerificationController::class, 'index'])->name('payments.index');
            Route::patch('payments/{payment}', [PaymentVerificationController::class, 'update'])->name('payments.update');
            
            // Task Management Admin
            Route::get('tasks', [TaskManagementController::class, 'index'])->name('tasks.index');
            Route::patch('tasks/{task}', [TaskManagementController::class, 'update'])->name('tasks.update');

            // Reports & Logs
            Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
            Route::get('reports/export', [ReportController::class, 'export'])->name('reports.export');
            
            Route::get('attendance-report', [AdminAttendanceController::class, 'index'])->name('attendance.report.index');
            Route::get('attendance-report/export', [AdminAttendanceController::class, 'export'])->name('attendance.report.export');
            Route::get('activity-log', [ActivityLogController::class, 'index'])->name('activity-log.index');
            
            // Helper View Invoice (Admin view client invoices)
            Route::get('invoices', [InvoiceController::class, 'index'])->name('invoices.index'); 
        });

        // --- CLIENT ROUTES ---
        Route::middleware(['can:is-client'])->prefix('client')->name('client.')->group(function () {
            Route::get('subscribe', [SubscriptionController::class, 'index'])->name('subscribe.index');
            Route::post('subscribe', [SubscriptionController::class, 'store'])->name('subscribe.store');
            
            Route::get('invoices', [InvoiceController::class, 'index'])->name('invoices.index');
            Route::get('invoices/{invoice}', [InvoiceController::class, 'show'])->name('invoices.show');
            
            Route::post('payments', [PaymentController::class, 'store'])->name('payments.store');
            
            Route::get('complaints', [ComplaintController::class, 'index'])->name('complaints.index');
            Route::post('complaints', [ComplaintController::class, 'store'])->name('complaints.store');
        });

        // --- TEKNISI ROUTES ---
        Route::middleware(['can:is-teknisi'])->prefix('teknisi')->name('teknisi.')->group(function () {
            
            // 1. Route Absensi (Bebas Akses - Agar bisa Clock In/Out)
            Route::get('attendance', [TeknisiAttendanceController::class, 'index'])->name('attendance.index');
            Route::post('attendance', [TeknisiAttendanceController::class, 'store'])->name('attendance.store');

            // 2. Route Operasional (WAJIB CLOCK IN DULU via Middleware)
            Route::middleware(['clock_in'])->group(function () {
                // Tugas Saya
                Route::get('tasks', [TeknisiTaskController::class, 'index'])->name('tasks.index');
                Route::patch('tasks/{task}', [TeknisiTaskController::class, 'update'])->name('tasks.update');

                // Stok Alat
                Route::get('equipment', [EquipmentLogController::class, 'index'])->name('equipment.index');
                Route::post('equipment', [EquipmentLogController::class, 'store'])->name('equipment.store');
                Route::patch('equipment/{equipmentLog}', [EquipmentLogController::class, 'update'])->name('equipment.update');
            });
        });
    });
});

require __DIR__.'/auth.php';