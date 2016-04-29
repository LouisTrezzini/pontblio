<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;

use JWTAuth;

use Exception;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

abstract class Controller extends BaseController
{
    use DispatchesJobs, ValidatesRequests;

    /**
     * @return \App\User $user
     */
    public function getAuthUser()
    {
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            throw new NotFoundHttpException;
        }

        return $user;
    }

    /**
     * Returns proper syntax for validator filter.
     *
     * @param string $name
     *
     * @return string
     */
    public static function enumValidator($name)
    {
        $enum_values = \Config::get('enum')[$name];
        $result = '';
        if (!is_null($enum_values)) {
            foreach ($enum_values as $key => $value) {
                if ($value === end($enum_values)) {
                    $result .= $key;
                } else {
                    $result .= $key.',';
                }
            }
            return 'in:'.$result;
        } else {
            return '';
        }
    }
}
