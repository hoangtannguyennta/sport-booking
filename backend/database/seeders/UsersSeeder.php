<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create('vi_VN');
        $skills = ['newbie', 'intermediate', 'advanced'];

        $users = [];

        for ($i = 1; $i <= 30; $i++) {
            $users[] = [
                'name' => $faker->name,
                'email' => 'user' . $i . '@sportbook.vn',
                'password' => Hash::make('password123'),
                    'skill_level' => $skills[array_rand($skills)],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

        DB::table('users')->insert($users);
    }
}
