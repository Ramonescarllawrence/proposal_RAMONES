<?php

use App\Http\Controllers\DatePlanController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DatePlanController::class, 'index'])->name('home');
Route::post('/plan', [DatePlanController::class, 'store'])->name('plan.store')->middleware('throttle:20,1');
Route::get('/plan/{id}', [DatePlanController::class, 'show'])->name('plan.show');
