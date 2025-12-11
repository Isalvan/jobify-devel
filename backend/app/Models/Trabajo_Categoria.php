<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="Trabajo_Categoria",
 *     title="Trabajo_Categoria",
 *     description="Pivot model for many-to-many relationship between Trabajo and Categoria",
 *     @OA\Property(
 *         property="trabajo_id",
 *         type="integer",
 *         format="int64",
 *         description="ID of the Trabajo"
 *     ),
 *     @OA\Property(
 *         property="categoria_id",
 *         type="integer",
 *         format="int64",
 *         description="ID of the Categoria"
 *     )
 * )
 */
class Trabajo_Categoria extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'trabajo__categorias';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'trabajo_id',
        'categoria_id',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;
}
