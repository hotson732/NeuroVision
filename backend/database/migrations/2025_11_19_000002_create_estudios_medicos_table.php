<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('estudios_medicos', function (Blueprint $table) {
            $table->uuid('id_estudio')->primary();
            $table->uuid('id_paciente');
            $table->string('tipo_estudio', 50);
            $table->timestamp('fecha_estudio');
            $table->string('medico_referente', 100)->nullable();
            $table->text('descripcion_estudio')->nullable();
            $table->string('ruta_imagen_original', 500)->nullable();
            $table->string('estado', 50)->default('pendiente');
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->uuid('creado_por');
            
            $table->foreign('id_paciente')->references('id_paciente')->on('pacientes');
            $table->foreign('creado_por')->references('id_usuario')->on('usuarios');
            $table->index('tipo_estudio');
            $table->index('estado');
            $table->index('fecha_estudio');
        });
    }

    public function down()
    {
        Schema::dropIfExists('estudios_medicos');
    }
};