<?php

namespace Database\Seeders;

use App\Models\Estudio;
use App\Models\Paciente;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EstudiosSeeder extends Seeder
{
    public function run(): void
    {
        // Primero verifica que hay pacientes
        $pacientes = Paciente::all();
        
        if ($pacientes->isEmpty()) {
            $this->command->info('No hay pacientes para crear estudios.');
            return;
        }

        $tiposEstudios = [
            'Hemograma Completo',
            'Radiografía de Tórax',
            'Electrocardiograma',
            'Ecografía Abdominal',
            'Tomografía Computarizada',
            'Resonancia Magnética',
            'Endoscopia',
            'Biopsia',
            'Ultrasonido',
            'Mamografía'
        ];

        $resultados = ['Normal', 'Anormal', 'Pendiente'];
        $medicos = ['Dr. Rodríguez', 'Dra. García', 'Dr. Martínez', 'Dra. López', 'Dr. Pérez'];

        foreach ($pacientes as $paciente) {
            // Crear 1-3 estudios por paciente
            $numEstudios = rand(1, 3);
            
            for ($i = 0; $i < $numEstudios; $i++) {
                Estudio::create([
                    'id_estudio' => Str::uuid()->toString(),
                    'paciente_id' => $paciente->id_paciente,
                    'numero_historia_clinica' => $paciente->numero_historia_clinica,
                    'fecha_estudio' => now()->subDays(rand(1, 90))->format('Y-m-d'),
                    'tipo_estudio' => $tiposEstudios[array_rand($tiposEstudios)],
                    'resultado' => $resultados[array_rand($resultados)],
                    'observaciones' => 'Observaciones del estudio médico realizado.',
                    'medico' => $medicos[array_rand($medicos)],
                    'creado_por' => '00000000-0000-0000-0000-000000000000'
                ]);
            }
        }

        $this->command->info('Estudios creados exitosamente.');
    }
}