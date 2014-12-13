<?php include app_path().'/views/inc/header.php'; ?>
<style type="text/css">
    #user_home_text > a {
        color: #A3A4FF;
        cursor: pointer;
        text-decoration: underline;
    }
    section {
        text-align: center;
    }
    #general-content {
        margin-top: 40px;
        font-family: trebuc;
    }
    #general-content h3 {
        font-size: 22px;
        padding: 15px;
    }
    #general-content h2 {
        font-size: 20px;
        padding: 10px;
    }
    #general-content p {
        width: 700px;
        margin: 0 auto;
        padding: 10px;
        background-color: #FFF;
        border-top: 3px solid #FF3939;
    }
    #general-content ul {
        list-style: circle;
    }
</style>
<script type="text/javascript" src="/inc/js/jquery-1.11.1-uncompressed.js"></script>

<div id="header">
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
        <span id="user_home_text">
            <a href="<?= action('HomeController@showHome') ?>">Continue</a>
        </span>
    </div>


</div>

<section>
    <div id="general-content">
        <h3>Sorry, but we can't activate your email now.</h3>
        <p>
            The server has rejected your query to email activation.<br>
            If the problem is not related with below issues, try to resend email activation. <br>
        </p>
        <h2>Possible issues:</h2>
        <ul>
            <li>Your token or email address is not valid.</li>
            <li>Your account is already activated.</li>
            <li>Server fault - developer mistake</li>
        </ul>
        <p style="margin-top: 20px;">
            If you continue to experience problems please refer to our email: <br>
            linkedhouse@gmail.com
        </p>
    </div>
</section>

<?php include app_path().'/views/inc/footer.php'; ?>