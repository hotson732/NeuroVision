<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('imagenes_estudio', function (Blueprint $table) {
            $table->uuid('id_imagen')->primary();
            $table->uuid('id_estudio');
            $table->string('nombre_archivo', 255);
            $table->string('formato_imagen', 10);
            $table->string('ruta_imagen', 500);
            $table->timestamp('fecha_creacion')->useCurrent();
            
            $table->foreign('id_estudio')->references('id_estudio')->on('estudios_medicos');
            $table->index('nombre_archivo');
        });
    }

    public function down()
    {
        Schema::dropIfExists('imagenes_estudio');
    }
};