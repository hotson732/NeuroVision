<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PacienteController extends Controller
{
    public function index()
    {
        try {
            $pacientes = Paciente::all();
            
            return response()->json([
                'success' => true,
                'data' => $pacientes,
                'message' => 'Pacientes obtenidos exitosamente'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener pacientes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nombre' => 'required|string|max:100',
                'apellido' => 'required|string|max:100',
                'fecha_nacimiento' => 'required|date',
                'genero' => 'required|string|in:Masculino,Femenino,Otro',
                'numero_historia_clinica' => 'required|string|unique:pacientes,numero_historia_clinica',
                'antecedentes_medicos' => 'nullable|string',
                'creado_por' => 'nullable|uuid' 
            ]);

            // Generar UUID para el paciente
            $validated['id_paciente'] = $request->input('id_paciente', Str::uuid()->toString());
            
            // Establecer fecha de creación
            $validated['fecha_creacion'] = now();

            $paciente = Paciente::create($validated);
            
            return response()->json([
                'success' => true,
                'data' => $paciente,
                'message' => 'Paciente creado exitosamente'
            ], 201);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear paciente',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $paciente = Paciente::find($id);
            
            if (!$paciente) {
                return response()->json([
                    'success' => false,
                    'message' => 'Paciente no encontrado'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => $paciente,
                'message' => 'Paciente obtenido exitosamente'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener paciente',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $paciente = Paciente::find($id);
            
            if (!$paciente) {
                return response()->json([
                    'success' => false,
                    'message' => 'Paciente no encontrado'
                ], 404);
            }

            $validated = $request->validate([
                'nombre' => 'sometimes|string|max:100',
                'apellido' => 'sometimes|string|max:100',
                'fecha_nacimiento' => 'sometimes|date',
                'genero' => 'sometimes|string|in:Masculino,Femenino,Otro',
                'antecedentes_medicos' => 'nullable|string',
                // No permitir cambiar numero_historia_clinica ni creado_por
            ]);

            $paciente->update($validated);
            
            return response()->json([
                'success' => true,
                'data' => $paciente,
                'message' => 'Paciente actualizado exitosamente'
            ]);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar paciente',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $paciente = Paciente::find($id);
            
            if (!$paciente) {
                return response()->json([
                    'success' => false,
                    'message' => 'Paciente no encontrado'
                ], 404);
            }

            $paciente->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Paciente eliminado exitosamente'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar paciente',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function search(Request $request)
    {
        try {
            $query = $request->input('q', '');
            
            $pacientes = Paciente::where('nombre', 'ILIKE', "%{$query}%")
                ->orWhere('apellido', 'ILIKE', "%{$query}%")
                ->orWhere('numero_historia_clinica', 'ILIKE', "%{$query}%")
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $pacientes,
                'message' => 'Búsqueda completada'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la búsqueda',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}