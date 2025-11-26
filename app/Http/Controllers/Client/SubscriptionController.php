<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\Subscription;
use App\Models\User;
use App\Notifications\SystemAlert;
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

        Subscription::create([
            'user_id' => $user->id,
            'package_id' => $request->package_id,
            'status' => 'pending',
        ]);

        $admins = User::where('role', 'administrator')->get();
        Notification::send($admins, new SystemAlert(
            'Permintaan Langganan Baru dari ' . $user->name,
            route('admin.subscriptions.index'),
            'subscription'
        ));

        return Redirect::route('client.subscribe.index')->with('success', 'Permintaan berlangganan berhasil dikirim. Mohon tunggu verifikasi admin.');
    }
}