<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        // Validasi input
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Cek kredensial
        if (Auth::attempt($credentials)) {
            // Ambil user yang terautentikasi
            $user = Auth::user();

            // Buat token
            $token = $user->createToken('authToken')->plainTextToken;

            return response()->json([
                'token' => $token,
                'user' => $user,
                'role' => $user->role,
                'id' => $user->id,
                'name' => $user->name,
                 // Pastikan kolom role ada di tabel user
            ]);
        }

        // Gagal login
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    public function logout(Request $request)
    {
        // Pastikan user sedang login
        $user = Auth::user();
        if ($user) {
            // Hapus semua token
            $user->tokens()->delete();

            return response()->json(['message' => 'Logged out successfully']);
        }

        return response()->json(['message' => 'No user logged in'], 400);
    }

    public function getUserById($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user, 200);
    }
}
