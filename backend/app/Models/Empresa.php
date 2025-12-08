<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     title="Empresa",
 *     description="Empresa model",
 *     @OA\Xml(
 *         name="Empresa"
 *     ),
 *     @OA\Property(
 *         property="id",
 *         type="integer",
 *         format="int64",
 *         description="ID de la empresa",
 *         readOnly="true"
 *     ),
 *     @OA\Property(
 *         property="usuario_id",
 *         type="integer",
 *         format="int64",
 *         description="ID del usuario asociado a la empresa"
 *     ),
 *     @OA\Property(
 *         property="descripcion",
 *         type="string",
 *         description="Descripción de la empresa"
 *     ),
 *     @OA\Property(
 *         property="sector",
 *         type="string",
 *         description="Sector de la empresa"
 *     ),
 *     @OA\Property(
 *         property="tamano_empresa",
 *         type="string",
 *         description="Tamaño de la empresa (e.g., 'Pequeña', 'Mediana', 'Grande')"
 *     ),
 *     @OA\Property(
 *         property="ubicacion",
 *         type="string",
 *         description="Ubicación de la empresa"
 *     ),
 *     @OA\Property(
 *         property="web",
 *         type="string",
 *         format="url",
 *         description="Sitio web de la empresa"
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
class Empresa extends Model
{
    /** @use HasFactory<\Database\Factories\EmpresaFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'usuario_id',
        'descripcion',
        'sector',
        'tamano_empresa',
        'ubicacion',
        'web',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tamano_empresa' => 'string',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    public function trabajos()
    {
        return $this->hasMany(Trabajo::class);
    }

    public function empleados()
    {
        return $this->hasMany(Empleado::class);
    }
}
