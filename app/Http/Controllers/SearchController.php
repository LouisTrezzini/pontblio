<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\User;
use App\Http\Requests;
use App\Http\Controllers\Controller;

use DB;

class SearchController extends Controller
{
    /**
     * Display the specified resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function searchUsers(Request $request)
    {
        $searchText = $request->get('searchText');

        $searchTerms = explode(' ', $searchText);

        $query = DB::table('users');

        foreach($searchTerms as $term)
        {
            $query->where('name', 'LIKE', '%'. $term .'%');
        }

        $results = $query->take(10)->get();

        return response()->json($results, 200);
    }
}
