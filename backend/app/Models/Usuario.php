<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\UsuarioGestion;
use App\Models\Candidato;
use App\Models\Empresa;
use App\Models\Empleado;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="Usuario",
 *     title="Usuario",
 *     description="Modelo de usuario",
 *     required={"nombre", "email", "password", "rol"},
 *     @OA\Property(
 *         property="id",
 *         type="integer",
 *         format="int64",
 *         description="ID único del usuario",
 *         readOnly=true,
 *         example=1
 *     ),
 *     @OA\Property(
 *         property="nombre",
 *         type="string",
 *         description="Nombre completo del usuario",
 *         example="John Doe"
 *     ),
 *     @OA\Property(
 *         property="email",
 *         type="string",
 *         format="email",
 *         description="Dirección de correo electrónico del usuario",
 *         example="john.doe@example.com"
 *     ),
 *     @OA\Property(
 *         property="password",
 *         type="string",
 *         format="password",
 *         description="Contraseña del usuario",
 *         writeOnly=true,
 *         example="secretpassword"
 *     ),
 *     @OA\Property(
 *         property="foto_perfil",
 *         type="string",
 *         nullable=true,
 *         description="URL o path de la foto de perfil del usuario",
 *         example="http://example.com/profiles/john.jpg"
 *     ),
 *     @OA\Property(
 *         property="telefono",
 *         type="string",
 *         nullable=true,
 *         description="Número de teléfono del usuario",
 *         example="+1234567890"
 *     ),
 *     @OA\Property(
 *         property="estado",
 *         type="string",
 *         enum={"activo", "inactivo", "pendiente"},
 *         default="pendiente",
 *         description="Estado de la cuenta del usuario",
 *         example="activo"
 *     ),
 *     @OA\Property(
 *         property="rol",
 *         type="string",
 *         enum={"administrador", "gerente", "usuario"},
 *         default="usuario",
 *         description="Rol del usuario en el sistema",
 *         example="usuario"
 *     ),
 *     @OA\Property(
 *         property="email_verified_at",
 *         type="string",
 *         format="date-time",
 *         nullable=true,
 *         description="Marca de tiempo de verificación del correo electrónico",
 *         readOnly=true,
 *         example="2023-01-01T12:00:00Z"
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         type="string",
 *         format="date-time",
 *         description="Marca de tiempo de creación del registro",
 *         readOnly=true,
 *         example="2023-01-01T12:00:00Z"
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         type="string",
 *         format="date-time",
 *         description="Marca de tiempo de la última actualización del registro",
 *         readOnly=true,
 *         example="2023-01-01T12:00:00Z"
 *     ),
 *     @OA\Property(
 *         property="gestion",
 *         ref="#/components/schemas/UsuarioGestion",
 *         description="Información de gestión asociada al usuario",
 *         nullable=true
 *     )
 * )
 */
class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'usuarios';

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (Usuario $usuario) {
            if (empty($usuario->foto_perfil)) {
                $name = urlencode($usuario->nombre);
                $usuario->foto_perfil = "https://ui-avatars.com/api/?name={$name}&background=random";
            }
        });
    }

    protected $fillable = [
        'nombre',
        'email',
        'password',
        'foto_perfil',
        'telefono',
        'estado',
        'rol',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Provide a `name` attribute for compatibility with Laravel's default expectations.
     * This maps to the `nombre` column in the DB so existing code that uses `nombre`
     * continues to work while authentication scaffolding can use `name`.
     */
    public function getNameAttribute()
    {
        return $this->attributes['nombre'] ?? null;
    }

    public function setNameAttribute($value)
    {
        $this->attributes['nombre'] = $value;
    }

    public function gestion()
    {
        return $this->hasOne(UsuarioGestion::class);
    }

    public function esAdministrador()
    {
        return in_array(strtoupper($this->rol), ['ADMIN', 'ADMINISTRADOR']);
    }

    public function candidato()
    {
        return $this->hasOne(Candidato::class);
    }

    public function empresa()
    {
        return $this->hasOne(Empresa::class);
    }

    public function empleado()
    {
        return $this->hasOne(Empleado::class);
    }
}
