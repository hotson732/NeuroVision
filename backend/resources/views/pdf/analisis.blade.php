<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Análisis Radiológico</title>

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
        }
        h1 {
            text-align: center;
            margin-bottom: 20px;
        }
        .section {
            margin-bottom: 15px;
        }
        .label {
            font-weight: bold;
        }
        pre {
            white-space: pre-wrap;
        }
    </style>
</head>
<body>

    <h1>ANÁLISIS RADIOLÓGICO</h1>

    <div class="section">
        <span class="label">Paciente:</span> {{ $paciente }}
    </div>

    <div class="section">
        <span class="label">Tipo de estudio:</span> {{ $tipo_estudio }}
    </div>
@if($imagen)
    <div class="imagen">
        <p><strong>Imagen del estudio</strong></p>
        <img src="{{ $imagen }}">
    </div>
@endif
    <div class="section">
        <span class="label">Fecha:</span> {{ $fecha }}
    </div>

    <div class="section">
        <span class="label">Notas médicas:</span><br>
        {{ $notas }}
    </div>

    <hr>

    <div class="section">
        <span class="label">Informe:</span>
        <pre>{{ $analisis }}</pre>
