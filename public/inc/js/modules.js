'use strict';

var userConfig = (function(){

	var cache;

	// doAjax function sendig request to the server with `type: 'user-config'`
	// It will be used in this module to easely send config request to the server.
	function doAjax(data, callback) {
		data.type = 'user-config';
		$.ajax({
			method: 'POST',
			data: data,
			success: function(res) {
				if (callback) {
					callback(res);
				}
			},
			error: function(err) {
				if (callback) {
					callback(null, err);
				}
			}
		});
	}

	var setData = function userConfigSetData(index, val) {
		doAjax({
			action: 'set',
			index: index,
			value: val
		}, function(res, err) {
			// TODO Important
			// --Update cache whan set data.
			// This must be implemented as soon as possible. Otherwise will result in many errors.
			if (err) {
				if (debug) {
					console.error(err);
				}
				console.error('Error occured when saving user settings.');
			}
		});
	};

	/*-------------------------------------------------------------------
	| Function getData(index, callback, ignoreCache)
	|--------------------------------------------------------------------
	| Description: Get user settings value for an index.
	| 
	| NOTE: By default userConfig module cacheing the current settings.
	|
	| Params:
	|   index: `string` index in user settings, seperated by dot '.'
	|
	|   callback: (optional) `function` function to be executed.
	|     params: callback(response, error)
	|     NOTE: If no callback provided, this function will return an promise object.
	|
	|   ignoreCache: (optional) `boolean` Ignoring cache.
	|     Getting server value for the index.
	|     
	|--------------------------------------------------------------------
	*/
	var getData = function userConfigGetData(index, callback, ignoreCache) {
		// If not callback, use promise.
		if (!callback) {
			var defer = $.Deferred();
		}
		if (ignoreCache || !cache) {
			doAjax({
				action: 'get',
				index: index
			}, function(res, err) {
				// If callback is provided, execute the callback.
				if (callback) {
					callback(res, err);
				}
				// Else if callback is not provided, resolve or reject the promise.
				else {
					if (err) {
						defer.reject(err);
					}
					else {
						defer.resolve(res);
					}
				}
			});
		}
		else {
			var value = getCacheValue(index);
			if (callback) {
				callback(value);
			}
			else {
				defer.resolve(value);
				return value;
			}
		}

		if (defer) {
			return defer.promise();
		}
	};

	function initCache() {
		getData('', function(res, err) {
			if (err) {
				if (debug) {
					console.log(err);
				}
				console.error('Server error occured while trying to get user config.');
			}
			else {
				cache = res;
			}
		}, true);
	}
	initCache();

	function getCacheValue(index) {
		if (!index) {
			return cache;
		}
		var indexArr = index.split('.');
		var cacheValue;
		for (index in indexArr) {
			cacheValue = cacheValue ? cacheValue[index] : cache[index];
		}
		return cacheValue;
	}

	// Public interface
	return {
		set: setData,
		get: getData
	}

}());