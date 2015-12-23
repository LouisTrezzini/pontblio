<?php

namespace App\Http\Controllers;

use App\Booking;
use App\Space;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Validator;

class BookingController extends Controller
{
    private static $validationRules = [
        'name' => 'required',
        'location' => 'required',
        'active' => 'boolean'
    ];

    public function index()
    {
        return response()->json(Booking::all());
    }

    public function spaceBookings($slug)
    {
        $spaceId = Space::findBySlugOrFail($slug)->id;

        return response()->json(Booking::where('space_id', $spaceId)->get());
    }

    public function show($id)
    {
        return response()->json(Booking::findOrFail($id));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), self::$validationRules);
        if ($validator->fails()) {
            return response()->json(null, 400);
        }

        $space = new Booking($request->all());
        $space->save();

        return response()->json($space, 201);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), self::$validationRules);
        if ($validator->fails()) {
            return response()->json(null, 400);
        }

        $space = Booking::findOrFail($id);
        $space->update($request->all());

        return response()->json($space, 200);
    }

    public function destroy($id)
    {
        Booking::destroy($id);
        return response(null, 204);
    }
}
