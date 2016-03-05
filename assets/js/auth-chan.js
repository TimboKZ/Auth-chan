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
        function Authchan(parametrs) {
        }
        Object.defineProperty(Authchan.prototype, "body", {
            get: function () {
                return this.body;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Authchan.prototype, "controls", {
            get: function () {
                return this.controls;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Authchan.prototype, "data", {
            get: function () {
                return this.data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Authchan.prototype, "modal", {
            get: function () {
                return this.modal;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Authchan.prototype, "slides", {
            get: function () {
                return this.slides;
            },
            enumerable: true,
            configurable: true
        });
        return Authchan;
    }());
    AuthchanModule.Authchan = Authchan;
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
