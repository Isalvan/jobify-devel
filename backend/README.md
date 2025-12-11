# Jobify Backend API

API RESTful desarrollada en Laravel 11 que alimenta la plataforma Jobify.

## 🛠 Tech Stack

-   **Framework:** Laravel 11
-   **PHP:** 8.2+
-   **Database:** MySQL / MariaDB
-   **Auth:** Laravel Sanctum (SPA Authentication)
-   **API Resources:** Transformación estandarizada de respuestas JSON.
-   **Policies:** Control de acceso basado en roles (Admin, Empresa, Candidato, Empleado).

## 🚀 Instalación y Configuración

### 1. Requisitos Previos

-   PHP 8.2 o superior
-   Composer
-   MySQL

### 2. Configuración Inicial

```bash
# Instalar dependencias
composer install

# Copiar variables de entorno
cp .env.example .env

# Generar llave de aplicación
php artisan key:generate

# Configurar base de datos en .env (DB_DATABASE, DB_USERNAME, etc.)
```

### 3. Base de Datos

Correr migraciones y seeders para tener datos de prueba (Usuarios, Ofertas, Categorías).

```bash
php artisan migrate --seed
```

### 4. Servidor de Desarrollo

```bash
php artisan serve
```

La API estará disponible en `http://localhost:8000/api`.

## 📂 Estructura Clave

-   `app/Http/Controllers`: Lógica de los endpoints.
-   `app/Http/Resources`: Formato de respuestas API.
-   `app/Http/Requests`: Validación de entradas.
-   `app/Models`: Modelos Eloquent.
-   `app/Policies`: Reglas de autorización.
-   `database/seeders`: Datos iniciales de prueba (incluye `UsersSeeder` y `ValoracionSeeder` mejorados).
-   `routes/api.php`: Definición de rutas de la API.

## ✨ Características Principales

-   **Autenticación**: Registro y Login con diferentes roles.
-   **Gestión de Ofertas**: CRUD completo con validación y autorización.
-   **Aplicaciones**: Flujo de postulación de candidatos a ofertas.
-   **Valoraciones**: Sistema de reseñas de candidatos a empresas/ofertas.
-   **Búsqueda Avanzada**: Filtrado de ofertas por múltiples criterios.
