<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\Space;

class SpaceTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('spaces')->delete();

        $plaza = Space::create([
            'name' => 'Plaza Athénée Paris',
            'location' => 'Avenue Montaigne',
            'description' =>
                'Le Plaza Athénée est un palace situé au 25, avenue Montaigne, une des artères bordant
                le « Triangle d\'or », dans le quartier des Champs-Élysées du 8e arrondissement de Paris.
                Il appartient au groupe Dorchester Collection.',
            'active' => true,
        ]);

        $langham = Space::create([
            'name' => 'Langham Place Hotel',
            'location' => '555 Shanghai Street, Mong Kok, Hong Kong',
            'description' => 'The hotel has 665 guest rooms and four restaurants, including the two-Michelin-starred
            Chinese restaurant, Ming Court, awarded in the 2009 Hong Kong and Macau edition of the Michelin Guide.',
            'active' => 'false',
        ]);
    }
}
