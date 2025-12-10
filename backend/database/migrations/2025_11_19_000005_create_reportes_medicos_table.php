<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('reportes_medicos', function (Blueprint $table) {
            $table->uuid('id_reporte')->primary();
            $table->uuid('id_estudio');
            $table->string('titulo_reporte', 200);
            $table->text('contenido_reporte');
            $table->string('firma_medico', 255)->nullable();
            $table->timestamp('fecha_aprobacion')->nullable();
            $table->string('ruta_pdf', 500)->nullable();
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->uuid('creado_por');
            
            $table->foreign('id_estudio')->references('id_estudio')->on('estudios_medicos');
            $table->foreign('creado_por')->references('id_usuario')->on('usuarios');
            $table->index('titulo_reporte');
            $table->index('fecha_aprobacion');
        });
    }

    public function down()
    {
        Schema::dropIfExists('reportes_medicos');
    }
};