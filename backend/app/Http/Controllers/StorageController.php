<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StorageController extends Controller
{
    public function download($path)
    {
        // Prevent path traversal and restrict to specific directories if needed
        // For now, at least ensure it doesn't contain '..'
        if (str_contains($path, '..')) {
            abort(403, 'Invalid path');
        }

        if (!Storage::disk('public')->exists($path)) {
            abort(404, 'File not found');
        }

        // Restrict to allowed directories to avoid accidental exposure of other public files
        $allowedPrefixes = ['perfiles/', 'cvs/', 'documentos/', 'logos/'];
        $isAllowed = false;
        foreach ($allowedPrefixes as $prefix) {
            if (str_starts_with($path, $prefix)) {
                $isAllowed = true;
                break;
            }
        }

        if (!$isAllowed) {
            abort(403, 'Access denied to this resource');
        }

        return Storage::disk('public')->response($path);
    }
}
