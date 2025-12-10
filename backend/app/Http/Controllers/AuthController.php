<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str; // ← AÑADE ESTA LÍNEA

class AuthController extends Controller
{
    public function login(Request $request)
    {
        
        $request->validate([
            'correo_electronico' => 'required|email',
            'contrasena' => 'required|string'
        ]);

        $user = User::where('correo_electronico', $request->correo_electronico)->first();

        if (!$user || !Hash::check($request->contrasena, $user->hash_contrasena)) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'nombre' => $user->nombre,
                'correo_electronico' => $user->correo_electronico,
            ]
        ]);
    }

    // Register
    public function register(Request $request)
    {
        $validated = $request->validate([
            // Datos personales
            'nombre' => 'required|string|max:150',
            'apellido' => 'required|string|max:150',

            // Dirección (opcional adaptar)
            'pais' => 'nullable|string|max:100',
            'direccion' => 'nullable|string|max:255',
            'ciudad' => 'nullable|string|max:100',
            'estado' => 'nullable|string|max:100',
            'codigo_postal' => 'nullable|string|max:20',

            // Identificación
            'numero_licencia' => 'required|string|max:100|unique:usuarios,numero_licencia',
            'email' => 'required|email|unique:usuarios,correo_electronico',

            // Perfil
            'usuario' => 'required|string|max:100|unique:usuarios,nombre_usuario',
            'contrasena' => 'required|string|min:8|confirmed',

            // Términos
            'aceptar_terminos' => 'required|accepted'
        ]);

        $id_usuario = (string) Str::uuid();

        $user = User::create([
            'id_usuario' => $id_usuario,
            'nombre_usuario' => $validated['usuario'],
            'correo_electronico' => $validated['email'],
            'hash_contrasena' => Hash::make($validated['contrasena']),
            'nombre' => $validated['nombre'],
            'apellido' => $validated['apellido'],
            'rol' => $request->input('rol', 'user'),
            'numero_licencia' => $validated['numero_licencia'],
            'esta_activo' => 1,

            // campos opcionales (si los envías)
            'pais' => $request->input('pais'),
            'direccion' => $request->input('direccion'),
            'ciudad' => $request->input('ciudad'),
            'estado' => $request->input('estado'),
            'codigo_postal' => $request->input('codigo_postal'),
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => [
                'id_usuario' => $user->id_usuario,
                'nombre_usuario' => $user->nombre_usuario,
                'correo_electronico' => $user->correo_electronico
            ]
        ], 201);
    }

    public function checkAvailability(Request $request)
    {
        $type = $request->query('type');
        $value = $request->query('value');

        if (!$type || !$value) {
            return response()->json(['message' => 'Parámetros inválidos'], 400);
        }

        $available = true;
        $message = 'Disponible';

        switch ($type) {
            case 'usuario':
                $exists = User::where('nombre_usuario', $value)->exists();
                if ($exists) {
                    $available = false;
                    $message = 'Usuario ya en uso';
                }
                break;
            case 'email':
                $exists = User::where('correo_electronico', $value)->exists();
                if ($exists) {
                    $available = false;
                    $message = 'E-mail ya registrado';
                }
                break;
            case 'licencia':
                $exists = User::where('numero_licencia', $value)->exists();
                if ($exists) {
                    $available = false;
                    $message = 'Número de licencia ya registrado';
                }
                break;
            default:
                return response()->json(['message' => 'Tipo no soportado'], 400);
        }

        return response()->json([
            'available' => $available,
            'message' => $message
        ]);
    }
}