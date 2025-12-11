<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DocumentoArchivo extends Model
{
    use HasFactory;

    protected $fillable = [
        'aplicacion_id',
        'tipo',
        'ruta_archivo',
    ];

    public function aplicacion()
    {
        return $this->belongsTo(Aplicacion::class);
    }
}
