<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     title="Gasto",
 *     description="Gasto model",
 *     @OA\Xml(
 *         name="Gasto"
 *     ),
 *     @OA\Property(
 *         property="id",
 *         type="integer",
 *         format="int64",
 *         description="ID del gasto",
 *         readOnly="true"
 *     ),
 *     @OA\Property(
 *         property="empresa_id",
 *         type="integer",
 *         format="int64",
 *         description="ID de la empresa asociada"
 *     ),
 *     @OA\Property(
 *         property="concepto",
 *         type="string",
 *         description="Concepto del gasto"
 *     ),
 *     @OA\Property(
 *         property="cantidad",
 *         type="number",
 *         format="double",
 *         description="Cantidad del gasto"
 *     ),
 *     @OA\Property(
 *         property="fecha",
 *         type="string",
 *         format="date",
 *         description="Fecha del gasto"
 *     ),
 *     @OA\Property(
 *         property="estado",
 *         type="string",
 *         enum={"PENDIENTE", "PAGADO", "CANCELADO"},
 *         description="Estado del gasto"
 *     ),
 *     @OA\Property(
 *         property="notas",
 *         type="string",
 *         description="Notas adicionales"
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         type="string",
 *         format="date-time",
 *         description="Fecha de creación",
 *         readOnly="true"
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         type="string",
 *         format="date-time",
 *         description="Fecha de última actualización",
 *         readOnly="true"
 *     )
 * )
 */
class Gasto extends Model
{
    use HasFactory;

    protected $fillable = [
        'empresa_id',
        'concepto',
        'cantidad',
        'fecha',
        'estado',
        'notas',
    ];

    protected $casts = [
        'cantidad' => 'decimal:2',
        'fecha' => 'date',
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }
}
