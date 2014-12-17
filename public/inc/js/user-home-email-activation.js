/*
	This file contains the client side logic related with email activation.
	This file will work correctly in user-home (/home route).
*/

'use strict';

(function() {

	function checkActivationState() {
		var defer = $.Deferred(),
		    data = {
		    	type: 'check-activation-state'
		    };
		$.ajax({
			type: 'post',
			data: data,
			success: function(res) {
				defer.resolve(res);
			},
			error: function(err) {
				defer.reject('Server error - Cannot get activation state');
			}
		});

		return defer.promise();
	}

	checkActivationState()
		.then(function(res) {
			if (res == 'activated') {
				return;
			} else if (res == 'expired') {
				addResendOption($('body'), _phpUserData.users[0].user_email);
			} else if (res == 'pending') {
				return;
			}
		});

	function addResendOption(element, currentEmail) {
		currentEmail = currentEmail || '';
		if (!element || !(element instanceof jQuery)) {
			// By default the constructDOM function will return holder with fixed position.
			// So we do not need an concrete element to render it inside.
			element = $('body');
		}

		var domObjs = constructDOM(currentEmail);
		handleClickEvent(domObjs.button, domObjs.input);
		element.append(domObjs.holder);

		/*-----------------------------------
		| Function: handleClickEvent(element)
		| Handeling event to the action button
		| which will send request for resend activation email to the user
		| if email is not changed or it's free.
		|------------------------------------
		*/
		function handleClickEvent(element, emailInput) {
			if (!emailInput || !(emailInput || emailInput instanceof jQuery)) {
				throw new Error('handleClickEvent(el, email) expecting second argument as email input address.');
			}
			if (!element || !(element instanceof jQuery)) {
				throw new Error('handleClickEvent(el) expecting first arg as jQuery object.');
			}

			element.on('click', function() {
				var that = $(this);
				var emailValue = emailInput.val();
				if (emailValue == _phpUserData.users[0].user_email) {
					doResendRequest();
				}
				else {
					$.ajax({
						type: 'post',
						data: {
							type: 'check-email',
							email: emailValue
						},
						success: function(res) {
							if (res == 'free') {
								doResendRequest();
								$('#activation-resend-holder').remove();
							} else if (res == 'exist') {
								emailInput.css('border', '2px solid red');
							} else {
								// TODO show user error.
								console.log('Unexpected server response');
							}
						}
						// TODO error hendeling
					});
				}

				function doResendRequest() {
					return $.ajax({
						type: 'post',
						data: {
							type: 'resend-activation-email',
							email: emailInput.val()
						},
						success: function(res) {
							if (res !== 'success') {
								// Important to show user error.
								// Email may be not actually sent.
								if (debug) {
									console.log('Server error while resending activation email. Reponse: ' + res);
								}
							}
						},
						error: function(err) {
							// TODO
							// Important to show an error if the request fails.
							// Because the activation email may be not actually sent.
							if (debug) {
								console.log(err);
							}
						}
					});
				}
			});
		}

		function constructDOM(currentEmail) {
			var $holder = $('<span>', {
				id: 'activation-resend-holder'
			}).css({
				position: 'fixed',
				top: '0px',
				left: '670px',
				padding: '5px',
				textAlign: 'center',
				color: 'white',
				opacity: '0.2'
			});

			var $resendText = $('<span>', {
				id: 'activation-resend-text'
			}).text('Resend activation email');

			$holder.append($resendText);

			var $inputEmail = $('<input>', {
				type: 'email',
				placeholder: 'Email address'
			}).css({
				display: 'none',
				marginTop: '10px',
			}).val(currentEmail);

			$holder.append($inputEmail);

			var $resendButton = $('<a>', {
				href: '#'
			}).css({
				display: 'none',
				marginTop: '10px',
				backgroundColor: '#fff',
				padding: '3px',
				cursor: 'pointer'
			}).text('Resend');

			$holder.append($resendButton);

			return {
				holder: $holder,
				input: $inputEmail,
				button: $resendButton
			}
		}
	}
}());