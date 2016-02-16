<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

use App\User;

class BookingTest extends TestCase
{
    private $bookingId;

    public function testIndex()
    {
        $tokenUser = JWTAuth::fromUser(User::where('username', 'trancara')->firstOrFail());

        $this->get('/api/bookings', [
            'HTTP_Authorization' => 'Bearer ' . $tokenUser
        ])
            ->seeStatusCode(405);
    }

    public function testStore()
    {
        $tokenUser = JWTAuth::fromUser(User::where('username', 'trancara')->firstOrFail());

        $this->post('/api/bookings', [], [
            'HTTP_Authorization' => 'Bearer ' . $tokenUser
        ])
            ->seeStatusCode(400);

        $request = $this->post('/api/bookings', [
            'space_slug' => 'bocal',
            'user_count' => '2',
            'object' => 'solo',
            'work_type' => 'skype',
            'start_date' => time(),
            'end_date' => time() + 3600,
        ], [
            'HTTP_Authorization' => 'Bearer ' . $tokenUser
        ]);

        $request->seeStatusCode(201);

        return json_decode($this->response->getContent(), true)['id'];
    }

    /**
     * @depends testStore
     */
    public function testShow($id)
    {
        $tokenUser = JWTAuth::fromUser(User::where('username', 'trancara')->firstOrFail());

        $this->get('/api/bookings/' . $id, [
            'HTTP_Authorization' => 'Bearer ' . $tokenUser
        ])->seeStatusCode(200);

        $this->get('/api/bookings/wtf', [
            'HTTP_Authorization' => 'Bearer ' . $tokenUser
        ])
            ->seeStatusCode(404);

        return $id;
    }


    /**
     * @depends testShow
     */
    public function testUpdate($id)
    {
//        $tokenAdmin = JWTAuth::fromUser(User::where('username', 'taquet-c')->firstOrFail());
//
//        $request = $this->patch('/api/bookings/' . $id, [
//            'work_type' => 'exam',
//        ], [
//            'HTTP_Authorization' => 'Bearer ' . $tokenAdmin
//        ]);
//
//        print_r(json_decode($this->response->getContent(), true));
//
//        $request->seeStatusCode(400);

//        $tokenUser = JWTAuth::fromUser(User::where('username', 'trancara')->firstOrFail());
//
//        $this->patch('/api/bookings/' . $id, [], [
//            'HTTP_Authorization' => 'Bearer ' . $tokenUser
//        ])->seeStatusCode(401);

        return $id;
    }

    /**
     * @depends testUpdate
     */
    public function testDestroy($id)
    {
        $tokenUser = JWTAuth::fromUser(User::where('username', 'trancara')->firstOrFail());

        $this->delete('/api/bookings/' . $id, [], [
            'HTTP_Authorization' => 'Bearer ' . $tokenUser
        ])
            ->seeStatusCode(204);

        $tokenAdmin = JWTAuth::fromUser(User::where('username', 'taquet-c')->firstOrFail());

        $this->delete('/api/bookings/lalala', [], [
            'HTTP_Authorization' => 'Bearer ' . $tokenAdmin
        ])
            ->seeStatusCode(404);
    }
}
