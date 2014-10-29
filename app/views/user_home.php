<?php
include __DIR__ . '/inc/header.php';
?>

<script type="text/javascript">
    debug = true;

    var _phpUserData = <?php echo json_encode($data); ?>;
</script>

<script type="text/javascript" src="inc/js/jquery-1.11.1-uncompressed.js"></script>
<!--        Load jQuery ^      -->

<header id="header">
    <div id="left_side_header">
        <h1 id="app_name">Linked House</h1>
        <ul id="header_links_list">
            <li><a href="#">Blog</a></li>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">About</a></li>
        </ul>
    </div>

    <div id="logo_holder">
        <span id="logo_house" title="House"></span>
    </div>

    <div id="right_side_header">
        <span id="user_home_text"><?= $user ?>'s home</span>
        <div id="user_settings_icon_holder">
            <span id="user_settings_button" title="Settings"></span>
        </div>
    </div>

    <div id="user_settings">
        <p id="us_alert"></p>
        <div id="us_change_password">
            <p id="us_change_password_text">Change password</p>
            <table id="us_change_password_table">
                <tr>
                    <td><label for="us_old_pass">Old</label></td>
                    <td><input type="password" class="us_password_input" id="us_old_pass" /></td>
                </tr>
                <tr>
                    <td><label for="us_new_pass">New</label></td>
                    <td><input type="password" class="us_password_input" id="us_new_pass" /></td>
                </tr>
                <tr>
                    <td><label for="us_new_pass_re">New</label></td>
                    <td><input type="password" class="us_password_input" id="us_new_pass_re" /></td>
                </tr>
            </table>
        </div>
        <div id="us_configuration_options">
            <table>
                <tr>
                    <td><input type="checkbox" id="disable_slider_checkbox" /></td>
                    <td><label for="disable_slider_checkbox">Disable slider</label></td>
                </tr>
                <tr>
                    <td><input type="checkbox" id="lock_links_checkbox" /></td>
                    <td><label for="lock_links_checkbox">Lock link positions</label></td>
                </tr>
            </table>
        </div>
        <div id="us_global_options">
            <span id="us_clear_favorites_option">Clear all favorites</span>
            <span id="us_deactivate_account_option">Deactivate account</span>
        </div>
        <div id="us_q">
            <p id="us_q_heading">Are you sure?</p>
            <p id="us_q_subheading"></p>
            <div id="us_q_answer">
                <a href="#" class="us_q_answer_button" id="us_q_answer_yes">Yes</a>
                <a href="#" class="us_q_answer_button" id="us_q_answer_no">No</a>
            </div>
        </div>
    </div>
</header>

<aside id="left_aside">
    <dl id="fast_links_def_list">
        <dt class="facebook">
        <div class="fast_link_holder">
            <a href="http://www.facebook.com" class="fast_link_icon_holder" id="facebook_icon"></a>
        </div>
        </dt>
        <dd class="facebook">Widget is not ready yet</dd>

        <dt class="twitter">
        <div class="fast_link_holder">
            <a href="http://www.twitter.com" class="fast_link_icon_holder" id="twitter_icon"></a>
        </div>
        </dt>
        <dd class="twitter">Widget is not ready yet</dd>

        <dt class="youtube">
        <div class="fast_link_holder">
            <a href="http://www.youtube.com" class="fast_link_icon_holder" id="youtube_icon"></a>
        </div>
        </dt>
        <dd class="youtube">Widget is not ready yet</dd>

        <dt class="google_mail">
        <div class="fast_link_holder">
            <a href="http://www.gmail.com" class="fast_link_icon_holder" id="google_mail_icon"></a>
        </div>
        </dt>
        <dd class="google_mail">Widget is not ready yet</dd>

        <dt class="blogger">
        <div class="fast_link_holder">
            <a href="http://www.blogger.com" class="fast_link_icon_holder" id="blogger_icon"></a>
        </div>
        </dt>
        <dd class="blogger">Widget is not ready yet</dd>

        <dt class="show_widgets" style="display: none">
        <div class="fast_link_holder fast_link_holder_orange">
            <div class="fast_link_icon_holder" id="show_widgets_icon"></div>
        </div>
        </dt>
        <dd class="show_widgets">Widget is not ready yet</dd>
    </dl>
</aside>

<section id="section">

    <div id="favorites_wapper">
        <div id="tabs_holder">
            <div id="tabs">

            </div>
        </div>
        
        <div id="new_tab_button">
            <span id="new_tab_icon" title="New tab"></span>
        </div>
        <div id="new_tab_form">
            <div id="tab_form_close" class="close_btn"></div>
            <p class="input_info"></p>
            <br class="clearfix"/>
            <label for="new_tab_input">Name:</label><input id="new_tab_input" type="text" maxlength="18" />
            <button id="add_new_tab_button">Add</button>
        </div>

        <div id="favorites_div">
            <div id="favorite_navigation">
                <span id="favorite_navigation_info"></span>
                <span id="add_favorite_button">Add new favorite</span>
            </div>
            
            <div class="favorite_links_wapper" id="favorite_links_wapper_tab_2"></div>
        </div>

        <form id="fav_form">
            <h2 style="text-align: center; margin-top: 10px">Add favorite</h2>
            <table id="fav_form_table">
                <tr>
                    <td><span>Name:</span></td>
                    <td><input type="text" class="fav_form_input" maxlength="24" id="fav_form_name_input" /></td>
                </tr>
                <tr>
                    <td><span>Url address:</span></td>
                    <td><input type="text" class="fav_form_input" id="fav_form_url_input" /></td>
                </tr>
                <tr>
                    <td><span>Comment:</span></td>
                    <td><input type="text" class="fav_form_input" id="fav_form_comment_input" maxlength="250" /></td>
                </tr>
                <tr>
                    <td><span id="fav_form_color_text">Color:</span></td>
                    <td id="fav_form_color_list_wapper"></td>
                </tr>
            </table>

            <div id="fav_form_example_line_holder">
                <span id="fav_form_example_text">Example:</span>
                <img src="inc/img/line_420.png" id="fav_form_example_line" alt="line" />
            </div>

            <div id="fav_form_example_holder">
                <div id="favorite_example_content_holder"></div>
                <div id="fav_form_accept_button">
                    <div id="fav_form_accept_button_icon_holder"></div>
                </div>
            </div>
        </form>

    </div>

    <div id="slider_wapper">

 
    </div>

</section>



<aside id="right_aside">
    <div id="widgets_wapper">
        
    </div>
</aside>

<br class="clearfix" >
<div id="shower"></div>
<script type="text/javascript" src="inc/js/functions.js"></script>
<script type="text/javascript" src="inc/js/classes.js"></script>
<script type="text/javascript" src="inc/js/ev_functions.js"></script>
<script type="text/javascript" src="inc/js/ev_handlers.js"></script>
<script type="text/javascript" src="inc/js/widgets.js"></script>
<script type="text/javascript" src="inc/js/home.js"></script>
<?php
include __DIR__ . '/inc/footer.php';
