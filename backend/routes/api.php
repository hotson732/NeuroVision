<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\EstudioController;
use App\Http\Controllers\GenerarAnalisis;
use App\Http\Controllers\UploadImageController;

// AUTH
Route::prefix('v1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::get('/check', [AuthController::class, 'checkAvailability']);
});

// ESTUDIOS (SIN autenticación - para pruebas)
Route::prefix('estudios')->group(function () {
    Route::get('/', [EstudioController::class, 'index']);
    Route::post('/', [EstudioController::class, 'store']);
    Route::get('/estadisticas', [EstudioController::class, 'estadisticas']);
    Route::get('/buscar', [EstudioController::class, 'search']);
    Route::get('/paciente/{pacienteId}', [EstudioController::class, 'getByPaciente']);
    Route::get('/{id}', [EstudioController::class, 'show']);
    Route::put('/{id}', [EstudioController::class, 'update']);
    Route::delete('/{id}', [EstudioController::class, 'destroy']);
});

// PACIENTES (PROTEGIDO) - Estudios también pueden estar aquí si quieres
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/pacientes', [PacienteController::class, 'index']);
    Route::post('/pacientes', [PacienteController::class, 'store']);
    Route::get('/pacientes/{id}', [PacienteController::class, 'show']);
    Route::put('/pacientes/{id}', [PacienteController::class, 'update']);
    Route::delete('/pacientes/{id}', [PacienteController::class, 'destroy']);
// Subir imagen a Google Drive
    Route::post('/upload/drive', [EstudioController::class, 'uploadImage']);
    
    // Obtener vista previa de imagen
    Route::get('/preview/{fileId}', [EstudioController::class, 'getImagePreview']);
    
    // Rutas CRUD para estudios
    Route::apiResource('estudios', EstudioController::class)->except(['store']);
    
    
    // Ruta específica para crear estudio (sin imagen)
    Route::post('estudios', [EstudioController::class, 'store']);
    

    //generar análisis IA
});
Route::post('/generar-analisis', [GenerarAnalisis::class, 'generar']);
