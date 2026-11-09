<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL; // Idagdag ito

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Piliting mag-HTTPS ang asset links kapag nasa production/Render na
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
        }
    }
}