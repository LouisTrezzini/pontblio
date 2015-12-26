<?php

namespace App\Http\Middleware;

use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\JWTAuth;
use Illuminate\Events\Dispatcher;
use Illuminate\Routing\ResponseFactory;

class JWTAuthenticate
{

    /**
     * @var \Illuminate\Routing\ResponseFactory
     */
    protected $response;
    /**
     * @var \Illuminate\Events\Dispatcher
     */
    protected $events;
    /**
     * @var \Tymon\JWTAuth\JWTAuth
     */
    protected $auth;
    /**
     * Create a new BaseMiddleware instance
     *
     * @param \Illuminate\Routing\ResponseFactory  $response
     * @param \Illuminate\Events\Dispatcher  $events
     * @param \Tymon\JWTAuth\JWTAuth  $auth
     */
    public function __construct(ResponseFactory $response, Dispatcher $events, JWTAuth $auth)
    {
        $this->response = $response;
        $this->events = $events;
        $this->auth = $auth;
    }

    /**
     * Fire event and return the response
     *
     * @param  string   $event
     * @param  string   $error
     * @param  integer  $status
     * @param  array    $payload
     * @return mixed
     */
    protected function respond($event, $error, $status, $payload = [])
    {
        $response = $this->events->fire($event, $payload, true);
        return $response ?: $this->response->json(['errors' => [$error]], $status);
    }


    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, \Closure $next)
    {
        if (! $token = $this->auth->setRequest($request)->getToken()) {
            return $this->respond('tymon.jwt.absent', 'token_not_provided', 401);
        }
        try {
            $user = $this->auth->authenticate($token);
        } catch (TokenExpiredException $e) {
            return $this->respond('tymon.jwt.expired', 'token_expired', 401, [$e]);
        } catch (JWTException $e) {
            return $this->respond('tymon.jwt.invalid', 'token_invalid', 401, [$e]);
        }
        if (! $user) {
            return $this->respond('tymon.jwt.user_not_found', 'user_not_found', 401);
        }
        $this->events->fire('tymon.jwt.valid', $user);
        return $next($request);
    }
}
