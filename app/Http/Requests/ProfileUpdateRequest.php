<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required', 
                'string', 
                'lowercase', 
                'email', 
                'max:255', 
                Rule::unique(User::class)->ignore($this->user()->id)
            ],
            'phone_number' => ['nullable', 'string', 'max:20'],
            
            // Validasi Alamat (Sesuai Permintaan: Nullable)
            'alamat' => ['nullable', 'string', 'max:500'],
            'rt' => ['nullable', 'string', 'max:3'],
            'rw' => ['nullable', 'string', 'max:50'],
            'blok' => ['nullable', 'string', 'max:10'],      // PENTING: Field ini harus ada agar data Blok masuk
            'nomor_rumah' => ['nullable', 'string', 'max:10'],

            // Validasi Password (Opsional, jika user mengisi password baru)
            'password' => ['nullable', 'confirmed', Password::defaults()], 
        ];
    }
}