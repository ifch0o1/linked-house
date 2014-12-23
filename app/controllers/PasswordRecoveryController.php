<?php

class PasswordRecoveryController extends Controller {
	
	public function checkToken($token, $userId) {
		if (PasswordRecovery::checkToken($token, $userId)) {
			
		}
		else {

		}
	}

	public function changePassword() {
		if (!isset($_POST['token']) || !isset($_POST['new-password'])
			|| !isset($_POST['re-new-password']) || !isset($_POST['user-id'])) {
			// Show Error, log
		}
		else if (PasswordRecovery::checkToken($_POST['token'], filter_var($_POST['user-id'], FILTER_VALIDATE_INT))) {
			// change password.
			return Response::make('password-changed')->header('Content-Type', 'text/plain');
		}
	}

	private function show($message, $error = false) {
		if ($error) {

		}
		else {
			
		}
	}
}