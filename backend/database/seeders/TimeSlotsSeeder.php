<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TimeSlotsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('time_slots')->insert([
            ['start_time' => '06:00', 'end_time' => '07:00'],
            ['start_time' => '07:00', 'end_time' => '08:00'],
            ['start_time' => '08:00', 'end_time' => '09:00'],
            ['start_time' => '17:00', 'end_time' => '18:00'],
            ['start_time' => '18:00', 'end_time' => '19:00'],
            ['start_time' => '19:00', 'end_time' => '20:00'],
            ['start_time' => '20:00', 'end_time' => '21:00'],
        ]);
    }
}
