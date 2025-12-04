<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Aplicacion extends Model
{
    protected $fillable = [
        'trabajo_id',
        'candidato_id',
        'mensaje',
        'estado',
    ];

    protected $casts = [
        'estado' => 'string',
        'fecha_aplicacion' => 'datetime',
    ];

    public function trabajo(): BelongsTo
    {
        return $this->belongsTo(Trabajo::class);
    }

    public function candidato(): BelongsTo
    {
        return $this->belongsTo(Candidato::class);
    }
}
