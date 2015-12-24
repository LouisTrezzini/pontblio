<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

use Storage;

class Image extends Model
{
    public function imageable()
    {
        return $this->morphTo();
    }

    /**
     * @param Request $request
     * @return \App\Image
     */
    public static function createFromRequest(Request $request){
        $file = $request->file('file');

        $image = Image::create();


        //TODO : storage
        $image->path = 'images/'.$image->id.'.'.$file->guessExtension();

//        try {

            Storage::put(
                $image->path,
                file_get_contents($file->getRealPath())
            );

            $image->save();
//        }
//        catch (\Exception $e){
//            $image->delete();
//        }

        return $image;
    }
}
