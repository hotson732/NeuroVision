<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;

/*
|--------------------------------------------------------------------------
| Rutas Públicas (No requieren Token)
|--------------------------------------------------------------------------
*/

// Para el Login
Route::post('/login', [AuthController::class, 'login']);

// Para el Registro
Route::post('/user/register', [UserController::class, 'store']);

/*
|--------------------------------------------------------------------------
| Rutas Protegidas (Requieren Token "Bearer")
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
