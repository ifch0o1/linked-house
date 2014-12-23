<?php

class TestController extends Controller {

    private $data = array();

    public function test($id = null) {
        $mic_time = microtime();
        $mic_time = explode(" ", $mic_time);
        $mic_time = $mic_time[1] + $mic_time[0];
        $start_time = $mic_time;
        
        
        // START OPERATIONS HERE -->
        return View::make('password-recovery.success', array('title' => 'Password Recovery [Linked House]', 'token' => 'asd314twef2f3', 'id' => 2));



        // $data['current'] = new DateTime('2014-12-11 00:12:12');
        // $data['expires'] = new DateTime('2014-12-12 11:24:44');
        // $data['interval'] = $data['current']->diff($data['expires']);
        // $data['intervalFormat'] = $data['interval']->format('%H:%i:%s');
        // $data['DateTimeNow'] = new DateTime(date("Y-m-d H:i:s"));

        // $data['bigger'] = $data['current'] > $data['expires'];
        
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