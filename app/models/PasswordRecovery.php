<?php

class PasswordRecovery {

	public static function sendMail($email) {
		$userRow = self::checkEmail($email);
		if ($userRow == false) {
			return false;
		}

		$token = self::generateToken();
		self::clearOldTokens($userRow->user_id);
		self::storeToken($userRow->user_id, $token);

		$link = action('PasswordRecoveryController@checkToken', array($token, $userRow->user_id));
		Mail::send('emails.auth.password-recovery', array('verifyLink' => $link), function($message) use ($email) {
			$message->to($email)->subject('Password recovery [Linked House]');
		});
	}

	/*----------------------------------------------------
	| function: checkEmail($email)
	|-----------------------------------------------------
	| Params:
	|   $email: `string` email address
	|
	| Returns:
	|   `boolean` false: If email does not exist.
	|   `object` User Row: If email exsist, returns laravel generated single database row
	|            which contains user information.
	|-----------------------------------------------------
	*/

	public static function checkEmail($email) {
		$result = DB::table('users')->where('user_email', $email)->first();
		if (!isset($result->user_email)) {
			return false;
		}
		else {
			return $result;
		}
	}

	public static function checkToken($token, $userId) {
		$validToken = self::checkForValidTokens($userId);
		if (!$validToken) {
			return false;
		}
		if ($token == $validToken) {
			return true;
		}
	}

	private static function generateToken($length = 60) {
		$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$charactersLength = strlen($characters);
		$randomString = '';
		for ($i = 0; $i < $length; $i++) {
			$randomString .= $characters[rand(0, $charactersLength - 1)];
		}
		return $randomString;
	}

	private static function storeToken($userId, $token) {
		DB::table('password-recovery')->insert(array(
				'user_id' => $userId,
				'token' => $token,
				'expires' => date('Y-m-d H:i:s', strtotime('+1 hours'))
			));
	}

	private static function clearOldTokens($userId) {
		DB::table('password-recovery')->where('user_id', $userId)->update(array('used' => 1));
	}

	private static function checkForValidTokens($userId) {
		$result = DB::table('password-recovery')->where('user_id', $userId)->where('used', 0)->first();
		$expires = isset($result->expires) ? new DateTime($result->expires)) : false;
		if (!$expires) {
			return false;
		}
		$now = new DateTime(date("Y-m-d H:i:s"));
		$diff = $expires - $now;
		if ($diff <= 0) {
			// An expired key found.
			return false;
		}
		else {
			// A valid key found.
			return $result->token;
		}
	}
}