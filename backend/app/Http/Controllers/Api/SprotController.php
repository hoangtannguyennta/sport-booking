<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sport;
use Illuminate\Http\Request;

class SprotController extends Controller
{
    /**
     * GET /api/sports
     */
    public function index()
    {
        $sports = Sport::all();
        return response()->json([
            'success' => true,
            'data' => $sports
        ]);
    }
}