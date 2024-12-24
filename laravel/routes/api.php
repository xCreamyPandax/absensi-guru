<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\LeaveController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/checkin', [AttendanceController::class, 'checkIn']);
    Route::post('/checkout', [AttendanceController::class, 'checkOut']);
    Route::get('/reports', [ReportController::class, 'index']);
    Route::get('/attendances/{user_id}', [AttendanceController::class, 'getByUser']);
    Route::get('/reports/all', [ReportController::class, 'indexAll']);

    Route::get('/teachers', [TeacherController::class, 'index']);
    Route::post('/teachers', [TeacherController::class, 'store']);
    Route::put('/teachers/{id}', [TeacherController::class, 'update']);
    Route::delete('/teachers/{id}', [TeacherController::class, 'destroy']);
    Route::get('/users/{id}', [AuthController::class, 'getUserById']);

    // Izin Guru
    Route::get('/leaves', [LeaveController::class, 'index']);
    Route::post('/leaves', [LeaveController::class, 'store']);
    Route::patch('/leaves/{id}', [LeaveController::class, 'updateStatus']);
    Route::get('/leaves/{user_id}', [LeaveController::class, 'getByUser']);

    //Import Data Dari Excel
    Route::post('/import-users', [TeacherController::class, 'import']);

    //Emport Template
    Route::get('/download-template', [TeacherController::class, 'downloadTemplate']);

 
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
