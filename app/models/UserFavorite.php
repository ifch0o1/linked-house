<?php

/**
 * Description of UserFavorite
 *
 * @author Ifch0o1
 */
class UserFavorite extends User {

    private $favName;
    private $tabId;
    private $favUrl;
    private $favPosition;
    private $favComment;
    private $favColor;
    private $_favId;
    private $colorRange = 5;

    public function __construct($username, $tabId = null, $favName = null, $favUrl = null, 
            $favPosition = null, $favComment = null, $favColor = null) {
        parent::__construct($username);
        if ($tabId)         $this->setTabId($tabId);
        if ($favName)       $this->setFavName($favName);
        if ($favUrl)        $this->setFavUrl($favUrl);
        if ($favPosition)   $this->setFavPosition($favPosition);
        if ($favComment)    $this->setFavComment($favComment); 
        if ($favColor)      $this->setFavColor($favColor);
    }
    
    //Setters

    public function setFavName($favName) {
        $validator = new DataValidator(array('name' => $favName), 36);
        $validator->setTrimStr('\'\".#@^&*$`:<>/\\;|');
        $validatedData = $validator->validate();
        if (!$validatedData['name']) {
            echo $this->showError(array(__CLASS__, __FUNCTION__, 'DataValidator->validate() fails'));
            exit;
        }
        $this->favName = $validatedData['name'];
    }

    public function setFavUrl($favUrl) {
        $url = filter_var($favUrl, FILTER_VALIDATE_URL);
        if (!$url) {
            echo $this->showError(array(__CLASS__, __FUNCTION__, 'filter_var([VALIDATE_URL]) return false'));
            exit;
        }
        $this->favUrl = $url;
    }

    public function setFavPosition($favPosition) {
        $intPosition = filter_var($favPosition, FILTER_VALIDATE_INT);
        if (!$intPosition) {
            $this->showError(array(__CLASS__, __FUNCTION__, 'filter_var([VALIDATE_INT]) return false'));
            exit;
        }
        $this->favPosition = $intPosition;
    }
    
    public function setTabId($tabId) {
        $IntTabId = filter_var($tabId, FILTER_VALIDATE_INT);
        if (!$IntTabId) {
            $this->showError(array(__CLASS__, __FUNCTION__, 'filter_var([VALIDATE_INT]) return false'));
            exit;
        }
        $this->tabId = $IntTabId;
    }

    public function setFavComment($favComment) {
        $validator = new DataValidator(array('comment' => $favComment), 250, '#\'\"');
        $validatedData = $validator->validate();
        if (!$validatedData['comment']) {
            echo $this->showError(array(__CLASS__, __FUNCTION__, 'DataValidator->validate return false or null'));
            exit;
        }
        $this->favComment = $validatedData['comment'];
    }
    
    public function setFavColor($favColor) {
        $color = filter_var($favColor, FILTER_VALIDATE_INT);
        if (!$color || ($color > $this->colorRange)) {
            echo $this->showError(array(__CLASS__, __FUNCTION__, 'VAL_INT return false or $color is more than $colorRange'));
            exit;
        }
        $this->favColor = $color;
    }
    
    public function set_favId($id) {
        $valId = filter_var($id, FILTER_VALIDATE_INT);
        if (!$valId) {exit;}
        
        // Somethink is wrong there.
        $result = DB::select('SELECT * FROM favorites WHERE id = ?', array($id));
    }

    public function get_favId() {
        return $this->_favId;
    }
    
        // Methods

    public function add() {
        if ($this->tabId && $this->favName && $this->favUrl && $this->favPosition && $this->favColor) {
            $result = DB::table('favorites')->insertGetId(array('user_id' => $this->_userId, 'tab' => $this->tabId,
                'name' => $this->favName, 'url' => $this->favUrl, 'position' => $this->favPosition,
                'comment' => $this->favComment, 'color' => $this->favColor));
            $id = $result;
            $this->_favId = $id;

            return true;
        } else {
            die('Cannot add favorite - missing favorite data.');
            return false;
        }
    }

    public function remove() {
        $isDeleted = DB::delete('DELETE FROM favorites WHERE user_id = ? AND tab = ? AND position = ?',
                array($this->_userId, $this->tabId, $this->favPosition));
        if ($isDeleted) {
            return true;
        } else {
            echo $this->showError(array(__CLASS__, __FUNCTION__, '$DB::delete didn\' affect any row'));
        }
    }
    
    public function rename($newName, $favRecId) {
        if (!$favRecId) {
            throw new UnexpectedValueException('$favRecId is: '. $favRecId);
        }        
        $this->setFavName($newName);
        
        $isRenamed = DB::update('UPDATE favorites SET name = ? WHERE fav_rec_id = ?',
                array($this->favName, $favRecId));
        if ($isRenamed) {
            return true;
        } else {
            echo $this->showError(array(__CLASS__, __FUNCTION__, 'DB::update didn\'t affect any row'));
        }
    }

    public function showError($_errorWhile) {
        //TODO
        //!! WARNING !!
        // $_errorWhile contents server information. Do not send it to the user!
        //!! WARNING !!
        // 
        //$_errorWhile will be used for the error log file.

        return View::make('usererror', array('title' => 'Server Error',
                    'error_heading' => 'The server was confused.',
                    'error_heading' => $_errorWhile[0].' '.$_errorWhile[1].' '.$_errorWhile[2],
                    'error_content' => 'Something crash when the server operating with favorites. <br>'
                    . 'In case you see this message while using the site in normal way, please feedback.'))->render();
    }

}
