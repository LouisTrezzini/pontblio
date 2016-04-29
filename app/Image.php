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
    public function fromBase64($base64, $ext)
    {
        return $this->fromData(base64_decode($base64), $ext);
    }

    public function fromData($data, $ext)
    {
        $this->path = 'imgs/uploads/' . $this->id . '.' . $ext;

        $this->save();

        //TODO : storage

        file_put_contents(public_path($this->path), $data);

        $imgFile = IntervImage::make(public_path($this->path));
        $imgFile->fit(600, 400);
        $imgFile->save(public_path($this->path));

        return $this;
    }
}
