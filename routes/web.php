<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardRedirectController;
use App\Http\Controllers\Admin\PackageController;
use App\Http\Controllers\Admin\ClientManagementController;
use App\Http\Controllers\Admin\SubscriptionManagementController;
use App\Http\Controllers\Admin\PaymentVerificationController;
use App\Http\Controllers\Admin\TaskManagementController;
use App\Http\Controllers\Admin\EquipmentController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\ActivityLogController;
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

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', DashboardRedirectController::class)
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::get('/auth/google/redirect', [SocialiteController::class, 'redirectToGoogle'])->name('socialite.google.redirect');
Route::get('/auth/google/callback', [SocialiteController::class, 'handleGoogleCallback'])->name('socialite.google.callback');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'can:is-admin'])->prefix('admin')->name('admin.')->group(function () {
    
    Route::resource('packages', PackageController::class)
        ->except(['show']);
        
    Route::resource('clients', ClientManagementController::class)
        ->except(['show']);

    Route::get('subscriptions', [SubscriptionManagementController::class, 'index'])
        ->name('subscriptions.index');
    Route::post('subscriptions/{subscription}/invoice', [SubscriptionManagementController::class, 'storeInstallationInvoice'])
        ->name('subscriptions.storeInvoice');

    Route::get('payments', [PaymentVerificationController::class, 'index'])->name('payments.index');
    Route::patch('payments/{payment}', [PaymentVerificationController::class, 'update'])->name('payments.update');

    Route::get('tasks', [TaskManagementController::class, 'index'])->name('tasks.index');
    Route::patch('tasks/{task}', [TaskManagementController::class, 'update'])->name('tasks.update');

    Route::resource('equipment', EquipmentController::class)->except(['show']);

    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');

    Route::get('activity-log', [ActivityLogController::class, 'index'])->name('activity-log.index');

});

Route::middleware(['auth', 'can:is-client'])->prefix('client')->name('client.')->group(function () {
    
    Route::get('subscribe', [SubscriptionController::class, 'index'])->name('subscribe.index');
    Route::post('subscribe', [SubscriptionController::class, 'store'])->name('subscribe.store');
    
    Route::get('invoices', [InvoiceController::class, 'index'])->name('invoices.index');
    Route::post('payments', [PaymentController::class, 'store'])->name('payments.store');

    Route::get('complaints', [ComplaintController::class, 'index'])->name('complaints.index');
    Route::post('complaints', [ComplaintController::class, 'store'])->name('complaints.store');
    
});

Route::middleware(['auth', 'can:is-teknisi'])->prefix('teknisi')->name('teknisi.')->group(function () {
    
    Route::get('tasks', [TeknisiTaskController::class, 'index'])->name('tasks.index');
    Route::patch('tasks/{task}', [TeknisiTaskController::class, 'update'])->name('tasks.update');

    Route::get('attendance', [AttendanceController::class, 'index'])->name('attendance.index');
    Route::post('attendance', [AttendanceController::class, 'store'])->name('attendance.store');

    Route::get('equipment', [EquipmentLogController::class, 'index'])->name('equipment.index');
    Route::post('equipment', [EquipmentLogController::class, 'store'])->name('equipment.store');
    Route::patch('equipment/{equipmentLog}', [EquipmentLogController::class, 'update'])->name('equipment.update');

});

require __DIR__.'/auth.php';