<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TimeSlots;
use Illuminate\Http\Request;

class TimeSlotController extends Controller
{
    /**
     * GET /api/time-slots
     * Lấy danh sách tất cả các khung giờ.
     */
    public function index()
    {
        $timeSlots = TimeSlots::all();

        return response()->json($timeSlots);
    }
}