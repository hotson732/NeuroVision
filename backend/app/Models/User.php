<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; 

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'usuarios';
    protected $primaryKey = 'id_usuario';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id_usuario',
        'nombre_usuario',
        'correo_electronico',
        'hash_contrasena',
        'nombre',
        'apellido',
        'rol',
        'numero_licencia',
        'esta_activo'
    ];

    protected $hidden = [
        'hash_contrasena',
        'remember_token'
    ];

    public function getAuthPassword()
{
    return $this->hash_contrasena;
}

}
