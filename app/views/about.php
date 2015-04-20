<?php include __DIR__.'/inc/header.php' ?>
<link rel="stylesheet" type="text/css" href="inc/css/about-page.css">
<link rel="stylesheet" type="text/css" href="inc/css/header-buttons.css">

<header id="header">
    
    <?php include __DIR__.'/inc/header-links.php' ?>

    <div id="right_side_header">
        <span class="header-btn" id="register-btn">
                <a href="/register">Register</a>
        </span>
        <span class="header-btn" id="login-btn">
            <a href="/login">Login</a>
        </span>
    </div>
</header>

<div id="overview-wrapper">
	<h1>Overview</h1>
	<div id="slider_wapper"></div>
</div>
<div id="about-wrapper">
	<h1>About</h1>
	<p>
		This is online storage for bookmarks and favorite links (urls). <br/>
	</p>

	<h2>Custom bookmarks</h2>
	<div class="about-row custom-bookmarks">
		<img src="inc/img/icons/set-1/customize.png">
		<p>
			You can customize your bookmarks. Choosing <strong>colors</strong>,
			adding <strong>comments</strong> and <strong>naming</strong> them.<br/>
			Deleting, renaming and changing color is easy. Just click options button
			sticked to the left side of the bookmark to open options.
		</p>
	</div>

	<h2>Weather forecast</h2>
	<div class="about-row forecast">
		<img src="inc/img/icons/set-1/weather.png">
		<p>
			At your home page you'll see forecast panel. It shows 3 days ahead forecast for
			choosen by you city.
		</p>
	</div>

	<h2>Fast links</h2>
	<div class="about-row fast-links">
		<img src="inc/img/icons/set-1/speed.png">
		<p>
			Fast links panel include few common web sites like: Facebook, Twitter, Gmail, etc.
			<br/>
			You could add only specific for you favorite links avoiding the common web sites.
		</p>
	</div>

	<h2>About the application and the creator</h2>
	<div class="about-row about-app">
		<img src="inc/img/icons/set-1/experiment.png">
		<p>
			An idea - "independent bookmarks". As you know every browser keeps your bookmarks
			at own storage, so you cannot access them between browsers. I using different browsers and I decided to develop an online storage for bookmarks with <strong>no browser dependency</strong>. Inside my mind it looks like a home page that redirects the user to the other pages, so I maded few other features like the slider and forecast for better look and feel.
			<br/>
			<br/>
			I am single web developer. You can contact me at ifch0o69@gmail.com
			<br/>
			Application code: <a href="https://github.com/ifch0o1/linked-house">Github - linked house</a>
			<br/>
			My <a href="https://github.com/ifch0o1">Github</a> profile.
		</p>
	</div>
</div>

<script type="text/javascript" src="inc/js/functions.js"></script>
<script type="text/javascript" src="inc/js/classes.js"></script>
<script type="text/javascript" src="inc/js/about-page.js"></script>
<?php include __DIR__.'/inc/footer.php' ?>