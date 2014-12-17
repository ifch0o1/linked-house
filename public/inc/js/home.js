/*
 * This script will working correctly only in /home route
 */

// TODO move settings varable in annonymous function.
var settings = new UserSettingsController();

var colors = {
    yellow: '#c5b800',
    red: '#b70000',
    green: '#2b5222',
    blue: '#220084',
    black: '#3a3a3a'
};

function colorListGenerate(listStr, elementsStr) {
    //TODO fully rewrite this function. (it's working correctly but isn't good writed)
    var listTag = stringTagToHtml(listStr);
    var elementTag = stringTagToHtml(elementsStr);

    if (!listTag || !elementTag) {
        return false;
    }

    var $list = $(listTag).addClass('favorite_color_list');

    var $element = null;
    for (var color in colors) {
        $element = $(elementTag)
                .addClass('favorite_color')
                .addClass('favorite_color_' + color);

        $list.append($element);
    }
    return $list;
}

// Including tabs
window.tabCount = 0;
var tabs = [];
var firstTabId;
(function() {
    for (var i = 0; i < _phpUserData.tabs.length; i++) {
        var currentTab = _phpUserData.tabs[i];
        if (currentTab.deleted) { continue; }

        window.tabCount++;
        firstTabId = firstTabId ? firstTabId : currentTab.tab_id;

        var tab = Object.create(Tab);
        tab.init(currentTab.tab_name, currentTab.tab_id);
        tab.render();
        
        tabs[currentTab.tab_id] = tab;

        $('#favorites_div').append(createFavoritesWapper(currentTab.tab_id));
    }

    tabs[firstTabId].select();
})();

// Including colors
(function() {
    var $list = colorListGenerate('ul', 'li');
    $('#fav_form_color_list_wapper').append($list);
    var $colors = $('.favorite_color');
    selectColor($colors.eq(0));
})();

// Showing favorites
var favoriteObjects = [];
(function() {
    for (var i = 0; i < _phpUserData.favorites.length; i++) {
        if (!_phpUserData.favorites[i].fav_rec_id) {
            if (debug) {
                console.log('_phpUserData.favorites[' + i + '].fav_rec_id is null or not defined.')
            }
            return;
        }

        var f = _phpUserData.favorites[i];
        if (f.deleted) { continue; }
        var stringColor = colorToString(f.fav_color);

        var favoriteObj = Object.create(Favorite);
        favoriteObj.init(f.fav_tab, f.fav_name, f.fav_url, f.fav_position, f.fav_comment, stringColor, f.fav_rec_id);
        favoriteObjects[f.fav_rec_id] = favoriteObj;
        favoriteObj.render();
    }
})();
refreshFavoritesCount();

// Initialize slider
(function() {
    userConfig.get('global.slider')
        .then(function(val) {
            if (val === 'enabled') {
                $('#disable_slider_checkbox').prop('checked', false);
                settings.disableSlider(false);
            }
            else {
                $('#disable_slider_checkbox').prop('checked', true);
            }
        }, function(err) {
            // TODO
            // Show user error.
        });

    
})();

// Initialize forecast
(function() {
    userConfig.get('forecast.location', function(location) {
        Weather.getForecast(['forecast', 'conditions'], location, initForecastController);
    }, false);

    function initForecastController(response) {
        window.ForecastController = new ControllForecast(response);
        window.ForecastController.render('C');
    }
})();

// Temporary disable Lock link position because positions and/or setting is not implemented yet.
(function() {
    var cb = $('#lock_links_checkbox').prop('disabled', true);
    cb.parent().parent()
        .css('text-decoration', 'line-through')
        .attr('title', 'It\'s not supported yet');
}());