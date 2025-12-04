<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsuarioGestion extends Model
{
    use HasFactory;

    protected $table = 'usuario_gestions';

    protected $fillable = [
        'usuario_id',
        'rol_gestion',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }
}
