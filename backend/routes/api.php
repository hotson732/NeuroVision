<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PacienteController;

Route::get('/test', function () {
    return response()->json([
        'message' => 'API de Laravel funcionando correctamente',
        'status' => 'success',
        'timestamp' => now()
    ]);
});

Route::prefix('v1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::get('/check', [AuthController::class, 'checkAvailability']); 
});

// Rutas para pacientes
Route::prefix('pacientes')->group(function () {
    Route::get('/', [PacienteController::class, 'index']);
    Route::post('/', [PacienteController::class, 'store']);
    Route::get('/search', [PacienteController::class, 'search']);
    Route::get('/{id}', [PacienteController::class, 'show']);
    Route::put('/{id}', [PacienteController::class, 'update']);
    Route::delete('/{id}', [PacienteController::class, 'destroy']);
    Route::get('/pacientes-test', [PacienteController::class, 'test']);
});