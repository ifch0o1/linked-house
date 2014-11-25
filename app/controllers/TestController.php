<?php

class TestController extends Controller {

    private $data = array();

    public function test() {
        $mic_time = microtime();
        $mic_time = explode(" ", $mic_time);
        $mic_time = $mic_time[1] + $mic_time[0];
        $start_time = $mic_time;
        
        
        // START OPERATIONS HERE -->


        $config = new UserConfig('glowhacker');
        // $config->setData('global.slider', 'enabled');
        $data = $config->getData('global.slider');
        
        
        // END OPERATIONS HERE ^^^
        
        
        $mic_time = microtime();
        $mic_time = explode(" ", $mic_time);
        $mic_time = $mic_time[1] + $mic_time[0];
        $endtime = $mic_time;
        $total_execution_time = ($endtime - $start_time);
        echo "<br>Total Executaion Time " . $total_execution_time . " seconds";
        echo '<br>';
        if (isset($data)) {
            echo '<pre>'.print_r($data, true).'<pre>';
        }
    }

}