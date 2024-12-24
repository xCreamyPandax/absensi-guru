<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Models\Leave;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function checkIn(Request $request)
    {
        $user = $request->user();
        $now = Carbon::now()->setTimezone('Asia/Jakarta');

        // Rentang waktu untuk check-in
        $checkInStart = Carbon::createFromTime(5, 0, 0, 'Asia/Jakarta');
        $checkInEnd = Carbon::createFromTime(7, 0, 0, 'Asia/Jakarta');

        if (!$now->between($checkInStart, $checkInEnd)) {
            return response()->json(['message' => 'Check-in allowed only between 5 AM and 7 AM WIB.'], 403);
        }

        $existingCheckIn = Attendance::where('user_id', $user->id)
            ->whereDate('check_in', $now->toDateString())
            ->first();

        if ($existingCheckIn) {
            return response()->json(['message' => 'You have already checked in today.'], 409);
        }

        $existingLeave = Leave::where('user_id', $user->id)
            ->whereDate('leave_date', $now->toDateString())
            ->first();

        if ($existingLeave) {
            $existingLeave->delete();
        }

        $attendance = Attendance::create([
            'user_id' => $user->id,
            'check_in' => $now,
        ]);


        return response()->json($attendance);
    }

    public function checkOut(Request $request)
    {
        $user = $request->user();
        $now = Carbon::now()->setTimezone('Asia/Jakarta');

        // Rentang waktu untuk check-out
        $checkOutStart = Carbon::createFromTime(15, 0, 0, 'Asia/Jakarta');
        $checkOutEnd = Carbon::createFromTime(17, 0, 0, 'Asia/Jakarta');

        if (!$now->between($checkOutStart, $checkOutEnd)) {
            return response()->json(['message' => 'Check-out allowed only between 3 PM and 5 PM WIB.'], 403);
        }

        $attendance = Attendance::where('user_id', $user->id)
            ->whereNull('check_out')
            ->first();

        if (!$attendance) {
            return response()->json(['message' => 'No check-in record found.'], 404);
        }

        $attendance->update(['check_out' => $now]);

        return response()->json($attendance);
    }

    
    public function getByUser($user_id)
    {
        $attendances = Attendance::where('user_id', $user_id)->get();

        if ($attendances->isEmpty()) {
            return response()->json(['message' => 'No attendance records found for this user'], 404);
        }

        return response()->json($attendances, 200);
    }
}
