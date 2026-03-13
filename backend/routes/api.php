<?php

use App\Http\Controllers\Api\MatchController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TestController;
use App\Http\Controllers\Api\VenueController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/test', [TestController::class, 'index']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::prefix('venues')->name('venues.')->group(function () {
    Route::get('/', [VenueController::class, 'index'])->name('index');
    Route::get('/{id}', [VenueController::class, 'show'])->name('show');
    Route::post('/', [VenueController::class, 'store'])->name('store');
    Route::put('/{id}', [VenueController::class, 'update'])->name('update');
    Route::delete('/{id}', [VenueController::class, 'destroy'])->name('destroy');
    Route::post('/parse-search', [VenueController::class, 'parseSearch'])->name('parse-search');
});


Route::middleware('auth:sanctum')->group(function () {

    Route::prefix('bookings')->group(function () {
        Route::get('/', [BookingController::class, 'index']);
        Route::post('/', [BookingController::class, 'store']);
        Route::get('{id}', [BookingController::class, 'show']);
        Route::delete('{id}', [BookingController::class, 'destroy']);
    });

    Route::prefix('matches')->group(function () {
        Route::get('/', [MatchController::class, 'index']);
        Route::get('{id}', [MatchController::class, 'show']);
        Route::post('/', [MatchController::class, 'store']);
        Route::post('{id}/join', [MatchController::class, 'join']);
        Route::post('{id}/leave', [MatchController::class, 'leave']);

    });

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});