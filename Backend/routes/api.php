<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OptionController;
use App\Http\Controllers\OptionValueController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductVariantController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\UserController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

/*
|--------------------------------------------------------------------------
| Guest Cart
|--------------------------------------------------------------------------
*/

Route::get('/cart', [CartController::class, 'show']);
Route::post('/cart/items', [CartController::class, 'addItem']);
Route::put('/cart/items/{cartItemId}', [CartController::class, 'updateItem']);
Route::delete('/cart/items/{cartItemId}', [CartController::class, 'removeItem']);
Route::post('/cart/checkout', [CartController::class, 'checkout']);

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |--------------------------------------------------------------------------
    | Admin Only
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:admin')->group(function () {

        Route::post('/register', [AuthController::class, 'register']);

        Route::apiResource('users', UserController::class)
        ->only([
            'index',
            'show',
            'update',
            'destroy',
        ]);

        Route::apiResource('options', OptionController::class);

        Route::apiResource('option-values', OptionValueController::class);

        Route::apiResource('products', ProductController::class);

        Route::apiResource('product-variants', ProductVariantController::class);

        Route::apiResource('product-images', ProductImageController::class);
    });

    /*
    |--------------------------------------------------------------------------
    | Admin + Confirmatrice
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:admin,confirmatrice')->group(function () {

        Route::apiResource('orders', OrderController::class)
            ->only([
                'index',
                'show',
                'update',
                'destroy',
            ]);

        Route::apiResource('histories', HistoryController::class)
            ->only([
                'index',
                'store',
                'show',
                'destroy',
            ]);
    });
});