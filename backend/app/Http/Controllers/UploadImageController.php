<?php
// app/Http/Controllers/Api/UploadImageController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Google\Client;
use Google\Service\Drive;
use Illuminate\Support\Str;

class UploadImageController extends Controller
{
    public function upload(Request $request)
    {
        // 1. Validar los datos que vienen del frontend
        $validated = $request->validate([
            'id_paciente' => 'required|uuid',
            'nombre_paciente' => 'required|string',
            'tipo_estudio' => 'required|string',
            'fecha_estudio' => 'required|date',
            'notas_medico' => 'nullable|string',
            'image' => 'required|file|mimes:jpeg,png,jpg,dcm|max:51200', // Máximo ~50MB
        ]);

        try {
            // 2. Subir la imagen a Google Drive
            $uploadedFile = $request->file('image');
            $originalName = $uploadedFile->getClientOriginalName();
            $fileName = 'neurovision_' . time() . '_' . $originalName;
            $mimeType = $uploadedFile->getMimeType();

            // 2.1. Configurar el cliente de Google usando los datos de tu .env
            $client = new Client();
            $client->setClientId(env('GOOGLE_DRIVE_CLIENT_ID'));
            $client->setClientSecret(env('GOOGLE_DRIVE_CLIENT_SECRET'));
            
            // Usar el refresh token para obtener un nuevo access token
            $client->refreshToken(env('GOOGLE_DRIVE_REFRESH_TOKEN'));
            
            // Si guardaste un access token y aún es válido, también podrías usarlo:
            // $client->setAccessToken(env('GOOGLE_DRIVE_ACCESS_TOKEN'));
            
            $client->addScope(Drive::DRIVE_FILE);

            $driveService = new Drive($client);

            // 2.2. Preparar los metadatos del archivo (nombre, carpeta destino)
            $fileMetadata = new Drive\DriveFile([
                'name' => $fileName,
                'parents' => [env('GOOGLE_DRIVE_FOLDER')] // 'imagenes_neurovision'
            ]);

            // 2.3. Subir el contenido del archivo
            $content = file_get_contents($uploadedFile->getRealPath());
            
            $file = $driveService->files->create($fileMetadata, [
                'data' => $content,
                'mimeType' => $mimeType,
                'uploadType' => 'multipart', // Para archivos pequeños/medianos
                'fields' => 'id, name, webViewLink'
            ]);

            // 3. Crear un registro en tu base de datos (tabla 'estudios')
            // Ajusta esto según tu modelo Estudio
            $estudio = \App\Models\Estudio::create([
                'id_estudio' => Str::uuid(),
                'id_paciente' => $validated['id_paciente'],
                'nombre_paciente' => $validated['nombre_paciente'],
                'tipo_estudio' => $validated['tipo_estudio'],
                'fecha_estudio' => $validated['fecha_estudio'],
                'notas_medico' => $validated['notas_medico'],
                'ruta_imagen_drive' => $file->webViewLink, // URL pública de Drive
                'drive_file_id' => $file->id, // ID interno de Drive
                'nombre_archivo' => $fileName,
                'estado' => 'subido',
                'creado_por' => 'system', // Aquí deberías obtener el ID del usuario logueado
            ]);

            // 4. Responder al frontend con éxito
            return response()->json([
                'success' => true,
                'message' => '✅ Imagen subida exitosamente',
                'data' => [
                    'estudio' => $estudio,
                    'drive_file' => [
                        'id' => $file->id,
                        'name' => $file->name,
                        'url' => $file->webViewLink
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            // 5. Manejar cualquier error
            return response()->json([
                'success' => false,
                'message' => '❌ Error al subir la imagen',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
