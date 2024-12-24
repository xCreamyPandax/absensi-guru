<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'), // Ganti dengan password yang aman
            'nip' => null,
            'address' => null,
            'place_of_birth' => null,
            'date_of_birth' => null,
            'role' => 'admin', // Pastikan role "admin" dikenali di sistem Anda
        ]);
    }
}
