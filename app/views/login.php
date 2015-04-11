<?php include __DIR__.'/inc/header.php' ?>
<style type="text/css">
    .header-btn {
        margin: 20px 10px;
        font-size: 12px;
        text-align: center;
        cursor: pointer;
        line-height: 20px;
        display: inline-block;
        float:left;
        height: 20px;
        width: 90px;
        background-color: #666666;
    }
    #register-btn {
        margin-left: 120px;
    }
    #register-btn a {
        color: #66cc66;
    }
    #login-btn a {
        color: #6699cc;
    }
    #login_wapper, #server-status-info, .login-note {
        width: 560px;
        margin-left: auto;
        margin-right: auto;
    }
    #login_wapper {
        position: relative;
        margin-top: 60px;
        text-align: center;
    }
    #login_wapper form {
        background-color: #99ff99;
        padding: 17px 0 40px 0;
        text-align: center;
        margin-top: 40px;
    }
    #login_heading_text {
        font-family: trebuc;
        float: left;

    }
    #login-sticker {
        position: absolute;
        top: -48px;
        right: -48px;
    }
    .server-status-icon {
        width: 48px;
        height: 48px;
    }
    .server-waiting-icon {
        background: url(inc/img/server-status-sprite.png) 0 0;
    }
    .server-working-icon {
        background: url(inc/img/server-status-sprite.png) -48px 0;
    }
    .server-deny-icon {
        background: url(inc/img/server-status-sprite.png) -96px 0;
    }
    .server-accept-icon {
        background: url(inc/img/server-status-sprite.png) -144px 0;
    }
    #server-status-info span {
        font-size: 13px;
    }
    #server-status-info sup,
    #server-status-info sub {
        font-size: 9px;
    }
    #login-table {
        position: relative;
        width: 400px;
        margin-left: 40px;
    }
    #login-table tbody > tr {
        margin-top: 20px;
        height: 40px;

    }
    #login-table input {
        font-size: 14px;
        height: 40px;
        text-align: center;
        border: none;
        width: 100%;
        box-shadow: 2px 3px 14px rgba(0, 0, 0, 0.1);
    }
    #login-table tbody > tr > td:first-child {
        width: 100px; /*Fix for mozilla firefox*/
        float: left;
        line-height: 40px; /*Fix for mozilla firefox*/
    }
    #login-table tbody > tr > td:last-child {
        width: 280px;
        float: right;
    }
    #current-server-status-icon {
        position: absolute;
        right: 50;
        top: 125;
    }
    #server-status-info > table > tbody > tr > td {
        display: inline-block;
    }
    #server-status-info > table > tbody > tr {
        font-family: "Trebuchet MS", Helvetica, sans-serif;
        font-weight: bold;
        margin-top: 10px;
    }
    #server-status-info > table > tbody > tr > td:last-child {
        padding-left: 15px;
    }
    .login-note {
        font-size: 13px;
        color: #888;
    }
    #login-submit {
        display: none;
        border: none;
        font-size: 16px;
        margin-top: 40px;
        width: 180px;
        height: 40px;
        cursor: pointer;
        background-color: #fafaaa;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
    }
    #login-submit:hover {
        background-color: #fafafa;
    }
    #login-error-text {
        color: red;
        font-size: 11px;
        font-weight: bold;
        text-align: center;
    }
    .pass-recovery-link {
        display: none;
        color: #4589FF;
        margin-top: 20px;
    }
    .pass-recovery-link:hover {
        color: blue;
    }
    .recovery-form-wrapper {
        display: none;
        background-color: #ABDB70;
        padding: 10px 0;
        top: 0;
        width: 100%;
        text-align: center;
    }
    .recovery-form-wrapper h2 {
        font-family: trebuc;
        margin-bottom: 15px;
    }
    .recovery-form-wrapper input, .recovery-form-wrapper button {
        margin: 2px;
    }
    .recovery-form-wrapper p {
        margin-top: 10px;
        font-family: trebuc;
        color: #323320;
    }

</style>

<script type="text/javascript" src="inc/js/jquery-1.11.1-uncompressed.js"></script>

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

<div id="login_wapper">
<img src="inc/img/login-sticker.png" class="l-sticker" id="login-sticker" />
    <h1 id="login_heading_text">Login</h1>
    <br class="clearfix"/>
    <div id="login-table-wapper">
        <form method="post">
            <p id="login-error-text"></p>
            <table id="login-table">
                <tr>
                    <td>Username: </td>
                    <td><input type="text" name="username" id="name-input"/></td>
                </tr>
                <tr>
                    <td>Password: </td>
                    <td><input type="password" name="password" id="password-input"/></td>
                </tr>
            </table>
            <span id="current-server-status-icon" class="server-status-icon server-waiting-icon"></span>
            <button type="button" id="login-submit">Login</button>
            <a href="#" class="pass-recovery-link">Password recovery</a>
        </form>
    </div>
</div>
<p class="login-note"><i>Note: </i>This login form will be submitted automaticality after you enter your information.</p>
<div id="server-status-info">
    <table>
        <tr>
            <td>
                <span class="server-status-icon server-waiting-icon"></span>
            </td>
            <td>
                <span>Server waiting.</span>
            </td>
        </tr>
        <tr>
            <td>
                <span class="server-status-icon server-accept-icon"></span>
            </td>
            <td>
                <span>Server accept - (You are logging in).</span>
            </td>
        </tr>
        <tr>
            <td>
                <span class="server-status-icon server-deny-icon"></span>
            </td>
            <td>
                <span>Server deny - (Username / Password wrong) <sup>OR ACCOUNT IS DEACTIVATED</sup></span>
            </td>
        </tr>
        <tr>
            <td>
                <span class="server-status-icon server-working-icon"></span>
            </td>
            <td>
                <span>Server working - (Checking your username and password).</span>
            </td>
        </tr>
    </table>
</div>
    
</div> <!-- This closing div closes '#wapper' div in header.php file. -->

<script type="text/javascript" src="inc/js/functions.js"></script>
<script type="text/javascript" src="inc/js/login.js"></script>
<script type="text/javascript" src="inc/js/password-recovery.js"></script>

<?php include __DIR__.'/inc/footer.php' ?>