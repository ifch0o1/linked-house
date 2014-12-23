<?php include app_path().'/views/inc/header.php'; ?>
<style type="text/css">
    #user_home_text > a,
    #general-content a {
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
    #general-content p {
        width: 700px;
        margin: 0 auto;
        padding: 10px;
        background-color: #FFF;
        border-top: 3px solid #00BD00;
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
        <h3>You have successfully activated your account.</h3>
        <p>
            Your email address is successfully verified.<br>
            You can now use password recovery within this email: <br>
            <?= $email ?>. <br><br>
            <a href="<?= action('HomeController@showHome') ?>">Continue</a>
        </p>
    </div>
</section>

<?php include app_path().'/views/inc/footer.php'; ?>