<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@radhe.com'],
            [
                'name' => 'Radhe Administrator',
                'password' => Hash::make('admin123'),
                'phone' => '9999999999',
                'is_admin' => true,
                'role' => 'admin',
            ]
        );

        // Also add admin@luxoria.com as fallback alias with same credentials
        User::updateOrCreate(
            ['email' => 'admin@luxoria.com'],
            [
                'name' => 'Luxoria Administrator',
                'password' => Hash::make('admin123'),
                'phone' => '8888888888',
                'is_admin' => true,
                'role' => 'admin',
            ]
        );
    }
}
