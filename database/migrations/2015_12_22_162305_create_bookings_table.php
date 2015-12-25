<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBookingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_count');

            $table->enum('object', array_keys(Config::get('enums')['object']));
            $table->enum('work_type', array_keys(Config::get('enums')['work_type']));

            $table->integer('start_date');
            $table->integer('end_date');

            $table->boolean('cancelled')->default(false);
            $table->boolean('booked_at_bib');

            $table->integer('space_id');
            $table->integer('booker_id');

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
        Schema::drop('bookings');
    }
}
