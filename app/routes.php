<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', 'HomeController@index');

Route::get('home', 'HomeController@showHome');

Route::post('home', 'HomeController@postControll');

Route::get('test/{id?}', 'TestController@test');

Route::get('login', 'LoginController@login');

Route::post('login', 'LoginController@authentication');

Route::get('register', 'RegisterController@showForm');

Route::post('register', 'RegisterController@register');

Route::get('activation/{token}/{userId}', 'ActivationController@verify');

Route::get('password-recover/{token}/{userId}', 'PasswordRecoveryController@checkToken');

Route::post('password-recover/{token}/{userId}', 'PasswordRecoveryController@changePassword');

Route::post('request-password-recovery', function() {
	if (isset($_POST['email'])) {
		$isSent = PasswordRecovery::sendMail($_POST['email']);
		$responseText = $isSent ? 'Sent' : 'Error! Check your typing.';
		return Response::make($responseText)->header('Content-Type', 'text/plain');
	}
	else {
		return Response::make('invalid-request')->header('Content-Type', 'text/plain');
	}
});

Route::get('about', function() {
	return View::make('about', array('title' => 'About [Linked House]'));
});