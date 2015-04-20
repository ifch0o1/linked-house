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
    #general-content.error p {
    	border-top: 3px solid red;
    }
    a {
    	display: inline-block !important;
    }
</style>

<div id="header">
    
    <?php include __DIR__.'/inc/header-links.php' ?>

    <div id="right_side_header">
        <span id="user_home_text">
            <a href="<?= action('HomeController@showHome') ?>">Continue</a>
        </span>
    </div>


</div>

<section>
    <div id="general-content" class="error">
        <h3>Registration error.</h3>
        <p>
            Sorry something crashed. <br/>
            Our server has experienced an unknown error while registering you in the system. <br/>
            You can try again.
        </p>
    </div>
</section>

<?php include app_path().'/views/inc/footer.php'; ?>