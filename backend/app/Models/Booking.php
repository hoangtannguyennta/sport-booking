<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'user_id',
        'venue_id',
        'time_slot_id',
        'booking_date',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }

    public function timeSlot()
    {
        return $this->belongsTo(TimeSlots::class);
    }
}
