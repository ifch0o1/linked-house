<?php

/**
 * Description of UserTab
 *
 * @author Default
 */

class UserTab extends User {
    
    private $tabName;
    private $_tabId;
    private $tabLimit = 4;
    
    public function __construct($username) {
        parent::__construct($username);
    }
    
    public function setTabName($name) {
        $validator = new DataValidator(array('name' => $name), 18, '\`\'\"');
        $valName = $validator->validate();
        $this->tabName = $valName['name'] ? $valName['name'] : null;
    }
    
    public function set_tabId($id) {
        $valId = filter_var($id, FILTER_VALIDATE_INT);
        if (!$valId) {exit;}
        $result = DB::select('SELECT tab_name FROM tabs WHERE tab_id = ?', array($valId));
        $this->tabName = $result[0]->tab_name;
        $this->_tabId = $valId;
    }
    
    public function save() {
        if ($this->tabName && !$this->_tabId) {
            DB::insert('INSERT INTO tabs (user_id, tab_name) VALUES (?, ?)', 
                    array($this->_userId, $this->tabName));
        } else {
            // TODO log/show error
        }
    }

}
