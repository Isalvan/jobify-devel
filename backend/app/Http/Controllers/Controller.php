<?php

namespace App\Http\Controllers;


use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

/**
 * @OA\OpenApi(
 *      security={{"bearerAuth": {}}},
 *      @OA\Info(
 *          version="1.0.0",
 *          title="Jobify API",
 *          description="Documentación de la API de Jobify",
 *          @OA\Contact(
 *              email="soporte@jobify.com"
 *          )
 *      ),
 *      @OA\Server(
 *          url=L5_SWAGGER_CONST_HOST,
 *          description="API Server"
 *      ),
 *      @OA\Components(
 *          @OA\SecurityScheme(
 *              securityScheme="bearerAuth",
 *              type="http",
 *              scheme="bearer",
 *              bearerFormat="JWT"
 *          )
 *      )
 * )
 */
abstract class Controller
{
    use AuthorizesRequests;
}
