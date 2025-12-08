<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Aplicacion;
use App\Models\Valoracion;
use App\Models\Documento;
use App\Models\Usuario;

/**
 * @OA\Schema(
 *     schema="Candidato",
 *     title="Candidato",
 *     description="Candidato model",
 *     @OA\Xml(
 *         name="Candidato"
 *     ),
 *     @OA\Property(
 *         property="id",
 *         title="ID",
 *         description="ID del candidato",
 *         type="integer",
 *         format="int64",
 *         example=1,
 *         readOnly=true
 *     ),
 *     @OA\Property(
 *         property="usuario_id",
 *         title="Usuario ID",
 *         description="ID del usuario asociado al candidato",
 *         type="integer",
 *         format="int64",
 *         example=1
 *     ),
 *     @OA\Property(
 *         property="apellidos",
 *         title="Apellidos",
 *         description="Apellidos del candidato",
 *         type="string",
 *         example="Pérez García"
 *     ),
 *     @OA\Property(
 *         property="fecha_nacimiento",
 *         title="Fecha de Nacimiento",
 *         description="Fecha de nacimiento del candidato",
 *         type="string",
 *         format="date",
 *         example="1990-01-01"
 *     ),
 *     @OA\Property(
 *         property="descripcion",
 *         title="Descripción",
 *         description="Descripción o perfil del candidato",
 *         type="string",
 *         nullable=true,
 *         example="Desarrollador web con 5 años de experiencia en Laravel y Vue.js."
 *     ),
 *     @OA\Property(
 *         property="ubicacion",
 *         title="Ubicación",
 *         description="Ubicación del candidato",
 *         type="string",
 *         nullable=true,
 *         example="Madrid, España"
 *     ),
 *     @OA\Property(
 *         property="url_cv",
 *         title="URL CV",
 *         description="URL al currículum vitae del candidato",
 *         type="string",
 *         format="url",
 *         nullable=true,
 *         example="https://example.com/cv/juan_perez.pdf"
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         title="Created At",
 *         description="Timestamp de creación",
 *         type="string",
 *         format="date-time",
 *         example="2023-01-01T12:00:00Z",
 *         readOnly=true
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         title="Updated At",
 *         description="Timestamp de la última actualización",
 *         type="string",
 *         format="date-time",
 *         example="2023-01-01T12:00:00Z",
 *         readOnly=true
 *     )
 * )
 */
class Candidato extends Model
{
    use HasFactory;

    protected $fillable = [
        'usuario_id',
        'apellidos',
        'fecha_nacimiento',
        'descripcion',
        'ubicacion',
        'url_cv',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    public function aplicaciones()
    {
        return $this->hasMany(Aplicacion::class);
    }

    public function valoraciones()
    {
        return $this->hasMany(Valoracion::class);
    }

    public function documentos()
    {
        return $this->hasMany(Documento::class);
    }

    public function favoritos()
    {
        return $this->hasMany(Favorito::class);
    }

    public function trabajosFavoritos()
    {
        return $this->belongsToMany(Trabajo::class, 'favoritos', 'candidato_id', 'trabajo_id')->withTimestamps();
    }
}
