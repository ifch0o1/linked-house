'use strict';
(function() {
	/*------------------------------
	|	requirements interface fields:
	|		required: `bool` required filed or not
	|		min: `number` minimum symbols,
	|		max: `number` maximum symbols,
	|		regex: `regex` regex expression,
	|		forbidden: `string` forbidden symbols
	|
	|-------------------------------
	*/
	var requirements = {
		username: {
			required: true,
			min: 6,
			max: 22,
			forbidden: '!@$#%^&*(){}[]|/\\:;\'",+=~`<>'
		},
		password: {
			required: true,
			min: 8,
			max: 40
		},
		email: {
			required: true,
			regex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		}
	}

	/*------------------------------------------------
	| Checking if an value passes provided requirements.
	| Returns `true` if it pass and `false` if not.
	| Note: This function can be slow if the requirements.forbidden
	| is too long string.
	|-------------------------------------------------
	*/
	// TODO write a test for this function. Just in case.
	var check = function(value, reqs) {
		if (value && typeof value !== 'string') {
			throw new TypeError('function chech(value, reqs) requires value parameter as `string`');
		}

		if (reqs.required && !value) {
			return false;
		} else if (reqs.min && reqs.min > value.length) {
			return false;
		} else if (reqs.max && reqs.max < value.length) {
			return false;
		} else if (reqs.forbidden) {
			var forbiddenSymbols = reqs.forbidden.split('');
			for (var i = 0; i < forbiddenSymbols.length; i++) {
				if (value.indexOf(forbiddenSymbols[i]) !== -1) {
					return false;
				}
			}
		} else if (reqs.regex && reqs.regex.test(value) !== true) {
			return false;
		}
		return true;
	}

	var remoteCheck = (function() {
		/*-----------------------------------
		|	doAjax function takes 2 arguments:
		|	obj: `JSON` properties: {
		|		check: `string` 'username' | 'email'
		|		value: `string` 'value'
		|	},
		|	callback: `function` arguments:
		|		response: `string` response from the server | null on ajax error.
		|		error: ajax error | server error.
		|	
		|------------------------------------
		*/
		function doAjax(obj, callback) {
			$.ajax({
				type: 'POST',
				data: obj,
				success: function(res) {
					callback(res);
				},
				error: function(err) {
					callback(null, err);
				}
			});
		}

		var checkEmail = function(val, callback) {
			doAjax({
				check: 'email',
				value: val
			}, callback);
		}

		var checkUsername = function(val, callback) {
			doAjax({
				check: 'username',
				value: val
			}, callback);
		}

		return {
			username: checkUsername,
			email: checkEmail
		}

	}());

	// Input focus event handlers
	(function() {
		var status = {
			clear: function($input) {
				var statusSpan = this._getStatusEl($input);
				statusSpan.removeClass('field_status_deny');
				statusSpan.removeClass('field_status_accept');
				statusSpan.removeAttr('_title');
			},
			accept: function($input, message) {
				var statusSpan = this._getStatusEl($input);
				statusSpan.addClass('field_status_accept');
				if (message) {
					statusSpan.attr('_title', message);
				}
			},
			deny: function($input, message) {
				var statusSpan = this._getStatusEl($input);
				statusSpan.addClass('field_status_deny');
				if (message) {
					statusSpan.attr('_title', message);
				}
			},
			_getStatusEl: function($input) {
				return $input.parent().parent().find('.field_status');
			}
		}

		$('#field_username').focusin(function() {
			status.clear($(this));
		});
		$('#field_username').focusout(function() {
			var that = $(this);
			if (!that.val()) return;

			var valid = check(that.val(), requirements.username);
			if (!valid) {
				status.deny(that, 'Min ' + requirements.username.min + 
					' max ' + requirements.username.max + 
					', a-Z 0-9');
				return;
			}

			remoteCheck.username(that.val(), function(res, err){
				if (err) {
					// TODO show error to the user.
					console.log(err);
					return;
				}

				if (res === 'free') {
					status.accept(that, 'This username is available.');
				} else if (res === 'exist') {
					status.deny(that, 'This username already exist.');
				} else {
					// TODO show error to the user.
				}
			});
		});

		$('#field_pass, #field_re_pass').focusin(function() {
			status.clear($('#field_pass'));
			status.clear($('#field_re_pass'));
		});
		$('#field_pass, #field_re_pass').focusout(function() {
			if ($('#field_pass').val() && $('#field_re_pass').val()) {
				if ($('#field_pass').val() !== $('#field_re_pass').val()) {
					status.deny($('#field_pass'), 'Passwords do not match.');
					status.deny($('#field_re_pass'), 'Passwords do not match.');
					return;
				}
			}
			var valid = check($('#field_pass').val(), requirements.password);
			if (!valid) {
				status.deny($('#field_pass'), 'Min ' + requirements.password.min +
					' max ' + requirements.password.max + ' symbols.');
			}
		});

		$('#field_email').focusin(function() {
			status.clear($(this));
		});
		$('#field_email').focusout(function() {
			if (!$(this).val()) return;
			var valid = check($(this).val(), requirements.email);
			if (!valid) {
				status.deny($(this), 'Enter an email address.');
				return;
			}

			var that = $(this);
			remoteCheck.email($(this).val(), function(res, err) {
				if (err) {
					// TODO show error to user.
					console.log(err);
				}
				if (res === 'free') {
					status.accept(that, 'This email is available.');
				} else if (res === 'exist') {
					status.deny(that, 'This email is already used.');
				} else {
					status.deny(that, 'Problem occured.');
				}
			});
		});
	}());


}());