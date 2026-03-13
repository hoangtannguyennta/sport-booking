<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VenuesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('venues')->insert([
            [
                'sport_id' => 1,
                'name' => 'Sân bóng Tây Lộc',
                'address' => '97 Nguyễn Trãi, Huế',
                'image' => 'venues/football-1.jpg',
                'price_per_hour' => 500000,
            ],
            [
                'sport_id' => 2,
                'name' => 'Sân cầu lông Tây Lộc',
                'address' => '97 Nguyễn Trãi, Huế',
                'image' => 'venues/tennis-1.jpg',
                'price_per_hour' => 300000,
            ],
            [
                'sport_id' => 3,
                'name' => 'CLB Cầu Lông Gia Hội',
                'address' => '27 Lê Lợi, Huế',
                'image' => 'venues/badminton-1.jpg',
                'price_per_hour' => 500000,
            ],
        ]);
    }
}
