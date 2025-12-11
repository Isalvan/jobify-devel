<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="StoreAplicacionRequest",
 *     title="Store Aplicacion Request",
 *     description="Datos para crear una nueva aplicación",
 *     required={"trabajo_id"},
 *     @OA\Property(
 *         property="trabajo_id",
 *         type="integer",
 *         description="ID del trabajo al que se aplica",
 *         example=1
 *     ),
 *     @OA\Property(
 *         property="mensaje",
 *         type="string",
 *         description="Mensaje opcional para la aplicación",
 *         example="Estoy muy interesado en este puesto."
 *     )
 * )
 */
class StoreAplicacionRequest extends FormRequest
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
            'trabajo_id' => ['required', 'exists:trabajos,id'],
            'mensaje' => ['nullable', 'string'],
            'cv_file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
            'use_profile_cv' => ['nullable', 'boolean'],
        ];
    }
}
