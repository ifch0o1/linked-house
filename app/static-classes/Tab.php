<?php

/*
|---------------------------------------------
| Tab helper functions
|---------------------------------------------
|
| This file contents simple and may be not so simple
| tab functions.
*/

namespace StaticClasses;

use Illuminate\Support\Facades\DB;

class Tab {

	/*
		TODO Important!
		tab_id in openshift database missing unique index.

		TODO Important!
		Backup localhost database - tab_id is now unique.
	*/

	public static function getMaxId() {
		$result = DB::select('SELECT MAX(tab_id) AS id FROM tabs');
        return $result[0]->id;
	}

	public static function add($name, $userId, $tabId = null) {
		$user = DB::table('users')->where('user_id', $userId)->first();
		if (!isset($user->user_id)) {
			App::abort(500, 'Cannot find user id.');
		}

		$id = $tabId ? $tabId : self::getMaxId() + 1;
		DB::insert('INSERT INTO tabs(user_id, tab_name, tab_id) VALUES (?, ?, ?)', 
			array($userId, $name, $id));

		return $id;
	}
}