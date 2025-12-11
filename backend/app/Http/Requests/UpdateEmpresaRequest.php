<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="UpdateEmpresaRequest",
 *     title="Update Empresa Request",
 *     description="Datos para actualizar el perfil de una empresa",
 *     @OA\Property(
 *         property="descripcion",
 *         type="string",
 *         description="Descripción de la empresa",
 *         example="Empresa líder en desarrollo de software"
 *     ),
 *     @OA\Property(
 *         property="sector",
 *         type="string",
 *         description="Sector de la empresa",
 *         example="Tecnología"
 *     ),
 *     @OA\Property(
 *         property="tamano_empresa",
 *         type="string",
 *         description="Tamaño de la empresa",
 *         example="50-100 empleados"
 *     ),
 *     @OA\Property(
 *         property="ubicacion",
 *         type="string",
 *         description="Ubicación de la sede principal",
 *         example="Madrid, España"
 *     ),
 *     @OA\Property(
 *         property="web",
 *         type="string",
 *         format="url",
 *         description="Sitio web de la empresa",
 *         example="https://techsolutions.com"
 *     )
 * )
 */
class UpdateEmpresaRequest extends FormRequest
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
            'descripcion' => ['sometimes', 'string'],
            'sector' => ['sometimes', 'string', 'max:255'],
            'tamano_empresa' => ['nullable', 'string', 'max:50'],
            'ubicacion' => ['sometimes', 'string', 'max:255'],
            'web' => ['nullable', 'url', 'max:255'],
        ];
    }
}
