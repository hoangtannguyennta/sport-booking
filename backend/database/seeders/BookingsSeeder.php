<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Carbon\Carbon;

class BookingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = User::pluck('id');
        $venues = DB::table('venues')->get();
        $timeSlots = DB::table('time_slots')->pluck('id');

        foreach ($venues as $venue) {

            DB::table('bookings')->insert([
                'user_id'      => $users->random(),
                'venue_id'     => $venue->id,
                'time_slot_id' => $timeSlots->random(),
                'booking_date' => Carbon::now()
                    ->addDays(rand(0, 3))
                    ->toDateString(),
                'status'       => collect(['confirmed', 'pending'])->random(),
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);
    }
    }
}
