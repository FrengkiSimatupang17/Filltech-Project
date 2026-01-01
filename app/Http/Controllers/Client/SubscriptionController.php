<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\Subscription;
use App\Models\User;
use App\Models\ActivityLog; // [WAJIB IMPORT] Agar tercatat di Audit
use App\Notifications\SystemAlert; // Pastikan file notifikasi ini ada
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $existingSubscription = Subscription::where('user_id', $user->id)
            ->whereIn('status', ['active', 'pending'])
            ->with('package')
            ->first();

        return Inertia::render('Client/Subscribe', [
            'packages' => $existingSubscription ? [] : Package::orderBy('price', 'asc')->get(),
            'currentSubscription' => $existingSubscription,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'package_id' => 'required|exists:packages,id',
        ]);

        $existingSubscription = Subscription::where('user_id', $user->id)
            ->whereIn('status', ['active', 'pending'])
            ->exists();

        if ($existingSubscription) {
            return Redirect::route('client.subscribe.index')
                ->with('error', 'Anda sudah memiliki langganan aktif atau sedang diproses.');
        }

        $package = Package::find($request->package_id);

        // 1. Simpan Subscription (Status Pending)
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'package_id' => $request->package_id,
            'status' => 'pending',
        ]);

        // 2. [FIX] Catat Log Aktivitas Client (Audit Trail)
        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'client_subscribe',
            'event' => 'create',
            'description' => "Mengajukan permintaan langganan paket: {$package->name}",
            'ip_address' => $request->ip(),
        ]);

        // 3. Kirim Notifikasi ke Admin
        $admins = User::where('role', 'administrator')->get();
        
        // Pastikan class SystemAlert sudah dibuat di App\Notifications
        if (class_exists(SystemAlert::class)) {
            Notification::send($admins, new SystemAlert(
                'Permintaan Langganan Baru dari ' . $user->name,
                route('admin.subscriptions.index'), // Pastikan route ini ada
                'subscription'
            ));
        }

        return Redirect::route('client.subscribe.index')->with('success', 'Permintaan berlangganan berhasil dikirim. Mohon tunggu verifikasi admin.');
    }
}