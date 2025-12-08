<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationRule;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="UpdateUsuarioRequest",
 *     title="Update Usuario Request",
 *     description="Datos para actualizar un usuario",
 *     @OA\Property(
 *         property="nombre",
 *         type="string",
 *         description="Nombre completo",
 *         example="Jane Doe"
 *     ),
 *     @OA\Property(
 *         property="email",
 *         type="string",
 *         format="email",
 *         description="Correo electrónico",
 *         example="jane@example.com"
 *     ),
 *     @OA\Property(
 *         property="password",
 *         type="string",
 *         format="password",
 *         description="Nueva contraseña",
 *         example="NewSecretPass123!"
 *     ),
 *     @OA\Property(
 *         property="password_confirmation",
 *         type="string",
 *         format="password",
 *         description="Confirmación de la nueva contraseña"
 *     ),
 *     @OA\Property(
 *         property="telefono",
 *         type="string",
 *         description="Número de teléfono",
 *         example="+123456789"
 *     ),
 *     @OA\Property(
 *         property="foto_perfil",
 *         type="string",
 *         description="URL de la foto de perfil",
 *         example="https://example.com/photo.jpg"
 *     ),
 *     @OA\Property(
 *         property="estado",
 *         type="string",
 *         enum={"activo", "inactivo", "pendiente"},
 *         description="Estado de la cuenta"
 *     )
 * )
 */
class UpdateUsuarioRequest extends FormRequest
{
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
            'nombre' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('usuarios')->ignore($this->route('usuario') ? $this->route('usuario')->id : $this->user()->id)],
            'password' => ['sometimes', 'confirmed', Password::defaults()],
            'telefono' => ['nullable', 'string', 'max:20'],
            'foto_perfil' => ['nullable', 'string', 'max:255'],
            'estado' => ['sometimes', 'in:activo,inactivo,pendiente'],
        ];
    }
}
