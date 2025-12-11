<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="Valoracion",
 *     title="Valoracion",
 *     description="Valoracion model",
 *     @OA\Property(
 *         property="id",
 *         type="integer",
 *         description="ID de la valoración",
 *         readOnly=true
 *     ),
 *     @OA\Property(
 *         property="trabajo_id",
 *         type="integer",
 *         description="ID del trabajo al que pertenece la valoración",
 *         example=1
 *     ),
 *     @OA\Property(
 *         property="candidato_id",
 *         type="integer",
 *         description="ID del candidato que recibió la valoración",
 *         example=1
 *     ),
 *     @OA\Property(
 *         property="puntuacion",
 *         type="integer",
 *         description="Puntuación de la valoración (ej. 1-5)",
 *         example=4
 *     ),
 *     @OA\Property(
 *         property="comentario",
 *         type="string",
 *         description="Comentario adicional sobre la valoración",
 *         example="Buen desempeño y actitud proactiva."
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         type="string",
 *         format="date-time",
 *         description="Fecha y hora de creación",
 *         readOnly=true
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         type="string",
 *         format="date-time",
 *         description="Última fecha y hora de actualización",
 *         readOnly=true
 *     )
 * )
 */
class Valoracion extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $fillable = [
        'trabajo_id',
        'candidato_id',
        'puntuacion',
        'comentario',
    ];

    public function trabajo()
    {
        return $this->belongsTo(Trabajo::class);
    }

    public function candidato()
    {
        return $this->belongsTo(Candidato::class);
    }
}
