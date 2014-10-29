<?php

class RegisterController extends Controller {

    public function showForm() {
        $user = new UserControl();
        if (!$user->authenticate()) {
            echo View::make('registration', array('title' => 'Registration'))->render();
        } else {
            return Redirect::to('home');
        }
    }

    public function register() {
        if ($_POST['password'] !== $_POST['password_confirm']) {
            //TODO --> view error message.
            exit;
        }
        $user = new UserControl($_POST['username'], $_POST['password'], $_POST['email']);
        $is_success = $user->register();
        if ($is_success) {
            echo View::make('success_registration', array('title' => 'Registration Success'))->render();
        } else {
            echo View::make('usererror', array('title' => 'Registration Error',
                'error_heading' => 'Registration error.',
                'error_content' => 'Sorry... <br/> Something crashed... Try again after few minutes.'))->render();
        }
    }

}
