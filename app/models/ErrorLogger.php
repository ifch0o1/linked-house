<?php

/**
 * Description of ErrorLogger
 *
 * @author Default
 */

class ErrorLogger {
    
    private static $instance = null;
    
    private function __construct() {
    }
    
    public function getInstance() {
        if (!self::$instance) {
            self::$instance = self;
        }
        return self;
    }
}
