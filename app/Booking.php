<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
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
        'end_date',
        'id',
        'object',
        'space_slug',
        'start_date',
        'user_count',
        'work_type',
    ];

    protected $appends = ['space_slug'];

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
}
