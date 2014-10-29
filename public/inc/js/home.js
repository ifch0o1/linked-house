/*
 * This script will working correctly only in /home route
 */

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
    var slider = Object.create(ContainerSlider);
    var paths = [
        'inc/img/slides/slide_1.png',
        'inc/img/slides/slide_2.png',
        'inc/img/slides/slide_3.png',
        'inc/img/slides/slide_4.png',
        'inc/img/slides/slide_5.png',
        'inc/img/slides/slide_6.png',
        'inc/img/slides/slide_7.png',
        'inc/img/slides/slide_8.png'
    ];

    slider.init('580', '160', paths);
    slider.render();
    slider.start(30);
})();

// TODO move settings varable in annonymous sunction.
var settings = new UserSettingsController();