<?php

use App\Http\Controllers\Api\MenuItemController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\OrderController;

Route::get('/menu-items', [MenuItemController::class, 'index']);

Route::get('/orders', [OrderController::class, 'index']);

Route::post('/orders', [OrderController::class, 'store']);

Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);

Route::get('/orders/{order}', [OrderController::class, 'show']);

Route::delete('/orders/{order}', [OrderController::class, 'destroy']);