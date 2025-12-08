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
    /**
     * @OA\Property(
     *      title="Nombre",
     *      description="Nombre completo del usuario",
     *      example="Juan Perez"
     * )
     *
     * @var string
     */
    public $name;

    /**
     * @OA\Property(
     *      title="Email",
     *      description="Correo electrónico del usuario",
     *      example="juan@example.com"
     * )
     *
     * @var string
     */
    public $email;

    /**
     * @OA\Property(
     *      title="Password",
     *      description="Contraseña del usuario",
     *      example="password123"
     * )
     *
     * @var string
     */
    public $password;

    /**
     * @OA\Property(
     *      title="Confirmación de Password",
     *      description="Confirmación de la contraseña",
     *      example="password123"
     * )
     *
     * @var string
     */
    public $password_confirmation;

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
        ];
    }
}
