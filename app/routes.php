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

Route::get('test', 'TestController@test');

Route::get('login', 'LoginController@login');

Route::post('login', 'LoginController@authentication');

Route::get('register', 'RegisterController@showForm');

Route::post('register', 'RegisterController@register');

