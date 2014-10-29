<?php
/**
 * Description of IReaderInterface
 *
 * @author Ifch0o1
 */

namespace Interfaces;

interface IReaderInterface {
    
    public function read($where);
    
    public function readUserData($_userId);
}
