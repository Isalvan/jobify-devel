<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Trabajo extends Model
{
    protected $fillable = [
        'empresa_id',
        'titulo',
        'slug',
        'descripcion',
        'salario',
        'ubicacion',
        'tipo_trabajo',
        'estado',
    ];

    protected $casts = [
        'tipo_trabajo' => 'string',
        'estado' => 'string',
        'salario' => 'decimal:2',
    ];

    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class);
    }
}
