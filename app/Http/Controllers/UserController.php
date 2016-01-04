<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Validator;

class UserController extends Controller
{
    private static function validationRules()
    {
        return [
            'user_profile' => self::enumValidator('user_profile'),
            'departement' => self::enumValidator('departement'),
        ];
    }

    public function index()
    {
        return response()->json(User::all());
    }

    public function show($username)
    {
        if (!$this->getAuthUser()->hasRole(['biblio', 'gestion']) && $this->getAuthUser()->username != $username) {
            return response()->json(['errors' => 'Accès non autorisé.'], 401);
        }

        return response()->json(User::where('username', $username)->firstOrFail(), 200);
    }

    public function store(Request $request)
    {
        if (!$this->getAuthUser()->hasRole(['biblio', 'gestion'])) {
            return response()->json(['errors' => 'Accès non autorisé.'], 401);
        }

        $validator = Validator::make($request->all(), self::validationRules());
        if ($validator->fails()) {
            return response()->json(null, 400);
        }

        $user = new User($request->all());
        $user->save();

        return response()->json($user, 201);
    }

    public function update(Request $request, $username)
    {
        if (!$this->getAuthUser()->hasRole(['biblio', 'gestion']) && $this->getAuthUser()->username != $username) {
            return response()->json(['errors' => 'Accès non autorisé.'], 401);
        }

        $validator = Validator::make($request->all(), self::validationRules());
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $user = User::where('username', $username)->firstOrFail();

        $user->departement = $request->get('departement');
        $user->user_profile = $request->get('user_profile');
        $user->user_profile_details = $request->get('user_profile_details');

        $user->save();

        return response()->json($user, 200);
    }

    public function destroy($username)
    {
        if (!$this->getAuthUser()->hasRole(['biblio', 'gestion'])) {
            return response()->json(['errors' => 'Accès non autorisé.'], 401);
        }

        $user = User::where('username', $username)->firstOrFail();
        $user->destroy();

        return response(null, 204);
    }
}
