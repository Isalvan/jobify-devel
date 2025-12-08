<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TrabajoController;
use App\Http\Controllers\AplicacionController;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\CandidatoController;
use App\Http\Controllers\DocumentoController;
use App\Http\Controllers\ValoracionController;
use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\UsuarioController;


// Rutas Públicas de Autenticación
Route::post('/register', [AuthController::class, 'store']);
Route::post('/login', [AuthController::class, 'authenticate']);

Route::get('/login', function () {
    return response()->json(['message' => 'Unauthorized. Please login.'], 401);
})->name('login');

Route::get('/trabajos', [TrabajoController::class, 'index']);
Route::get('/trabajos/mejores-valorados', [TrabajoController::class, 'topRated']);
Route::get('/trabajos/{trabajo}/valoraciones', [TrabajoController::class, 'getReviews']);
Route::get('/trabajos/{trabajo}', [TrabajoController::class, 'show']);
Route::get('/usuarios/{usuario}', [UsuarioController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user()->load(['candidato', 'empresa', 'empleado']);
    });

    Route::middleware('role:empresa,administrador')->group(function () {
        Route::post('/trabajos', [TrabajoController::class, 'store']);
        Route::put('/trabajos/{trabajo}', [TrabajoController::class, 'update']);
        Route::delete('/trabajos/{trabajo}', [TrabajoController::class, 'destroy']);
    });

    Route::get('/aplicaciones', [AplicacionController::class, 'index']);
    Route::get('/aplicaciones/{aplicacion}', [AplicacionController::class, 'show']);
    Route::post('/aplicaciones', [AplicacionController::class, 'store'])->middleware('role:candidato,administrador');
    Route::put('/aplicaciones/{aplicacion}', [AplicacionController::class, 'update'])->middleware('role:empresa,administrador');

    Route::get('/empresas/destacadas', [EmpresaController::class, 'destacadas'])->withoutMiddleware('auth:sanctum');
    Route::apiResource('empresas', EmpresaController::class);

    Route::apiResource('candidatos', CandidatoController::class);

    Route::apiResource('documentos', DocumentoController::class);
    Route::apiResource('valoraciones', ValoracionController::class);
    Route::apiResource('empleados', EmpleadoController::class);

    Route::apiResource('usuarios', UsuarioController::class)->except(['store', 'destroy', 'index', 'show']);
    
    Route::middleware('role:administrador')->group(function () {
        Route::get('/usuarios', [UsuarioController::class, 'index']);
        Route::delete('/usuarios/{usuario}', [UsuarioController::class, 'destroy']);
    });

    Route::get('/favoritos', [App\Http\Controllers\FavoritoController::class, 'index']);
    Route::post('/favoritos/toggle', [App\Http\Controllers\FavoritoController::class, 'toggle']);
});
