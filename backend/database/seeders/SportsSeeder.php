<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SportsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('sports')->insert([
            ['name' => 'Bóng đá', 'icon' => '⚽'],
            ['name' => 'Tennis', 'icon' => '🎾'],
            ['name' => 'Cầu lông', 'icon' => '🏸'],
            ['name' => 'Bơi lội', 'icon' => '🏊'],
        ]);
    }
}
