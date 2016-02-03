<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

use App\User;

class WebpageTest extends TestCase
{
    public function testIndex()
    {
        $tokenAdmin = JWTAuth::fromUser(User::where('username', 'taquet-c')->firstOrFail());

        $this->get('/api/webpages', [
            'HTTP_Authorization' => 'Bearer ' . $tokenAdmin
        ])
            ->seeStatusCode(404);
    }

    public function testStore()
    {
        $tokenAdmin = JWTAuth::fromUser(User::where('username', 'taquet-c')->firstOrFail());

        $this->post('/api/webpages', [], [
            'HTTP_Authorization' => 'Bearer ' . $tokenAdmin
        ])
            ->seeStatusCode(404);
    }

    public function testShow()
    {
        $tokenUser = JWTAuth::fromUser(User::where('username', 'trancara')->firstOrFail());

        $this->get('/api/webpages/home', [
                'HTTP_Authorization' => 'Bearer ' . $tokenUser
            ])->seeJson([
                'slug' => 'home',
            ]);

        $this->get('/api/webpages/lalala', [
            'HTTP_Authorization' => 'Bearer ' . $tokenUser
        ])
            ->seeStatusCode(404);
    }

    public function testUpdate()
    {
        $tokenAdmin = JWTAuth::fromUser(User::where('username', 'taquet-c')->firstOrFail());

        $this->patch('/api/webpages/home', [
            'content' => '<div>Hello</div>'
        ], [
            'HTTP_Authorization' => 'Bearer ' . $tokenAdmin
        ])->seeStatusCode(200);

        $tokenUser = JWTAuth::fromUser(User::where('username', 'trancara')->firstOrFail());

        $this->patch('/api/webpages/home', [
            'content' => '<div>Darkness</div>'
        ], [
            'HTTP_Authorization' => 'Bearer ' . $tokenUser
        ])->seeStatusCode(401);
    }

    public function testDestroy()
    {
        $tokenAdmin = JWTAuth::fromUser(User::where('username', 'taquet-c')->firstOrFail());

        $this->delete('/api/webpages/home', [

        ], [
            'HTTP_Authorization' => 'Bearer ' . $tokenAdmin
        ])
            ->seeStatusCode(405);
    }
}
