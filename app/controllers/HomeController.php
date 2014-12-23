<?php

/**
 * Description of HomeController
 *
 * @author Ifch0o1
 */
//namespace App\Controllers;

use Interfaces\IReaderInterface;
use Readers\DatabaseReader;

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

    /*-------------------------------------------------------------
    | TODO - postControll()
    |--------------------------------------------------------------
    | 1. Refactoring - This function need refactoring.
    |    * Too much switch cases for $_POST['type'] (type of the request)
    |    * Some operations are out of closure and isn't used at every case.
    |--------------------------------------------------------------
    */
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
                if (!$validatedId) exit;

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
                    // TODO
                    // Next lines renaming the favorite
                    // But favorite Class have own rename function
                    // Fix renaming by using the fav class function.
                    
                    if (DB::update('UPDATE favorites SET name=? WHERE fav_rec_id=?', 
                    array($newName, $favId))) {
                        echo 'success';
                    }
                }
                else {
                    echo 'Error while renaming favorite.';
                    // TODO Log, Show error.
                }
                break;

            case 'change_color': 
                if (isset($_POST['new_color']) && isset($_POST['fav_id'])) {
                    $validatedId = filter_var($_POST['fav_id'], FILTER_VALIDATE_INT);
                    // TODO validate $_POST['new_color'] !!!
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
                $newTabId = Tab::add($valData['name'], $user->getUserId());
                
                $data = ['id' => $newTabId, 'name' => $valData['name']];
                echo json_encode($data);
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

            case 'forecast-citylist':
                $URIparams = urlencode($_POST['query']);
                $query = 'http://autocomplete.wunderground.com/aq?query=' . $URIparams;
                $result = file_get_contents($query);
                echo($result);
                break;

            case 'user-config':
                $config = new UserConfig($user->getUsername());
                if ($_POST['action'] == 'set') {
                    if (!isset($_POST['index'])) {
                        App::abort(500, 'User config server error. Set config->[index] is not provided.');
                    }
                    if (!isset($_POST['value'])) {
                        App::abort(500, 'User config server error. Cannot set undefined value to [index],');
                    }

                    $config->setData($_POST['index'], $_POST['value']);

                } else if ($_POST['action'] == 'get') {
                    if (!isset($_POST['index'])) {
                        App::abort(500, 'User config server error. Get config->[index] is not provided.');
                    }

                    $value = $config->getData($_POST['index']);
                    return Response::json($value);
                } else {
                    App::abort(500, 'User config server error. Cannot operate.');
                }
                break;

            case 'check-activation-state':
                if (EmailActivator::isActivated($user->getUserId())) {
                    return Response::make('activated', 200)->header('Content-Type', 'text/plain');
                }
                else {
                    $result = EmailActivator::getTimeRemaining($user->getUserId());
                    switch ($result) {
                        case 'expired':
                            return Response::make('expired', 200)->header('Content-Type', 'text/plain');
                            break;

                        default:
                            return Response::make('pending', 200)->header('Content-Type', 'text/plain');
                            break;
                    }
                }
                break;

            case 'resend-activation-email':
                $user->setEmail($_POST['email']);
                $user->saveEmail();
                EmailActivator::sendMail($user->getUserId(), $user->getEmail());

                return Response::make('success', 200)->header('Content-Type', 'text/plain');
                break;

            case 'check-email':
                $result = DB::table('users')->where('user_email', $_POST['email'])->first();
                if (isset($result)) {
                    return 'exist';
                }
                else {
                    return 'free';
                }
                break;

            default:
                return Response::make('Unexpected action', 500)->header('Content-Type', 'text/plain');
                break;
        }
    }
}