<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->uuid('id_usuario')->primary();
            $table->string('nombre_usuario', 50)->unique();
            $table->string('correo_electronico', 100)->unique();
            $table->string('hash_contrasena', 255);
            $table->string('nombre', 100);
            $table->string('apellido', 100);
            $table->string('rol', 50);
            $table->string('numero_licencia', 100)->nullable();
            $table->boolean('esta_activo')->default(true);
            $table->timestamps();
            
            $table->index('rol');
        });
    }

    public function down()
    {
        Schema::dropIfExists('usuarios');
    }
};