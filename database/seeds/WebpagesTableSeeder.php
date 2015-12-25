<?php

use Illuminate\Database\Seeder;

use App\Webpage;

class WebpagesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('webpages')->delete();

        Webpage::create([
            'name' => 'home',
            'content' => '<h1>HELLO</h1>'
        ]);
    }
}
