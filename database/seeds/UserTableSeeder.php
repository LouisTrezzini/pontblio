<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\User;
use App\Role;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->delete();

        $trancara = User::create([
            'username' => 'trancara',
            'email' => 'trancara@gmail.com',
            'password' => Hash::make('password'),
            'name' => 'Albéric Trancart',
        ]);

        $tata = User::create([
            'username' => 'taquet-c',
            'email' => 'tata@gmail.com',
            'password' => Hash::make('tata'),
            'name' => 'Cécile Taquet Gaspérini',
        ]);

        $tata->role_id = Role::where('name', 'gestion')->first()->id;
        $tata->save();

    }
}
