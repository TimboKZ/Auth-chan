/**
 * Auth-chan main module v2.0 (https://github.com/TimboKZ/Auth-chan)
 * Copyright (c) 2016 Timur Kuzhagaliyev (TimboKZ)
 */
var AuthchanModule;
(function (AuthchanModule) {
    var ACBody = (function () {
        function ACBody() {
        }
        return ACBody;
    }());
    var ACControls = (function () {
        function ACControls() {
        }
        return ACControls;
    }());
    var ACDataManager = (function () {
        function ACDataManager() {
        }
        return ACDataManager;
    }());
    var ACDebug = (function () {
        function ACDebug() {
        }
        return ACDebug;
    }());
    var ACModal = (function () {
        function ACModal() {
        }
        return ACModal;
    }());
    var ACSlideManager = (function () {
        function ACSlideManager() {
        }
        return ACSlideManager;
    }());
    var ACSlide = (function () {
        function ACSlide() {
        }
        return ACSlide;
    }());
    var Authchan = (function () {
        function Authchan(config, slides) {
            if (config === void 0) {
                config = null;
            }
            if (slides === void 0) {
                slides = null;
            }
            var defaults = {
                // Closing
                allowClose: true,
                closeOnOverlayClick: true,
                discardDataOnClose: false,
                closeOnESC: true,
                // Submitting
                submitOnClose: true,
                submitIncomplete: true,
                // Callbacks
                showCallback: null,
                shownCallback: null,
                closeCallback: null,
                closedCallback: null,
                submitCallback: null,
                // Text
                nextButtonText: 'Next Step',
                prevButtonText: 'Previous Step',
                closeButtonText: 'Close',
                // Appearance
                useOverlay: true,
                useCustomFont: true,
                skin: null
            };
            // Reading settings
            this.settings = ACUtil.extendObject(defaults, config);
        }

        Authchan.prototype.body = function () {
            return this.body;
        };
        Authchan.prototype.controls = function () {
            return this.controls;
        };
        Authchan.prototype.data = function () {
            return this.data;
        };
        Authchan.prototype.modal = function () {
            return this.modal;
        };
        Authchan.prototype.slides = function () {
            return this.slides;
        };
        return Authchan;
    }());
    AuthchanModule.Authchan = Authchan;
    var ACUtil = (function () {
        function ACUtil() {
        }

        ACUtil.extendObject = function (source, properties) {
            var property;
            for (property in properties) {
                if (properties.hasOwnProperty(property)) {
                    source[property] = properties[property];
                }
            }
            return source;
        };
        return ACUtil;
    }());
})(AuthchanModule || (AuthchanModule = {}));
var Authchan = AuthchanModule.Authchan;
/**
 * For NodeJS/Mocha testing purposes
 */
//noinspection TypeScriptUnresolvedVariable
if (typeof module === 'object' && module.exports) {
    //noinspection TypeScriptUnresolvedVariable
    module.exports = Authchan;
}
