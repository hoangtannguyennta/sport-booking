<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimeSlots extends Model
{
    protected $table = 'time_slots';
    
    protected $fillable = [
        'start_time',
        'end_time',
    ];
}
