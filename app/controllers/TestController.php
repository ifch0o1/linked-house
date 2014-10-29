<?php

class TestController extends Controller {

    private $data = array();

    public function test() {
        $mic_time = microtime();
        $mic_time = explode(" ", $mic_time);
        $mic_time = $mic_time[1] + $mic_time[0];
        $start_time = $mic_time;
        
        
        // START OPERATIONS HERE -->

        $_userId = 1;
        $this->data['users'] = array();
        $this->data['favorites'] = array();
        $this->data['tabs'] = array();

        $userResult = \DB::select(
                        'SELECT * FROM users '
                        . 'LEFT JOIN tabs       ON users.user_id = tabs.user_id '
                        . 'LEFT JOIN favorites ON favorites.tab = tabs.tab_id '
                        . 'WHERE users.user_id = ?', array($_userId));
        echo '<pre>'.print_r($userResult, true).'<pre>';
        array_push($this->data['users'], array('user_name' => $userResult[0]->user_name,
            'user_email' => $userResult[0]->user_email, 'user_last_login' => $userResult[0]->user_last_login));

        foreach ($userResult as $row) {
            array_push($this->data['favorites'], array('fav_rec_id' => $row->fav_rec_id, 'fav_tab' => $row->tab,
                'fav_name' => $row->name, 'fav_url' => $row->url, 'fav_position' => $row->position, 'fav_comment' => $row->comment, 'fav_color' => $row->color));

            $lastTab = end($this->data['tabs']);
            if ($lastTab['tab_rec_id'] != $row->tab_rec_id) {
                array_push($this->data['tabs'], array('tab_rec_id' => $row->tab_rec_id, 'tab_id' => $row->tab_id,
                    'tab_name' => $row->tab_name));
            }
        }
        return $this->data;
        
        
        // END OPERATIONS HERE ^^^
        
        
        $mic_time = microtime();
        $mic_time = explode(" ", $mic_time);
        $mic_time = $mic_time[1] + $mic_time[0];
        $endtime = $mic_time;
        $total_execution_time = ($endtime - $start_time);
        echo "Total Executaion Time " . $total_execution_time . " seconds";
        echo '<pre>'.print_r($data, true).'<pre>';
    }

}