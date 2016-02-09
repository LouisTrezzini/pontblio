<?php

namespace App\Http\Controllers;

use App\Image;
use Illuminate\Http\Request;

use App\Space;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use JWTAuth;
use Validator;

class SpaceController extends Controller
{
    private static function validationRules()
    {
        return [
            'active' => 'boolean',
            'capacity' => 'required|integer',
            'location' => 'required',
            'name' => 'required',
            'screen' => 'boolean',
            'whiteboard' => 'boolean',
        ];
    }

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
        if (!$this->getAuthUser()->hasRole('gestion')) {
            return response()->json(['errors' => 'Accès non autorisé.'], 401);
        }

        $validator = Validator::make($request->all(), self::validationRules());
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $space = new Space();

        $space->name = $request->get('name');
        $space->location = $request->get('location');
        $space->description = $request->get('description', '');
        $space->active = $request->get('active', false);
        $space->save();

        if ($request->has('image')) {
            $image = new Image();
            $space->image()->save($image);

            $image->fromBase64($request->get('image'), $request->get('image_ext'));
        }

        return response()->json($space, 201);
    }

    public function update(Request $request, $slug)
    {
        if (!$this->getAuthUser()->hasRole('gestion')) {
            return response()->json(['errors' => 'Accès non autorisé.'], 401);
        }

        $validator = Validator::make($request->all(), self::validationRules());
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $space = Space::findBySlugOrFail($slug);

        $space->name = $request->get('name');
        $space->location = $request->get('location');
        $space->description = $request->get('description', '');
        $space->active = $request->get('active', false);
        $space->save();

        if ($request->has('image')) {
            $space->image()->delete();

            $image = new Image();
            $space->image()->save($image);

            $image->fromBase64($request->get('image'), $request->get('image_ext'));
        }

        return response()->json($space, 200);
    }

    public function destroy($slug)
    {
        if (!$this->getAuthUser()->hasRole('gestion')) {
            return response()->json(['errors' => 'Accès non autorisé.'], 401);
        }

        $space = Space::findBySlugOrFail($slug);
        $space->delete();

        return response()->json(null, 204);
    }
}
