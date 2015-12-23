<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Space;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class SpaceController extends Controller
{
    public function main()
    {
        return response()->json([], 200);
    }

    public function user($id)
    {
        return response()->json([], 200);
    }
}
