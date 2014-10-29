<?php

class LoginController extends Controller {

    public function login() {
        $user = new UserControl();
        if ($user->authenticate()) {
            return Redirect::to('/');
        } else {
            echo View::make('login', array('title' => 'Login'))->render();
        }
    }

    public function authentication() {
        if (isset($_POST['username']) && isset($_POST['password'])) {
            // UserControl class has inner data validation.
            $user = new UserControl($_POST['username'], $_POST['password']);
            $is_success = $user->login();

            switch ($is_success) {
                case true:
                    echo 'accept';
                    break;

                case false:
                    echo 'deny';
                    break;

                case null:
                    echo 'error';
                    break;
            }
        }
    }
}
