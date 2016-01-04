<?php
namespace App;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;

class User extends Model implements AuthenticatableContract, CanResetPasswordContract
{

    use Authenticatable, CanResetPassword;
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'users';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'email', 'password'];

    protected $casts = [
        'blocked' => 'boolean',
        'id' => 'integer'
    ];

    protected $visible = [
        'name',
        'email',
        'username',
        'id',
        'user_profile',
        'user_profile_details',
        'departement'
    ];

    public function bookings()
    {
        return $this->hasMany('App\Booking', 'booker_id', 'id');
    }

    public function role()
    {
        return $this->hasOne('App\Role', 'id', 'role_id');
    }

    public function hasRole($roles)
    {
        if ($this->getUserRole() === null)
            return false;

        // Check if the user is a root account
        if ($this->getUserRole()->name == 'root') {
            return true;
        }
        if (is_array($roles)) {
            foreach ($roles as $need_role) {
                if ($this->checkIfUserHasRole($need_role)) {
                    return true;
                }
            }
        } else {
            return $this->checkIfUserHasRole($roles);
        }
        return false;
    }

    private function getUserRole()
    {
        return $this->role;
    }

    private function checkIfUserHasRole($need_role)
    {
        return (strtolower($need_role) == strtolower($this->role->name)) ? true : false;
    }
}
