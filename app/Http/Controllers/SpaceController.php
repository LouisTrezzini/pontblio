<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Space;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use JWTAuth;
use Validator;

class SpaceController extends Controller
{
    private static $validationRules = [
        'name' => 'required',
        'location' => 'required',
        'active' => 'boolean'
    ];

    public function index()
    {
        return response()->json(Space::all());
    }

    public function show($slug)
    {
        return response()->json(Space::findBySlugOrFail($slug));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), self::$validationRules);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $space = new Space();

        $space->name = $request->get('name');
        $space->location = $request->get('location');
        $space->description = $request->get('description', '');
        $space->active = $request->get('active', false);

        $space->save();

        return response()->json($space, 201);
    }

    public function update(Request $request, $slug)
    {
        $validator = Validator::make($request->all(), self::$validationRules);
        if ($validator->fails()) {
            return response()->json(null, 400);
        }

        $space = Space::findBySlugOrFail($slug);

        $space->name = $request->get('name');
        $space->location = $request->get('location');
        $space->description = $request->get('description', '');
        $space->active = $request->get('active', false);

        $space->save();

        return response()->json($space, 200);
    }

    public function destroy($slug)
    {
        $space = Space::findBySlugOrFail($slug);
        $space->delete();

        return response()->json(null, 204);
    }
}
