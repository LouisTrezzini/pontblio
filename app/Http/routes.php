<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::group(['prefix' => '/api/'/*, 'middleware' => 'jwt.auth'*/], function () {
    Route::resource('bookings', 'BookingController', ['except' => ['create', 'edit']]);
    Route::resource('spaces', 'SpaceController', ['except' => ['create', 'edit']]);
    Route::resource('users', 'UserController', ['except' => ['create', 'edit']]);
    Route::get('statistics/main', 'StatisticsController@main');
    Route::get('statistics/user/{id}', 'StatisticsController@user');
    Route::get('spaces/{slug}/bookings', 'BookingController@spaceBookings');
    Route::get('own/bookings', 'BookingController@userBookings');
});

Route::post('/api/login', 'LoginController@login');
Route::get('/api/logout', 'LoginController@logout');

Route::get('/', function() {
    return view('index');
});
