<?php

namespace App\Imports;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;

class UserImport implements ToModel
{
    public function model(array $row)
{
    // Skip header row
    if ($row[0] === 'NIP') {
        return null;
    }

    // Periksa apakah email sudah ada di database
    $existingUser = User::where('email', $row[5])->first();
    if ($existingUser) {
        throw new \Exception("Email {$row[5]} sudah ada di database."); // Lewati jika email sudah ada
    }

    $existingUserNip = User::where('nip', $row[5])->first();
    if ($existingUserNip) {
        throw new \Exception("NIP {$row[0]} sudah ada di database."); // Lewati jika email sudah ada
    }

    // Konversi tanggal lahir dari 'mm/dd/yyyy' ke 'yyyy-mm-dd'
    $tanggalLahir = null;
    if (!empty($row[4])) {
        try {
            $tanggalLahir = Carbon::createFromFormatTimestamp('mm/dd/yyyy', $row[4])->format('Y-m-d');
        } catch (\Exception $e) {
            $tanggalLahir = null; // Tanggal tidak valid
        }
    }

    return new User([
        'nip' => $row[0],
        'name' => $row[1],
        'address' => $row[2],
        'place_of_birth' => $row[3],
        'date_of_birth' => $tanggalLahir,
        'email' => $row[5],
        'password' => Hash::make($row[6]),
        'role' => $row[7] ?? 'guru', // Default role 'guru'
    ]);
}
}
