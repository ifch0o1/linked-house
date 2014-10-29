<?php

/**
 * WARNING :
 * This class did not validate or normalize received values!
 *
 * @author Ifch0o1
 */

namespace Readers;

use Interfaces\IReaderInterface;

class DatabaseReader implements IReaderInterface {

    private $data = array();

    public function read($where) {
        
    }

    public function readUserData($_userId, $specificTable = null) {
        if (!$specificTable) {
            return $this->readAllUserData($_userId);
        }
        return $this->readSpecificUserData($_userId, $specificTable);
    } 

    private function readAllUserData($_userId) {
        $this->data['users'] = array();
        $this->data['favorites'] = array();
        $this->data['tabs'] = array();

        $userResult = \DB::select(
                        'SELECT * FROM users '
                        . 'LEFT JOIN tabs ON users.user_id = tabs.user_id '
                        . 'LEFT JOIN favorites ON favorites.tab = tabs.tab_id '
                        . 'WHERE users.user_id = ?', array($_userId));

        array_push($this->data['users'], array('user_name' => $userResult[0]->user_name,
            'user_email' => $userResult[0]->user_email, 'user_last_login' => $userResult[0]->user_last_login));

        foreach ($userResult as $row) {
            if (isset($row->fav_rec_id)) {
                array_push($this->data['favorites'], array('fav_rec_id' => $row->fav_rec_id, 'fav_tab' => $row->tab,
                    'fav_name' => $row->name, 'fav_url' => $row->url, 'fav_position' => $row->position, 
                    'fav_comment' => $row->comment, 'fav_color' => $row->color, 'deleted' => $row->deleted));
            }

            $lastTab = end($this->data['tabs']);
            if ($lastTab['tab_rec_id'] != $row->tab_rec_id) {
                array_push($this->data['tabs'], array('tab_rec_id' => $row->tab_rec_id, 'tab_id' => $row->tab_id,
                    'tab_name' => $row->tab_name, 'deleted' => $row->deleted_tab));
            }
        }
        return $this->data;
    }
    
    private function readSpecificUserData($_userId, $specificTable) {
        $this->data[$specificTable] = array();
        $result = \DB::select('SELECT * FROM '.$specificTable.' WHERE user_id = ?',
                array($_userId));

        $index = 0;
        foreach ($result as $row) {
            $keys = array();
            $values = array();
            $rowValues = get_object_vars($row);
            
            foreach ($rowValues as $key => $value) {
                array_push($keys, $key);
                array_push($values, $value);
            }
            
            $arrCache = array_combine($keys, $values);
            $this->data[$specificTable][$index] = isset($this->data[$specificTable][$index]) 
                    ? array_push($this->data[$specificTable][$index], $arrCache) 
                    : $arrCache;
            
            $index++;
        }
        return $this->data;
    }
}
