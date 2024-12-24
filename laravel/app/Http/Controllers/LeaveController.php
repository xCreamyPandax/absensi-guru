<?php

namespace App\Http\Controllers;

use App\Models\Leave;
use Illuminate\Http\Request;

class LeaveController extends Controller
{
    public function index()
    {
        $leaves = Leave::with('user')->get();
        return response()->json($leaves);
    }

    public function store(Request $request)
    {
        $request->validate([
            'leave_date' => 'required|date',
            'reason' => 'required|string|max:255',
            'type' => 'required|string|max:255',
        ]);

        $leave = Leave::create([
            'user_id' => $request->user()->id,
            'leave_date' => $request->leave_date,
            'reason' => $request->reason,
            'type' => $request->type,
        ]);

        return response()->json($leave);
    }

    public function updateStatus(Request $request, $id)
    {
        $leave = Leave::findOrFail($id);
        $request->validate(['status' => 'required|in:pending,approved,rejected']);

        $leave->update(['status' => $request->status]);

        return response()->json($leave);
    }

    public function getByUser($user_id)
    {
        $leaves = Leave::where('user_id', $user_id)->get();

        if ($leaves->isEmpty()) {
            return response()->json(['message' => 'No leave records found for this user'], 404);
        }

        return response()->json($leaves, 200);
    }
}
