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
    a {
    	display: inline-block !important;
    }
</style>
<script type="text/javascript" src="/inc/js/jquery-1.11.1-uncompressed.js"></script>

<div id="header">
    
    <?php include __DIR__.'/inc/header-links.php' ?>

    <div id="right_side_header">
        <span id="user_home_text">
            <a href="<?= action('HomeController@showHome') ?>">Continue</a>
        </span>
    </div>


</div>

<section>
    <div id="general-content">
        <h3>Registration successful.</h3>
        <p>
            You successfully registered at Linked House.<br><br>
            <b>About email activation:</b><br>
            Email activation is not required, <b>but</b> if you forgot your password, you can recover it only if your email is activated.
            <br>
            An email with instructions has beed sent to your email address (<?= $email ?>).
            <br>
            <br>
            You can <a href="<?=action('LoginController@login'); ?>">login</a> now.
        </p>
    </div>
</section>

<?php include app_path().'/views/inc/footer.php'; ?>