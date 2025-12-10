<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('pacientes', function (Blueprint $table) {
            $table->uuid('id_paciente')->primary();
            $table->string('nombre', 100);
            $table->string('apellido', 100);
            $table->date('fecha_nacimiento');
            $table->string('genero', 20);
            $table->string('numero_historia_clinica', 50)->unique();
            $table->text('antecedentes_medicos')->nullable();
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->uuid('creado_por');
            
            $table->foreign('creado_por')->references('id_usuario')->on('usuarios');
            $table->index(['nombre', 'apellido']);
            $table->index('numero_historia_clinica');
        });
    }

    public function down()
    {
        Schema::dropIfExists('pacientes');
    }
};