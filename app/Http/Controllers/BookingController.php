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
        'space' => 'required',
        'user_count' => 'required',
        'reason' => 'required',
        'start_date' => 'required',
        'end_date' => 'required'
    ];

    //TODO : serialization
    public function index()
    {
        return response()->json(Booking::all());
    }

    public function userBookings()
    {
        if($this->getAuthUser()->hasRole(['biblio', 'gestion'])) {
            return response()->json(Booking::all());
        } else {
            return response()->json($this->getAuthUser()->bookings);
        }
    }

    public function spaceBookings($slug)
    {
        $bookingId = Space::findBySlugOrFail($slug)->id;

        return response()->json(Booking::where('space_id', $bookingId)->get());
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

        $booking = new Booking($request->all());
        $booking->save();

        return response()->json($booking, 201);
    }

    public function update(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        if (!$this->getAuthUser()->hasRole(['biblio', 'gestion']) && $this->getAuthUser() !== $booking->booker) {
            return response()->json(null, 401);
        }

        $validator = Validator::make($request->all(), self::$validationRules);
        if ($validator->fails()) {
            return response()->json(null, 400);
        }

        $booking->update($request->all());

        return response()->json($booking, 200);
    }

    public function destroy($id)
    {
        $booking = Booking::findOrFail($id);

        if (!$this->getAuthUser()->hasRole('gestion') && $this->getAuthUser() !== $booking->booker) {
            return response()->json(null, 401);
        }

        $booking->delete();
        return response(null, 204);
    }
}
