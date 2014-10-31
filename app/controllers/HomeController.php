<?php

/**
 * Description of HomeController
 *
 * @author Ifch0o1
 */
//namespace App\Controllers;

use Interfaces/IReaderInterface;
use Readers/DatabaseReader;

class HomeController extends Controller {

    function index() {
        $user = new UserControl();
        if ($user->authenticate()) {
            return Redirect::to('home');
        } else {
            return Redirect::to('login');
        }
    }

    function showHome() {
        $user = new UserControl();
        if ($user->authenticate()) {
            $userData = new UserData($user->getUsername());
            $reader = new DatabaseReader();
            $data = $userData->getData($reader);
            echo View::make('user_home', array('title' => 'Home',
                'user' => $user->getUsername(),
                'data' => $data))->render();
        } else {
            return Redirect::to('login');
        }
    }

    function postControll() {
        if (!isset($_POST['type'])) {
            exit;
        }
        $user = new UserControl();
        if (!$user->authenticate()) {
            exit;
        }
        if (isset($_POST['tabId']) && isset($_POST['name']) && isset($_POST['url'])) {
            $fav = new UserFavorite($user->getUsername(), $_POST['tabId'], $_POST['name'],
                $_POST['url'], $_POST['position'], $_POST['comment'], $_POST['color']);
        }

        switch ($_POST['type']) {
            case 'add_favorite':
                if ($fav->add()) {
                    echo $fav->get_favId();
                }
                break;

            case 'remove_favorite':
                $validatedId = filter_var($_POST['fav_id'], FILTER_VALIDATE_INT);
                if (DB::update('UPDATE favorites SET deleted=true WHERE fav_rec_id=?',
                    array($validatedId))) {

                    echo 'success';
                }
                break;

            case 'rename_favorite':
                if (isset($_POST['fav_id'])) {
                    $favId = filter_var($_POST['fav_id'], FILTER_VALIDATE_INT);
                    $tabId = filter_var($_POST['tabId'], FILTER_VALIDATE_INT);
                    $validator = new DataValidator(array('newName' => $_POST['new_favorite_name']),
                        255, '#/\\<>\'`\"');
                    $validatedData = $validator->validate();
                    $newName = $validatedData['newName'];
                    //// UPDATE DATABASE
                    //TODO
                    //// WITH SQL QUERY.

                    //TODO
                    //// Check if this user actually owns this favorite.
                    if (DB::update('UPDATE favorites SET name=? WHERE fav_rec_id=?', 
                    array($newName, $favId))) {
                        echo 'success';
                    }
                }
                else {
                    echo 'Error while renaming favorite ($_POST)';
                    // TODO Show Error.
                }
                break;

            case 'change_color': 
                if (isset($_POST['new_color']) && isset($_POST['fav_id'])) {
                    $validatedId = filter_var($_POST['fav_id'], FILTER_VALIDATE_INT);
                    // TODO validate $_POST['new_color'] !!!
                    // TODO ^^^^^
                    $unvalidatedColor = $_POST['new_color'];
                    $success = DB::update('UPDATE favorites SET color=? WHERE fav_rec_id=?',
                        array($unvalidatedColor, $validatedId));
                    echo $success ? $success : '500 Server error (cannot update color)';
                }
                else {
                    echo 'Error while changing color. ($_POST)';
                    // TODO show error, log.
                }
                break;

            case 'rename_tab':
                if (isset($_POST['tab_id']) && isset($_POST['new_name'])) {
                    $validatedId = filter_var($_POST['tab_id'], FILTER_VALIDATE_INT);
                    $unvalidatedName = $_POST['new_name'];
                    // TODO validate $_POST['new_name'] !!!
                    $success = DB::update('UPDATE tabs SET tab_name=? WHERE user_id=? AND tab_id=?',
                        array($unvalidatedName, $user->getUserId(), $validatedId));
                    echo $success ? $success : '500 Server error (cannot update tab name)';
                }
                else {
                    echo 'Error while renaming tab ($_POST)';
                }
                break;

            case 'remove_tab':
                if (isset($_POST['tab_id'])) {
                    $validatedId = filter_var($_POST['tab_id'], FILTER_VALIDATE_INT);
                    $success = DB::update('UPDATE tabs SET deleted_tab=true WHERE user_id=? AND tab_id=?',
                        array($user->getUserId(), $validatedId));
                    echo $success ? $success : 'Server error.'; //(cannot update tab.deleted)
                }
                else {
                    echo 'Error while removing tab.';
                    //TODO remove above line, show error, log.
                }
                break;

            case 'add_tab':
                if (isset($_POST['tab_name'])) {
                    $validator = new DataValidator(array('name' => $_POST['tab_name']), 18);
                    $valData = $validator->validate();
                    if (!$valData) { exit; }
                }

                function getMaxTabId() {
                    $result = DB::select('SELECT MAX(tab_id) AS id FROM tabs');
                    return $result[0]->id;
                }
                $id = getMaxTabId() + 1;
                $name = $valData['name'];
                if (DB::insert('INSERT INTO tabs(user_id, tab_name, tab_id) VALUES (?, ?, ?)', 
                array($user->getUserId(), $name, $id))) {
                    $data = ['id' => $id, 'name' => $name];
                    echo json_encode($data);
                }
                break;

            case 'get_user_favorites':
                $userData = new UserData($user->getUsername());
                $reader = new DatabaseReader();
                $data = $userData->getData($reader, 'favorites');
                echo json_encode($data);
                break;

            case 'logout':
                $user->logout();
                // TODO check if logout is success.
                echo '1';
                break;

            case 'change_password':
                // UserControll class have inner data validation.
                $currentPassword = $user->getPasswordHash();
                if (Hash::check($_POST['old_password'], $currentPassword)) {
                    $user->setPassword($_POST['new_password']);
                    $result = $user->savePassword();
                    echo $result;
                }
                else {
                    echo 'incorrect';
                }
                break;

            case 'slider_disabled':
                Session::put('config.slider', $_POST['value']);
                echo Session::get('config.slider');
                break;
        }
    }
}