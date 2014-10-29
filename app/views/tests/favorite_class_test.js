module('Favorite class init test');

QUnit.testStart(function() {
    favorite = Object.create(Favorite);
    gName = 'some name';
    gUrl = 'http://www.someurl.com';
    gComment = 'text comments favorite';
    gColor = 'blue';
});

test('Test: init with non-float tabId and position', function() {
    var tabId = 1;
    var position = 2;
    
    favorite.init(tabId, gName, gUrl, position, gComment, gColor);
    
    var actualPosition = favorite.position;
    var actualTabId = favorite.tabId;
    var expectedPosition = position;
    var expectedTabId = tabId;
    
    equal(actualPosition, expectedPosition, 'Exepted position is 2, actual position is 2');
    equal(actualTabId, expectedTabId ,'Exepted tabId is 1, actual tabId is 1');
    
    QUnit.testStart( function() { } );
});

test('Test: init with float tabId or position must throw an TypeError.', function() {
    var tabId = 1.7;
    var position = 2;
    
    throws(function () {
        favorite.init(tabId, gName, gUrl, position, gComment, gColor);
    }, TypeError,  'Init with tabId 1.7 must throw an TypeError');
    
    tabId = 3;
    position = 2.5;
    
    throws(function () {
        favorite.init(tabId, gName, gUrl, position, gComment, gColor);
    }, TypeError,  'Init with position 2.5 must throw an TypeError');
    
    tabId = 255.22;
    position = 8901.11;
    
    throws(function () {
        favorite.init(tabId, gName, gUrl, position, gComment, gColor);
    }, TypeError,  'Init with tabId 255.22 and position 8901.11 must throw an TypeError');
    
    QUnit.testStart( function() { } );
});

test('Test: init with negative number must throw an RangeError.', function() {
    var tabId = -5;
    var position = 2;
    
    throws(function () {
        favorite.init(tabId, gName, gUrl, position, gComment, gColor);
    }, RangeError, 'Init with tabId -5 must throw an RangeError');
    
    tabId = 5;
    position = -2;
    
    throws(function () {
        favorite.init(tabId, gName, gUrl, position, gComment, gColor);
    }, RangeError, 'Init with position -2 must throw an RangeError');
    
    tabId = -255;
    position = -8901;
    
    throws(function () {
        favorite.init(tabId, gName, gUrl, position, gComment, gColor);
    }, RangeError, 'Init with tabId -255 and position -8901 must throw an RangeError');
    
    QUnit.testStart( function() { } );
});

QUnit.testStart(function() {
    favorite = Object.create(Favorite);
    gTabId = 1;
    gPosition = 2;
    gName = 'some name';
    gComment = 'text comments favorite';
    gColor = 'blue';
});

test('Test init url', function() {
    var url = 'http://someurl.com';
    
    favorite.init(gTabId, gName, url, gPosition, gComment, gColor);
    
    equal(favorite.url, url, 'Actual url is ' + favorite.url + ', exepted url is ' + url);
    
    url = 'http://not url.com';
    
    throws(function () {
        favorite.init(gTabId, gName, url, gPosition, gComment, gColor);
    }, TypeError, 'Not valid url example: ' + url + '. must thrown an TypeError.');
    
    url = 'www.not`url.com';
    
    throws(function () {
        favorite.init(gTabId, gName, url, gPosition, gComment, gColor);
    }, TypeError, 'Not valid url example: ' + url + '. must thrown an TypeError.');
    
    url = 'http:/noturl.com';
    
    throws(function () {
        favorite.init(gTabId, gName, url, gPosition, gComment, gColor);
    }, TypeError, 'Not valid url example: ' + url + '. must thrown an TypeError.');
    
    url = 'xhttp//noturl.com';
    
    throws(function () {
        favorite.init(gTabId, gName, url, gPosition, gComment, gColor);
    }, TypeError, 'Not valid url example: ' + url + '. must thrown an TypeError.');
    
    url = 'http://noturlcom';
    
    throws(function () {
        favorite.init(gTabId, gName, url, gPosition, gComment, gColor);
    }, TypeError, 'Not valid url example: ' + url + '. must thrown an TypeError.');
    
    
});