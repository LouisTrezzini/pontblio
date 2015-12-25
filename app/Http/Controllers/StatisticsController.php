<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Space;
use App\Booking;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class StatisticsController extends Controller
{


    public function main()
    {
        $cancelled = Booking::where('cancelled', true)->count();
        $total = Booking::all()->count();
        $modified = Booking::whereRaw('updated_at != created_at')->count();
        $unmodified = $total - $cancelled - $modified;

        $bookedAtBib = Booking::where('booked_at_bib', true)->count();
        $bookedOnline = $total - $bookedAtBib;

        $output = [
            'types' =>
                [
                    ['name' => 'Total', 'y' => $total],
                    ['name' => 'Non modifiées', 'y' => $unmodified],
                    ['name' => 'Modifiées', 'y' => $modified],
                    ['name' => 'Annulées', 'y' => $cancelled]
                ],
            'modes' =>
                [
                    ['name' => 'Total', 'y' => $total],
                    ['name' => 'Accueil de la bibliothèque', 'y' => $bookedAtBib],
                    ['name' => 'En ligne', 'y' => $bookedOnline],
                ],
            'aheadplan' =>
                [

                ]
        ];


        return response()->json($output, 200);
    }

    public function user($id)
    {
        return response()->json([], 200);
    }
}
