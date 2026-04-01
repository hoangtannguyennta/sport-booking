<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matches extends Model
{
    use HasFactory;

    protected $table = 'matches';

    protected $fillable = [
        'booking_id',
        'host_user_id',
        'status',
        'max_players',
        'skill_level',
        'note'
    ];

    // Booking gốc
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    // Chủ trận (người đặt sân)
    public function host()
    {
        return $this->belongsTo(User::class, 'host_user_id');
    }

    // Người tham gia
    public function usersMatch()
    {
        return $this->belongsToMany(User::class, 'match_user', 'match_id', 'user_id')
            ->withPivot('role', 'status', 'joined_at');
    }
}
