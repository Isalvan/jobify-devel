<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorito extends Model
{
    protected $fillable = ['candidato_id', 'trabajo_id'];

    public function candidato()
    {
        return $this->belongsTo(Candidato::class);
    }

    public function trabajo()
    {
        return $this->belongsTo(Trabajo::class);
    }
}
