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

        ];
    }

    public function index()
    {
        return response()->json(User::all());
    }

    public function show($username)
    {
        return response()->json(User::where('username', $username)->firstOrFail());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), self::$validationRules);
        if ($validator->fails()) {
            return response()->json(null, 400);
        }

        $user = new User($request->all());
        $user->save();

        return response()->json($user, 201);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), self::$validationRules);
        if ($validator->fails()) {
            return response()->json(null, 400);
        }

        $user = User::findOrFail($id);
        $user->update($request->all());

        return response()->json($user, 200);
    }

    public function destroy($id)
    {
        User::destroy($id);
        return response(null, 204);
    }
}
