<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('diagnosticos', function (Blueprint $table) {
            $table->uuid('id_diagnostico')->primary();
            $table->uuid('id_estudio');
            $table->text('descripcion_diagnostico');
            $table->text('hallazgos_principales')->nullable();
            $table->text('observaciones_medicas')->nullable();
            $table->timestamp('fecha_diagnostico')->useCurrent();
            $table->uuid('diagnosticado_por');
            
            $table->foreign('id_estudio')->references('id_estudio')->on('estudios_medicos');
            $table->foreign('diagnosticado_por')->references('id_usuario')->on('usuarios');
            $table->index('fecha_diagnostico');
        });
    }

    public function down()
    {
        Schema::dropIfExists('diagnosticos');
    }
};