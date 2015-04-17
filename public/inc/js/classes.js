/*
 * Comments like FSOME_CLASS_NAME or anything else starting with F
 * are writed for easy finding start position of the class (CTRL+F).
 * 
 * This file contains some classes and objects used in the application.
 */

if (!Object.create) {
    Object.create = function(obj) {
        function f() {
        };
        f.prototype = obj;
        return new f();
    };
}

// Classes

//FFAVORITE
var Favorite = {
    init: function(tabId, name, url, position, comment, color, id) {
        if (tabId < 0 || position < 0) {
            throw new RangeError('Oops, favorite crashed. [init:ArgumentsError]');
        }
        if ((!checkPositiveInt(tabId)) || (!checkPositiveInt(position)) 
            || (!isUrl(url)) || !color || !name) {

            throw new TypeError('Oops, favorite crashed. [init:ArgumentsError]');
        }
        if (id) {
            if ((!checkPositiveInt(id))) {
                throw new TypeError('Oops, favorite crashed. [init:ArgumentsError[id is not positive int.]');
            }
        }
        
        this.tabId = tabId;
        this.name = name;
        this.url = url;
        this.position = position;
        this.comment = comment || 'No Comment';
        this.color = color;
        this.id = id;
    },
    
    add: function() {
        var data = {
            type: 'add_favorite',
            tabId: this.tabId,
            name: this.name,
            url: this.url,
            position: this.position,
            comment: this.comment,
            color: colorToNumber(this.color)
        };
        
        $.ajax({
            type: "POST",
            dataType: "json",
            data: data,
            async: false,
            success: function(id) {
                //Workaround
                window._responseFavId = id;
            },
            error: function(error) {
                //TODO log, show user error.
                if (debug) {
                    console.error('Cannot add favorite, server error occured.');
                }
            }
        });

        this.id = window._responseFavId;
        favoriteObjects.push(this);
        this.render();
        bindFavoriteButtons();
        refreshFavoritesCount();
    },

    remove: function() {
        var data = {
            type: 'remove_favorite',
            fav_id: this.id
        };

        $.ajax({
            type: "POST",
            data: data,
            success: function(message) {
                if (debug) {
                    console.log(message);
                }
            },
            error: function() {
                //TODO
                // ShowError
                // LOG
            }
        });

        $('#fav_' + this.id).remove();
        refreshFavoritesCount();
    },
    
    changePosition: function() {
        //TODO -implement favorite positions.
    },

    changeColor: function(newColor) {
        var stringColor = (typeof newColor === 'number') ? colorToString(newColor) : newColor;
        var numberColor = (typeof newColor === 'string') ? colorToNumber(newColor) : newColor;
        data = {
            type: 'change_color',
            fav_id: this.id,
            new_color: numberColor
        };

        $.ajax({
            type: "POST",
            data: data,
            success: function() {

            },
            error: function() {
                //TODO
                // ShowError
                // LOG
            }
        });
        //  TODO 
        // Next few lines of code didn't work in $.ajax.success callback function
        // In the success function, `this` did not pointing to the object.
        $favEl = $('#fav_' + this.id);
        $favEl.removeClass('favorite_color_' + this.color);
        this.color = stringColor;
        $favEl.addClass('favorite_color_' + this.color);
    },
    
    rename: function(newName) {
        // TODO check if new name is actually current name.
        if (!newName) {
            throw new Error('FavoriteEditor.rename(): expecting one argument. ' + arguments.length + ' given. Didn\'t accept null, undefined or false.');
        }
        
        if (newName.length >= 3) {
            var data = {
                type: 'rename_favorite',
                tabId: selectTab().id,
                new_favorite_name: newName,
                fav_id: this.id
            };

            $.ajax({
                type: "POST",
                // dataType: json will afect success method.
                // dataType: "json",
                data: data,
                success: function() {

                },
                error: function() {
                    // TODO
                    //   ShowError;
                    //   Log;
                }
            });
            //  TODO 
            // Next few lines of code didn't work in $.ajax.success callback function
            // In the success function, `this` did not pointing to the object.
            this.name = newName;
            var $nameEl = $('#fav_' + this.id).find('.favorite_name');
            $nameEl.text(this.name);
        }
        else {
            //TODO show error while renaming.
            console.log('Favorite name cannot be under 3 symbols.');
        }
    },
    
    render: function() {
        $('#favorite_links_wapper_tab_' + this.tabId).append(this._domConstructor());
    },
    
    getContent: function() {
        var content = this._domConstructor();
        return content;
    },
    _domConstructor: function() {
        var $favoriteDiv = $('<div>', {
            class: 'favorite favorite_color_' + this.color,
            id: 'fav_' + this.id,
            _position: this.position
        });

        var $favoriteDefaultDiv = $('<div>', {
            class: 'favorite_default_state'
        });

        var $favoriteOptionsButtonHolder = $('<div>', {
            class: 'favorite_options_button_holder'
        });

        var $favoriteOptionsButton = $('<div>', {
            class: 'favorite_options_button',
            title: 'Options'
        });

        var $favoriteAnchor = $('<a>', {
            class: 'favorite_anchor',
            href: this.url,
            'data-title': this.comment
        });
        if (this.comment.length > 60) {
            $favoriteAnchor.addClass('long-title');
        }

        var $favoriteAnchorText = $('<span>', {
            class: 'favorite_name'
        })  .text(this.name);

        var $favoriteOptionsDiv = $('<div>', {
            class: 'favorite_options_state'
        });

        var $favoriteDefaultButtonHoler = $('<div>', {
            class: 'favorite_default_button_holder'
        });

        var $favoriteDefaultButton = $('<div>', {
            class: 'favorite_default_button',
            title: 'Hide options'
        });

        var $favoriteRenameButton = $('<span>', {
            class: 'favorite_rename_button'
        })  .text('Rename');

        var $favoriteRemoveButton = $('<span>', {
            class: 'favorite_delete_button'
        })  .text('Delete');

        var $favoriteColorButton = $('<span>', {
            class: 'favorite_color_change_button'
        })  .text('Color');


        $favoriteOptionsButtonHolder
                .append($favoriteOptionsButton);

        $favoriteAnchor
                .append($favoriteAnchorText);

        $favoriteDefaultDiv
                .append($favoriteOptionsButtonHolder)
                .append($favoriteAnchor);

        $favoriteDefaultButtonHoler
                .append($favoriteDefaultButton);

        $favoriteOptionsDiv
                .append($favoriteDefaultButtonHoler)
                .append($favoriteRenameButton)
                .append($favoriteRemoveButton)
                .append($favoriteColorButton)
                .append(colorListGenerate('ul', 'li'));

        $favoriteDiv
                .append($favoriteDefaultDiv)
                .append($favoriteOptionsDiv);

        return $favoriteDiv;
    }
}

// FTAB
var Tab = {
    init: function(tabName, tabId) {
        if (tabName.length > 18) {
            throw new RangeError('tabName cannot be more than 18 symbols.');
        }
        this.tabName = tabName;
        this.tabId = tabId || null;
    },
    setTabId: function(id) {
        if (typeof id != 'number') {
            throw new TypeError(this + '.setId(id) expecting id as number. ' + typeof id + ' given.');
        }
        this.tabId = id;
    },
    add: function() {
        if (window.tabCount >= 4) {
            alert('You cannot add more than 4 tabs for now.');
            return;
        }
        //Workaround
        window._responseTabId = null;

        var data = {
            type: 'add_tab',
            tab_name: this.tabName,
            tab_id: this.tabId
        };
        $.ajax({
            type: "POST",
            dataType: 'json',
            data: data,
            async: false,
            success: function(data) {
                window._responseTabId = data.id;
            },
            error: function(error) {
                window._responseTabId = null;
                if (debug) {
                    console.error(error);
                }
            }
        });

        this.setTabId(window._responseTabId);
        tabs[this.tabId] = this;
        this.render();
        $('#favorites_div').append(createFavoritesWapper(this.tabId));
        bindTabButtons();
        window.tabCount++;
    },
    render: function () {
        if (debug && (!this.tabName || !this.tabId)) {
            throw new Error('cannot render tab without tabName or tabId');
        }
        
        $('#tabs').append(this._domConstructor());
        
    },
    select: function () {
        selectTab(this.tabId);
        refreshFavoritesCount();
    },
    rename: function(newName) {
        if (newName.length > 2) {
            var data = {
                type: 'rename_tab',
                tab_id: this.tabId,
                new_name: newName
            };

            $.ajax({
                type: "POST",
                data: data,
                success: function() {

                },
                error: function() {
                    //TODO SHOW ERROR, LOG
                }
            });

            $tabEl = $('#tab' + this.tabId);
            this.tabName = newName;
            $tabEl.find('.tab_name').text(this.tabName);
        }
        else {
            //TODO show error while renaming
            console.log('Name cannot be under 3 symbols.');
        }
    },
    remove: function() {
        if (window.tabCount == 1) {
            alert('You must have another tab to remove this tab.');
            return;
        }
        var data = {
            type: 'remove_tab',
            tab_id: this.tabId
        };

        $.ajax({
            type: "POST",
            data: data,
            success: function() {

            },
            error: function() {
                //TODO Show error, log.
            }
        });

        $tabEl = $('#tab' + this.tabId);
        var prevTabId = this.getSiblingId();
        $tabEl.remove();
        window.tabCount--;
        tabs.splice(this.tabId, 1, null);
        selectTab(prevTabId);
    },
    getSiblingId: function() {
        $thisTab = $('#tab' + this.tabId);
        $prevTab = $thisTab.prev();
        $nextTab = $thisTab.next();
        if ($prevTab.hasClass('favorite_tab')) {
            return $prevTab.attr('id');
        }
        else if ($nextTab.hasClass('favorite_tab')) {
            return $nextTab.attr('id');
        }
        else {
            throw new Error('Tab.getSiblingId() cannot find any siblings of the tab.');
        }
    },
    _domConstructor: function () {
        var $tabDiv = $('<div>') // TAB WAPPER DIV
                .addClass('favorite_tab')
                .attr('id', 'tab' + this.tabId);
        
        var $tabDefault = $('<div>')
                .addClass('tab_default');
        
        var $tabOptionsBtn = $('<div>')
                .addClass('tab_options_button')
                .attr('title', 'Options')
        
        var $tabName = $('<span>')
                .addClass('tab_name')
                .text(this.tabName);

        var $tabOptions = $('<div>').addClass('tab_options');

        var $tabDefaultBtn = $('<span>')
                .addClass('tab_default_button')
        
        var $tabRenameBtn = $('<span>')
                .addClass('tab_rename_button')
                .text('rename');

        var $tabDeleteBtn = $('<span>')
                .addClass('tab_delete_button')
                .text('delete');
        
        $tabDefault.append($tabOptionsBtn).append($tabName);
        $tabOptions.append($tabDefaultBtn).append($tabRenameBtn).append($tabDeleteBtn);
        $tabDiv.append($tabDefault);
        $tabDiv.append($tabOptions);
        
        return $tabDiv;
    }
}
// FContainerSlider
var ContainerSlider = {
    init: function(width, height, picPaths) {
        this.width = width | 0;
        this.height = height | 0;
        this.picPaths = $.isArray(picPaths) ? picPaths : false;
        this._interval;

        if (!this.picPaths) { 
            throw new TypeError('Slider crashed [Arguments Error [expect paths as array]]');
        }

        this.firstImg = getRandomInt(0, this.picPaths.length - 1);

        preloadImages(picPaths);
    },
    render: function(pathIndex) {
        pathIndex = pathIndex === undefined ? this.firstImg : pathIndex;

        var content = null;
        if (pathIndex == this.picPaths.length - 1) {
            content = this._domConstructor(this.picPaths[pathIndex], this.picPaths[0]);
        }
        else {
            content = this._domConstructor(this.picPaths[pathIndex], this.picPaths[pathIndex + 1]);
        }

        var $container = $('#slider_wapper');
        $container.empty();
        $container.append(content);
    },
    start: function(intervalSec) {
        if (this._interval) {
            clearInterval(this._interval);
        }
        var pathIndex = this.firstImg;
        self = this;

        this._interval = setInterval(function() {
            if (pathIndex >= self.picPaths.length) {
                pathIndex = 0;
            }

            self.render(pathIndex);

            var fx = Object.create(SliderFx);
            var currentImage = $('.slider_current_image');
            var nextImage = $('.slider_next_image');

            fx.init(currentImage, nextImage);
            fx.render(1000);

            pathIndex++;
        }, intervalSec * 1000);
    },
    stop: function() {
        clearInterval(this._interval);
        $('#slider_wapper').empty();
    },
    _domConstructor: function(currentImage, nextImage) {
        var currentImageFileName = extractFileName(currentImage, true);
        var nextImageFileName = extractFileName(nextImage, true);

        var $sliderDiv = $('<div>', {
            class: 'container slider'
        })
            .css({
                "display": "inline-block",
                "width": this.width,
                "height": this.height,
                "padding": "10px",
                "border": "10px solid #c6c6c6"
            });

        var $sliderHolder = $('<div>', {
            class: 'slider_holder'
        })
            .css({
                "display": "block",
                "position": "relative",
                "width": "100%",
                "height": "100%",
                "overflow": "hidden"
            });

        var $currentSlide = $('<img>', {
            src: currentImage,
            alt: currentImageFileName,
            class: 'slider_current_image'
        })
            .css({
                "position": "absolute",
                "top": "0px",
                "left": "0px"

            });

        var $nextSlide = $('<img>', {
            src: nextImage,
            alt: nextImageFileName,
            class: 'slider_next_image'
        })
            .css({
                "position": "absolute",
                "top": "0px",
                "left": "0px"
            });

        $sliderHolder
            .append($nextSlide)
            .append($currentSlide);

        $sliderDiv
            .append($sliderHolder);

        return $sliderDiv;
    }
}

var SliderFx = {
    init: function($currentImage, $nextImage) {
        this.$currentImage = $currentImage;
        this.$nextImage = $nextImage;
        this.width = $currentImage.width();
        this.height = $currentImage.height();
    },
    render: function(speed) {
        var offset = this.width + 20;

        // Current image animation
        this.$currentImage.css({
            left: "0"
        });
        this.$currentImage.animate({
            left: offset
        },
        {
            duration: speed,
            queue: false
        });

        // Next image animation
        this.$nextImage.css({
            left: offset - (2 * offset)
        });
        this.$nextImage.animate({
            left: "0"
        },
        {
            duration: speed,
            queue: false
        });
    },
}

// FInputTextEditor
function InputTextEditor($el, value) {
    this.$el = $el;
    this.value = value ? value : '';
    this._content;
    var self = this;
    
    this.render = function() {
        var $content = this._domConstructor();
        this.$el.css({'position' : 'relative'});
        this.$el.append($content);
        $($content).bind('keydown', function(e) {
            var code = e.keyCode || e.which;
            if (code == '27') { // Escape pressed
                $(this).unbind('keydown');
                self.remove();
            }
        });
        return {
            content: $content,
        }
    }
    this.getNewValue = function() {
        return this._content.val();
    },
    this.remove = function() {
        $(this._content).remove();
    },
    this._domConstructor = function() {
        $input = $('<input>', {
            class: 'input_edit',
            type: 'text'
            })
            .css({
                position: 'absolute',
                top: '0px',
                left: '0px',
                width: this.$el.width(),
                height: this.$el.height(),
                opacity: 0.9,
                padding: '10px'
            })
            .attr('value', this.value)
            .attr('maxlength', 24);
        this._content = $input;

        return $input;
    }
}

// FElementFx
function ElementFx($element) {
    this.$element = $element;
    this._extraElement = null;

    this.focus = function() {
        this._extraElement = $('<div>', {
            class: 'focus_background'
        }).css({
            'opacity': '0',
            'z-index': '199999',
            'position': 'absolute',
            'top': '0',
            'left': '0',
            'background-color': 'rgba(10, 10, 10, 0.7)',
            'width': '100%',
            'height': $(document).height()
        });

        $('body').append(this._extraElement);

        this._extraElement.animate({
            'opacity': '1'
        });

        this.$element.css({
            'z-index': '200000'
        });
    }
    this.removeFocus = function() {
        if (!this._extraElement) {
            throw new Error('ElementFx.removeFocus() cannot remove focus from unfocused element [_extraElement] is ' + this._extraElement);
        }

        this._extraElement.animate({
            'opacity': '0'
        }, 
        {
            complete: function() {
                $(this).css({
                    'z-index': '-99'
                })
                .remove();
            }
        });

        this.$element.css({
           'z-index': 'auto'
        });
    }
}

// Prototype-oriented code below.

// FUserSettings
function UserSettings() {
    
}
UserSettings.prototype.changePassword = function(oldPassword, newPassword) {
    if (!oldPassword || !newPassword) {
        throw new Error('UserSettings.changePassword(oldPassword, newPassword) expecting two arguments.');
    }

    var data = {
        type: 'change_password',
        old_password: oldPassword,
        new_password: newPassword
    }
    var result;
    $.ajax({
        type: 'POST',
        data: data,
        async: false,
        success: function(response) {
            result = response;
        },
        error: function(error) {
            if (debug) {
                console.log(error);
            }
        }
    });
    return result;
}
UserSettings.prototype.disableSlider = function(bool) {
    if (typeof bool != 'boolean') {
        throw new TypeError('Usersettings.disableSlider(bool) expecting argument as boolean type. ' + typeof bool + ' guven.');
    }
    if (bool === true) {
        userConfig.set('global.slider', 'disabled');
    }
    else {
        userConfig.set('global.slider', 'enabled');   
    }
}
UserSettings.prototype.clearAllLinks = function() {
    $.each(favoriteObjects, function(index, favoriteObj) {
        if (favoriteObj && favoriteObj.remove) {
            favoriteObj.remove();
        }
    });
}
UserSettings.prototype.lockLinkPositions = function() {
    return null;
    // TODO
}
UserSettings.prototype.deactivateAccount = function() {
    return null;
    // TODO
}

function UserSettingsView() {
    this.q = $('#us_q');
    this.qSubHeadingText = $('#us_q_subheading');
    this.settings = $('#user_settings');
    this.alertText = $('#us_alert');
    this.slider = $('#slider_wapper');
}
UserSettingsView.prototype.showSettings = function() {
    this.settings.slideDown(300);
}
UserSettingsView.prototype.hideSettings = function() {
    this.settings.slideUp(300);
}
UserSettingsView.prototype.showQ = function() {
    this.q.height('120px');
}
UserSettingsView.prototype.hideQ = function() {
    this.q.height('0px');
}
UserSettingsView.prototype.showWallpapersWideLink = function() {
    $('.wallpaperswide_link').show().css('display', 'inline-block');
}
UserSettingsView.prototype.hideWallpapersWideLink = function() {
    $('.wallpaperswide_link').hide();
}

UserSettingsView.prototype.qSubHeading = function(text) {
    this.qSubHeadingText.text(text);
}
UserSettingsView.prototype.alert = function(text, color) {
    if (typeof text !== 'string') {
        throw new TypeError('UserSettingsView.alert(text) expecting argument as string! ' + typeof text + ' given.');
    }

    if (!color) {
        color = 'yellow';
    }
    this.alertText.text(text).css('color', color);
    this.alertText.height('20px');

    var timeToLive = text.length * 300;
    var that = this;
    setTimeout(function() {
        that.alertText.text('');
        that.alertText.height('0px');
    }, timeToLive);
}

function UserSettingsController() {
    this.oldPassword = $('#us_old_pass');
    this.newPassword = $('#us_new_pass');
    this.newPasswordRe = $('#us_new_pass_re');
    this.checkDisableSlider = $('#disable_slider_checkbox');
    this.checkLockLinks = $('#lock_links_checkbox');
    this.clearLinksSpan = $('#us_clear_favorites_option');
    this.deactivateAccountSpan = $('#us_deactivate_account_option');
    this.yesButton = $('#us_q_answer_yes');
    this.noButton = $('#us_q_answer_no');
    this.model = new UserSettings();
    this.view = new UserSettingsView();
    this._slider;

    // This function will be referenced when user try to make any changes in setting that require confirm.
    // This function will be called when user answer with 'yes' to confirm question.
    this._confirmFunction = function() {}

    // Preparing to work.
    var that = this;
    this.yesButton.on('click', function() {
        that._confirmFunction();
        that.view.hideQ();
    });
    this.noButton.on('click', function() {
        that.clearChanges('password');
        that.view.hideQ();
    });

    $('.us_password_input').on('keyup', function() {
        var isFieldsFilled = that._checkPasswordFields();
        if (isFieldsFilled) {
            that.ask('Changing password...', that.changePassword);
        }
    });

    this.checkDisableSlider.on('click', function() {
        var boolAction = $(this).prop('checked') ? true : false;
        that.disableSlider(boolAction);
    });

    this.clearLinksSpan.on('click', function() {
        that.ask('Delete all favorite links?', that.model.clearAllLinks);
    });
}
UserSettingsController.prototype.openSettings = function() {
    this.view.showSettings();
}
UserSettingsController.prototype.closeSettings = function() {
    this.view.hideSettings();
}
UserSettingsController.prototype.changePassword = function() {
    // TODO do not store passwords in varables. Check for other possible ways.
    var newPass = this.newPassword.val();
    var newPassRe = this.newPasswordRe.val();
    if (newPass !== newPassRe) {
        this.view.alert('Passwords do not match.', 'red');
        return;
    }

    var result = this.model.changePassword(this.oldPassword.val(), this.newPassword.val());
    switch (result) {
        case 'success':
            this.view.alert('Password changed successful.', '#11ff11');
            break;
        case 'incorrect':
            this.view.alert('Old password is incorrect.', 'red');
            break;
        default:
            this.view.alert('Something crashed. Try again later.', 'red');
            break;
    }
    this.clearChanges('password');
}
// disableSlider(bool) enabling slider if bool is `false`.
UserSettingsController.prototype.disableSlider = function(bool) {
    if (typeof bool != 'boolean') {
        throw new TypeError('UsersettingsController.disableSlider(bool) expecting argument as boolean type. ' + typeof bool + ' guven.');
    }

    this.model.disableSlider(bool);
    if (bool === true) {
        if (this._slider) {
            this._slider.stop();
        }
        this.view.hideWallpapersWideLink();
    }
    else {
        this._initSlider(false, {width: '580', height: '160'}, 25);
        this.view.showWallpapersWideLink();
    }
}
UserSettingsController.prototype.ask = function(text, confirmFunction) {
    if (confirmFunction) {
        if ($.isFunction(confirmFunction) != true) {
            throw new Error('UserSettingsController.ask() expecting second argument as function if it exist.');
        }
 
        this._confirmFunction = confirmFunction;
    }

    this.view.qSubHeading(text);
    this.view.showQ();
}
UserSettingsController.prototype.whenConfirm = function(fn) {
    if ($.isFunction(fn) != true) {
        throw new Error('UserSettingsController.whenConfirm(fn) expecting one argument as function.');
    }

    this._confirmFunction = fn;
}
UserSettingsController.prototype.clearChanges = function(setting) {
    var that = this;
    switch(setting) {
        case 'password':
            clearPasswordFields();       
            break;
        default:
            break;
    }
    function clearPasswordFields() {
        that.oldPassword.val('');
        that.newPassword.val('');
        that.newPasswordRe.val('');
    }
}
UserSettingsController.prototype._unbindAnswerButtons = function() {
    this.yesButton.unbind('click');
    this.noButton.unbind('click');
}
UserSettingsController.prototype._checkPasswordFields = function() {
    if (this.oldPassword.val() && this.newPassword.val() && this.newPasswordRe.val()) {
        return true;
    }
    else {
        return false;
    }
}

/*-----------------------------------------------------
| _initSlider(paths, size, interval)
|------------------------------------------------------
| Params:
|   paths: `array` : paths to the slides.
|
|   size: `json` | `array` :
|     fields:
|     {
|       width: value,
|       height: value  
|     }
|
|   interval: `number`: seconds between slide switches.
|   
|------------------------------------------------------
*/
UserSettingsController.prototype._initSlider = function(paths, size, interval) {
    if (!this._slider) {
        this._slider = Object.create(ContainerSlider);
    }
    var paths = paths || [
        'inc/img/slides/slide_1.png',
        'inc/img/slides/slide_2.png',
        'inc/img/slides/slide_3.png',
        'inc/img/slides/slide_4.png',
        'inc/img/slides/slide_5.png',
        'inc/img/slides/slide_6.png',
        'inc/img/slides/slide_7.png',
        'inc/img/slides/slide_8.png',
        'inc/img/slides/slide_9.png',
        'inc/img/slides/slide_10.png',
        'inc/img/slides/slide_11.png',
        'inc/img/slides/slide_12.png',
        'inc/img/slides/slide_13.png',
        'inc/img/slides/slide_14.png',
        'inc/img/slides/slide_15.png',
        'inc/img/slides/slide_16.png',
        'inc/img/slides/slide_17.png',
        'inc/img/slides/slide_18.png',
        'inc/img/slides/slide_19.png',
        'inc/img/slides/slide_20.png',
        'inc/img/slides/slide_21.png',
        'inc/img/slides/slide_22.png',
        'inc/img/slides/slide_23.png'
    ];

    this.checkDisableSlider.prop('disabled', true);
    this._slider.init(size['width'], size['height'], paths);
    this._slider.render();
    this._slider.start(interval);
    this.checkDisableSlider.prop('disabled', false);
}