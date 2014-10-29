<?php

class User {
    protected $username;
    protected $_userId;
    
    public function __construct($username = null) {
    if($username)
        {$this->setUsername($username);}
    }
    
    public function setUsername($username) {

        $validator = new DataValidator(array('username' => $username), 20);
        $validatedData = $validator->validate();

        if (isset($validatedData['username'])) {
            $this->username = $validatedData['username'];

            $result = DB::select('SELECT user_id FROM users WHERE user_name=?', array($validatedData['username']));

            if (isset($result[0]->user_id)) {
                $this->_userId = $result[0]->user_id;
            }
        }
    }
    
    public function getUsername() {
        return $this->username;
    }

    public function getUserId() {
        return $this->_userId;
    }

}
