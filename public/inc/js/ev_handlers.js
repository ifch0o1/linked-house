/*
    This file contain event handlers    
*/

// Forecast Config
function bindForecastConfig() {
    var forecastConfig = $('#forecast_config');
    forecastConfig.unbind('click');

    var configInstance = null;
    forecastConfig.on('click', function() {
        if (!configInstance) {
            configInstance = new WeatherConfiguration(
                window.ForecastController, $('#forecast_config_conteiner'));
        }
        configInstance.show(!configInstance.isVisible());
    });

    window.bindForecastSuggestions = function() {
        $('.city_suggestion').on('click', function() {
            var data = _elementDataToJSON($(this));
            var location = data.lat + ',' + data.lon;
            window.ForecastController.setLocation(location);
            Weather.getForecast(['forecast', 'conditions'], location, function(response) {
                window.ForecastController.rerender(response, 'C');
            });
        });

        function _elementDataToJSON(element) {
            return {
                c: element.attr('c'),
                lat: element.attr('lat'),
                lon: element.attr('lon')
            }
        }
    }
}

/*
    DOM Ready events
*/
$(document).ready(function() {
    /*
    | Closing most of the elements, configs, settings forms etc.
    | when click event is triggered outside of these elements.
    */
    $(document).click(function(event) {
        if(!$(event.target).closest('#new_tab_form').length && !$(event.target).is('.new_tab_button')) {
            if($('#new_tab_form').is(":visible")) {
                window.TabForm.hide();
            }
        }
        if(!$(event.target).closest('#forecast_config_conteiner').length && !$(event.target).is('#forecast_config')) {
            if($('#forecast_config_conteiner').is(":visible")) {
                $('#forecast_config_conteiner').hide();
            }
        }
    });

    // SELECTING TABS 
    function bindTabClick() {
        $('.favorite_tab').on('click', function() {
            if (!$(this).hasClass('selected_tab')) {
                var tabId = convertIdToNumber($(this).attr('id'));
                selectTab(tabId);
                refreshFavoritesCount();
            }
        });
    }
    bindTabClick();

    // Selecting colors event

    // Add new favorite and favorite form activation events

    $('#add_favorite_button').on('click', function() {
        var $form = $('#fav_form');
        $form.css('display', 'inline-block');

        favFormFx = new ElementFx($form);
        favFormFx.focus();

        FavFormEvent.activeInputKeyPress();
        FavFormEvent.activeColorClick();
    });

    // FAVORITE FORM KEYPRESS AND BUTTON

    var FavFormEvent = {
        activeInputKeyPress: function() {
            $('#fav_form input').bind('keypress', function() {
                setTimeout(function() {
                    var isValidName = inputController.checkInput($('#fav_form_name_input'), 24);
                    if (!isValidName || $('#fav_form_name_input').val().length < 3) {
                        inputController.stylizeWrongInput($('#fav_form_name_input'));
                    }
                    else {
                        inputController.UnstylizeInput($('#fav_form_name_input'))
                    }

                    var isValidUrl = inputController.checkInput($('#fav_form_url_input'), 2000, true);
                    if (!isValidUrl) {
                        inputController.stylizeWrongInput($('#fav_form_url_input'));
                    }
                    else {
                        inputController.UnstylizeInput($('#fav_form_url_input'));
                    }

                    getFavInfoAndRenderExample();

                    if (!isValidName || !isValidUrl || $('#fav_form_name_input').val().length < 3) {
                        $('#fav_form_accept_button_icon_holder').addClass('close-fav-form');
                    } else {
                        $('#fav_form_accept_button_icon_holder').removeClass('close-fav-form');
                    }
                }, 65);
            });
        },
        deactiveInputKeyPress: function() {
            $('#fav_form input').unbind('keypress');
        },
        activeColorClick: function() {
            $('.favorite_color').bind('click', function() {
                getFavInfoAndRenderExample();
            });
        }
    }

    $('#fav_form_accept_button').on('click', function() {
        var fNameInput = $('#fav_form_name_input');
        var fName = fNameInput.val();
        var isValidName = (inputController.checkInput($('#fav_form_name_input'), 24)) && (fName.length > 3);

        var fUrlInput = $('#fav_form_url_input');
        var fUrl = fUrlInput.val();
        var isValidUrl = inputController.checkInput($('#fav_form_url_input'), 2048, true);

        var positions = getFavoritePositions(); // This function is inside functions.js
        if (positions.length >= 1) {
            var lastPosition = maxArrayNum(positions);
            var fPosition = lastPosition + 1;
        }
        else {
            var fPosition = 1;
        }

        var fCommentInput = $('#fav_form_comment_input');
        var fComment = fCommentInput.val();
        var isValidComment = inputController.checkInput($('#fav_form_comment_input'), 250);

        var fColor = getSelectedColor();

        var tab = $('.selected_tab');
        var fTab = convertIdToNumber(tab.attr('id'));

        if (isValidName && isValidComment && isValidUrl) {
            var favorite = Object.create(Favorite);
            favorite.init(fTab, fName, fUrl, fPosition, fComment, fColor);
            favorite.add();

            fNameInput.val('');
            fUrlInput.val('');
            fCommentInput.val('');
        }

        var $form = $('#fav_form');
        $form.css('display', 'none');
        favFormFx.removeFocus();
    });

    // Favorite options and default buttons.
    var FavState = {
        showOptions: function(favId) {
            var $defaultState = $('#fav_' + favId).find('.favorite_default_state');
            var $optionsState = $('#fav_' + favId).find('.favorite_options_state');
            $defaultState.css('display', 'none');
            $optionsState.css('display', 'inline-block');
        },
        showDefault: function(favId) {
            var $defaultState = $('#fav_' + favId).find('.favorite_default_state');
            var $optionsState = $('#fav_' + favId).find('.favorite_options_state');
            $optionsState.css('display', 'none');
            $defaultState.css('display', 'inline-block');
        }
    };

    // TODO refactor below function code.
    function bindFavEditButtons() {
        var favId;
        $('.favorite_rename_button').unbind('click');
        $('.favorite_rename_button').bind('click', function() {
            var $favorite = $(this).parent().parent();
            var favoriteName = $favorite.find('.favorite_name').text();
            favId = getLastSplit('_', $favorite.attr('id'));
            var textEditor = new InputTextEditor($favorite, favoriteName);
            var nameEditor = textEditor.render();
            $(nameEditor.content).bind('keypress', function(e) {
                var code = e.keyCode || e.which;
                if(code == 13) { //Enter pressed.
                    _rename();
                    $(this).unbind('keypress');
                    textEditor.remove();
                    FavState.showDefault(favId);
                }

                function _rename() {
                    newName = textEditor.getNewValue();
                    favoriteObjects[favId].rename(newName);
                }
            });
        });

        $('.favorite_delete_button').unbind('click');
        $('.favorite_delete_button').bind('click', function() {
            var $favorite = $(this).parent().parent();
            var favoriteName = $favorite.find('.favorite_name').text();
            favId = getLastSplit('_', $favorite.attr('id'));

            var answer = confirm("Deleting favorite " + favoriteName + ". Are you sure?");
            if (answer == true) {
                favoriteObjects[favId].remove();
            }
        });
        $('.favorite_color_change_button').unbind('click');
        $('.favorite_color_change_button').bind('click', function() {
            var $favorite = $(this).parent().parent();
            favId = getLastSplit('_', $favorite.attr('id'));

            var $colorList = $(this).parent().find('.favorite_color_list');
            $colorList.animate({width: 'toggle'});
            $colorList.find('li').on('click', function() {
                var selectedColor = getSelectedColor();
                favoriteObjects[favId].changeColor(selectedColor);
            });
        });
        
        $('.favorite_color').unbind('click');
        $('.favorite_color').bind('click', function() {
            selectColor($(this));
        });
    }
    bindFavEditButtons();

    function bindFavoriteButtons() {
        $('.favorite_options_button').unbind('click');
        $('.favorite_options_button').bind('click', function() {
            var $defaultState = $(this).parent().parent();
            var $optionsState = $defaultState.next();

            $defaultState.css('display', 'none');
            $optionsState.css('display', 'inline-block');
        });

        $('.favorite_default_button').unbind('click');
        $('.favorite_default_button').bind('click', function() {
            var $optionsState = $(this).parent().parent();
            var $defaultState = $optionsState.prev();

            $optionsState.css('display', 'none');
            $defaultState.css('display', 'inline-block');
        });
        bindFavEditButtons();
    }
    window.bindFavoriteButtons = bindFavoriteButtons;
    bindFavoriteButtons();
    
    // Tab options buttons [ TAB EDIT ]
    function _getTabElementInfo($buttonEl) {
        $tabEl = $buttonEl.parent().parent();
        tabId = convertIdToNumber($tabEl.attr('id'), 10);
        tabName = $tabEl.find('.tab_name').text();
        return {
            element: $tabEl,
            id: tabId,
            name: tabName
        }
    }

    function bindTabEditButtons() {
        $('.tab_rename_button').unbind('click');
        $('.tab_rename_button').bind('click', function() {
            tab = _getTabElementInfo($(this));
            var textEditor = new InputTextEditor(tab.element, tab.name);
            var nameEditor = textEditor.render();
            $(nameEditor.content).bind('keypress', function(e) {

                var code = e.keyCode || e.which;
                if(code == 13) { //Enter pressed.
                    _rename();
                    $(this).unbind('keypress');
                    textEditor.remove();
                    showTabDefault(tab.id);
                }

                function _rename() {
                    newName = textEditor.getNewValue();
                    tabs[tab.id].rename(newName);
                }
            });
        });
        $('.tab_delete_button').unbind('click');
        $('.tab_delete_button').bind('click', function() {
            tab = _getTabElementInfo($(this));
            var answer = confirm('Deleting tab ' + tab.name + '. Are you sure?');
            if (answer === true) {
                tabs[tab.id].remove();
            }
        });
    }
    bindTabEditButtons();

    function bindTabButtons() {
        bindTabClick();
        $('.tab_options_button').unbind('click');
        $('.tab_options_button').bind('click', function() {
            var id = $(this).parent().parent().attr('id');
            showTabOptions(id);
        });
        $('.tab_default_button').unbind('click');
        $('.tab_default_button').bind('click', function() {
            var id = $(this).parent().parent().attr('id');
            showTabDefault(id);
        });
        bindTabEditButtons();
    }
    window.bindTabButtons = bindTabButtons;
    bindTabButtons();

    // New Tab
    (function() {
        //Form

        var $form = $('#new_tab_form');
        var elFX = new ElementFx($form);
        var $btn = $('#new_tab_button');

        window.TabForm = {
            show: function() {
                $form.slideDown();
                $form.find('input').focus();
                elFX.focus();
            },
            hide: function() {
                $form.slideUp();
                elFX.removeFocus();
            }
        }
        $btn.bind('click', window.TabForm.show);
        
        var $close = $('#tab_form_close');
        $close.bind('click', window.TabForm.hide);
        $('#new_tab_input').on('keyup', function(e) {
            var code = e.keyCode || e.which,
                keyName = checkKeyCode(code);

            if (keyName === 'escape') {
                window.TabForm.hide();
            }
            else if (keyName === 'enter') {
                $('#add_new_tab_button').trigger('click');
            }
        });
    })();

    (function() {
        // Add button

        var addBtn = $('#add_new_tab_button').bind('click', function() {
            window.TabForm.hide();
            var $input = $('#new_tab_input');
            var nameValue = $input.val();
            if (nameValue && nameValue.length >= 3) {
                if (nameValue.length > 10) {
                    var $info = $('#new_tab_form.input_info').text('Tab name cannot contain more than 10 symbols.');
                    setTimeout(function() {
                        $info.text('');
                    }, 5000);
                }
                var newTab = Object.create(Tab);
                newTab.init(nameValue);
                newTab.add();
                window.TabForm.hide();
            }
            // else {
                // TODO
            // }

        });

    })();

    $('#logout_button').on('click', function() {
        $.ajax({
            type: 'post',
            data: {type: 'logout'},
            success: function(isLoggedOut) {
                if (isLoggedOut) {
                    window.location.reload();
                }
            }
        });
    });

    //User Settings
    $('#user_settings_button').unbind('click');
    $('#user_settings_button').on('click', function() {
        $('#user_settings').slideToggle(300);
    });

});