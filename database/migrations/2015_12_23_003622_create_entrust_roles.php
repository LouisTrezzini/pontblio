<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

use App\Role;

class CreateEntrustRoles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $gestion = new Role();
        $gestion->name         = 'gestion';
        $gestion->display_name = 'Gestion'; // optional
        $gestion->description  = 'Gestionnaire du module de réservation'; // optional
        $gestion->save();

        $biblio = new Role();
        $biblio->name         = 'biblio';
        $biblio->display_name = 'Personnel de la bibliothèque'; // optional
        $biblio->description  = 'Quiconque possédant des droits de modérateur'; // optional
        $biblio->save();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        foreach(Role::all() as $role){
            $role->delete();
        }
    }
}
