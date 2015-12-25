<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;

use JWTAuth;
use Auth;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        // grab credentials from the request
        $credentials = $request->only('username', 'password');

        // attempt to verify the credentials and create a token for the user
        if (!Auth::once($credentials)) {
            return response()->json(['error' => 'invalid_credentials'], 401);
        }

        $user = Auth::user();

        $customClaims = [
            'role' => $user->role ? $user->role->name : ''
        ];

        try {
            $token = JWTAuth::fromUser($user, $customClaims);
        } catch (JWTException $e) {
            // something went wrong whilst attempting to encode the token
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        // all good so return the token
        return response()->json(['token' => $token]);
    }

    public function logout() {
        JWTAuth::parseToken()->invalidate();

        return response()->json(null, 200);
    }
}
