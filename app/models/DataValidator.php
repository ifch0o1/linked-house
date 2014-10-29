<?php

/**
 * CLASS DataValidator:
 * Normalize and validate data from array.
 * Accepts array data only.
 * 
 * METHOD validate() return values:
 * (array)  -> return normalized and validated data,
 * (false)  -> return (bool)false if $maxLength condition not passed,
 * (null)   -> return null if $maxLength is not setted
 *
 * @author Ifch0o1
 */
class DataValidator {

    private $data = array();
    private $trimStr;
    private $maxLength;
    private $validData = null;

    public function setData($data) {
        if (is_array($data)) {
            $this->data = $data;
        }
    }

    public function setTrimStr($trimStr) {
        $this->trimStr = $trimStr;
    }

    public function setMaxLength($maxLength) {
        $this->maxLength = (int) $maxLength;
    }

    public function __construct($data = null, $maxLength = null, $trim = ' \`\'\".,#@^&*$`:<>/\\;!|{}[]') {
        if (is_array($data)) {
            $this->data = $data;
            $this->maxLength = (int) $maxLength;
            $this->trimStr = $trim;
        }
    }

    public function validate() {
        if ($this->maxLength != null) {


            //Cheking validation
            foreach ($this->data as $key => $value) {
                if (strlen($value) > (int) $this->maxLength && strlen($value) <= 0) {
                    $this->validData = false;
                    return $this->validData;
                }

                $this->validData[$key] = trim($value, $this->trimStr);
            }
        }
        return $this->validData;
    }

}
