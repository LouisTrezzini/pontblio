<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that should not be reported.
     *
     * @var array
     */
    protected $dontReport = [
        \Symfony\Component\HttpKernel\Exception\HttpException::class,
    ];

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception  $e
     * @return void
     */
    public function report(Exception $e)
    {
        return parent::report($e);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $e
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $e)
    {
        if ($e instanceof TokenExpiredException) {
            return response()->json(['errors' => ['token_expired']], 401);
        } else if ($e instanceof TokenInvalidException) {
            return response()->json(['errors' => ['token_invalid']], 401);
        } else if ($e instanceof NotFoundHttpException || $e instanceof ModelNotFoundException) {
            return response()->json(['errors' => ['entry_not_found']], 404);
        } else if ($e instanceof JWTException) {
            return response()->json(['errors' => ['token_absent']], 401);
        } else if ($e instanceof BadRequestHttpException) {
            return response()->json(['errors' => [$e->getMessage()]], 400);
        }

        return parent::render($request, $e);
    }
}
