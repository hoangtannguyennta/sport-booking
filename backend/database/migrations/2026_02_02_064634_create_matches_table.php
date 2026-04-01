<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('matches', function (Blueprint $table) {
            $table->id();

            // gắn với booking (booking giữ sân + giờ)
            $table->foreignId('booking_id')
                ->constrained('bookings')
                ->cascadeOnDelete();

            // chủ kèo
            $table->foreignId('host_user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // trình độ trận
            $table->enum('skill_level', ['newbie', 'beginner', 'intermediate', 'advanced'])
                ->default('intermediate');

            $table->unsignedTinyInteger('max_players')->default(4);

            $table->enum('status', ['open', 'full', 'cancelled', 'finished'])
                ->default('open');

            $table->text('note')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('matches');
    }
};
