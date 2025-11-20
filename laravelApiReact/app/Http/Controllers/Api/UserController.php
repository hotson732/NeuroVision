<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash; // <--- Importante para la seguridad

class UserController extends Controller
{
    public function store(StoreUserRequest $request)
    {
        // 1. Validar datos (Laravel lo hace automático con StoreUserRequest)
        $validated = $request->validated();

        // 2. Encriptar contraseña MANUALMENTE
        $validated['password'] = Hash::make($validated['password']);

        try {
            // 3. Crear usuario en la BD
            $user = User::create($validated);

            // 4. Retornar éxito
            return response()->json([
                'message' => 'Usuario registrado exitosamente',
                'user' => $user
            ], 201);

        } catch (\Exception $e) {
            // Esto nos dirá si hay un error de conexión
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}