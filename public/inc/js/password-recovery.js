(function(linkEl) {

	var model = (function() {
		function recoveryRequest(email) {
			var def = jQuery.Deferred();
			$.ajax({
				type: 'POST',
				url: '/request-password-recovery',
				data: {email: email},
				success: function(data) {
					def.resolve(data);
				},
				error: function(err) {
					def.reject(err);
				}
			});
			return def.promise();
		}

		return {
			recoveryRequest: recoveryRequest
		}
	}());

	var view = (function() {
		var formWrapper = $('<div>', {class: 'recovery-form-wrapper'});
		var heading = $('<h2>').text('Password recovery');
		var input = $('<input>', {'type': 'email', 'placeholder': 'Your email'});
		var submit = $('<button>').text('Send recovery email');
		var close = $('<button>').text('Close');
		formWrapper.append(heading)
			.append(input)
			.append(submit)
			.append(close)
		$('#login_wapper').append(formWrapper);

		return {
			submit: submit,
			input: input,
			close: close,
			show: function() {
				formWrapper.show();
			},
			hide: function() {
				formWrapper.hide();
			},
			alert: function(text) {
				$('.recovery-info').remove();
				formWrapper.append($('<p>', {class: 'recovery-info'}).text(text));
			}
		}
	}());

	var controller = (function() {
		linkEl.on('click', function() {
			view.show();
		});
		view.submit.on('click', function() {
			if (view.input.val()) {
				model.recoveryRequest(view.input.val()).then(function(data) {
					view.alert(data);
				}, function(err) {
					view.alert(err);
				});
			}
		});
		view.close.on('click', view.hide);
	}());
}($('.pass-recovery-link')));