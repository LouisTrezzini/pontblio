<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

use JWTAuth;

class Booking extends Model
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $casts = [
        'booked_at_bib' => 'boolean',
        'cancelled' => 'boolean',
        'end_date' => 'integer',
        'id' => 'integer',
        'start_date' => 'integer',
        'user_count' => 'integer',
        'used_id' => 'integer',
    ];

    protected $visible = [
        'booker_name',
        'end_date',
        'id',
        'object',
        'space_slug',
        'start_date',
        'user_count',
        'work_type',
    ];

    protected $appends = ['booker_name', 'space_slug'];

    public function space()
    {
        return $this->belongsTo('App\Space');
    }

    public function booker()
    {
        return $this->belongsTo('App\User');
    }

    public function getSpaceSlugAttribute()
    {
        return $this->space->slug;
    }

    public function getBookerNameAttribute()
    {
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            throw new NotFoundHttpException;
        }

        if($user->hasRole(['biblio', 'gestion']) || $user->id == $this->booker->id) {
            return $this->booker->name;
        }
        else
            return 'Occupé';
    }

    public function scopeInterval($query, $from, $to) {
        // mktime(0, 0, 0, date('n', $from), date('j', $from), date('Y', $from))
        if(!is_null($from))
            $query = $query->where('start_date', '>=', $from);

        // mktime(0, 0, 0, date('n', $to), date('j', $to) + 1, date('Y', $to))
        if(!is_null($to))
            $query = $query->where('start_date', '<=', $to);

        return $query;
    }
}
