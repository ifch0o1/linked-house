<?php

// autoload_classmap.php @generated by Composer

$vendorDir = dirname(dirname(__FILE__));
$baseDir = dirname($vendorDir);

return array(
    'DataValidator' => $baseDir . '/app/models/DataValidator.php',
    'DatabaseSeeder' => $baseDir . '/app/database/seeds/DatabaseSeeder.php',
    'ErrorLogger' => $baseDir . '/app/models/ErrorLogger.php',
    'HomeController' => $baseDir . '/app/controllers/HomeController.php',
    'IlluminateQueueClosure' => $vendorDir . '/laravel/framework/src/Illuminate/Queue/IlluminateQueueClosure.php',
    'Interfaces\\IReaderInterface' => $baseDir . '/app/models/interfaces/IReaderInterface.php',
    'LaravelUser' => $baseDir . '/app/models/LaravelUser.php',
    'LoginController' => $baseDir . '/app/controllers/LoginController.php',
    'Readers\\DatabaseReader' => $baseDir . '/app/models/readers/DatabaseReader.php',
    'RegisterController' => $baseDir . '/app/controllers/RegisterController.php',
    'SessionHandlerInterface' => $vendorDir . '/symfony/http-foundation/Symfony/Component/HttpFoundation/Resources/stubs/SessionHandlerInterface.php',
    'TestCase' => $baseDir . '/app/tests/TestCase.php',
    'TestController' => $baseDir . '/app/controllers/TestController.php',
    'User' => $baseDir . '/app/models/User.php',
    'UserAccount' => $baseDir . '/app/models/UserAccount.php',
    'UserControl' => $baseDir . '/app/models/UserControl.php',
    'UserData' => $baseDir . '/app/models/UserData.php',
    'UserFavorite' => $baseDir . '/app/models/UserFavorite.php',
    'UserTab' => $baseDir . '/app/models/UserTab.php',
);
