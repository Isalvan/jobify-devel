<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empleado extends Model
{
    protected $table = 'empleados';

    protected $fillable = [
        'usuario_id',
        'empresa_id',
        'apellidos',
        'puesto',
        'fecha_nacimiento',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }
}
