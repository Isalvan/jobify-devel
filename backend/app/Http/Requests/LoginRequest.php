<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *      title="Login Request",
 *      description="Datos para iniciar sesión",
 *      type="object",
 *      required={"email", "password"}
 * )
 */
class LoginRequest extends FormRequest
{
    /**
     * @OA\Property(
     *      title="Email",
     *      description="Correo electrónico del usuario",
     *      example="admin@jobify.com"
     * )
     *
     * @var string
     */
    public $email;

    /**
     * @OA\Property(
     *      title="Password",
     *      description="Contraseña del usuario",
     *      example="password"
     * )
     *
     * @var string
     */
    public $password;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'email'],
            'password' => ['required'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Introduce tu correo electrónico.',
            'email.email' => 'Introduce un correo electrónico válido.',
            'password.required' => 'Introduce tu contraseña.',
        ];
    }
}
