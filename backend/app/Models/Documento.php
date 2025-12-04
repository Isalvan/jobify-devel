<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentoArchivos extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'documento_archivos';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'aplicacion_id',
        'tipo',
        'ruta_archivo',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        // 'tipo' => DocumentoTipoEnum::class, // Example if you define a PHP enum for 'tipo'
    ];

    /**
     * Get the application that owns the document file.
     */
    public function aplicacion(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Aplicacion::class, 'aplicacion_id');
    }
}
