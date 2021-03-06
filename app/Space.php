<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Cviebrock\EloquentSluggable\SluggableInterface;
use Cviebrock\EloquentSluggable\SluggableTrait;

class Space extends Model implements SluggableInterface
{
    use SluggableTrait;

    protected $sluggable = [
        'build_from' => 'name',
        'save_to' => 'slug',
    ];

    protected $casts = [
        'active' => 'boolean',
        'capacity' => 'integer',
        'id' => 'integer',
        'screen' => 'boolean',
        'whiteboard' => 'boolean',
    ];

    protected $visible = [
        'active',
        'capacity',
        'description',
        'image_url',
        'location',
        'name',
        'screen',
        'slug',
        'whiteboard',
    ];

    protected $appends = ['image_url'];

    public function bookings()
    {
        return $this->hasMany('App\Booking');
    }

    public function image()
    {
        return $this->morphOne('App\Image', 'imageable');
    }

    public function getImageUrlAttribute()
    {
        if ($this->image) {
            return $this->image->path;
        } else
            return null;
    }
}
