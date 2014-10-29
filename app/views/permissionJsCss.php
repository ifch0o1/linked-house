<?php 
$chmodNum = 0777;

// chmod(__DIR__.'/inc/css', $chmodNum);
// chmod(__DIR__.'/inc/js', $chmodNum);
// chmod(__DIR__.'/inc/img', $chmodNum);
// chmod(__DIR__.'/inc/img/slides', $chmodNum);

$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(__DIR__.'/inc'));

// foreach($iterator as $item) {
//     chmod($item, $chmodNum);
// }


// $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(__DIR__.'/inc/js'));

// foreach($iterator as $item) {
//     chmod($item, $chmodNum);
// }
// $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(__DIR__.'/inc/img'));

// foreach($iterator as $item) {
//     chmod($item, $chmodNum);
// }
// $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(__DIR__.'/inc/js'));

// foreach($iterator as $item) {
//     chmod($item, $chmodNum);
// }


?>