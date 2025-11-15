<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class SubscriptionController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $existingSubscription = Subscription::where('user_id', $user->id)
            ->whereIn('status', ['active', 'pending'])
            ->first();

        $subscription = $existingSubscription 
            ? Subscription::with('package')->find($existingSubscription->id) 
            : null;

        return Inertia::render('Client/Subscribe', [
            'packages' => $existingSubscription ? [] : Package::all(),
            'hasSubscription' => $existingSubscription !== null,
            'subscription' => $subscription,
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
                ->with('error', 'Anda sudah memiliki langganan.');
        }

        Subscription::create([
            'user_id' => $user->id,
            'package_id' => $request->package_id,
            'status' => 'pending',
        ]);

        return Redirect::route('client.subscribe.index');
    }
}