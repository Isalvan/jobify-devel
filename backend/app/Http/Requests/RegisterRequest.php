<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *      title="Register Request",
 *      description="Datos para registrar un nuevo usuario",
 *      type="object",
 *      required={"name", "email", "password", "password_confirmation"}
 * )
 */
class RegisterRequest extends FormRequest
{
    // Public properties removed to avoid shadowing request data.
    // Annotations kept in DocBlocks if needed, but properties must be removed
    // for $request->name to work correctly if not manually hydrated.

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Typically, registration is allowed for all guests
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:usuarios'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'apellidos' => ['required', 'string', 'max:255'],
            'telefono' => ['nullable', 'string', 'max:20'],
            'fecha_nacimiento' => ['required', 'date'],
            'descripcion' => ['nullable', 'string'],
            'ubicacion' => ['required', 'string', 'max:255'],
        ];
    }
}
