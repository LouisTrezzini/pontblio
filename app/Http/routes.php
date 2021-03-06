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

Route::group(['prefix' => '/api/', 'middleware' => 'pontblio.auth'], function () {
    Route::get('bookings/{date}/{mode}', 'BookingController@index');
    Route::resource('bookings', 'BookingController', ['except' => ['index', 'create', 'edit']]);
    Route::resource('spaces', 'SpaceController', ['except' => ['create', 'edit']]);
    Route::resource('users', 'UserController', ['except' => ['create', 'store', 'edit', 'destroy']]);
    Route::resource('webpages', 'WebpageController', ['only' => ['show', 'update']]);
    Route::get('statistics/main', 'StatisticsController@main');
    Route::get('statistics/user/{id}', 'StatisticsController@user');
    Route::get('spaces/{slug}/bookings/{date}/{mode}', 'BookingController@spaceBookings');
    Route::get('own/bookings', 'BookingController@userBookings');
    Route::post('search/users', 'SearchController@searchUsers');
});

Route::post('/api/login', 'LoginController@login');
Route::get('/api/logout', 'LoginController@logout');

Route::get('/enums', function () {
    return response()->json(Config::get('enums'), 200);
});

Route::get('/', function () {
    return view('index');
});
