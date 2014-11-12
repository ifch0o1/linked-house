// Login and auto login

// TODO
// IMPORTANT
// TODO
// Fix the bug with page refreshing while submitting
// Because while refresh the page get parameters with username and PASSWORD
// are showed in the window.location like GET request.

// REMOVE CONSOLE LOGS...
// They are writed while accepted or login submitted.

'use strict';

function WriteSpeed(inputElements, arrReference) {
	//TODO : Check inputElements array. (elements must be inputs and jQuery objects).
	if (!$.isArray(arrReference)) {
		throw new TypeError('writingSpeed(inputElements, arrReference), arrReference must be an array. '
		+ arrReference + ' given.');
	}
	if (!$.isEmptyObject(arrReference)) {
		throw new Error('writingSpeed arrReference must be an empty array. ' + arrReference + ' given.');
	}
	this.inputsLength = inputElements.length;
	this.inputElements = [];
	this.arrReference = arrReference;
	this.changeCounter = 0;

	this.defineArrKeys();
	for (var i = 0; i < inputElements.length; i++) {
		this.watch(inputElements[i]);
	}
}
WriteSpeed.prototype.defineArrKeys = function() {
	this.arrReference['inputs'] = [];
	for (var i = 0; i < this.inputsLength; i++) {
		this.arrReference['inputs'].push([]);
	}
	this.arrReference['lastChange'] = null;
	this.arrReference['speed'] = null;
	this.arrReference['lowSpeedDetected'] = false;
}
WriteSpeed.prototype.clear = function() {
	this.defineArrKeys(); // This cleaning arrReference array.
	this.changeCounter = 0;
}
WriteSpeed.prototype.watch = function(inputElement) {
	if (!(inputElement instanceof jQuery)) {
		throw new Error('WriteSpeed.prototype.watchSpeed(inputElement)' +
			' expecting inputElement as jQuery object. ' + inputElement + ' given.');
	}
	var index = (this.inputElements.push(inputElement)) - 1;

	function worker(e) {
		var code = e.keyCode || e.which;
		if (checkKeyCode(code) == 'backspace') {
			this.arrReference['lastChange'] = getCurrentTime();
			return;
		}
		if (checkKeyCode(code) == 'enter') {
			LogerController.login();
			return;
		}
		if (checkKeyCode(code) == 'tab') {
			return;
		}

		this.changeCounter++;
		var currentTime = getCurrentTime();
		if (this.changeCounter == 1) {
			this.arrReference['lastChange'] = currentTime;
		}
		else if (this.changeCounter == 2) {
			var difference = currentTime - this.arrReference['lastChange'];
			if (difference > 1000) {
				this.arrReference['lowSpeedDetected'] = true;
			}
			this.arrReference['inputs'][index] = this.arrReference['inputs'][index] ?
			this.arrReference['inputs'][index] : [];
			this.arrReference['inputs'][index].push(difference);
		}
		else if (this.changeCounter > 2) {
			var difference = currentTime - this.arrReference['lastChange'];
			this.arrReference['inputs'][index].push(difference);
			this.arrReference['speed'] = average(this.arrReference['inputs'][index]);
		}
		this.arrReference['lastChange'] = currentTime;
	}

	inputElement.bind('keyup', function(e) {
		worker.call(window.ws, e); // window.ws is new WriteSpeed instance used by Loger.
	});
}

function Loger(nameInput, passInput) {
	function check(input) {
		if (!(input instanceof jQuery)) {
			throw new Error('Loger(nameInput, passInput) expecting arguments as jQuery objects. '
			+ input + ' given.');
		}
		// TODO check if element is input.
	}
	check(nameInput);
	check(passInput);

	this.nameInput = nameInput;
	this.passInput = passInput;
	this.arrReference = [];
	this.autoSubmiting = true;
	this.failSubmits = 0;

	window.ws = new WriteSpeed([this.nameInput, this.passInput], this.arrReference);
}
Loger.prototype.checkArrReference = function() {
	var ar = this.arrReference;
	if (ar['lowSpeedDetected'] || (this.failSubmits >= 3)) {
		return 'disableAuto';
	}
	if (ar['speed']  &&  this.autoSubmiting  && 
	(ar['inputs'][0].length > 2) && (ar['inputs'][1].length > 2)) {
		if ((getCurrentTime() - ar['lastChange']) > ( ar['speed'] * 2 + 300)) {
			return 'submit';
		}
	}
}
Loger.prototype.disableAutoSubmit = function() {
	this.autoSubmiting = false;
}
Loger.prototype.enableAutoSubmit = function() {
	this.autoSubmiting = true;
}
Loger.prototype.checkAutoSubmit = function() {
	return this.autoSubmiting;
}
Loger.prototype.getSpeed = function() {
	return this.arrReference['speed'];
}
Loger.prototype.registerFail = function() {
	this.failSubmits++;
	return this.failSubmits;
}

var LogerController = {
	reqInProgress: false,
	loger: new Loger($('#name-input'), $('#password-input')),

	init: function() {
		this._fixBrowserAutocompleteBug($('#name-input'), $('#password-input'));
		this._customIntervalChecking();
	},
	login: function() {
		if (this.reqInProgress === true) {
			return;
		}
		LogerView.changeIcon('working');
		var data = {
			username: $('#name-input').val(), 
			password: $('#password-input').val(),
		};
		$.ajax({
			type: 'POST',
			data: data,
			beforeSend: function() {
				LogerController.reqInProgress = true;
			},
			success: function(response) {
				switch (response) {
					case 'accept':
						LogerView.changeIcon('accept');
						setTimeout(function(){window.location.reload()}, 350);
						break;
					case 'deny':
						LogerView.changeIcon('deny');
						if (LogerController.loger.registerFail() < 2) {
							LogerController.enableAutoSubmit();
						}
						setTimeout(function(){LogerView.changeIcon('waiting')}, 3000);
						break;
					case 'error':
						LogerView.changeIcon('error');
						setTimeout(function() {LogerView.changeIcon('waiting')}, 200); 
						LogerView.showError('Server error occured. Try again later.');
						break;
					default:
						LogerView.showError();
						LogerView.changeIcon('waiting');
						break;
				}
			},
			error: function() {
				// TODO redirect user to error page with error content
				// Options for feedback
			},
			complete: function() {
				LogerController.reqInProgress = false;
			}
		});
	},
	disableAutoSubmit: function() {
		LogerController.loger.disableAutoSubmit();
		LogerView.showButton();
	},
	enableAutoSubmit: function() {
		LogerController.loger.enableAutoSubmit();
		LogerView.hideButton();
	},
	_customIntervalChecking: function() {
		check();
		function check() {
			var status = LogerController.loger.checkArrReference();
			switch (status) {
				case 'disableAuto':
					LogerController.disableAutoSubmit();
					break;
				case 'submit':
					LogerController.login();
					window.ws.clear();
					break;
				default:
					break;
			}
			var speed = LogerController.loger.getSpeed() || 1000;
			if (speed > 1000) {
				LogerController.disableAutoSubmit();
			}
			setTimeout(check, speed);
		};
	},
	_fixBrowserAutocompleteBug: function(nameInput, passInput) {
		if (nameInput.val()) {
			LogerController.loger.arrReference['inputs'][0] = [300, 300, 300];
		}
		if (passInput.val()) {
			LogerController.loger.arrReference['inputs'][1] = [600, 600, 600];
		}
		if (nameInput.val() && passInput.val()) {
			LogerController.loger.arrReference['speed'] = 999;
			LogerController.loger.arrReference['lastChange'] = getCurrentTime();
		}
	}
}

var LogerView = {
	serverState: $('#current-server-status-icon'),

	showButton: function() {
		$('#login-submit').show();
	},
	hideButton: function() {
		$('#login-submit').hide();
	},
	changeIcon: function(stateString) {
		(function dropIconClass() {
			var classes = LogerView.serverState.attr('class').split(' ');
			for (var i=0; i < classes.length; i++) {
				if (classes[i].substr(0, 6) == 'server' &&
				classes[i] != 'server-status-icon') {
					LogerView.serverState.removeClass(classes[i]);
				}
			}
		})();
		var classTemplate = 'server-?-icon';
		var fullClass = classTemplate.replace('?', stateString);
		LogerView.serverState.addClass(fullClass);
	},
	showError: function(text) {
		var error = text ? text : 'Unknown error.';
		var errorPlaceHolder = $('#login-error-text');
		errorPlaceHolder.text(error);
	}
}

$('#login-submit').bind('click', LogerController.login);

LogerController.init();