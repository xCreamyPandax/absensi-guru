<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\UserImport;
use App\Exports\UserTemplateExport;

class TeacherController extends Controller
{
    public function index()
    {
        $teachers = User::where('role', 'guru')->get();
        return response()->json($teachers);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'nip' => 'required|string|unique:users,nip',
            'address' => 'nullable|string|max:255',
            'place_of_birth' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
        ]);
        
        $teacher = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'nip' => $request->nip,
            'address' => $request->address,
            'place_of_birth' => $request->place_of_birth,
            'date_of_birth' => $request->date_of_birth,
            'role' => 'guru',
        ]);

        return response()->json($teacher);
    }

    public function update(Request $request, $id)
    {
        $teacher = User::findOrFail($id);

        $request->validate([
            'name' => 'string|max:255',
            'email' => 'email|unique:users,email,' . $id,
            'password' => 'nullable|min:6',
            'nip' => 'string|unique:users,nip,' . $id,
            'address' => 'nullable|string|max:255',
            'place_of_birth' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
        ]);
        
        $teacher->update([
            'name' => $request->name ?? $teacher->name,
            'email' => $request->email ?? $teacher->email,
            'password' => $request->password ? bcrypt($request->password) : $teacher->password,
            'nip' => $request->nip ?? $teacher->nip,
            'address' => $request->address ?? $teacher->address,
            'place_of_birth' => $request->place_of_birth ?? $teacher->place_of_birth,
            'date_of_birth' => $request->date_of_birth ?? $teacher->date_of_birth,
        ]);
        

        return response()->json($teacher);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls',
        ]);

        Excel::import(new UserImport, $request->file('file'));

        return response()->json(['message' => 'Data user berhasil diimport'], 200);
    }

    public function downloadTemplate()
    {
        return Excel::download(new UserTemplateExport, 'user_template.xlsx');
    }

    public function destroy($id)
    {
        $teacher = User::findOrFail($id);
        $teacher->delete();

        return response()->json(['message' => 'Teacher deleted successfully.']);
    }
}
