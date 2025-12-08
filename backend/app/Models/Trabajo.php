<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     title="Trabajo",
 *     description="Modelo de Trabajo",
 *     @OA\Xml(
 *         name="Trabajo"
 *     ),
 *     @OA\Property(
 *         property="id",
 *         title="ID",
 *         description="ID del trabajo",
 *         format="int64",
 *         readOnly=true,
 *         example=1
 *     ),
 *     @OA\Property(
 *         property="empresa_id",
 *         title="Empresa ID",
 *         description="ID de la empresa a la que pertenece el trabajo",
 *         format="int64",
 *         example=1
 *     ),
 *     @OA\Property(
 *         property="titulo",
 *         title="Título",
 *         description="Título del trabajo",
 *         example="Desarrollador Full Stack"
 *     ),
 *     @OA\Property(
 *         property="slug",
 *         title="Slug",
 *         description="Slug único para el trabajo",
 *         example="desarrollador-full-stack"
 *     ),
 *     @OA\Property(
 *         property="descripcion",
 *         title="Descripción",
 *         description="Descripción detallada del trabajo",
 *         example="Buscamos un desarrollador con experiencia en Laravel y Vue.js."
 *     ),
 *     @OA\Property(
 *         property="salario",
 *         title="Salario",
 *         description="Salario ofrecido para el trabajo",
 *         format="float",
 *         example=3000.50
 *     ),
 *     @OA\Property(
 *         property="ubicacion",
 *         title="Ubicación",
 *         description="Ubicación del trabajo",
 *         example="Remoto"
 *     ),
 *     @OA\Property(
 *         property="tipo_trabajo",
 *         title="Tipo de Trabajo",
 *         description="Tipo de trabajo (e.g., tiempo completo, medio tiempo)",
 *         enum={"Tiempo Completo", "Medio Tiempo", "Freelance", "Temporal"},
 *         example="Tiempo Completo"
 *     ),
 *     @OA\Property(
 *         property="estado",
 *         title="Estado",
 *         description="Estado del trabajo (e.g., publicado, borrador, archivado)",
 *         enum={"publicado", "borrador", "archivado"},
 *         example="publicado"
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         title="Created At",
 *         description="Fecha de creación",
 *         format="date-time",
 *         readOnly=true
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         title="Updated At",
 *         description="Fecha de actualización",
 *         format="date-time",
 *         readOnly=true
 *     )
 * )
 */
class Trabajo extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

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

    /**
     * Relación con la empresa a la que pertenece el trabajo.
     * @return BelongsTo
     */
    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class);
    }

    public function aplicaciones()
    {
        return $this->hasMany(Aplicacion::class);
    }

    public function valoraciones()
    {
        return $this->hasMany(Valoracion::class);
    }

    public function categorias()
    {
        return $this->belongsToMany(Categoria::class, 'trabajo__categorias', 'trabajo_id', 'categoria_id');
    }

    public function scopeActiva($query)
    {
        return $query->where('estado', 'publicado');
    }

    public function scopePorEmpresa($query, $empresaId)
    {
        return $query->where('empresa_id', $empresaId);
    }

    protected static function booted()
    {
        static::creating(function ($trabajo) {
            $trabajo->slug = Str::slug($trabajo->titulo) . '-' . uniqid();
        });

        static::updating(function ($trabajo) {
            if ($trabajo->isDirty('titulo')) {
                $trabajo->slug = Str::slug($trabajo->titulo) . '-' . uniqid();
            }
        });
    }
}
