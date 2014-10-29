<?php
/**
 * Description of UserData
 *
 * @author Ifch0o1
 */

use Interfaces\IReaderInterface;

class UserData extends User {
    
    private $data;
    
    public function __construct($username = null) {
        parent::__construct($username);
        
    }
    
    public function getData(IReaderInterface $obj, $specific = null, $refresh = false) {
        if (!$this->data || $refresh === true) {
            $this->data = $obj->readUserData($this->_userId, $specific);
        }
        return $this->data;
    }
}
