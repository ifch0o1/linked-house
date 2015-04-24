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

function isUrl(obj) {
    if (typeof obj !== 'string') {
        false;
    }
    return obj.match("^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
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
    if (!path) {
        var _error = new Error('extractFileName(path, cutEx) Error: path argument is not provided');
        console.error(_error);
        return;
    }
    var fileName = getLastSplit('/', path);
    if (cutExtension) {
        fileName = fileName.split('.')[0];
    }
    return fileName;
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
        $input.data('ic-old-border', $input.css('border'));
        $input.css('border-right', '10px solid #FF6969');
    },
    UnstylizeInput: function($input) {
        var border = $input.data('ic-old-border') || 'none';
        $input.css('border', border);
    }
}

function getFavoritePositions() {
    var positions = [];

    $('.favorite').each(function() {
        positions.push($(this).attr('_position'));
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
            break;
        case 27:
            return 'escape';
            break;
        default:
            return 'unknown';
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
                preloadImages.list.splice(index, 1);
            }
        }
        preloadImages.list.push(img);
        img.src = array[i];
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isMobile() {
    if (typeof window._isMobileDevice === 'undefined') {
        window._isMobileDevice = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))window._isMobileDevice = true})(navigator.userAgent||navigator.vendor||window.opera);
        return window._isMobileDevice;
    } else {
        return window._isMobileDevice;
    }
}