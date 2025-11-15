<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ClientManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Clients/Index', [
            'users' => User::orderBy('name')->get()->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'id_unik' => $user->id_unik,
                'address_detail' => $user->address_detail,
                'phone_number' => $user->phone_number,
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::min(8)],
            'role' => ['required', Rule::in(['client', 'administrator', 'teknisi'])],
            'id_unik' => 'nullable|string|max:100|unique:users',
            'address_detail' => 'nullable|string',
            'phone_number' => 'nullable|string|max:20',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'id_unik' => $request->id_unik,
            'address_detail' => $request->address_detail,
            'phone_number' => $request->phone_number,
        ]);

        return Redirect::route('admin.clients.index');
    }

    public function update(Request $request, User $client)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($client->id)],
            'password' => ['nullable', 'confirmed', Password::min(8)],
            'role' => ['required', Rule::in(['client', 'administrator', 'teknisi'])],
            'id_unik' => ['nullable', 'string', 'max:100', Rule::unique('users')->ignore($client->id)],
            'address_detail' => 'nullable|string',
            'phone_number' => 'nullable|string|max:20',
        ]);

        $client->fill($request->except('password'));

        if ($request->filled('password')) {
            $client->password = Hash::make($request->password);
        }

        $client->save();

        return Redirect::route('admin.clients.index');
    }

    public function destroy(User $client)
    {
        $client->delete();

        return Redirect::route('admin.clients.index');
    }
}