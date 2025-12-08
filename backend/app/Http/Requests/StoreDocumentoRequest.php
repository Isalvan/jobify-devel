<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'aplicacion_id' => ['required', 'exists:aplicaciones,id'],
            'archivo' => ['required', 'file', 'mimes:pdf,doc,docx,jpg,png', 'max:5120'], // 5MB
            'tipo' => ['nullable', 'string', 'max:50'],
        ];
    }
}
