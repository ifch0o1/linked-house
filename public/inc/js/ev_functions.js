// This file contain function used by event handlers

function getFavFormInformation() {
    var favName = $('#fav_form_name_input').val();
    var favUrl = $('#fav_form_url_input').val();
    var favComment = $('#fav_form_comment_input').val();
    var favColor = getSelectedColor();
    
    var favInformation = {
        name: favName,
        url: favUrl,
        comment: favComment,
        color: favColor
    };

    return favInformation;
}

function getFavInfoAndRenderExample() {
    var favState = getFavFormInformation();
    if (!favState.name || (favState.name.length < 3)) {
        favoriteExample.clear();
        return;
    }
    try {
        favoriteExample.render(favState.name, favState.url, favState.color, favState.comment);
    }
    catch (ex) {
        var expectedMessage = 'Oops, favorite crashed. [init:ArgumentsError]';
        if (ex.message !== expectedMessage) {
            throw ex;
        }
    }
}

function sendFavFormInformation(data) {
    $.ajax({
        type: "POST",
        dataType: 'json',
        data: data,
        success: function() {
            // TODO
        },
        error: function(error) {
            // TODO
        }
    });
}

function showTabOptions(tabId) {
    var childrens = $('#' + tabId).children();
    childrens.first().hide();
    childrens.next().show();
}
function showTabDefault(tabId) {
    var childrens = $('#' + tabId).children();
    childrens.first().next().hide();
    childrens.first().show();
}

var favoriteExample = {
    render: function(name, url, color, comment) {
        var favorite = Object.create(Favorite);
        var content = null;

        // initValues contain some default values required by Favorite.init() method.
        var exampleUrl = isUrl(url) ? url : 'http://default.com';
        var initValues = {
            tabId: 1,
            position: 0,
            comment: comment,
            name: name,
            defaultUrl: exampleUrl,
            color: color
        }
        
        favorite.init(initValues.tabId, initValues.name, initValues.defaultUrl, initValues.position, initValues.comment, initValues.color);
        content = favorite.getContent();

        var $holder = $('#favorite_example_content_holder');
        $holder.empty();
        $holder.append(content);
    },
    clear: function() {
        var $holder = $('#favorite_example_content_holder');
        $holder.empty();
    }
}

function showActiveTabFavorites(tabId) {
    if (typeof tabId !== 'number') {
        throw new TypeError('showActiveTabFavorites(): argument error [expecting number]');
    }

    var $allTabFavoriteWappers = $('.favorite_links_wapper');
    $allTabFavoriteWappers.css('display', 'none');

    var $tabFavoriteWapper = $('#favorite_links_wapper_tab_' + tabId);
    $tabFavoriteWapper.css('display', 'inline-block');
}