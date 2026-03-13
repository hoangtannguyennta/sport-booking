<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatchUser extends Model
{
    protected $table = 'match_user';

    protected $fillable = [
        'match_id',
        'user_id',
    ];
}
