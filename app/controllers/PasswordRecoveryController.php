<?php

class PasswordRecoveryController extends Controller {
	
	public function checkToken($token, $userId) {
		if (PasswordRecovery::checkToken($token, $userId)) {
			return View::make('password-recovery.success',
				array(
					'title' => 'Password Recovery [Linked House]',
					'token' => $token,
					'id' => $userId
					));
		}
		else {
			return View::make('password-recovery.error', array('title' => 'Password Recovery Error [Linked House]'));
		}
	}

	public function changePassword() {
		if (!isset($_POST['token']) || !isset($_POST['new-password'])
			|| !isset($_POST['re-new-password']) || !isset($_POST['id'])
			|| ($_POST['new-password'] != $_POST['re-new-password'])) {
			// Show Error, log
		}
		else if (PasswordRecovery::checkToken($_POST['token'], filter_var($_POST['id'], FILTER_VALIDATE_INT))) {
			$userRow = DB::table('users')->where('user_id', $_POST['id'])->first();
			$user = new UserControl($userRow->user_name);
			$user->setPassword($_POST['new-password']);
			$successed = $user->savePassword();
			if ($successed) {
				PasswordRecovery::clearTokens($userRow->user_id);
				return Response::make('password-changed')->header('Content-Type', 'text/plain');
			}
			else {
				return Response::make('cannot-change')->header('Content-Type', 'text/plain');
			}
		}
	}
}