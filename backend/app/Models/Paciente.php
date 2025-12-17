<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    use HasFactory;

    protected $table = 'pacientes';
    protected $primaryKey = 'id_paciente';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'id_paciente',
        'nombre',
        'apellido',
        'fecha_nacimiento',
        'genero',
        'numero_historia_clinica',
        'antecedentes_medicos',
        'fecha_creacion',
        'creado_por'
    ];

    protected $casts = [
        'fecha_nacimiento' => 'date',
        'fecha_creacion' => 'datetime',
    ];
}
