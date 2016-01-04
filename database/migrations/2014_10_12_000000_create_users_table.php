<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->string('password', 60);

            $table->string('name')->nullable();

            $table->enum('user_profile', array_keys(Config::get('enums')['user_profile']));
            $table->enum('user_profile_details', array_keys(
                array_merge(
                    Config::get('enums')['user_profile_aue'],
                    Config::get('enums')['user_profile_inge'],
                    Config::get('enums')['user_profile_master'],
                    Config::get('enums')['user_profile_master_spec'],
                    Config::get('enums')['user_profile_other']
                )
            ));
            $table->enum('departement', array_keys(Config::get('enums')['departement']));


            $table->integer('role_id')->nullable();

            $table->boolean('blocked')->default(false);

            $table->rememberToken();
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
        Schema::drop('users');
    }
}
