<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     title="Categoria",
 *     description="Modelo de Categoria",
 *     @OA\Xml(
 *         name="Categoria"
 *     )
 * )
 */
class Categoria extends Model
{
    use HasFactory;

    protected $table = 'categorias';

    protected $fillable = [
        'nombre',
        'slug',
        'descripcion',
    ];

    /**
     * @OA\Property(
     *     property="id",
     *     type="integer",
     *     format="int64",
     *     readOnly=true
     * )
     * @OA\Property(
     *     property="nombre",
     *     type="string"
     * )
     * @OA\Property(
     *     property="descripcion",
     *     type="string"
     * )
     */

    public function trabajos()
    {
        return $this->belongsToMany(Trabajo::class, 'trabajo__categorias', 'categoria_id', 'trabajo_id');
    }
}
