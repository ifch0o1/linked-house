<?php

class RegisterController extends Controller {

    public function showForm() {
        $user = new UserControl();
        if (!$user->authenticate()) {
            return View::make('registration', array('title' => 'Registration'))->render();
        } else {
            return Redirect::to('home');
        }
    }

    public function register() {
        if (isset($_POST['check']) && isset($_POST['value'])) {
            $result = $this->check($_POST['check'], $_POST['value']);
            return Response::make($result)->header('Content-Type', 'text/plain');
            exit;
        }

        if (!isset($_POST['password']) || !isset($_POST['password_confirm'])) {
            App::abort(500, 'Server error - password missing.');
        }
        if ($_POST['password'] !== $_POST['password_confirm']) {
            return View::make('registration', 
                array('title' => 'Registration', 
                      'regError' => 'Passwords do not match.'))->render();
            exit;
        }
        if (!isset($_POST['email']) || !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
            return View::make('registration',
                array('title' => 'Registration',
                       'regError' => 'Email address is not valid.'))->render();
            exit;
        }

        $user = new UserControl($_POST['username'], $_POST['password'], $_POST['email']);
        $is_success = $user->register();

        if ($is_success) {
            return View::make('success_registration', array(
                'title' => 'Registration Success',
                'email' => $_POST['email']
                ))->render();
            exit;
        } else {
            return View::make('usererror', array('title' => 'Registration Error',
                'error_heading' => 'Registration error.',
                'error_content' => 'Sorry... <br/> Something crashed... Try again after few minutes.'))->render();

            exit;
        }
    }

    private function check($check, $value) {
        switch ($check) {
            case 'username':
                $result = DB::table('users')->where('user_name', $value)->first();
                if (isset($result)) {
                    return 'exist';
                }
                else {
                    return 'free';
                }
                break;
            case 'email':
                $result = DB::table('users')->where('user_email', $value)->first();
                if (isset($result)) {
                    return 'exist';
                }
                else {
                    return 'free';
                }
                break;
        }
    }

}