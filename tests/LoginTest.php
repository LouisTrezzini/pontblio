<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

use App\User;

class LoginTest extends TestCase
{
    public function testLogin()
    {
        $this->post('/api/login', [
            'username' => 'taquet-c',
            'password' => 'tata'
        ])
            ->seeStatusCode(200);
    }
}
