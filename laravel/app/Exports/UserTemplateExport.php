<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithHeadings;

class UserTemplateExport implements WithHeadings
{
    public function headings(): array
    {
        return [
            'NIP',          // Kolom NIP
            'Nama',         // Kolom Nama
            'Alamat',        // Kolom Alamat
            'Tempat Lahir', // Kolom Tempat Lahir
            'Tanggal Lahir (mm/dd/yyyy)',// Kolom Tanggal Lahir
            'Email',        // Kolom Email
            'Password',     // Kolom Password
            'Role',         // Kolom Role (opsional)
        ];
    }
}
