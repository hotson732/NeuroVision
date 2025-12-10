<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('auditoria', function (Blueprint $table) {
            $table->uuid('id_auditoria')->primary();
            $table->uuid('id_usuario');
            $table->string('accion', 100);
            $table->string('tabla_afectada', 50);
            $table->uuid('id_registro_afectado');
            $table->text('valores_anteriores')->nullable();
            $table->text('valores_nuevos')->nullable();
            $table->string('direccion_ip', 45);
            $table->timestamp('fecha_hora')->useCurrent();
            
            $table->foreign('id_usuario')->references('id_usuario')->on('usuarios');
            $table->index('tabla_afectada');
            $table->index('accion');
            $table->index('fecha_hora');
        });
    }

    public function down()
    {
        Schema::dropIfExists('auditoria');
    }
};