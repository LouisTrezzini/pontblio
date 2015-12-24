<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

use Storage;
use IntervImage;

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
    public static function createFromBase64($base64, $ext)
    {
        $image = Image::create();

        //decode base64 string
        $data = base64_decode($base64);

        $image->path = 'imgs/uploads/' . $image->id . '.' . $ext;

        //TODO : storage

        file_put_contents(public_path() . '/' . $image->path, $data);

        $image->save();

        $imgFile = IntervImage::make($image->path);
        $imgFile->fit(600, 400);
        $imgFile->save($image->path);

        return $image;
    }
}
