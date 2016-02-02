<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

use App\User;

class UserTest extends TestCase
{
    public function testIndex()
    {
        $tokenAdmin = JWTAuth::fromUser(User::where('username', 'taquet-c')->firstOrFail());

        $this->get('/api/users', [
            'HTTP_Authorization' => 'Bearer ' . $tokenAdmin
        ])
            ->seeStatusCode(200);
    }

    public function testShow()
    {
        $tokenAdmin = JWTAuth::fromUser(User::where('username', 'taquet-c')->firstOrFail());

        $this->get('/api/users/taquet-c', [
                'HTTP_Authorization' => 'Bearer ' . $tokenAdmin
            ])->seeJson([
                'id' => 2,
                'username' => 'taquet-c',
            ]);

        $this->get('/api/users/lalala', [
            'HTTP_Authorization' => 'Bearer ' . $tokenAdmin
        ])
            ->seeStatusCode(404);
    }

    public function testStore()
    {
        $tokenAdmin = JWTAuth::fromUser(User::where('username', 'taquet-c')->firstOrFail());

        $this->post('/api/users', [], [
            'HTTP_Authorization' => 'Bearer ' . $tokenAdmin
        ])
            ->seeStatusCode(405);
    }

    public function testUpdate()
    {
        $tokenAdmin = JWTAuth::fromUser(User::where('username', 'taquet-c')->firstOrFail());

        $this->patch('/api/users/taquet-c', [
            'departement' => 'vet',
            'user_profile' => 'user_profile_inge',
            'user_profile_details' => '2a'
        ], [
            'HTTP_Authorization' => 'Bearer ' . $tokenAdmin
        ])->seeJsonEquals([
            'id' => 2,
            'username' => 'taquet-c',
            'email' => 'tata@gmail.com',
            'name' => 'Cécile Taquet Gaspérini',
            'user_profile' => 'user_profile_inge',
            'user_profile_details' => '2a',
            'departement' => 'vet'
        ]);
    }

    public function testDestroy()
    {
        $tokenAdmin = JWTAuth::fromUser(User::where('username', 'taquet-c')->firstOrFail());

        $this->delete('/api/users/lalala', [

        ], [
            'HTTP_Authorization' => 'Bearer ' . $tokenAdmin
        ])
            ->seeStatusCode(405);
    }
}
