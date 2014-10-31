<?php

/**
 * Class UserControl:
 * - Register users
 * - Login users
 * - Authenticate users
 * 
 * Method register() return values:
 * true     -if registration is compelte,
 * false    -if registration cannot complete
 * 
 * Method login() return values:
 * true     -if logged success,
 * false    -if user_id didn't exist in database,
 * null     -if DB::update cannot update the table
 * 
 * 
 * 
 * @author Ifch0o1
 */

class UserControl extends User {

    private $email;
    private $password;
    
    public function __construct($username = null, $password = null, $email = null) {
        parent::__construct($username);

        $this->setPassword($password);
        if ($email) {
            $this->setEmail($email); 
        }
    }

    public function setEmail($email) { 
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo '<b>PHP error:</b><br/>'
            . ' \'[Control] User: email validation error!\'<br/>'
            . 'Please contact site administrator!';
            exit;
        }

        //TODO chenge below validatior with filter_var email.
        $validator = new DataValidator(array('email' => $email), 45, ' #/\\<>\'\"');
        $validatedData = $validator->validate();
        if (!$validatedData) { exit; }
        $this->email = $validatedData['email'];
    }

    public function getPasswordHash() {
        $result = DB::table('users')->where('user_id', $this->_userId)->first();
        $passHash = $result->user_password;
        return $passHash;
    }

    public function setPassword($password) {
        $validator = new DataValidator(array('password' => $password), 22);
        $validatedData = $validator->validate();
        $this->password = $validatedData['password'];
    }

    public function savePassword() {
        $hasedPass = Hash::make($this->password);
        DB::table('users')->where('user_id', $this->_userId)
                        ->update(array('user_password' => $hasedPass));
        // TODO check if is possible to know if update is success.
        return 'success';
    }

    public function authenticate() {
        $userName = isset(Session::get('_ua._u')) ? Session::get('_ua._u') || false;
        $this->setUsername(Session::get('_ua._u'));
        
        if ($this->username) {
            $result = DB::select('SELECT user_name FROM users WHERE user_id=?', 
                    array($this->_userId));
            return (isset($result[0]->user_name)) ? true : false;
        }
        return false;
    }

    public function login() {    
        $result = DB::select('SELECT user_password FROM users WHERE user_id=?', array($this->_userId));
        if (!isset($result[0]->user_password)) {
            return false;
        }
        if (Hash::check($this->password, $result[0]->user_password)) {
            $isUpdate = DB::update('UPDATE users SET user_last_login=?'
                            . ' WHERE user_id=?', array(date("Y-m-d H:i:s"), $this->_userId));

            if ($isUpdate) {
                Session::put('_ua._u', $this->username);
                return true;
            } else /* Cannot update DB row with this userId */ {
                return null;
            }
        } else /* Incorrect password received */ {
            return false;
        }
    }

    public function register() {
        $passwordHash = Hash::make($this->password);
        $isUserExist = $this->isUserExist($this->username);
        $isEmailExist = $this->isEmailExist($this->email);

        if ($this->username != null && $this->password != null && $this->email != null && $isUserExist === false && $isEmailExist === false) {

            DB::insert('INSERT INTO users(user_name, user_password, user_email) '
                    . 'VALUES (?, ?, ?) ', array($this->username, $passwordHash, $this->email));
            $this->setUsername($this->username); // Refresh _userId in `this`
            $this->insertDefaultTab();
            $this->insertDefaultFavorites();

            return true;
        } else {
            return false;
        }
    }

    public function logout() {
        Session::clear('_ua._u');
    }
    
    private function isUserExist($username) {
        $result = DB::select('SELECT user_name FROM users WHERE user_name=?', array($username));
        if (isset($result[0])) {
            return true;
        } else {
            
            // TODO - Log error.
            
            return false;
        }
    }

    private function isEmailExist($email) {
        $result = DB::select('SELECT user_email FROM users WHERE user_email=?', array($email));
        if (isset($result[0])) {

            //TODO - Log error.

            return true;
        } else {
            return false;
        }
    }

    private function insertDefaultFavorites() {
        $defaultFav = new UserFavorite($this->username);
        $defaultFavorites = array(
            array('tabId' => 0, 'favName' => 'Google', 'favUrl' => 'https://www.google.com',
                'favPosition' => 1, 'favComment' => 'Google search engine.', 'favColor' => 1)
            // NEXT FAVORITE - > array(),
        );

        $index = 0;
        foreach ($defaultFavorites as $key => $value) {
            $defaultFav->setTabId($defaultFavorites[$index]['tabId']);
            $defaultFav->setFavName($defaultFavorites[$index]['favName']);
            $defaultFav->setFavUrl($defaultFavorites[$index]['favUrl']);
            $defaultFav->setFavPosition($defaultFavorites[$index]['favPosition]']);
            $defaultFav->setFavComment($defaultFavorites[$index]['favComment']);
            $defaultFav->setFavColor($defaultFavorites[$index]['favColor']);
            $defaultFav->add();

            $index++;
        }
    }
    private function insertDefaultTab() {
        DB::insert('INSERT INTO tabs(user_id, tab_id, tab_name) 
                VALUES (?, ?, ?)', array($this->_userId, 1, 'General'));
    }
}
