<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Matches;
use App\Models\Booking;
use Illuminate\Http\Request;

class MatchController extends Controller
{
    // 📌 Danh sách matches
    public function index()
    {
        $matches = Matches::with([
            'booking',
            'booking.venue',
            'booking.timeSlot',
            'host',
            'usersMatch'
        ])->get();

        return response()->json([
            'matches' => $matches
        ]);
    }

    // 📌 Tạo match từ booking
    public function store(Request $request)
    {
        $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'max_players' => 'required|integer|min:2',
            'skill_level' => 'nullable|string',
        ]);

        $booking = Booking::findOrFail($request->booking_id);

        $match = Matches::create([
            'booking_id'   => $booking->id,
            'host_user_id' => $booking->user_id,
            'status'       => 'open',
            'max_players'  => $request->max_players,
            'skill_level'  => $request->skill_level,
        ]);

        // Host auto join match
        $match->users()->attach($booking->user_id);

        return response()->json([
            'message' => 'Match created successfully',
            'match'   => $match
        ], 201);
    }

    // 📌 Join match
    public function join($id)
    {
        $match = Matches::findOrFail($id);

        if ($match->users()->count() >= $match->max_players) {
            return response()->json([
                'message' => 'Match is full'
            ], 400);
        }

        $match->users()->syncWithoutDetaching(auth()->id());

        return response()->json([
            'message' => 'Joined match successfully'
        ]);
    }

    // 📌 Rời match
    public function leave($id)
    {
        $match = Matches::findOrFail($id);
        $match->users()->detach(auth()->id());

        return response()->json([
            'message' => 'Left match'
        ]);
    }

    // 📌 Chi tiết match
    public function show($id)
    {
        $match = Matches::with([
            'booking.venue',
            'booking.timeSlot',
            'users',
            'host'
        ])->findOrFail($id);

        return response()->json([
            'match' => $match
        ]);
    }
}
