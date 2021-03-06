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
	.accept {
		color: green;
	}
	.deny {
		color: red;
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
	<p id="info"></p>
	<h2>Password recovery</h2>
	<p>Enter your new password below</p>
	<form action="post">
		<table id="password-inputs">
			<tr>
				<td>Password:</td>
				<td><input name="new-password" id="new-password" type="password" required /></td>
			</tr>
			<tr>
				<td>Password confirm:</td>
				<td><input name="re-new-password" id="re-new-password" type="password" required /></td>
			</tr>
		</table>
		<input name="state-token" id="state-token" type="hidden" value="<?= $token ?>" />
		<input name="state-user-id" id="state-user-id" type="hidden" value="<?= $id ?>" />
		<a href="#" id="submit-form">Change Password</a>
	</form>
</div>

<script type="text/javascript">
	var viewPassword = {
		_el: $('#info'),
		message: function(text, isBad) {
			this._el.removeClass('accept').removeClass('deny');
			if (isBad) {
				this._el.addClass('deny');
			}
			else {
				this._el.addClass('deny');
			}
			this._el.text(text);
		},
		changed: function() {
			this._el.removeClass('deny').addClass('accept');
			this._el.text('Password changed successful.');
		},
		notMatch: function() {
			this._el.removeClass('accept').addClass('deny');
			this._el.text('Password do not match.');
		},
		hideButton: function() {
			$('#submit-form').css('visibility', 'hidden');
		}
	}

	$('#submit-form').on('click', function() {
		if (!$('#new-password').val() || !$('#re-new-password').val()) {
			return;
		}
		if ($('#new-password').val() !== $('#re-new-password').val()) {
			viewPassword.notMatch();
			return;
		}
		if ($('#new-password').val().length < 8) {
			viewPassword.message('Min 8 symbols', true);
		}

		var data = {
			'token': $('#state-token').val(),
			'id': $('#state-user-id').val(),
			'new-password': $('#new-password').val(),
			're-new-password': $('#re-new-password').val()
		}
		$.ajax({
			type: 'POST',
			data: data,
			success: function(res) {
				if (res == 'password-changed') {
					viewPassword.changed();
					viewPassword.hideButton();
				}
			}
		});
	});
</script>


<?php include app_path().'/views/inc/footer.php'; ?>