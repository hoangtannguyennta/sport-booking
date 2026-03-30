<?php

use App\Http\Controllers\Api\MatchController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TestController;
use App\Http\Controllers\Api\VenueController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TimeSlotController;
use App\Http\Controllers\Api\SprotController;

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

Route::get('/test', [TestController::class, 'index']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/sports', [SprotController::class, 'index']);

Route::prefix('venues')->name('venues.')->group(function () {
    Route::get('/', [VenueController::class, 'index'])->name('index');
    Route::get('/{id}', [VenueController::class, 'show'])->name('show');
    Route::post('/', [VenueController::class, 'store'])->name('store');
    Route::put('/{id}', [VenueController::class, 'update'])->name('update');
    Route::delete('/{id}', [VenueController::class, 'destroy'])->name('destroy');
    Route::post('/parse-search', [VenueController::class, 'parseSearch'])->name('parse-search');
});

Route::get('/time-slots', [TimeSlotController::class, 'index']);

// Các route cần đăng nhập mới sử dụng được
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::prefix('bookings')->group(function () {
        Route::post('/', [BookingController::class, 'store']);
        Route::delete('{id}', [BookingController::class, 'destroy']);
    });

    Route::prefix('matches')->group(function () {
        Route::post('/', [MatchController::class, 'store']);
        Route::post('{id}/join', [MatchController::class, 'join']);
        Route::post('{id}/leave', [MatchController::class, 'leave']);
    });
});

// Các route công khai (không cần đăng nhập cũng xem được)
Route::get('/bookings', [BookingController::class, 'index']);
Route::get('/bookings/{id}', [BookingController::class, 'show']);
Route::get('/matches', [MatchController::class, 'index']);
Route::get('/matches/{id}', [MatchController::class, 'show']);
