<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class MatchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $bookings = DB::table('bookings')->inRandomOrder()->take(10)->get();
        $users = User::all();

        foreach ($bookings as $booking) {
            $host = $users->random();

            $matchId = DB::table('matches')->insertGetId([
                'booking_id'   => $booking->id,
                'host_user_id' => $host->id,
                'skill_level'  => collect(['beginner','intermediate','advanced'])->random(),
                'max_players'  => 4,
                'status'       => 'open',
                'note'         => 'Kèo giao lưu vui vẻ 😄',
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);

            // host join trước
            DB::table('match_user')->insert([
                'match_id' => $matchId,
                'user_id'  => $host->id,
                'role'     => 'host',
                'joined_at'=> now(),
            ]);

            // thêm người chơi random
            $players = $users->where('id', '!=', $host->id)
                             ->random(rand(1, 3));

            foreach ($players as $player) {
                DB::table('match_user')->insert([
                    'match_id' => $matchId,
                    'user_id'  => $player->id,
                    'role'     => 'player',
                    'joined_at'=> now(),
                ]);
            }
        }
    }
}
