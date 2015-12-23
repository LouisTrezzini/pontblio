<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

use App\Role;

class CreateRoles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 40);
            $table->string('description', 255);
            $table->timestamps();
        });

        $gestion = new Role();
        $gestion->name         = 'gestion';
        $gestion->description  = 'Gestionnaire du module de réservation';
        $gestion->save();

        $biblio = new Role();
        $biblio->name         = 'biblio';
        $biblio->description  = 'Personnel de la bibliothèque';
        $biblio->save();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('roles');
    }
}
