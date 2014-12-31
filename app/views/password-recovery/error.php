<?php include app_path().'/views/inc/header.php'; ?>

<style type="text/css">
	table td {
		display: table-cell;
	}
	table tr {
		display: table-row;
	}
	table {
		display: table;
		margin: 40px auto 0 auto;
	}
	#user_home_text a {
		color: #A3A4FF;
	}
	#content-holder {
		width: 560px;
		padding: 10px;
		margin: 80px auto;
		background-color: #FEFFBF;
		text-align: center;
		box-shadow: 0px 0px 50px -34px;
		font-family: trebuc;
	}
	#content-holder > p {
		margin-top: 20px;
	}
	#password-inputs {
		border: 1px solid rgba(0, 0, 0, 0.3);
		border-radius: 3px;
		border-spacing: 20px;
		box-shadow: 0px 7px 10px -11px;
	}
	#password-inputs input {
		height: 40px;
		text-align: center;
		color: lightgrey;
	}
	#submit-form {
		padding: 10px 0px;
		background-color: #000;
		color: white;
		width: 180px;
		margin: 40px auto 30px auto;
		-webkit-transition: 0.2s;
		transition: 0.2s;
	}
	#submit-form:hover {
		background-color: #FFB400;
		color: black;
	}
	#content-holder ul {
		margin-top: 20px;
		text-align: left;
		padding: 0 0 0 20px;
	}
	#content-holder li {
		list-style: disc;
		margin-top: 5px;
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

<div id="content-holder">
	<h2>Password Recovery Error</h2>
	<p>This error can be caused by any of these issues:</p>
	<ul>
		<li>The token we sent you is expired. (every token is valid to 1h after it is sent)</li>
		<li>This token doesn't not exist or is invalid.</li>
		<li>This token is not own by the users.</li>
		<li>Server error. (If you continue experiencing this problem, contact us for more help)</li>
	</ul>
</div>

<?php include app_path().'/views/inc/footer.php'; ?>