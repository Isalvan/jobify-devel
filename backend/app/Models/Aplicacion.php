<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @OA\Schema(
 *     schema="Aplicacion",
 *     title="Aplicacion",
 *     description="Aplicacion model",
 *     @OA\Property(
 *         property="id",
 *         type="integer",
 *         format="int64",
 *         description="ID de la aplicación"
 *     ),
 *     @OA\Property(
 *         property="trabajo_id",
 *         type="integer",
 *         format="int64",
 *         description="ID del trabajo al que se aplica"
 *     ),
 *     @OA\Property(
 *         property="candidato_id",
 *         type="integer",
 *         format="int64",
 *         description="ID del candidato que aplica"
 *     ),
 *     @OA\Property(
 *         property="mensaje",
 *         type="string",
 *         description="Mensaje del candidato al aplicar"
 *     ),
 *     @OA\Property(
 *         property="estado",
 *         type="string",
 *         description="Estado de la aplicación (ej. 'pendiente', 'aceptado', 'rechazado')"
 *     ),
 *     @OA\Property(
 *         property="fecha_aplicacion",
 *         type="string",
 *         format="date-time",
 *         description="Fecha y hora de la aplicación"
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         type="string",
 *         format="date-time",
 *         description="Marca de tiempo de creación"
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         type="string",
 *         format="date-time",
 *         description="Marca de tiempo de la última actualización"
 *     )
 * )
 */
class Aplicacion extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

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

    public function scopePorCandidato($query, $candidatoId)
    {
        return $query->where('candidato_id', $candidatoId);
    }

    public function scopePorEmpresa($query, $empresaId)
    {
        return $query->whereHas('trabajo', function ($q) use ($empresaId) {
            $q->where('empresa_id', $empresaId);
        });
    }
}
