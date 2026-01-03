<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserProfileTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function register_user_baru_via_google_atau_form_id_unik_harus_null()
    {
        $user = User::create([
            'name' => 'User Baru',
            'email' => 'new@example.com',
            'password' => 'password',
            'role' => 'client',
        ]);

        $this->assertNull($user->id_unik);
    }

    /** @test */
    public function update_profil_lengkap_otomatis_generate_id_unik()
    {
        $user = User::factory()->create([
            'role' => 'client',
            'id_unik' => null, 
            'alamat' => null
        ]);

        $response = $this->actingAs($user)->patch(route('profile.update'), [
            'name' => $user->name,
            'email' => $user->email,
            'alamat' => 'Jl. Mawar',
            'rt' => '005',
            'rw' => '002', // Input 002
            'blok' => 'A',
            'nomor_rumah' => '10'
        ]);

        $response->assertSessionHasNoErrors();
        $user->refresh();

        $this->assertNotNull($user->id_unik);
        
        // [PERBAIKAN DISINI] Ubah RW02 menjadi RW002 sesuai input
        $this->assertStringContainsString('RW002', $user->id_unik); 
        $this->assertStringContainsString('RT005', $user->id_unik);
    }

    /** @test */
    public function rw_format_string_seperti_mantang_diterima()
    {
        $user = User::factory()->create(['role' => 'client', 'id_unik' => null]);

        $this->actingAs($user)->patch(route('profile.update'), [
            'name' => $user->name,
            'email' => $user->email,
            'alamat' => 'Jl. Anggrek',
            'rt' => '1',
            'rw' => 'MANTANG',
            'blok' => 'C',
            'nomor_rumah' => '12'
        ]);

        $user->refresh();
        $this->assertStringContainsString('RWMANTANG', $user->id_unik);
    }
}