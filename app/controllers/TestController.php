<?php

class TestController extends Controller {

    private $data = array();

    public function test($id = null) {
        $mic_time = microtime();
        $mic_time = explode(" ", $mic_time);
        $mic_time = $mic_time[1] + $mic_time[0];
        $start_time = $mic_time;
        
        
        // START OPERATIONS HERE -->

        $data['res'] = DB::table('users')->where('user_id', null)->first();

        $data['user_email'] = $data['res']->user_email;



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