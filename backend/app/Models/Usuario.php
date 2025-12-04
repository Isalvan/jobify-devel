<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\UsuarioGestion;

class Usuario extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'usuarios';

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
}
