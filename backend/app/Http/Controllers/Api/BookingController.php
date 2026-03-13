<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    // GET /bookings
    public function index()
    {
        $bookings = Booking::with(['venue', 'timeSlot'])
            ->latest()
            ->get();

        return response()->json([
            'bookings' => $bookings,
        ]);
    }

    // POST /bookings
    public function store(Request $request)
    {
        $data = $request->validate([
            'venue_id'     => 'required|exists:venues,id',
            'time_slot_id' => 'required|exists:time_slots,id',
            'booking_date' => 'required|date',
        ]);

        $booking = Booking::create([
            'user_id'      => Auth::id(),
            'venue_id'     => $data['venue_id'],
            'time_slot_id' => $data['time_slot_id'],
            'booking_date' => $data['booking_date'],
            'status'       => 'confirmed',
        ]);

        return response()->json([
            'message' => 'Booking created successfully',
            'booking' => $booking,
        ], 201);
    }

    // GET /bookings/{id}
    public function show($id)
    {
        $booking = Booking::with(['venue', 'timeSlot'])->findOrFail($id);

        return response()->json([
            'booking' => $booking,
        ]);
    }

    // DELETE /bookings/{id}
    public function destroy($id)
    {
        Booking::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Booking cancelled',
        ]);
    }
}
