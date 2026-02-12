<?php

namespace App\Http\Controllers;

use App\Models\Conversacion;
use App\Models\Mensaje;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    /**
     * List user conversations with latest message and unread count.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $conversaciones = Conversacion::where('user_one_id', $user->id)
            ->orWhere('user_two_id', $user->id)
            ->with(['userOne', 'userTwo', 'lastMensaje'])
            ->orderByDesc('last_message_at')
            ->get();

        $data = $conversaciones->map(function ($conv) use ($user) {
            $otherUser = $conv->getOtherUser($user->id);
            return [
                'id' => $conv->id,
                'other_user' => [
                    'id' => $otherUser->id,
                    'nombre' => $otherUser->nombre,
                    'foto_perfil' => $otherUser->foto_perfil,
                ],
                'last_message' => $conv->lastMensaje,
                'unread_count' => $conv->mensajes()
                    ->where('sender_id', '!=', $user->id)
                    ->unread()
                    ->count(),
                'updated_at' => $conv->updated_at,
            ];
        });

        return response()->json($data);
    }

    /**
     * Get messages for a conversation, optionally after a specific ID (polling).
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        $conversacion = Conversacion::findOrFail($id);

        if ($conversacion->user_one_id !== $user->id && $conversacion->user_two_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = $conversacion->mensajes()->with('sender');

        if ($request->has('after_id')) {
            $query->where('id', '>', $request->after_id);
        } else {
            // Initial load, get latest 50
            $query->latest()->limit(50);
        }

        $messages = $query->get();
        
        if (!$request->has('after_id')) {
            $messages = $messages->reverse()->values();
        }

        // Mark as read
        $conversacion->mensajes()
            ->where('sender_id', '!=', $user->id)
            ->unread()
            ->update(['read_at' => now()]);

        return response()->json($messages);
    }

    /**
     * Send a new message.
     */
    public function store(Request $request)
    {
        $request->validate([
            'recipient_id' => 'required_without:conversacion_id|exists:usuarios,id',
            'conversacion_id' => 'required_without:recipient_id|exists:conversaciones,id',
            'content' => 'required|string|max:2000',
        ]);

        $user = $request->user();
        $conversacion = null;

        if ($request->conversacion_id) {
            $conversacion = Conversacion::findOrFail($request->conversacion_id);
            if ($conversacion->user_one_id !== $user->id && $conversacion->user_two_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        } else {
            // Find or create conversation
            $recipientId = (int) $request->recipient_id;
            if ($recipientId === $user->id) {
                return response()->json(['message' => 'Cannot chat with yourself'], 400);
            }

            $ids = [min($user->id, $recipientId), max($user->id, $recipientId)];
            $conversacion = Conversacion::firstOrCreate([
                'user_one_id' => $ids[0],
                'user_two_id' => $ids[1],
            ]);
        }

        $message = DB::transaction(function () use ($conversacion, $user, $request) {
            $msg = $conversacion->mensajes()->create([
                'sender_id' => $user->id,
                'content' => $request->content,
            ]);

            $conversacion->update(['last_message_at' => now()]);
            return $msg;
        });

        return response()->json($message->load('sender'), 201);
    }

    /**
     * Get global unread count for the user.
     */
    public function unreadCount(Request $request)
    {
        $user = $request->user();
        $count = Mensaje::whereHas('conversacion', function ($q) use ($user) {
            $q->where('user_one_id', $user->id)->orWhere('user_two_id', $user->id);
        })
        ->where('sender_id', '!=', $user->id)
        ->unread()
        ->count();

        return response()->json(['unread_count' => $count]);
    }
}
