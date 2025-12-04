<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Valoracion extends Model
{
    protected $fillable = [
        'trabajo_id',
        'candidato_id',
        'puntuacion',
        'comentario',
    ];
}
