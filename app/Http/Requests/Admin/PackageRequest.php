<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class PackageRequest extends FormRequest
{
    // Otorisasi: Hanya Admin yang boleh
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->role === 'administrator';
    }

    // Sanitasi Input sebelum validasi (Pencegahan XSS dasar & Formatting)
    protected function prepareForValidation()
    {
        $this->merge([
            'name' => strip_tags($this->name),
            'description' => strip_tags($this->description),
            'price' => (float) str_replace('.', '', $this->price),
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'speed' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string', 'max:500'],
        ];
    }
}