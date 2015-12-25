<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $casts = [
        'booked_at_bib' => 'boolean',
        'cancelled' => 'boolean',
        'id' => 'integer',
        'user_count' => 'integer',
        'used_id' => 'integer',
    ];

    protected $hidden = [
        'booked_at_bib',
        'created_at',
        'cancelled',
        'space',
        'space_id',
        'updated_at',
        'user_id',
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
