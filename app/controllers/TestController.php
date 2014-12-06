<?php

class TestController extends Controller {

    private $data = array();

    public function test() {
        $mic_time = microtime();
        $mic_time = explode(" ", $mic_time);
        $mic_time = $mic_time[1] + $mic_time[0];
        $start_time = $mic_time;
        
        
        // START OPERATIONS HERE -->


        $data['exist'] = DB::table('users')->where('user_name', 'glowhacker')->first();
        $data['free'] = DB::table('users')->where('user_name', 'kjqwgijas22')->first();
        $data['issetfree'] = isset($data['free']);
        $data['issetfreeDUMP'] = var_dump(isset($data['free']));

        if ($data['issetfree']) {
            $data['if_runned'] = 'TRYE';
        }
        else {
            $data['if_runned'] = 'FALSE';
        }
        
        
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