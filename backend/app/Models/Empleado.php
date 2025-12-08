<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     title="Empleado",
 *     description="Modelo de Empleado",
 *     @OA\Xml(
 *         name="Empleado"
 *     ),
 *     @OA\Property(
 *         property="id",
 *         title="ID",
 *         description="ID del empleado",
 *         format="int64",
 *         readOnly=true,
 *         example=1
 *     ),
 *     @OA\Property(
 *         property="usuario_id",
 *         title="Usuario ID",
 *         description="ID del usuario asociado",
 *         format="int64",
 *         example=101
 *     ),
 *     @OA\Property(
 *         property="empresa_id",
 *         title="Empresa ID",
 *         description="ID de la empresa asociada",
 *         format="int64",
 *         example=201
 *     ),
 *     @OA\Property(
 *         property="apellidos",
 *         title="Apellidos",
 *         description="Apellidos del empleado",
 *         example="García Pérez"
 *     ),
 *     @OA\Property(
 *         property="puesto",
 *         title="Puesto",
 *         description="Puesto de trabajo del empleado",
 *         example="Desarrollador Senior"
 *     ),
 *     @OA\Property(
 *         property="fecha_nacimiento",
 *         title="Fecha de Nacimiento",
 *         description="Fecha de nacimiento del empleado",
 *         format="date",
 *         example="1990-05-15"
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         title="Fecha de Creación",
 *         description="Fecha y hora de creación del registro",
 *         format="date-time",
 *         readOnly=true,
 *         example="2023-01-01T12:00:00Z"
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         title="Fecha de Actualización",
 *         description="Fecha y hora de la última actualización del registro",
 *         format="date-time",
 *         readOnly=true,
 *         example="2023-01-01T13:00:00Z"
 *     )
 * )
 */
class Empleado extends Model
{
    use HasFactory;
    protected $table = 'empleados';

    protected $fillable = [
        'usuario_id',
        'empresa_id',
        'apellidos',
        'puesto',
        'fecha_nacimiento',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }
}
