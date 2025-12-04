<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidato extends Model
{
    use HasFactory;

    protected $fillable = [
        'usuario_id',
        'apellidos',
        'fecha_nacimiento',
        'descripcion',
        'ubicacion',
        'url_cv',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }
}
