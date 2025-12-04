<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    /** @use HasFactory<\Database\Factories\EmpresaFactory> */
    use HasFactory;

    protected $fillable = [
        'usuario_id',
        'descripcion',
        'sector',
        'tamano_empresa',
        'ubicacion',
        'web',
    ];

    protected $casts = [
        'tamano_empresa' => 'string',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }
}
