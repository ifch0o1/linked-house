/* This is the base javascript file.
 * 
 * Here you can find most functions used in the application.
 * 
 * This file uses jQuery library in some functions.
 * 
 */

// --------------------------------------------------------

// Base functions

// Cookie Functions

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1) {
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1) {
        c_value = null;
    }
    else {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1) {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start, c_end));
    }
    return c_value;
}

// Tabs functions

function isUrl(url) {
    if (typeof url !== 'string') {
        throw new TypeError('isUrl(): Expecting just one argument as string.');
    }
    return url.match("^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
}

function refreshFavoritesCount() {
    var $favoritesInfo = $('#favorite_navigation_info');
    var count = getFavoritesCount();
    $favoritesInfo.text(count + ' favorites.');
}
function selectTab(id) {
    if (id) {
        id = (typeof id === 'number') ? id : convertIdToNumber(id, 10);
        var tabOptionsButton = $('.selected_tab div:first-child div:first-child');
        
        $('.selected_tab').removeClass('selected_tab');
        $('#tab'+id).addClass('selected_tab');
        tabOptionsButton.css({'display' : 'none'});
        
        tabOptionsButton = $('#tab'+id + ' div:first-child div:first-child');
        tabOptionsButton.css({'display' : 'inline-block'});
        showActiveTabFavorites(parseInt(id));
        refreshFavoritesCount();
    }
    else {
        var tabId = $('.selected_tab').attr('id');
        return {
            element: $('.selected_tab'),
            id: convertIdToNumber(tabId, 10)
        }
    }
}



// Other functions

function convertStringToNumber(stringNumber) {
    if (isNaN(stringNumber)) {
        throw new TypeError('convertStringToNumber(): Expecting one argument [valid string number]');
    }

    return parseInt(stringNumber);
}

// Converting an string id to number.
// Cutting last numbers from the string.
// maxLenght argument is used for more performance while operating with long strings.
function convertIdToNumber(id, maxLength) {
    if (maxLength && !parseInt(maxLength) || maxLength < 1) {
        throw new Error('convertIdToNumber() expecting maxlength as '
            +'positive number. ' + maxLength + ' given.');
    }
    var len = maxLength || 3;
    var idNum = null;
    function tryConvert() {
        if (len < 1) {
            throw new RangeError('Cannot find ID inside string with value : ' + id);
        }

        var result = parseInt(id.slice(len * -1));
        if (!result) {
            len--;
            return tryConvert();
        }
        else {
            return result;
        }
    }
    var num = tryConvert();
    return num;
}

function stringTagToHtml(tag) {
    if (!tag) {
        throw new TypeError('stringTabToHtml(): Expecting 1 agrument to be executed.');
    }
    if ((tag.substr(0, 1) != '<') && (tag.substr(tag.length - 1) != '>')) {
        tag = '<' + tag + '>';
    }
    return tag;
}

function checkPositiveInt(int, returnNewInt) {
    if (typeof int !== 'number') {
        return false;
    }
    
    if (int < 0) {
        return false;
    }
    else if (int % 1 === 0) {
        return returnNewInt ? int : true;
    }
    else {
        return returnNewInt ? Math.round(int) : false;
    }
}

function extractFileName(path, cutExtension) {
    var fileName = getLastSplit('/', path);

    if (cutExtension) {
        fileName = fileName.split('.')[0];
    }

    return fileName;
}

function findFilePaths(path) {
    //TODO
}

function createFavoritesWapper(tab) {
    if (typeof tab !== 'number') {
        throw new TypeError('createFavoritesWapper(): Expecting only one argument as number (tab id)');
    }

    var $wapperDiv = $('<div>', {
        id: 'favorite_links_wapper_tab_' + tab,
        class: 'favorite_links_wapper'
    });
    return $wapperDiv;
}

function colorToString(number) {
    if (typeof number !== 'number') {
        throw new TypeError('colorToString(number): Number argument must be typeof number.');
    }
    if (number < 1 || number > 5) {
        throw new RangeError('colorToString(): Number argument must be in range [1-5].');
    }

    switch (number) {
        case 1:
            return 'yellow';
            break;
        case 2:
            return 'red';
            break;
        case 3:
            return 'green';
            break;
        case 4:
            return 'blue';
            break;
        case 5:
            return 'black';
            break;
        default:
            throw new Error('colorToString(): Unexpected error [number-argument]=' + number);
    }
}

function colorToNumber(stringColor) {
    switch (stringColor) {
        case 'yellow':
            return 1;
            break;
        case 'red':
            return 2;
            break;
        case 'green':
            return 3;
            break;
        case 'blue':
            return 4;
            break;
        case 'black':
            return 5;
            break;
        default:
            throw new Error('colorToNumber(): Unexpected argument error.');
    }
}

function getLastSplit(splitCharacter, str) {
    var splitArray = str.split(splitCharacter);
    var lastSplittedElement = splitArray[splitArray.length - 1];
    
    return lastSplittedElement;
}

function selectColor($colorElement) {
    if (!$colorElement.hasClass('favorite_color')) {
        throw new ReferenceError('selectColor(): Expecting one argument with favorite_color class');
    }

    var animateSpeed = 200;
    var $currentlySelectedColor = $('.selected_color');
    if ($currentlySelectedColor[0]) {
        $currentlySelectedColor.animate({'margin-top': '0px'},{duration: animateSpeed});
        $currentlySelectedColor.removeClass('selected_color');         
    }
    
    $colorElement.addClass('selected_color')
            .animate({'margin-top': '-6px'},{duration: animateSpeed});
}

function getSelectedColor() {
    var selectedColorEl = $('.selected_color');
    if (!selectedColorEl[0]) {
        throw new Error('getSelectedColor() FATAL ERROR: Selected color didn\'t exsits.');
    }
    var selectedColorClasses = selectedColorEl.attr('class').split(' ');
    
    var selectedColor = null;
    for (var i = 0; i < selectedColorClasses.length; i++) {
        var mayBeColor = getLastSplit('_', selectedColorClasses[i]);
        
        for (var color in colors) {
            if (mayBeColor === color) {
                selectedColor = color;
                break;
            }
        }
    }
    
    if (!selectedColor) {
        throw new Error('getSelectedColor() FATAL ERROR: cannot find selected color. \n\
        selectedColorClasses = ' + selectedColorClasses + '. You can find colors object in home.js');
    }
    
    return selectedColor;
}

function getFavoriteColor(arg) {
    if (arguments.length !== 1) {
        throw new Error('getFavoriteColor(): Expecting only one argument.\n\
                         Instead given: ' + arguments.length + ' argument/s.');
    }
    
    var $favorite = null;
    if (arguments[0] instanceof jQuery) {
        $favorite = arguments[0];
    }
    else if (typeof arguments[0] === 'number') {
        $favorite = $('#fav_' + arguments[0]);
    }
    else if (typeof arguments[0] === 'string') {
        $favorite = $('#' + arguments[0]);
    }
    else {
        throw new TypeError('getFavoriteColor(): Unexpected argument type: '
                + typeof arguments[0] + '. argument can be instanceof jQuery or string or number.');
    }
    
    var color = null;
    
    var classes = $favorite.attr('class');
    classes = classes.split(' ');
    for (var i = 0; i < classes.length; i++) {
        if (classes[i].substr(0, 15) === 'favorite_color_') {
            color = getLastSplit('_', classes[i]);
            break;
        }
    }
    
    if (!color) { throw new Error('getFavoriteColor() internal error: Cannot find favorite color.') };
    return color;
}

var inputController = {
    checkInput: function($input, length, mustBeUrl) {
        if (!($input instanceof jQuery)) {
            throw new TypeError('InputController.checkInput() expect first argument as jQuery Object. instead given: ' + $input);
        }
        if (typeof length !== 'number') {
            throw new TypeError('InputController.checkInput() expect second argument as number. instead given: ' + typeof length + '. Second argument is: ' + length);
        }
        if (mustBeUrl !== undefined) {
            if (typeof mustBeUrl !== 'boolean') {
                throw new TypeError('InputController.checkInput() expect third argumens as boolean. instead given: ' + typeof mustBeUrl + '. Third argumens is: ' + mustBeUrl);
            }    
        }

        var input = $input.val();
        if (input.length > length) {
            return false;
        }
        if (mustBeUrl) {
            if(!isUrl(input)) {
                return false;
            }
        }
        return true;
    },
    stylizeWrongInput: function($input) {
        $input.css('background-color', '#ffbfbf');
    },
    UnstylizeInput: function($input) {
        $input.removeAttr('style');
    }
}

function getFavoritePositions() {
    var positions = [];

    var $favorites = $('#favorites_div > .favorite');
    $.each($favorites, function(index, val) {
        positions.push(val.attr('_position'));
    });

    return positions;
}

function maxArrayNum(arr) {
    return Math.max.apply(null, arr);
}

// Getting favorites count for current or specific tab.
// This function uses html elements and attributes.
// Cannot working correctly with different html structure.
function getFavoritesCount(tabId) {
    if (tabId && typeof tabId != 'number') {
        throw new TypeError('getFavoriteCount(tabId) expecting 0 or 1 argument as number. ' + typeof tabId + ' given.');
    }

    if (!tabId) {
        var tabId = selectTab().id;
    }
    try {
        var favWapper = $('#favorite_links_wapper_tab_' + tabId);
        var favCount = favWapper.children().length;
        return favCount;
    }
    catch(e) {
        if (debug) { console.log('getFavoriteCount() exeption: ' + e); }
        return 'Unknown';
    }
}

function average(numbers) {
    if (!$.isArray(numbers)) {
        throw new TypeError('average(arg1) - arg1 must be array. numbers(' + numbers + ') is '
            + typeof numbers);
    }

    var numbersSum = 0;
    for (var i=0; i < numbers.length; i++) {
        numbersSum += numbers[i];
    }

    var avr = numbersSum / (numbers.length);
    return avr | 0;
}

function checkKeyCode(code) {
    if (typeof code != 'number') {
        throw new TypeError('checkKeyCode(code) expecting code as number. ' + typeof code + ' given.');
    }

    switch (code) {
        case 8:
            return 'backspace';
            break;
        case 13:
            return 'enter';
            break;
        case 9:
            return 'tab';
        default:
            return false;
    }
}

function getCurrentTime(options) {
    var timestamp = new Date().getTime();
    if (options) {
        var dateObj = {};
        if (options.seconds) dataObj.seconds = parseInt(timestamp / 1000);
        if (options.hours) dateObj.hours = parseInt(timestamp / 1000 / 60 / 3600);

        return dateObj;
    }
    return timestamp;
}

function preloadImages(array) {
    if (!preloadImages.list) {
        preloadImages.list = [];
    }
    for (var i = 0; i < array.length; i++) {
        var img = new Image();
        img.onload = function() {
            var index = preloadImages.list.indexOf(this);
            if (index !== -1) {
                // remove this one from the array once it's loaded
                // for memory consumption reasons
                preloadImages.splice(index, 1);
            }
        }
        preloadImages.list.push(img);
        img.src = array[i];
    }
}