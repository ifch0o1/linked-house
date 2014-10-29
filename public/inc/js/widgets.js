//	WEATHER API
//	Powered by WeatherUnderground (http://www.wunderground.com/weather/api/)
//

var Weather = (function(){
	//	Do not use this key in your applications. That will affect Linked House weather widget.
	// 	You can get your own key free. More info at (http://www.wunderground.com/weather/api/).
	var key = '0257e6db7a93e8a3';
	var whost = 'http://api.wunderground.com/api/' + key + '/';
	var cityId = null;

	return {
		getForecast: function(country, city, degree) {
			var tCountry = country ? country : 'BG';
			var tCity = city ? city : 'Sofia';

			var url = whost + 'forecast/conditions/q/' + tCountry + '/' + tCity + '.json';

			$.ajax({
				type: 'GET',
				url: url,
				dataType: 'jsonp',
				success: function(response){
					window.ForecastController = new ControllForecast(response);
					window.ForecastController.render(degree);
				},
				error: function(){

				}
			});
		},

		getCityId: function() {
			return cityId || 'city ID is not setted.';
		}
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

		$today.find('.forecast_values').text(min + '-' + max + ' °C');
	}
	this.after1day = function (min, max, icon) {
		var $thisDay = $forecastPlatform.children('.forecast_after').eq(0);

		$thisDay.find('.forecast_day_text').text('Tomorrow');

		$thisDay.find('img').attr({
			alt: 'Forecast Icon',
			src: icon,
			title: extractFileName(icon, true)
		});

		$thisDay.find('.forecast_values').text(min + '-' + max + ' °C');
	}
	this.after2day = function (min, max, icon, weekDay) {
		var $thisDay = $forecastPlatform.children('.forecast_after').eq(1);

		$thisDay.find('.forecast_day_text').text(weekDay);

		$thisDay.find('img').attr({
			alt: 'Forecast Icon',
			src: icon,
			title: extractFileName(icon, true)
		});

		$thisDay.find('.forecast_values').text(min + '-' + max + ' °C');
	}
	this.after3day = function (min, max, icon, weekDay) {
		var $thisDay = $forecastPlatform.children('.forecast_after').eq(2);

		$thisDay.find('.forecast_day_text').text(weekDay);

		$thisDay.find('img').attr({
			alt: 'Forecast Icon',
			src: icon,
			title: extractFileName(icon, true)
		});

		$thisDay.find('.forecast_values').text(min + '-' + max + ' °C');
	}

	this.render = function($parentElement) {
		this.$holder = $parentElement;
		$parentElement.append($forecastPlatform);
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

	this._forecast = weatherObject.forecast.simpleforecast.forecastday;
	this._textForecast = weatherObject.forecast.txt_forecast.forecastday;
	this._current = weatherObject.current_observation;
	var fullCity = weatherObject.current_observation.observation_location.city;
	this.city = getLastSplit(',', fullCity.trim());

	this.render = function(degree) {
		if (degree !== 'C') {
			if (degree !== 'F') {
				throw new Error('Weather.getForecast() expecting third argument as char(string) \'C\' or \'F\'');
			}
		}

		var todayTemp = (degree === "C") ? this._current.temp_c : this._current.temp_f;
		var todayValues = new Array(2);
		todayValues[0] = (degree === "C") ? this._forecast[0].low.celsius : this._forecast[0].low.fahrenheit;
		todayValues[1] = (degree === "C") ? this._forecast[0].high.celsius : this._forecast[0].high.fahrenheit;
		var todayIcon = this._forecast[0].icon_url;

		var viewForecast = new ViewForecast(this.city, degree);
		//Next line is work around.
		window.forecastView = viewForecast;
		viewForecast.today(todayTemp, todayValues[0], todayValues[1], todayIcon);

		var tomorrowValues = new Array(2);
		tomorrowValues[0] = (degree === "C") ? this._forecast[1].low.celsius : this._forecast[1].low.fahrenheit;
		tomorrowValues[1] = (degree === "C") ? this._forecast[1].high.celsius : this._forecast[1].high.fahrenheit;
		var tomorrowIcon = this._forecast[1].icon_url;

		viewForecast.after1day(tomorrowValues[0], tomorrowValues[1], tomorrowIcon);

		var after2dayValues = new Array(2);
		after2dayValues[0] = (degree === "C") ? this._forecast[2].low.celsius : this._forecast[2].low.fahrenheit;
		after2dayValues[1] = (degree === "C") ? this._forecast[2].high.celsius : this._forecast[2].high.fahrenheit;
		var after2dayIcon = this._forecast[2].icon_url;
		var after2dayWeekDay = this._textForecast[4].title;

		viewForecast.after2day(after2dayValues[0], after2dayValues[1], after2dayIcon, after2dayWeekDay);

		var after3dayValues = new Array(2);
		after3dayValues[0] = (degree === "C") ? this._forecast[3].low.celsius : this._forecast[3].low.fahrenheit;
		after3dayValues[1] = (degree === "C") ? this._forecast[3].high.celsius : this._forecast[3].high.fahrenheit;
		var after3dayIcon = this._forecast[3].icon_url;
		var after3dayWeekDay = this._textForecast[6].title;

		viewForecast.after3day(after3dayValues[0], after3dayValues[1], after3dayIcon, after3dayWeekDay);
		viewForecast.render($('#widgets_wapper'));
	}
}

Weather.getForecast('BG', 'sozopol', 'C');


// Configuration

function WeatherConfiguration(weather, configDiv) {
	this._weather = weather;
	this._config = configDiv;
}
WeatherConfiguration.prototype.show = function() {
	//TODO
}
WeatherConfiguration.prototype.hide = function() {
	//TODO
}
WeatherConfiguration.prototype.getCityList = function(qStr) {
	//TODO
	//IDEA: try to make it animated height.
}
WeatherConfiguration.prototype._domConstructor = function() {
	
}