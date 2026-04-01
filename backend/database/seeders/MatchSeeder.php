<?php

namespace Database\Seeders;

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
            DB::transaction(function () use ($booking, $users) {

                $host = $users->random();
                $availableUsers = $users->where('id', '!=', $host->id);

                // Tổng số người tối đa (host + players)
                $maxPlayers = rand(3, 8); // tối thiểu 3 người để có trận

                // Quyết định trận đầy hay thiếu
                $isFull = rand(0, 1); // 0: thiếu người, 1: đủ người

                if ($isFull) {
                    $playerCount = $maxPlayers - 1; // trừ host
                } else {
                    $playerCount = rand(1, max(1, $maxPlayers - 2)); // thiếu người
                }

                // Tạo trận
                $matchId = DB::table('matches')->insertGetId([
                    'booking_id'   => $booking->id,
                    'host_user_id' => $host->id,
                    'skill_level'  => collect(['newbie', 'beginner', 'intermediate', 'advanced'])->random(),
                    'max_players'  => $maxPlayers,
                    'status'       => 'open', // cập nhật sau
                    'note'         => 'Kèo giao lưu vui vẻ 😄',
                    'created_at'   => now(),
                    'updated_at'   => now(),
                ]);

                // Host tham gia trước
                DB::table('match_user')->insert([
                    'match_id' => $matchId,
                    'user_id'  => $host->id,
                    'role'     => 'host',
                    'joined_at'=> now(),
                ]);

                // Thêm player
                if ($availableUsers->count() > 0) {
                    $players = $availableUsers->random(
                        min($playerCount, $availableUsers->count())
                    );

                    foreach ($players as $player) {
                        DB::table('match_user')->insert([
                            'match_id' => $matchId,
                            'user_id'  => $player->id,
                            'role'     => 'player',
                            'joined_at'=> now(),
                        ]);
                    }
                }

                // Cập nhật status nếu đủ người
                $currentPlayers = DB::table('match_user')->where('match_id', $matchId)->count();
                if ($currentPlayers >= $maxPlayers) {
                    DB::table('matches')->where('id', $matchId)->update(['status' => 'full']);
                }

            });
        }
    }
}