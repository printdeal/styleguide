/**
 * @namespace Modal
 * @memberOf  Core
 */
var Core = (function (Core, $, randomString) {
    "use strict";

    var _$document = $(document),

        _$body = $("body"),

        /**
         * Default modal settings
         *
         * @type {object}
         * @private
         */
        _defaults = {
            id: null,
            title: null,
            content: null,
            size: "normal",
            closeOnBgClick: true,
            closeOnEscPress: true,
            showCloseButton: true,
            open: null,
            close: null,
            focus: null,
            async: {
                url: null,
                data: null,
                method: "GET",
                success: null,
                fail: null,
                loadingText: ""
            }
        },

        /**
         * Custom modal settings
         *
         * @type {object}
         * @private
         */
         _settings = {},

        /**
         * Modal's async request
         *
         * @type {object}
         * @private
         */
        _asyncRequest = null,

        /**
         * Used css selectors
         *
         * @type {object}
         * @private
         */
        _selectors = {
            triggerOpen: ".js-modal-open",
            triggerClose: ".js-modal-close",
            footer: "js-modal-footer"
        },

        /**
         * CSS Classes that apply certain states to elements
         *
         * @type {object}
         * @private
         */
        _stateClasses = {
            modalFull: "Modal--Full",
            modalSmall: "Modal--Small",
            modalLoading: "Modal--IsLoading",
            backdropClosable: "Modal__Backdrop--IsClosable"
        },

        /**
         * Possible modal custom sizes
         *
         * @type {object}
         * @private
         */
        _sizes = {
            full: "full",
            small: "small"
        },

        /**
         * Different cached jQuery-wrapped parts of the modal window
         *
         * @type {object}
         * @private
         */
        _elements = {
            $header: $("<header>", {
                "class": "Modal__Header"
            }),

            $title: $("<div>", {
                "class": "Modal__Title"
            }),

            $body: $("<div>", {
                "class": "Modal__Body"
            }),

            $close: $("<button>", {
                "type": "button",
                "class": "Modal__Close js-modal-close",
                "aria-label": "close",
                "html": $("<i>", {
                    "class": "Icon Icon--Cross",
                    "aria-hidden": "true"
                })
            }),

            $backdrop: $("<div>", {
                "class": "Modal__Backdrop " + _stateClasses.backdropClosable
            })
        },

        /**
         * Cached jQuery-wrapped modal object
         *
         * @type {object}
         * @private
         */
        _$modal = $("<div>").append(
            function () {
                return _elements.$header.append(
                    _elements.$title,
                    _elements.$close
                );
            },
            _elements.$body
        ),

        /**
         * HTML container that contains the modal content
         *
         * @type {object}
         * @private
         */
        _$contentContainer = null,

        /**
         * HTML element that was used to open the modal
         *
         * @type {object}
         * @private
         */
        _trigger = null,

        /**
         * Get JSON settings object from the `data-modal` attribute
         * of the element that triggered the modal
         *
         * @param {HTMLElement} trigger HTML node that triggered the modal
         * @return {void}
         * @private
         */
        _getSettings = function (trigger) {
            var settings, href;
            trigger = $(trigger);

            settings = trigger.data("modal");
            href = trigger.attr("href");

            // Get async url from href attribute if possible
            if (href && settings.async) {
                _settings.async.url = href;
            }

            _parseSettings(settings);
        },

        /**
         * Merge the default settings object and the one with custom settings
         *
         * @param {object|string} options Object with custom settings or just id
         * @return {void}
         * @private
         */
        _parseSettings = function (options) {
            // If there are just string in data-modal - it's modal's id
            if ($.type(options) === "string") {
                _settings.id = options;
            } else {
                _settings = $.extend({}, _settings, options);
            }
        },

        /**
         * Set all settings to its default values
         *
         * @return {void}
         * @private
         */
        _resetSettings = function () {
            _settings = $.extend(true, {}, _defaults);
        },

        /**
         * Fallback behaviour or IE/Edge, because
         * <button form="form-id">Submit</button> doens't work in IE/Edge
         */
        _bindFooterEvents = function () {
            var formSubmitSelector, submitForm;

            if (Modernizr.formattribute) {
                return;
            }

            // List possible selectors that can sumbit a form via click
            formSubmitSelector = [
                ".Modal__Footer button:not([type=\"button\"])",
                ".Modal__Footer [type=\"submit\"]"
            ].join(", ");

            // Handle the form submit
            // Triggered by an element with a `form="form-(random-string)"`
            // attribute.
            submitForm = function () {
                var formId = $(this).attr("form");
                $("#" + formId).trigger("submit");
            };

            $(document).on("click", formSubmitSelector, submitForm);
        },

        /**
         * Move the formActions to be a direct child of the modal
         * for styling purposes
         *
         * @param {object} The modal
         * @return {void}
         * @private
         */
        _appendFooter = function (modal) {
            var $modal = $(modal) || $(".Modal--Active");
            var modalFooter, $form, formId;

            $(".Modal__Footer").remove();
            modalFooter = $modal.find("." + _selectors.footer);

            $form = $modal.find("form");

            if ($form) {
                formId = $form.attr("id");

                // Require a form-id; make a random one if none is available
                // The id is neccessary to add into the 'form' attribute of
                // the submit button when it's in the modal footer, outside
                // the form: <button form="form-id">Submit</button>
                if (!formId) {
                    formId = "form-" + randomString();
                    $form.attr("id", formId);
                }

                // Attach the form to the <input>s that are now outside the
                // <form> so modern browsers can pick this up
                modalFooter
                    .find("input, button:not([type=\"button\"])")
                    .attr("form", formId);
            }

            // Move form footer to modal footer
            modalFooter
                .addClass("Modal__Footer")
                .appendTo($modal);
        },

        /**
         * Construct the modal insides
         *
         * @return {void}
         * @private
         */
        _construct = function () {
            if (!_settings.closeOnBgClick) {
                _elements.$backdrop.removeClass(_stateClasses.backdropClosable);
            }

            if (_settings.showCloseButton) {
                _elements.$close.removeClass("hidden");
            } else {
                _elements.$close.addClass("hidden");
            }

            if (_settings.title) {
                _elements.$title.html(_settings.title);
            } else {
                _elements.$title.empty();
            }

            _$body.append(
                _elements.$backdrop,
                _$modal
            );

            _$modal.addClass("Modal");

            switch (_settings.size) {
                case _sizes.small:
                    _$modal.addClass(_stateClasses.modalSmall);
                    break;
                case _sizes.full:
                    _$modal.addClass(_stateClasses.modalFull);
                    break;
            }

            // Make the async wrapper to enable the animation
            setTimeout(function () {
                _$modal.addClass("Modal--Active");
            }, 0);
        },

        /**
         * Attach modal events
         *
         * @return {void}
         * @private
         */
        _attachEvents = function () {
            if (_settings.closeOnEscPress === true) {
                _$document.one("keyup", function (event) {
                    if (event.keyCode === _u.KEYS.ESC) {
                        event.preventDefault();
                        close();
                    }
                });
            }

            if (_settings.closeOnBgClick) {
                _elements.$backdrop
                    .addClass(_stateClasses.backdropClosable)
                    .one("click", close);
            }

            _bindFooterEvents();
        },

        /**
         * Load modal content asynchronously
         *
         * @return {void}
         * @private
         */
        _setAsyncContent = function () {
            _asyncRequest = $.ajax({
                url : _settings.async.url,
                type: _settings.async.method,
                data: _settings.async.data,
                beforeSend: function () {
                    _$modal
                        .attr("data-text", _settings.async.loadingText)
                        .addClass(_stateClasses.modalLoading)
                        .trigger("modal:load");
                }
            }).always(function () {
                _$modal.removeClass(_stateClasses.modalLoading);
                _asyncRequest = null;
            }).done(function (response) {
                if (_settings.async.success) {
                    _settings.async.success(response);
                } else {
                    _elements.$body.html(response);
                }

                _$modal.trigger("modal:loaded");
                _appendFooter(_$modal);
            }).fail(function () {
                if (_settings.async.fail) {
                    _settings.async.fail();
                }

                _$modal.trigger("modal:fail");
            });
        },

        /**
         * Provides the direct access to the modal's body
         *
         * @return {HTMLElement}
         * @public
         */
        getBody = function () {
            return _elements.$body;
        },

        /**
         * Open the modal window
         *
         * @param {object|string} options Object with custom settings or just id
         * @return {void}
         * @public
         */
        open = function (options) {
            if (options) {
                _parseSettings(options);
            }

            _construct();

            if (_settings.async.url) {
                _setAsyncContent();
            } else {
                if (_settings.id) {
                    _$contentContainer = $("#" + _settings.id);

                    if (!_settings.content) {
                        _settings.content = _$contentContainer.html();
                    }

                    _$contentContainer.empty();
                }

                if (_settings.content) {
                    _elements.$body.html(_settings.content);
                } else {
                    close();
                    return;
                }

                _appendFooter(_$modal);
            }

            if (_settings.focus) {
                $("#" + _settings.focus).focus();
            }

            _trigger = document.activeElement;

            if (_trigger) {
                _trigger.blur();
            }

            _attachEvents();

            if (_settings.open) {
                _settings.open();
            }

            _$modal.trigger("modal:open");
        },

        /**
         * Close the modal window
         *
         * @return {void}
         * @public
         */
        close = function () {
            if (_settings.id) {
                _$contentContainer.html(_settings.content);
            }

            if (_settings.close) {
                _settings.close();
            }

            if (_asyncRequest) {
                _asyncRequest.abort();
            }

            _resetSettings();
            _elements.$backdrop.remove();
            _elements.$body.empty();
            $(".Modal__Footer").remove();
            _$modal.removeClass().remove();
            _$document.trigger("modal:close");

            if (_trigger) {
                _trigger.focus();
            }
        },

        setTitle = function (title) {
            $(".Modal--Active")
                .find(".Modal__Title")
                .text(title);
            return this;
        },

        setBody = function (body) {
            $(".Modal--Active")
                .find(".Modal__Body")
                .html(body);
            _appendFooter();
            return this;
        },

        /**
         * Setup this module
         *
         * @return {void}
         * @public
         */
        setup = function () {
            _resetSettings();

            _$document.on("click", _selectors.triggerOpen, function (event) {
                event.preventDefault();

                _getSettings(this);
                open();
            });

            _$document.on("click", _selectors.triggerClose, close);
        };

    return Core.register("Modal", {
        setup: setup,
        open: open,
        close: close,
        getBody: getBody,
        setTitle: setTitle,
        setBody: setBody
    });
}(Core || {}, window.jQuery, window.randomString));
