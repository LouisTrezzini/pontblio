<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;

use JWTAuth;

use Exception;

abstract class Controller extends BaseController
{
    use DispatchesJobs, ValidatesRequests;

    /**
     * @return \App\User $user
     */
    public function getAuthUser()
    {
        return JWTAuth::parseToken()->authenticate();
    }
}
