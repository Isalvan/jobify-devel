<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\ValidationRule;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="UpdateCandidatoRequest",
 *     title="Update Candidato Request",
 *     description="Datos para actualizar el perfil del candidato",
 *     @OA\Property(
 *         property="apellidos",
 *         type="string",
 *         description="Apellidos del candidato",
 *         example="Doe Smith"
 *     ),
 *     @OA\Property(
 *         property="fecha_nacimiento",
 *         type="string",
 *         format="date",
 *         description="Fecha de nacimiento",
 *         example="1990-01-01"
 *     ),
 *     @OA\Property(
 *         property="descripcion",
 *         type="string",
 *         description="Breve descripción profesional",
 *         example="Desarrollador apasionado..."
 *     ),
 *     @OA\Property(
 *         property="ubicacion",
 *         type="string",
 *         description="Ubicación actual",
 *         example="Barcelona"
 *     ),
 *     @OA\Property(
 *         property="url_cv",
 *         type="string",
 *         description="URL al CV (PDF, LinkedIn, etc)",
 *         example="https://linkedin.com/in/johndoe"
 *     )
 * )
 */
class UpdateCandidatoRequest extends FormRequest
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
            'apellidos' => ['sometimes', 'string', 'max:255'],
            'fecha_nacimiento' => ['sometimes', 'date'],
            'descripcion' => ['nullable', 'string'],
            'ubicacion' => ['nullable', 'string', 'max:255'],
            'url_cv' => ['nullable', 'string', 'max:2048'],
            'cv_file' => ['nullable', 'file', 'mimes:pdf', 'max:5120'], // 5MB max, PDF only
        ];
    }

    public function messages(): array
    {
        return [
            'apellidos.string' => 'Los apellidos deben ser texto.',
            'fecha_nacimiento.date' => 'La fecha de nacimiento no es válida.',
            'ubicacion.string' => 'La ubicación debe ser texto.',
            'url_cv.max' => 'La URL del CV es demasiado larga.',
            'cv_file.file' => 'El CV debe ser un archivo.',
            'cv_file.mimes' => 'El archivo debe ser un PDF válido.',
            'cv_file.max' => 'El archivo no puede pesar más de 5MB.',
        ];
    }
}
