<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Estudio extends Model
{
    protected $table = 'estudios_medicos';
    
    // IMPORTANTE: Deshabilitar timestamps de Laravel
    public $timestamps = false;
    
    protected $fillable = [
        'id_estudio',
        'id_paciente',
        'tipo_estudio',
        'fecha_estudio',
        'medico_referente',
        'descripcion_estudio',
        'ruta_imagen_original',
        'estado',
        'fecha_creacion',
        'creado_por'
    ];
    
    protected $primaryKey = 'id_estudio';
    public $incrementing = false;
    protected $keyType = 'string';
    
    // Casts para los campos
    protected $casts = [
        'fecha_estudio' => 'datetime',
        'fecha_creacion' => 'datetime',
    ];
    
    // Relación con paciente
    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'id_paciente', 'id_paciente');
    }
}