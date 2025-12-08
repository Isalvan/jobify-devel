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

// Ruta de fallback para redirección de autenticación (evita error 500 Route [login] not defined)
Route::get('/login', function () {
    return response()->json(['message' => 'Unauthorized. Please login.'], 401);
})->name('login');

// Rutas Protegidas
Route::middleware('auth:sanctum')->group(function () {
    // Autenticación
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // --- Trabajos ---
    // Ver: Público (o autenticado general)
    Route::get('/trabajos', [TrabajoController::class, 'index']);
    Route::get('/trabajos/{trabajo}', [TrabajoController::class, 'show']);

    // Crear/Editar/Eliminar: Solo Empresas y Administradores
    Route::middleware('role:empresa,administrador')->group(function () {
        Route::post('/trabajos', [TrabajoController::class, 'store']);
        Route::put('/trabajos/{trabajo}', [TrabajoController::class, 'update']);
        Route::delete('/trabajos/{trabajo}', [TrabajoController::class, 'destroy']);
    });

    // --- Aplicaciones ---
    // Ver mis aplicaciones: Candidato
    // Ver aplicaciones de mis ofertas: Empresa
    // Ver todas: Administrador
    Route::get('/aplicaciones', [AplicacionController::class, 'index']);
    Route::get('/aplicaciones/{aplicacion}', [AplicacionController::class, 'show']);

    // Aplicar: Solo Candidatos
    Route::post('/aplicaciones', [AplicacionController::class, 'store'])->middleware('role:candidato,administrador');

    // Actualizar estado: Empresa y Administrador
    Route::put('/aplicaciones/{aplicacion}', [AplicacionController::class, 'update'])->middleware('role:empresa,administrador');

    // --- Empresas ---
    Route::apiResource('empresas', EmpresaController::class);

    // --- Candidatos ---
    Route::apiResource('candidatos', CandidatoController::class);

    // --- Recursos Adicionales ---
    Route::apiResource('documentos', DocumentoController::class);
    Route::apiResource('valoraciones', ValoracionController::class);
    Route::apiResource('empleados', EmpleadoController::class);

    // --- Usuarios (Admin) ---
    Route::middleware('role:administrador')->apiResource('usuarios', UsuarioController::class);
});
