<?php

namespace App\Http\Controllers;

use App\Models\Estudio;
use App\Models\Paciente;
use App\Models\ImagenEstudio;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Google\Client as GoogleClient;
use Google\Service\Drive as GoogleDrive;

class EstudioController extends Controller
{
    /**
     * Subir imagen a Google Drive y crear estudio
     */
    public function uploadImage(Request $request)
{
    try {
        Log::info('=== INICIO UPLOAD IMAGEN ===');
        Log::info('Datos recibidos:', $request->except(['image']));

        // Validar los datos
        $validator = Validator::make($request->all(), [
            'image' => 'required|file|mimes:jpeg,png,jpg,bmp,dcm|max:51200',
            'id_paciente' => 'required|uuid|exists:pacientes,id_paciente',
            'tipo_estudio' => 'required|string|max:50',
            'fecha_estudio' => 'required|date',
            'notas_medico' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            Log::error('Validación fallida:', $validator->errors()->toArray());
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verificar si el paciente existe
        $paciente = Paciente::where('id_paciente', $request->id_paciente)->first();
        if (!$paciente) {
            Log::error('Paciente no encontrado: ' . $request->id_paciente);
            return response()->json([
                'success' => false,
                'message' => 'Paciente no encontrado'
            ], 404);
        }

        // VERIFICAR QUE EL USUARIO SISTEMA EXISTA
        $usuarioSistema = \App\Models\User::where('id_usuario', '00000000-0000-0000-0000-000000000000')->first();
        
        if (!$usuarioSistema) {
            Log::error('Usuario sistema no encontrado');
            // Crear usuario sistema si no existe
            $usuarioSistema = \App\Models\User::create([
                'id_usuario' => '00000000-0000-0000-0000-000000000000',
                'nombre' => 'Sistema NeuroVision',
                'email' => 'sistema@neurovision.com',
                'password' => bcrypt('sistema_password'),
                'rol' => 'sistema',
                'fecha_creacion' => now()
            ]);
            Log::info('Usuario sistema creado automáticamente');
        }

        Log::info('Paciente encontrado: ' . $paciente->nombre . ' ' . $paciente->apellido);
        Log::info('Usuario creador: ' . $usuarioSistema->nombre);

        // 1. Subir la imagen a Google Drive
        $file = $request->file('image');
        $originalName = $file->getClientOriginalName();
        $fileName = 'neurovision_' . time() . '_' . $originalName;
        
        Log::info('Subiendo a Google Drive: ' . $fileName);
        $driveInfo = $this->uploadToGoogleDrive($file, $fileName);
        
        if (!isset($driveInfo['id'])) {
            throw new \Exception('No se pudo subir la imagen a Google Drive');
        }
        
        Log::info('Google Drive upload exitoso. ID: ' . $driveInfo['id']);

        // 2. Crear el estudio
        $estudioData = [
            'id_estudio' => Str::uuid(),
            'id_paciente' => $request->id_paciente,
            'tipo_estudio' => $request->tipo_estudio,
            'fecha_estudio' => $request->fecha_estudio,
            'descripcion_estudio' => $request->notas_medico ?? '',
            'ruta_imagen_original' => $driveInfo['webViewLink'] ?? '',
            'estado' => 'pendiente',
            'fecha_creacion' => now(),
            'creado_por' => $usuarioSistema->id_usuario // Usar el ID verificado
        ];

        Log::info('Creando estudio con datos:', $estudioData);

        // Crear estudio usando DB::insert para evitar problemas con Eloquent
        DB::table('estudios_medicos')->insert($estudioData);
        
        // Obtener el estudio creado
        $estudio = DB::table('estudios_medicos')
            ->where('id_estudio', $estudioData['id_estudio'])
            ->first();

        Log::info('Estudio creado exitosamente. ID: ' . $estudio->id_estudio);

        // 3. Guardar información de la imagen
        

        Log::info('=== FIN UPLOAD EXITOSO ===');

        return response()->json([
            'success' => true,
            'message' => '✅ Imagen subida exitosamente',
            'data' => [
                'estudio_id' => $estudio->id_estudio,
                'paciente' => [
                    'id' => $paciente->id_paciente,
                    'nombre_completo' => $paciente->nombre . ' ' . $paciente->apellido
                ],
                'preview_url' => $driveInfo['webContentLink'] ?? '',
                'drive_info' => [
                    'id' => $driveInfo['id'],
                    'name' => $driveInfo['name'],
                    'url' => $driveInfo['webViewLink']
                ],
                'usuario_creador' => $usuarioSistema->nombre
            ]
        ], 201);

    } catch (\Exception $e) {
        Log::error('ERROR en uploadImage: ' . $e->getMessage());
        Log::error('Trace: ' . $e->getTraceAsString());
        
        return response()->json([
            'success' => false,
            'message' => '❌ Error al subir la imagen: ' . $e->getMessage()
        ], 500);
    }
}

    /**
     * Método para subir archivos a Google Drive
     */
    private function uploadToGoogleDrive($file, $fileName)
    {
        try {
            $client = new GoogleClient();
            
            // Configurar credenciales desde .env
            $client->setClientId(env('GOOGLE_DRIVE_CLIENT_ID'));
            $client->setClientSecret(env('GOOGLE_DRIVE_CLIENT_SECRET'));
            $client->setRedirectUri(env('GOOGLE_REDIRECT_URI', 'http://localhost:8000/google/callback'));
            
            $refreshToken = env('GOOGLE_DRIVE_REFRESH_TOKEN');
            if (!$refreshToken) {
                throw new \Exception('Refresh token no configurado en .env');
            }
            
            $client->refreshToken($refreshToken);
            
            $client->addScope(GoogleDrive::DRIVE_FILE);
            $client->setAccessType('offline');

            $driveService = new GoogleDrive($client);

            // OBTENER EL ID DE CARPETA DESDE .env
            $folderId = env('GOOGLE_DRIVE_FOLDER');
            
            Log::info('Intentando subir a carpeta con ID: ' . $folderId);
            
            // Metadatos del archivo con la carpeta correcta
            $fileMetadata = new GoogleDrive\DriveFile([
                'name' => $fileName,
                'parents' => [$folderId],
                'description' => 'Imagen médica subida desde NeuroVision'
            ]);

            // Contenido del archivo
            $content = file_get_contents($file->getRealPath());
            
            // Subir archivo
            $uploadedFile = $driveService->files->create($fileMetadata, [
                'data' => $content,
                'mimeType' => $file->getMimeType(),
                'uploadType' => 'multipart',
                'fields' => 'id, name, webViewLink, webContentLink, size'
            ]);

            Log::info('Archivo subido exitosamente. ID: ' . $uploadedFile->getId());

            // Hacer el archivo públicamente accesible para vista previa
            $permission = new GoogleDrive\Permission([
                'type' => 'anyone',
                'role' => 'reader'
            ]);
            
            $driveService->permissions->create($uploadedFile->getId(), $permission);

            return [
                'id' => $uploadedFile->getId(),
                'name' => $uploadedFile->getName(),
                'webViewLink' => $uploadedFile->getWebViewLink(),
                'webContentLink' => $uploadedFile->getWebContentLink(),
                'size' => $uploadedFile->getSize() ?? $file->getSize()
            ];

        } catch (\Exception $e) {
            Log::error('Error Google Drive detallado: ' . $e->getMessage());
            throw new \Exception('Error al subir a Google Drive: ' . $e->getMessage());
        }
    }

    /**
     * Obtener todos los estudios
     */
    public function index()
    {
        try {
            $estudios = Estudio::with('paciente')->get();
            
            return response()->json([
                'success' => true,
                'data' => $estudios,
                'message' => 'Estudios obtenidos exitosamente'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error en index: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estudios'
            ], 500);
        }
    }

    /**
     * Obtener un estudio específico
     */
    public function show($id)
    {
        try {
            $estudio = Estudio::with('paciente')->find($id);
            
            if (!$estudio) {
                return response()->json([
                    'success' => false,
                    'message' => 'Estudio no encontrado'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => $estudio,
                'message' => 'Estudio obtenido exitosamente'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error en show: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estudio'
            ], 500);
        }
    }

    /**
     * Crear un nuevo estudio (sin imagen)
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'id_paciente' => 'required|uuid',
                'tipo_estudio' => 'required|string|max:50',
                'fecha_estudio' => 'required|date',
                'medico_referente' => 'nullable|string|max:100',
                'descripcion_estudio' => 'nullable|string',
                'ruta_imagen_original' => 'nullable|string|max:500',
                'estado' => 'string|in:pendiente,procesando,completado,anormal',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $estudio = Estudio::create([
                'id_estudio' => Str::uuid(),
                'id_paciente' => $request->id_paciente,
                'tipo_estudio' => $request->tipo_estudio,
                'fecha_estudio' => $request->fecha_estudio,
                'medico_referente' => $request->medico_referente,
                'descripcion_estudio' => $request->descripcion_estudio,
                'ruta_imagen_original' => $request->ruta_imagen_original,
                'estado' => $request->estado ?? 'pendiente',
                'fecha_creacion' => now(),
                'creado_por' => $request->user() ? $request->user()->id : '00000000-0000-0000-0000-000000000000'
            ]);
            
            return response()->json([
                'success' => true,
                'data' => $estudio,
                'message' => 'Estudio creado exitosamente'
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('Error en store: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al crear estudio: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar un estudio
     */
    public function update(Request $request, $id)
    {
        try {
            $estudio = Estudio::find($id);
            
            if (!$estudio) {
                return response()->json([
                    'success' => false,
                    'message' => 'Estudio no encontrado'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'tipo_estudio' => 'sometimes|string|max:50',
                'fecha_estudio' => 'sometimes|date',
                'medico_referente' => 'nullable|string|max:100',
                'descripcion_estudio' => 'nullable|string',
                'ruta_imagen_original' => 'nullable|string|max:500',
                'estado' => 'sometimes|string|in:pendiente,procesando,completado,anormal',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $estudio->update($validator->validated());
            
            return response()->json([
                'success' => true,
                'data' => $estudio,
                'message' => 'Estudio actualizado exitosamente'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error en update: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar estudio: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar un estudio
     */
    public function destroy($id)
    {
        try {
            $estudio = Estudio::find($id);
            
            if (!$estudio) {
                return response()->json([
                    'success' => false,
                    'message' => 'Estudio no encontrado'
                ], 404);
            }

            $estudio->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Estudio eliminado exitosamente'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error en destroy: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar estudio: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener vista previa de imagen desde Google Drive
     */
    public function getImagePreview($fileId)
    {
        try {
            $client = new GoogleClient();
            $client->setClientId(env('GOOGLE_DRIVE_CLIENT_ID'));
            $client->setClientSecret(env('GOOGLE_DRIVE_CLIENT_SECRET'));
            
            $refreshToken = env('GOOGLE_DRIVE_REFRESH_TOKEN');
            if (!$refreshToken) {
                return response()->json([
                    'success' => false,
                    'message' => 'Refresh token no configurado'
                ], 500);
            }
            
            $client->refreshToken($refreshToken);
            $client->addScope(GoogleDrive::DRIVE_READONLY);

            $driveService = new GoogleDrive($client);
            
            $file = $driveService->files->get($fileId, ['fields' => 'webContentLink, thumbnailLink']);
            
            return response()->json([
                'success' => true,
                'preview_url' => $file->webContentLink ?? $file->thumbnailLink
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error en getImagePreview: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error obteniendo vista previa'
            ], 500);
        }
    }
}