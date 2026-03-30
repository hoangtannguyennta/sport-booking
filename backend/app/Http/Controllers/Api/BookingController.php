<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Matches;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Exceptions\HttpResponseException;

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
            'venue_id'      => 'required|exists:venues,id',
            'time_slot_id'  => 'required|exists:time_slots,id',
            'booking_date'  => 'required|date',
            'max_players'   => 'required|integer|min:2',
            'skill_level'   => 'nullable|string',
            'note'          => 'nullable|string',
        ]);

        try {
            return DB::transaction(function () use ($data) {
                // Kiểm tra xem sân đã được đặt vào khung giờ và ngày này chưa
                $isAlreadyBooked = Booking::where('venue_id', $data['venue_id'])
                    ->where('time_slot_id', $data['time_slot_id'])
                    ->where('booking_date', $data['booking_date'])
                    ->exists();

                if ($isAlreadyBooked) {
                    throw new HttpResponseException(
                        response()->json([
                            'message' => 'Sân đã có người đặt vào khung giờ và ngày này. Vui lòng chọn thời gian khác.'
                        ], 422)
                    );
                }

                // 1. Tạo bản ghi Booking
                $booking = Booking::create([
                    'user_id'      => Auth::id(),
                    'venue_id'     => $data['venue_id'],
                    'time_slot_id' => $data['time_slot_id'],
                    'booking_date' => $data['booking_date'],
                    'status'       => 'confirmed',
                ]);

                // 2. Tạo bản ghi Match tương ứng
                $match = Matches::create([
                    'booking_id'   => $booking->id,
                    'host_user_id' => Auth::id(),
                    'status'       => 'open',
                    'max_players'  => $data['max_players'],
                    'skill_level'  => $data['skill_level'] ?? 'all',
                    'note'         => $data['note'] ?? null,
                ]);

                // 3. Tự động thêm chủ sân (host) vào danh sách người tham gia trận đấu
                $match->usersMatch()->attach(Auth::id(), ['role' => 'host']);

                return response()->json([
                    'message' => 'Booking and Match created successfully',
                    'booking' => $booking,
                    'match'   => $match
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi khi tạo đặt sân: ' . $e->getMessage()], 500);
        }
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
