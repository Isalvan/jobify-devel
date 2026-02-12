<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversacion extends Model
{
    use HasFactory;

    protected $table = 'conversaciones';

    protected $fillable = [
        'user_one_id',
        'user_two_id',
        'last_message_at',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
    ];

    public function userOne()
    {
        return $this->belongsTo(Usuario::class, 'user_one_id');
    }

    public function userTwo()
    {
        return $this->belongsTo(Usuario::class, 'user_two_id');
    }

    public function mensajes()
    {
        return $this->hasMany(Mensaje::class, 'conversacion_id');
    }

    public function lastMensaje()
    {
        return $this->hasOne(Mensaje::class, 'conversacion_id')->latest();
    }

    /**
     * Get the other user in the conversation.
     */
    public function getOtherUser(int $currentUserId)
    {
        return $this->user_one_id === $currentUserId ? $this->userTwo : $this->userOne;
    }

    /**
     * Scope to find a conversation between two users.
     */
    public function scopeBetweenUsers($query, $userA, $userB)
    {
        $ids = [min($userA, $userB), max($userA, $userB)];
        return $query->where('user_one_id', $ids[0])
                     ->where('user_two_id', $ids[1]);
    }
}
