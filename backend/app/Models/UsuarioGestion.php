<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     title="UsuarioGestion",
 *     description="UsuarioGestion model",
 *     @OA\Xml(
 *         name="UsuarioGestion"
 *     )
 * )
 */
class UsuarioGestion extends Model
{
    use HasFactory;

    protected $table = 'usuario_gestions';

    /**
     * @OA\Property(
     *     title="ID",
     *     description="ID",
     *     format="int64",
     *     readOnly=true,
     *     example=1
     * )
     *
     * @var int
     */
    private int $id;

    /**
     * @OA\Property(
     *     title="Usuario ID",
     *     description="Foreign key to the Usuario model",
     *     format="int64",
     *     example=1
     * )
     *
     * @var int
     */
    private int $usuario_id;

    /**
     * @OA\Property(
     *     title="Rol de Gestión",
     *     description="Role of management for the user",
     *     example="admin"
     * )
     *
     * @var string
     */
    private string $rol_gestion;

    /**
     * @OA\Property(
     *     title="Created at",
     *     description="Timestamp when the record was created",
     *     example="2023-01-01T00:00:00Z",
     *     format="datetime",
     *     readOnly=true
     * )
     *
     * @var string
     */
    private string $created_at;

    /**
     * @OA\Property(
     *     title="Updated at",
     *     description="Timestamp when the record was last updated",
     *     example="2023-01-01T00:00:00Z",
     *     format="datetime",
     *     readOnly=true
     * )
     *
     * @var string
     */
    private string $updated_at;

    protected $fillable = [
        'usuario_id',
        'rol_gestion',
    ];

    /**
     * Get the user that owns the UsuarioGestion.
     * @OA\Property(
     *     title="Usuario",
     *     description="The associated user",
     *     ref="#/components/schemas/Usuario"
     * )
     */
    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }
}
