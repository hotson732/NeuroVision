<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: DejaVu Sans, sans-serif; }
        .container { display: table; width: 100%; }
        .left, .right { display: table-cell; vertical-align: top; padding: 10px; }
        .left { width: 45%; }
        .right { width: 55%; }
        img { max-width: 100%; border: 1px solid #ccc; }
        h2 { margin-top: 0; }
        pre { white-space: pre-wrap; font-size: 12px; }
    </style>
</head>
<body>

<div class="container">
    <div class="left">
        <h3>Imagen del Estudio</h3>
        @if($imagen)
            <img src="{{ $imagen }}">
        @else
            <p>Sin imagen</p>
        @endif
    </div>

    <div class="right">
        <h2>Datos del Estudio</h2>
        <p><strong>Paciente:</strong> {{ $paciente }}</p>
        <p><strong>Tipo:</strong> {{ $tipo_estudio }}</p>
        <p><strong>Fecha:</strong> {{ $fecha }}</p>
        <p><strong>Notas:</strong> {{ $notas }}</p>

        <hr>

        <h2>Análisis Radiológico</h2>
        <pre>{{ $analisis }}</pre>
    </div>
</div>

</body>
</html>
