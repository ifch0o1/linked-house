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
        <span class="header-btn" id="register-btn">Register</span>
        <span class="header-btn" id="login-btn">Login</span>
    </div>
</header>


<h1 id="registration_heading_text" class="center">Registration</h1>

<div id="registration_wapper" class="center">

    <img id="reg-icon" src="inc/img/registration-icon.png">

    <form method="POST">
        <table class="reg_table">
            <tr>
                <td>Username</td>
                <td><input type="text" name="username"/></td>
            </tr>
            <tr>
                <td>
                    Password
                </td>
                <td><input type="password" name="password" /></td>
            </tr>
            <tr>
                <td>
                    Password
                </td>
                <td><input type="password" name="password_confirm" /></td>
            </tr>
            <tr>
                <td>
                    Email address
                </td>
                <td><input type="text" name="email" /></td>
            </tr>
        </table>
        <p id="activation-note" class="center">
            <i>Note: </i> Email activation is not required, but is recommended.<br>
            In case you forget your password, your email will be used to change it.
        </p>

        <input type='submit' value="Register" />
    </form>
</div>

<script type="text/javascript" src="inc/js/registration.js"></script>


<?php include __DIR__.'/inc/footer.php'; ?>