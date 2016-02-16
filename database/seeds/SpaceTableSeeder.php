<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\Space;
use App\Image;

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

        $files = glob(public_path() . '/imgs/uploads/*'); // get all file names
        foreach($files as $file){ // iterate files
            if(is_file($file))
                unlink($file); // delete file
        }

        if(!file_exists(public_path() . '/imgs/uploads'))
            mkdir(public_path() . '/imgs/uploads');


/*        $plaza = Space::create([
            'name' => 'Plaza Athénée Paris',
            'location' => 'Avenue Montaigne',
            'description' => 'Le Plaza Athénée est un palace situé au 25, avenue Montaigne, une des artères bordant le «Triangle d\'or», dans le quartier des Champs-Élysées du 8e arrondissement de Paris. Il appartient au groupe Dorchester Collection.',
            'active' => true,
            'capacity' => 500,
        ]);

        $plaza_image = new Image();
        $plaza->image()->save($plaza_image);
        $plaza_image->fromData(
            file_get_contents(public_path() . '/imgs/plaza_athene.jpg'),
            'jpg'
        );

        $langham = Space::create([
            'name' => 'Langham Place Hotel',
            'location' => '555 Shanghai Street, Mong Kok, Hong Kong',
            'description' => 'The hotel has 665 guest rooms and four restaurants, including the two-Michelin-starred Chinese restaurant, Ming Court, awarded in the 2009 Hong Kong and Macau edition of the Michelin Guide.',
            'active' => false,
            'capacity' => 300,
        ]);

        $langham_image = new Image();
        $langham->image()->save($langham_image);
        $langham_image->fromData(
            file_get_contents(public_path() . '/imgs/langham_place_mongkok.jpg'),
            'jpg'
        );*/

        Space::create([
            'name' => 'Bocal',
            'active' => true,
            'capacity' => 6,
            'screen' => true,
        ]);

        Space::create([
            'name' => 'Petite Ruche',
            'active' => true,
            'capacity' => 6,
            'screen' => true,
            'whiteboard' => true,
        ]);

        Space::create([
            'name' => 'Espace Jean Rouch',
            'active' => true,
            'capacity' => 8,
            'screen' => true,
            'whiteboard' => true,
        ]);

        Space::create([
            'name' => 'Espace Raymond Aubrac',
            'active' => true,
            'capacity' => 3,
            'whiteboard' => true,
        ]);
    }
}
