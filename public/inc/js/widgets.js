//	WEATHER API
//	Powered by WeatherUnderground (http://www.wunderground.com/weather/api/)
//

var Weather = (function(){
	//	Do not use this key in your applications. That will affect Linked House weather widget.
	// 	You can get your own key free. More info at (http://www.wunderground.com/weather/api/).
	var key = '13324c920a8e523f';
	var whost = 'http://api.wunderground.com/api/' + key + '/';

	return {
		getForecast: function(features, location, callback) {
			if (!$.isArray(features)) throw new Error('getForecast() expect first arguments as array.');
			var featuresURI;
			$.each(features, function(i, feature) {
				featuresURI = featuresURI ? featuresURI += '/' + feature : feature;
			});

			var url = whost + featuresURI + '/q/' + location + '.json';
			$.ajax({
				type: 'GET',
				url: url,
				dataType: 'jsonp',
				success: function(response){
					callback(response);
				},
				error: function(){
					// TODO
				}
			});
		},
	}
})();

var ViewForecast = function(city) {
	if (!city) {
		throw new Error('ViewForecast(city) expecting 1 argument as city name.');
	}
	this.$holder;

	var $forecastPlatform = domConstructor(city);

	this.today = function (temp, min, max, icon) {
		var $today = $forecastPlatform.find('#forecast_today');

		$today.find('#forecast_today_temp').text(temp + ' °C');

		$today.find('img').attr({
			alt: 'Forecast Icon',
			src: icon,
			title: extractFileName(icon, true)
		});

		$today.find('.forecast_values').text(max + ' | ' + min + ' °C');
	}
	this.after1day = function (min, max, icon) {
		var $thisDay = $forecastPlatform.children('.forecast_after').eq(0);
		$thisDay.find('.forecast_day_text').text('Tomorrow');

		$thisDay.find('img').attr({
			alt: 'Forecast Icon',
			src: icon,
			title: extractFileName(icon, true)
		});

		$thisDay.find('.forecast_values').text(max + ' | ' + min + ' °C');
	}
	this.after2day = function (min, max, icon, weekDay) {
		var $thisDay = $forecastPlatform.children('.forecast_after').eq(1);

		$thisDay.find('.forecast_day_text').text(weekDay);

		$thisDay.find('img').attr({
			alt: 'Forecast Icon',
			src: icon,
			title: extractFileName(icon, true)
		});

		$thisDay.find('.forecast_values').text(max + ' | ' + min + ' °C');
	}
	this.after3day = function (min, max, icon, weekDay) {
		var $thisDay = $forecastPlatform.children('.forecast_after').eq(2);

		$thisDay.find('.forecast_day_text').text(weekDay);

		$thisDay.find('img').attr({
			alt: 'Forecast Icon',
			src: icon,
			title: extractFileName(icon, true)
		});

		$thisDay.find('.forecast_values').text(max + ' | ' + min + ' °C');
	}

	this.render = function($parentElement) {
		this.$holder = $parentElement;
		$parentElement.append($forecastPlatform);
		bindForecastConfig();
	}

	this.clear = function() {
		// Todo fix this function. It will empty all widgets. not only forecast.
		this.$holder.empty();
	}

	function domConstructor(city) {
		$forecast = $('<div>', {
			id: 'forecast'
		});

		$cityName = $('<h3>').attr('id', 'forecast_cityname').text(city);

		$forecastToday = $('<div>', {
			id: 'forecast_today',
			class: 'forecast_block'
		});

		$todayTemp = $('<p>', {
			id: 'forecast_today_temp'
		});

		$forecastValues = $('<p>', {
			class: 'forecast_values'
		});

		$forecastIcon = $('<img>');

		$forecastSeparator = $('<div>', {
			class: 'forecast_separator'
		});

		$forecastAfter = $('<div>', {
			class: 'forecast_after forecast_block'
		});

		$forecastAfterText = $('<p>', {
			class: 'forecast_day_text'
		});

		$forecastConfig = $('<span>', {
			id: 'forecast_config'
		}) .text('Configure');

		$forecastConfigContainer = $('<div>', {
			id: 'forecast_config_conteiner'
		});

		$wundergroundAnchor = $('<a>', {
			href: 'http://www.wunderground.com/'
		});

		$wundergroundLogo = $('<img>', {
			src: '/inc/img/wunderground.png',
			id: 'wunderground_logo'
		});

		$forecastToday.append($todayTemp).append($forecastIcon.clone())
			.append($forecastValues.clone()).append($forecastSeparator.clone());

		$forecastAfter.append($forecastAfterText.clone()).append($forecastIcon.clone())
			.append($forecastValues.clone()).append($forecastSeparator.clone());

		$wundergroundAnchor.append($wundergroundLogo);

		$forecast.append($cityName).append($forecastToday)
			.append($forecastAfter.clone()).append($forecastAfter.clone())
			.append($forecastAfter.clone()).append($forecastConfig)
			.append($forecastConfigContainer).append($wundergroundAnchor);

		return $forecast;
	}
}

var ControllForecast = function(weatherObject) {
	// TODO check if weatherObject is correct.
	// not only exist. Some cityes did not receiving correct data.
	this.init = function(weatherObject) {
		this._forecast = weatherObject.forecast.simpleforecast.forecastday;
		this._textForecast = weatherObject.forecast.txt_forecast.forecastday;
		this._current = weatherObject.current_observation;
		var fullCity = weatherObject.current_observation.display_location.full;
		this.city = fullCity;
		// this.city = getLastSplit(',', fullCity.trim());
		this.viewForecast;
	}
	this.init(weatherObject);

	this.render = function(degree) {
		if (degree !== 'C' && degree !== 'F') {
			throw new Error('Weather.getForecast() expecting third argument as char(string) \'C\' or \'F\'');
		}

		var todayTemp = (degree === "C") ? this._current.temp_c : this._current.temp_f;
		var todayValues = new Array(2);
		todayValues[0] = (degree === "C") ? this._forecast[0].low.celsius : this._forecast[0].low.fahrenheit;
		todayValues[1] = (degree === "C") ? this._forecast[0].high.celsius : this._forecast[0].high.fahrenheit;
		var todayIcon = this._forecast[0].icon_url;

		this.viewForecast = new ViewForecast(this.city, degree);
		this.viewForecast.today(todayTemp, todayValues[0], todayValues[1], todayIcon);

		var tomorrowValues = new Array(2);
		tomorrowValues[0] = (degree === "C") ? this._forecast[1].low.celsius : this._forecast[1].low.fahrenheit;
		tomorrowValues[1] = (degree === "C") ? this._forecast[1].high.celsius : this._forecast[1].high.fahrenheit;
		var tomorrowIcon = this._forecast[1].icon_url;

		this.viewForecast.after1day(tomorrowValues[0], tomorrowValues[1], tomorrowIcon);

		var after2dayValues = new Array(2);
		after2dayValues[0] = (degree === "C") ? this._forecast[2].low.celsius : this._forecast[2].low.fahrenheit;
		after2dayValues[1] = (degree === "C") ? this._forecast[2].high.celsius : this._forecast[2].high.fahrenheit;
		var after2dayIcon = this._forecast[2].icon_url;
		var after2dayWeekDay = this._textForecast[4].title;

		this.viewForecast.after2day(after2dayValues[0], after2dayValues[1], after2dayIcon, after2dayWeekDay);

		var after3dayValues = new Array(2);
		after3dayValues[0] = (degree === "C") ? this._forecast[3].low.celsius : this._forecast[3].low.fahrenheit;
		after3dayValues[1] = (degree === "C") ? this._forecast[3].high.celsius : this._forecast[3].high.fahrenheit;
		var after3dayIcon = this._forecast[3].icon_url;
		var after3dayWeekDay = this._textForecast[6].title;

		this.viewForecast.after3day(after3dayValues[0], after3dayValues[1], after3dayIcon, after3dayWeekDay);
		this.viewForecast.render($('#widgets_wapper'));
	};

	this.empty = function() {
		this.viewForecast.clear();
	}

	this.rerender = function(weatherObject, degreeFormat) {
		if (degreeFormat !== 'C' && degreeFormat !== 'F') {
			throw new Error('rerender() expecting second arguments as string `C` or `F`');
		}
		this.empty();
		this.init(weatherObject);
		this.render(degreeFormat);
	}

	this.setLocation = function(location) {
		if (!location) {
			throw new Error('forecastController.setLocation(location) expecting 1 argument as `string` location');
		}

		userConfig.set('forecast.location', location);
	}
}


/*
	Configuration
*/

function WeatherConfiguration(weatherController, configDiv) {
	this._controller = weatherController;
	this._config = configDiv;
	this._visible = false;
	this._dom = this._domConstructor();
	this._autocomplete = {
		waitingAjax: false,
		queuedQuery: null
	}

	// Preparing to work.
	this._config
		.append(this._dom.full)
		.css('display', 'none');

	this._handleCityInputEvent();
}
WeatherConfiguration.prototype.show = function(value) {
	var displayRule = value ? 'block' : 'none';
	this._config.css('display', displayRule);
	this._visible = !!value;
}
WeatherConfiguration.prototype.isVisible = function() {
	return this._visible;
}
/*
	WeatherConfiguration.getCityList(qStr, callback).

	The callback function argument provide an list(array) of JSON objects.
	Each object comes from autocomplete.wunderground API therefore it implements
	wunderground API interface.
	for example:
	```````````````````````````````````````````````
		config.getCityList('burgas', function(response) {
			//Interate all response objects in the response.
			$.each(response, function(obj) {
				console.log(obj.name); // logs the name of the city
				console.log(obj.c); // logs the country (for example: "BG" for bulgaria.)
			})
		})
	```````````````````````````````````````````````
*/
WeatherConfiguration.prototype.getCityList = function(qStr, callback) {
	/* Wunderground response content is JSON but response header is text/html.
	To avoid cross-domain requests, the request will be handled in the local server*/
	var data = {
		type: 'forecast-citylist',
		query: qStr
	};
	var self = this;
	$.ajax({
		type: 'POST',
		data: data,
		beforeSend: function() {
			self._autocomplete.waitingAjax = true;
		},
		success: function(response) {
			var res = JSON.parse(response);
			callback.call(self, res.RESULTS);
		},
		error: function(err) {
			if (debug) console.log(err);
		},
		complete: function() {
			if (self._autocomplete.queuedQuery) {
				var args = self._autocomplete.queuedQuery;
				self.getCityList(args.qStr, args.callback);
				self._autocomplete.queuedQuery = null;
			}
			else {
				self._autocomplete.waitingAjax = false;
			}
		}
	});
}
// If no `dataKey` parameter provided, `getData()` will return all the forecast data.
WeatherConfiguration.prototype.autocomplete = function() {
	var self = this;
	return {
		clear: function() {
			self._dom.cityList.empty();
		},
		render: function(res, resultsLength) {
			if (!res) { return }
			var current,
				cityListItem,
				i;

			for (i = 0; i < resultsLength; i++) {
				if (!res[i]) break;
				if (res[i].tz === "MISSING") {
					resultsLength++;
					continue;
				}
				current = res[i];
				cityListItem = self._dom.cityItem(current.name)
					.attr('c', current.c)
					.attr('lat', current.lat)
					.attr('lon', current.lon);
				self._dom.cityList.append(cityListItem);
			}
		}
	}
};
WeatherConfiguration.prototype._handleCityInputEvent = function(res) {
	var self = this;
	this._dom.input.on('keyup', function() {
		if (!$(this).val() || $(this).val().length < 2) {
			self.autocomplete().clear();
			return;
		}

		if (self._autocomplete.waitingAjax === true) {
			self._autocomplete.queuedQuery = {
				qStr: $(this).val(),
				callback: self._showAutocompleteSuggestions
			}
		} else {
			self.getCityList($(this).val(), function(res) {
				self._showAutocompleteSuggestions(res);
				
			});
		}
	});
};
WeatherConfiguration.prototype._showAutocompleteSuggestions = function(res) {
	this.autocomplete().clear();
	this.autocomplete().render(res, 5);
	bindForecastSuggestions();
};
WeatherConfiguration.prototype._domConstructor = function() {
	$cityConfig = $('<div>', {
		id: 'forecast_city_config'
	});
	$cityInput = $('<input>', {
		type: 'text',
		id: 'forecast_city_input',
		placeholder: 'City or country',
		maxlength: 20
	});
	$citySuggestionList = $('<ul>', {
		id: 'forecast_city_list'
	});
	$cityConfig.append($cityInput);
	$cityConfig.append($citySuggestionList);

	$degreeConfig = $('<div>', {
		id: 'forecast_degree_config'
	});
	$degreeText = $('<span>', {id: 'forecast_degree_text'})
	.text('Degree:');
	$degreeC = $('<span>', {id: 'forecast_degree_C'})
	.text('C');
	$degreeF = $('<span>', {id: 'forecast_degree_F'})
	.text('F');
	$degreeConfig.append($degreeText).append($degreeC).append($degreeF);

	$fullConfig = $('<div>').append($cityConfig).append($degreeConfig);

	return {
		full: $fullConfig,
		input: $cityInput,
		cityList: $citySuggestionList,
		cityItem: function(text) {
			return $('<li>', {class: 'city_suggestion'}).clone().text(text || "");	
		}
	}
}