<?php

namespace App\Http\Controllers;

use App\Booking;
use App\Space;
use App\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use DB;
use Mail;
use Validator;

class BookingController extends Controller
{
    private static function validationRules()
    {
        return [
            'space_slug' => 'required',
            'user_count' => 'required|integer|min:1|max:10',
            'object' => 'required|' . self::enumValidator('object'),
            'work_type' => 'required|' . self::enumValidator('work_type'),
            'start_date' => 'required',
            'end_date' => 'required'
        ];
    }

    //TODO : serialization
    public function index()
    {
        return response()->json(Booking::all());
    }

    public function userBookings()
    {
        if ($this->getAuthUser()->hasRole(['biblio', 'gestion'])) {
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
        if ($this->getAuthUser()->blocked) {
            return response()->json(['errors' => ['Utilisateur bloqué. Contactez la bibliothèque.']], 401);
        }

        $booking = new Booking();

        $response = $this->bookingValidation($booking, $request);

        return $response;
    }

    public function update(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        $response = $this->bookingValidation($booking, $request, true);

        if ($this->getAuthUser()->hasRole(['biblio', 'gestion'])) {
            Mail::send('emails.modification', ['booking' => $booking], function ($mail) use ($booking) {
                $mail->to($booking->booker->email, $booking->booker->name)->subject('Votre réservation a été modifiée');
            });
        }

        return $response;
    }

    public function destroy($id)
    {
        $booking = Booking::findOrFail($id);

        if (!$this->getAuthUser()->hasRole('gestion') && $this->getAuthUser()->id != $booking->booker_id) {
            return response()->json(['errors' => 'Accès non autorisé.'], 401);
        }

        Mail::send('emails.deleted', ['booking' => $booking], function ($mail) use ($booking) {
            $mail->to($booking->booker->email, $booking->booker->name)->subject('Votre réservation a été supprimée');
        });

        $booking->delete();
        return response(null, 204);
    }

    /**
     * @param $booking Booking
     * @param $request Request
     * @param $editing boolean
     * @return Booking
     */
    private function bookingValidation(&$booking, $request, $editing = false)
    {
        $validator = Validator::make($request->all(), self::validationRules());

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $booking->space_id = Space::findBySlugOrFail($request->get('space_slug'))->id;
        $booking->user_count = $request->get('user_count');

        $booking->object = $request->get('object');
        $booking->work_type = $request->get('work_type');

        $booking->start_date = $request->get('start_date');
        $booking->end_date = $request->get('end_date');

        $booking->booked_at_bib = $this->getAuthUser()->hasRole(['biblio', 'gestion']);

        if(!$editing) {
            if ($this->getAuthUser()->hasRole(['biblio', 'gestion'])) {
                if ($request->has('booker_username')) {
                    $booker = User::where('username', $request->get('booker_username'))->firstOrFail();
                    $booking->booker_id = $booker->id;
                } else {
                    throw new BadRequestHttpException('Vous devez réserver au nom de quelqu\'un');
                }
            } else {
                $booking->booker_id = $this->getAuthUser()->id;
            }

            $booking->departement = $booking->booker->departement;
            $booking->user_profile = $booking->booker->user_profile;
            $booking->user_profile_details = $booking->booker->user_profile_details;
        }

        if($editing) {
            $query = 'SELECT COUNT(*) AS nb FROM bookings WHERE space_id = ?  AND id <> ?  AND ( start_date BETWEEN ? AND ? OR end_date BETWEEN ? AND ? OR (start_date <= ? AND end_date >= ?))';
            $result = DB::select($query, [
                $booking->space_id,
                $booking->id,
                $booking->start_date,
                $booking->end_date,
                $booking->start_date,
                $booking->end_date,
                $booking->start_date,
                $booking->end_date,
            ]);
        }
        else {
            $query = 'SELECT COUNT(*) AS nb FROM bookings WHERE space_id = ? AND ( start_date BETWEEN ? AND ? OR end_date BETWEEN ? AND ? OR (start_date <= ? AND end_date >= ?))';
            $result = DB::select($query, [
                $booking->space_id,
                $booking->start_date,
                $booking->end_date,
                $booking->start_date,
                $booking->end_date,
                $booking->start_date,
                $booking->end_date,
            ]);
        }

        if($result[0]->nb) {
            throw new BadRequestHttpException('Espace occupé');
        }

        $booking->save();

        return response()->json($booking, $editing ? 200 : 201);
    }
}
