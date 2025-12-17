<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;

class GenerarAnalisis extends Controller
{
    
    public function generar(Request $request)
    {
    Log::info('🟢 Entró a generarAnalisis');
        $analisis = [
            $this->analisisRMN1(),
            $this->analisisRMN2(),
            $this->analisisRMN3(),
            $this->analisisRMN4(),
            $this->analisisRMN5(),
            $this->analisisRMN6(),
            $this->analisisRMN7(),
            $this->analisisRMN8(),
        ];
    Log::info('🟡 Texto generado');

        $analisisSeleccionado = Arr::random($analisis);

       $imageBase64 = null;

if ($request->image_url) {
    try {
        $response = Http::withHeaders([
    'User-Agent' => 'Mozilla/5.0',
])->get($request->image_url);

if ($response->successful()) {
    $img = $response->body();
    $imageBase64 = 'data:image/jpeg;base64,' . base64_encode($img);
} else {
    Log::error('❌ Drive respondió error', [
        'status' => $response->status()
    ]);
}Log::info('🟣 Imagen descargada', [
    'bytes' => strlen($img ?? ''),
]);

        $imageBase64 = 'data:image/jpeg;base64,' . base64_encode($img);
    } catch (\Exception $e) {
        $imageBase64 = null;
    }
}


       $data = [
    'paciente' => $request->id_paciente ?? 'N/A',
    'tipo_estudio' => $request->tipo_estudio ?? 'N/A',
    'fecha' => $request->fecha_estudio ?? now()->format('Y-m-d'),
    'notas' => $request->notas_medico ?? 'Sin observaciones',
    'analisis' => $analisisSeleccionado,
    'imagen' => $imageBase64, 
    ];

    Log::info('🟠 Antes de generar PDF');

        $pdf = Pdf::loadView('pdf.analisis', $data);

        
        return $pdf->download('analisis_radiologico.pdf');
    }

private function analisisRMN1()
{
    return <<<TEXT
RESONANCIA MAGNÉTICA CEREBRAL - INFORME DETALLADO

TÉCNICA:
- Estudio realizado en secuencias T1, T2, FLAIR, difusión y contraste con gadolinio
- Cortes axiales, coronales y sagitales

HALLAZGOS:
- Masa intraaxial en lóbulo temporal izquierdo
- Dimensiones: 2.5 x 3.1 x 2.8 cm
- Realce heterogéneo con gadolinio
- Edema vasogénico perilesional moderado
- Efecto de masa mínimo (3 mm de desplazamiento)
- No hay evidencia de sangrado agudo

INTERPRETACIÓN:
Probable astrocitoma grado II-III
Lesión circunscrita sin invasión del sistema ventricular

RECOMENDACIONES:
1. Valoración por neurocirugía
2. Segimiento con RMN en 3 meses
3. Considerar biopsia estereotáxica
TEXT;
}

private function analisisRMN2()
{
    return <<<TEXT
RESONANCIA MAGNÉTICA CEREBRAL CON CONTRASTE

HALLAZGOS:
- Múltiples lesiones hiperintensas en sustancia blanca periventricular
- Localización: áreas frontoparietales bilaterales
- Tamaño: de 3 a 15 mm
- Algunas lesiones realzan con gadolinio (activas)
- Otras sin realce (crónicas)
- Ausencia de efecto de masa significativo
- Ventrículos de tamaño normal

INTERPRETACIÓN:
Hallazgos compatibles con Esclerosis Múltiple
Patrón de lesiones desmielinizantes características

RECOMENDACIONES:
1. Consulta con neurología especializado en EM
2. RMN medular para extensión
3. Potenciales evocados
4. Análisis de LCR
TEXT;
}

private function analisisRMN3()
{
    return <<<TEXT
RMN CEREBRAL - EVALUACIÓN VASCULAR

SECUENCIA ESPECIAL:
- Angio-RMN 3D Time-of-Flight
- Perfusión cerebral

HALLAZGOS:
- Malformación arteriovenosa en región parieto-occipital derecha
- Nido vascular de 2.8 cm
- Arterias aferentes de la arteria cerebral media
- Drenaje venoso hacia el seno sagital superior
- No evidencia de sangrado reciente
- Flujo rápido en secuencias de angio-RMN

INTERPRETACIÓN:
MAV Spetzler-Martin Grado II
Riesgo hemorrágico moderado

RECOMENDACIONES:
1. Valoración por neurocirugía vascular
2. Angiografía cerebral confirmatoria
3. Opciones: microcirugía, radiocirugía o embolización
TEXT;
}

private function analisisRMN4()
{
    return <<<TEXT
RESONANCIA MAGNÉTICA CEREBRAL - ESTUDIO HIPOCAMPAL

SECUENCIAS ESPECIALES:
- Cortes coronales oblicuos paralelos al eje hipocampal
- T2 de alta resolución

HALLAZGOS:
- Esclerosis mesial temporal izquierda
- Atrofia hipocampal marcada
- Hiperintensidad en T2 en hipocampo izquierdo
- Pérdida de la estructura interna
- Lóbulo temporal izquierdo ligeramente más pequeño
- Uncus prominente

INTERPRETACIÓN:
Hallazgos compatibles con Epilepsia del Lóbulo Temporal Mesial
Corteza temporal lateral preservada

RECOMENDACIONES:
1. Evaluación por unidad de epilepsia
2. Video-EEG prolongado
3. Neuropsicología para evaluación de memoria
4. Considerar cirugía resectiva
TEXT;
}

private function analisisRMN5()
{
    return <<<TEXT
RMN CEREBRAL - METÁSTASIS

ESTUDIO COMPLETO CON CONTRASTE:

HALLAZGOS:
- 3 lesiones intraaxiales con realce anular
- Localizaciones: 
  1. Lóbulo frontal derecho (2.1 cm)
  2. Cerebelo izquierdo (1.8 cm)
  3. Ganglios basales izquierdos (1.5 cm)
- Edema vasogénico moderado-severo
- Efecto de masa en 4ª ventrículo
- Realce meníngeo difuso sospechoso

INTERPRETACIÓN:
Metástasis cerebrales múltiples
Posible origen: pulmón, mama o melanoma

RECOMENDACIONES:
1. Búsqueda de tumor primario
2. PET-TAC corporal completo
3. Radiocirugía estereotáxica
4. Tratamiento sistémico oncológico
TEXT;
}

private function analisisRMN6()
{
    return <<<TEXT
RESONANCIA MAGNÉTICA - DEGENERACIÓN CORTICOBASAL

HALLAZGOS:
- Asimetría marcada de ganglios basales
- Atrofia cortical frontoparietal izquierda
- Hiperintensidad en T2 en putamen derecho
- "Signo de la cinta" en sustancia negra
- Pérdida de definición sustancia blanca-gris
- Ventrículos levemente aumentados

INTERPRETACIÓN:
Patrón compatible con Degeneración Corticobasal
Diagnóstico diferencial con Parálisis Supranuclear Progresiva

RECOMENDACIONES:
1. Evaluación por neurología de trastornos del movimiento
2. SPECT cerebral
3. Seguimiento evolutivo
4. Manejo sintomático
TEXT;
}

private function analisisRMN7()
{
    return <<<TEXT
RMN CEREBRAL - ANEURISMA

ANGIO-RMN 3D:

HALLAZGOS:
- Aneurisma sacular en bifurcación de arteria cerebral media derecha
- Tamaño: 7 x 9 mm
- Cuello ancho de 4 mm
- Ausencia de trombosis intraluminal
- No vasoespasmo asociado
- Relación con arterias perforantes preservada

INTERPRETACIÓN:
Aneurisma cerebral no roto
Riesgo de ruptura estimado: 1-2% anual

RECOMENDACIONES:
1. Evaluación por neurocirugía/neurorradiología intervencionista
2. Considerar clipping o embolización
3. Control angiográfico en 6 meses si no se interviene
4. Control de factores de riesgo vascular
TEXT;
}

private function analisisRMN8()
{
    return <<<TEXT
RESONANCIA MAGNÉTICA - ISQUEMIA AGUDA

SECUENCIA DE DIFUSION Y PERFUSIÓN:

HALLAZGOS:
- Restricción a la difusión en territorio de arteria cerebral media izquierda
- Área de penumbra isquémica en secuencia de perfusión
- Mismatch difusión-perfusión de 120%
- Vasos intracraneales permeables
- No lesiones hemorrágicas
- Realce leptomeníngeo sugestivo de inflamación

INTERPRETACIÓN:
Infarto cerebral agudo en evolución
Ventana terapéutica posible

RECOMENDACIONES URGENTES:
1. Valoración inmediata para trombólisis/terapia endovascular
2. Monitorización en unidad de ictus
3. Estudio etiológico completo
4. Ecodoppler de troncos supraaórticos
TEXT;
}

}