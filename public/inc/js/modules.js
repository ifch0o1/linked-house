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
			if (err) {
				throw new Error(err);
			}
		});
	};
	var getData = function userConfigGetData(index, callback, ignoreChache) {
		if (ignoreChache || !cache) {
			doAjax({
				action: 'get',
				index: index
			}, function(res, err) {
				if (callback) {
					callback(res, err);
				}
			});
		}
		else {
			var value = getCacheValue(index);
			if (callback) {
				callback(value);
			}
			else {
				return getCacheValue(index);
			}
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