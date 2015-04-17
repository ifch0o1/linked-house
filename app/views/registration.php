<?php include __DIR__.'/inc/header.php' ?>
<link type="text/css" rel="stylesheet" href="inc/css/registration.css">
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
        <span class="header-btn" id="register-btn">
                <a href="/register">Register</a>
        </span>
        <span class="header-btn" id="login-btn">
            <a href="/login">Login</a>
        </span>
    </div>
</header>


<h1 id="registration_heading_text" class="center">Registration</h1>

<div id="registration_wapper" class="center">

    <img id="reg-icon" src="inc/img/registration-icon.png">
    <?php
        if (isset($regError)) {
            echo '<p id="reg_error" class="center">'.$regError.'</p>';
        }
    ?>
    <form method="POST">
        <table class="reg_table">
            <tr>
                <td>Username</td>
                <td><input id="field_username" type="text" name="username" required /></td>
                <td><span class="field_status"></span></td>
            </tr>
            <tr>
                <td>Password</td>
                <td><input id="field_pass" type="password" name="password" required /></td>
                <td><span class="field_status"></span></td>
            </tr>
            <tr>
                <td>Password</td>
                <td><input id="field_re_pass" type="password" name="password_confirm" required /></td>
                <td><span class="field_status"></span></td>
            </tr>
            <tr>
                <td>Email address</td>
                <td><input id="field_email" type="email" name="email" required /></td>
                <td><span class="field_status"></span></td>
            </tr>
        </table>
        <p id="activation-note" class="center">
            <i>Note: </i> Email activation is not required, but is recommended.<br>
            In case you forgot your password, your email will be used to renew it.
        </p>

        <input id="reg_submit" type="submit" value="Register" />
    </form>
</div>
<script type="text/javascript" src="inc/js/jquery-1.11.1-uncompressed.js"></script>
<script type="text/javascript" src="inc/js/registration.js"></script>


<?php include __DIR__.'/inc/footer.php'; ?>