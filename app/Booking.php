<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    public function space()
    {
        return $this->belongsTo('App\Space');
    }

    public function booker()
    {
        return $this->belongsTo('App\User');
    }
}
