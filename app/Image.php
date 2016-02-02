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
        return self::createFromData(base64_decode($base64), $ext);
    }

    public static function createFromData($data, $ext)
    {
        $image = Image::create();

        $image->path = 'imgs/uploads/' . $image->id . '.' . $ext;

        $image->save();

        //TODO : storage

        file_put_contents(public_path($image->path), $data);

        $imgFile = IntervImage::make(public_path($image->path));
        $imgFile->fit(600, 400);
        $imgFile->save(public_path($image->path));

        return $image;
    }
}
