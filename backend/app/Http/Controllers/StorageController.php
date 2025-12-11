<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StorageController extends Controller
{
    public function download($path)
    {
        // Decode URL components just in case, though Laravel routing handles it usually
        // But since we use a greedy pattern matching in route, we receive the full relative path

        if (!Storage::disk('public')->exists($path)) {
            abort(404, 'File not found');
        }

        return Storage::disk('public')->response($path);
    }
}
