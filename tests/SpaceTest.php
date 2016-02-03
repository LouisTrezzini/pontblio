<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

use App\User;

class SpaceTest extends TestCase
{
    public function testIndex()
    {
        $tokenUser = JWTAuth::fromUser(User::where('username', 'trancara')->firstOrFail());

        $this->get('/api/spaces', [
            'HTTP_Authorization' => 'Bearer ' . $tokenUser
        ])
            ->seeStatusCode(200);
    }

    public function testStore()
    {
        $tokenAdmin = JWTAuth::fromUser(User::where('username', 'taquet-c')->firstOrFail());

        $this->post('/api/spaces', [], [
            'HTTP_Authorization' => 'Bearer ' . $tokenAdmin
        ])
            ->seeStatusCode(400);

        $this->post('/api/spaces', [
            'name' => 'Test Space',
            'location' => 'The Moon',
            'active' => true,
        ], [
            'HTTP_Authorization' => 'Bearer ' . $tokenAdmin
        ])
            ->seeStatusCode(201);

        $tokenUser = JWTAuth::fromUser(User::where('username', 'trancara')->firstOrFail());

        $this->post('/api/spaces', [], [
            'HTTP_Authorization' => 'Bearer ' . $tokenUser
        ])
            ->seeStatusCode(401);
    }

    public function testShow()
    {
        $tokenUser = JWTAuth::fromUser(User::where('username', 'trancara')->firstOrFail());

        $this->get('/api/spaces/test-space', [
            'HTTP_Authorization' => 'Bearer ' . $tokenUser
        ])->seeJson([
            'slug' => 'test-space',
        ]);

        $this->get('/api/spaces/lalala', [
            'HTTP_Authorization' => 'Bearer ' . $tokenUser
        ])
            ->seeStatusCode(404);
    }

    public function testUpdate()
    {
        $tokenAdmin = JWTAuth::fromUser(User::where('username', 'taquet-c')->firstOrFail());

        $this->patch('/api/spaces/test-space', [], [
            'HTTP_Authorization' => 'Bearer ' . $tokenAdmin
        ])->seeStatusCode(400);

        $tokenUser = JWTAuth::fromUser(User::where('username', 'trancara')->firstOrFail());

        $this->patch('/api/spaces/test-space', [], [
            'HTTP_Authorization' => 'Bearer ' . $tokenUser
        ])->seeStatusCode(401);
    }

    public function testDestroy()
    {
        $tokenUser = JWTAuth::fromUser(User::where('username', 'trancara')->firstOrFail());

        $this->delete('/api/spaces/test-space', [], [
            'HTTP_Authorization' => 'Bearer ' . $tokenUser
        ])
            ->seeStatusCode(401);

        $tokenAdmin = JWTAuth::fromUser(User::where('username', 'taquet-c')->firstOrFail());

        $this->delete('/api/spaces/test-space', [], [
            'HTTP_Authorization' => 'Bearer ' . $tokenAdmin
        ])
            ->seeStatusCode(204);

        $this->delete('/api/spaces/lalala', [], [
            'HTTP_Authorization' => 'Bearer ' . $tokenAdmin
        ])
            ->seeStatusCode(404);
    }
}
