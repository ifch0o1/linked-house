<?php

class ActivationController extends Controller {

	public function verify($token, $userId) {
		// Check if the token is owned by the user and is valid.
		if (!EmailActivator::checkToken($token, $userId)) {
			return View::make('activation.error', array('title' => 'Activation error [1]'));
		}
		else {
			// If everything is right, activate the user.
			if (EmailActivator::activate($userId)) {
				$email = EmailActivator::getEmail();
				return View::make('activation.successed', array(
					'title' => 'Activation successed',
					'email' => $email
					));
			}
			else {
				return View::make('activation.error', array('title' => 'Activation error [2]'));
			}
		}
	}
}