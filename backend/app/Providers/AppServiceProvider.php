<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void {}

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \Illuminate\Support\Facades\Gate::policy(\App\Models\Aplicacion::class, \App\Policies\AplicacionPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\Valoracion::class, \App\Policies\ValoracionPolicy::class);
    }
}
