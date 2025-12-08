<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     title="DocumentoArchivos",
 *     description="DocumentoArchivos model",
 *     @OA\Xml(
 *         name="DocumentoArchivos"
 *     ),
 *     @OA\Property(
 *         property="id",
 *         type="integer",
 *         format="int64",
 *         description="ID of the document file",
 *         readOnly=true
 *     ),
 *     @OA\Property(
 *         property="aplicacion_id",
 *         type="integer",
 *         format="int64",
 *         description="Foreign key to the application"
 *     ),
 *     @OA\Property(
 *         property="tipo",
 *         type="string",
 *         description="Type of the document file (e.g., 'pdf', 'image', 'word')"
 *     ),
 *     @OA\Property(
 *         property="ruta_archivo",
 *         type="string",
 *         description="Path to the document file"
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         type="string",
 *         format="date-time",
 *         description="Timestamp when the document file was created",
 *         readOnly=true
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         type="string",
 *         format="date-time",
 *         description="Timestamp when the document file was last updated",
 *         readOnly=true
 *     )
 * )
 */
class Documento extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

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
    protected $casts = [];

    /**
     * Get the application that owns the document file.
     */
    public function aplicacion(): BelongsTo
    {
        return $this->belongsTo(Aplicacion::class, 'aplicacion_id');
    }
}
