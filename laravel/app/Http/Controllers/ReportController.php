<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendance;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Leave;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $attendances = Attendance::with('user')->get();

        return response()->json($attendances);
    }

    public function indexAll()
{
    $attendances = Attendance::with('user') // Ambil relasi user
        ->get()
        ->map(function ($attendance) {
            return [
                'name' => $attendance->user->name,
                'tanggal' => Carbon::parse($attendance->check_in)->format('d-m-Y'), // Format tanggal check_in
                'status' => 'Hadir',
                'keterangan' => '-',
            ];
        });

    // Query leave
    $leaves = Leave::with('user') // Ambil relasi user
        ->where('status', 'approved') // Hanya leave yang disetujui
        ->get()
        ->map(function ($leave) {
            return [
                'name' => $leave->user->name,
                'tanggal' => Carbon::parse($leave->leave_date)->format('d-m-Y'), // Format tanggal date
                'status' => 'Izin',
                'keterangan' => $leave->type,
            ];
        });

    // Gabungkan data attendance dan leave
    $combinedData = $attendances->merge($leaves)->sortBy('tanggal')->values();

    return response()->json($combinedData);

}

}

