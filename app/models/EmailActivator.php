<?php

class EmailActivator {
	private static $token;
	private static $userId;
	private static $email;

	public static function init($userId, $email) {
		self::$userId = $userId;
		self::$email = $email;
	}

	// This function will also rewrite the private static member $userId if argument is provided.
	public static function getEmail($userId = null) {
		if (isset($userId)) self::$userId = $userId;
		if (!isset(self::$userId)) App::abort(500, 'Server error - Cannot get email address on unknow user.');

		$result = DB::table('users')->where('user_id', self::$userId)->first();
		return $result->user_email;
	}

	/*-------------------------------
	| sendMail function:
	| -------------------------------
	| If this function is called with any parameters,
	| it will change the private fields in this class.
	| It's equal to call init() method.
	|--------------------------------
	*/
	public static function sendMail($userId = null, $email = null) {
		if (isset($userId)) self::$userId = $userId;
		if (isset($email)) self::$email = $email;

		if (!isset(self::$userId) || !isset(self::$email)) {
			App::abort(500, 'Server error - Cannot send mail, missing some important fields.');
		}

		self::$token = self::generateToken();
		self::clearOldTokens();
		self::storeToken(self::$userId);

		$link = action('ActivationController@verify', array(self::$token, self::$userId));
		Mail::send('emails.auth.activation', array('verifyLink' => $link), function($message) {
			$message->to(self::$email)->subject('Email activation [Linked House]');
		});
	}

	/*--------------------------------------
	| Function getTimeRemaining($userId)
	|
	| Return values:
	| 	null: 	If we have no valid key or we have more that one valid keys.
	|   false: 	If key is expired.
	|   array:	Format array(h, i, s) - Time remaining.
	|
	| NOTE: This function will also rewrite the private static member $userId if argument is provided.
	|---------------------------------------
	*/ 
	public static function getTimeRemaining($userId = null) {
		if (isset($userId)) self::$userId = $userId;
		if (!isset(self::$userId)) App::abort(500, 'Server error - Cannot get remaining time from unknow userId');

		$result = DB::table('email-activation')->where('used', 0)->get();
		if (!isset($result[0]) || isset($result[1])) {
			// We have not valid token stored.
			// Or we have more than one valid tokens -> This is unexpected exception.
			return null;
		}
		else {
			$expires = new DateTime($result[0]->expires);
			$now = new DateTime(date("Y-m-d H:i:s"));
			if ($expires < $now) {
				return false;
			}
			else {
				$diff = $expires->diff($now);
				return array(
					'h' => $diff->h,
					'i' => $diff->i,
					's' => $diff->s
				);
			}
		}
	}

	/*------------------------------------------------------
	| Function activate($userId)
	|
	| Return values:
	|	 true: If activation successed.
	|	 false: If account is already activated.
	|
	| NOTE: This function will also rewrite the private static member $userId if argument is provided.
	|-------------------------------------------------------
	*/
	public static function activate($userId = null) {
		if (isset($userId)) self::$userId = $userId;
		if (!isset(self::$userId)) App::abort(500, 'Server error - Cannot activate unknown user');

		if (!self::isActivated()) {
			DB::table('users')->where('user_id', self::$userId)
				->update(array('activated' => 1));
			DB::table('email-activation')->where('user_id', self::$userId)
				->update(array('used' => 1));
			return true;
		}
		else {
			return false;
		}
	}

	// This function will also rewrite the private static member $userId if argument is provided.
	public static function isActivated($userId = null) {
		if (isset($userId)) self::$userId = $userId;
		if (!isset(self::$userId)) App::abort(500, 'Server error - Cannot check activation state of unknown user');

		$result = DB::table('users')->where('user_id', self::$userId)->first();
		if (!isset($result)) {
			App::abort(500, 'Server error - Sometring wrong with database. CODE: 0019 [EmailActivator model]');
		}
		else {
			return $result->activated;
		}
	}

	public static function checkToken($token, $userId) {
		$result = DB::table('email-activation')->where('user_id', $userId)->where('used', 0)->first();
		if ($token == $result->token) {
			// Token is owned by the user.
			return true;
		}
		else {
			// Token is not owned by the user.
			return false;
		}
	}


	// Private functions

	private static function generateToken($length = 60) {
		$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$charactersLength = strlen($characters);
		$randomString = '';
		for ($i = 0; $i < $length; $i++) {
			$randomString .= $characters[rand(0, $charactersLength - 1)];
		}
		return $randomString;
	}

	private static function storeToken($userId) {
		if (isset(self::$token)) {
			DB::table('email-activation')->insert(array(
				'user_id'	=> $userId,
				'token'		=> self::$token,
				'expires'	=> date('Y-m-d H:i:s', strtotime('+24 hours'))));
		}
		else {
			App::abort(500, 'Server error. Email activation token is missing. Cannot be stored.');
		}
	}

	private static function clearOldTokens($userId = null) {
		if ($userId) self::$userId = $userId;
		if (!isset(self::$userId)) App::abort(500, 'Server error - Cannot make changes to unknown userId');

		DB::table('email-activation')->where('user_id', self::$userId)
				->update(array('used' => 1));
	}

}