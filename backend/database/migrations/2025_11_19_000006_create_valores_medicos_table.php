<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('valores_medicos', function (Blueprint $table) {
            $table->uuid('id_valor_medico')->primary();
            $table->uuid('id_estudio');
            $table->string('nombre_parametro', 100);
            $table->decimal('valor_parametro', 10, 4);
            $table->string('unidad_medida', 20);
            $table->timestamp('fecha_medicion');
            $table->uuid('creado_por');
            
            $table->foreign('id_estudio')->references('id_estudio')->on('estudios_medicos');
            $table->foreign('creado_por')->references('id_usuario')->on('usuarios');
            $table->index('nombre_parametro');
            $table->index('fecha_medicion');
        });
    }

    public function down()
    {
        Schema::dropIfExists('valores_medicos');
    }
};