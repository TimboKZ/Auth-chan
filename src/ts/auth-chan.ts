/**
 * Auth-chan main module v2.0 (https://github.com/TimboKZ/Auth-chan)
 * Copyright (c) 2016 Timur Kuzhagaliyev (TimboKZ)
 */

module AuthchanModule {

    class ACBody {

    }

    class ACControls {

    }

    class ACDataManager {

    }

    class ACDebug {

    }

    class ACModal {

    }

    class ACSlideManager {

    }

    class ACSlide {

    }

    export class Authchan {

        private body:ACBody;
        private controls:ACControls;
        private data:ACDataManager;
        private modal:ACModal;
        private slides:ACSlideManager;

        private settings:Object;

        constructor(config:Object = null, slides:Object = null) {

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
                closeCallback: null, // (isComplete)
                closedCallback: null, // (isComplete)
                submitCallback: null, // (data)

                // Text
                nextButtonText: 'Next Step',
                prevButtonText: 'Previous Step',
                closeButtonText: 'Close',

                // Appearance
                useOverlay: true,
                useCustomFont: true,
                skin: null,
            };

            // Reading settings
            this.settings = ACUtil.extendObject(defaults, config);

        }

        public body():ACBody {
            return this.body;
        }

        public controls():ACControls {
            return this.controls;
        }

        public data():ACDataManager {
            return this.data;
        }

        public modal():ACModal {
            return this.modal;
        }

        public slides():ACSlideManager {
            return this.slides;
        }
    }

    class ACUtil {
        public static extendObject(source:Object, properties:Object) {
            var property;
            for (property in properties) {
                if (properties.hasOwnProperty(property)) {
                    source[property] = properties[property];
                }
            }
            return source;
        }
    }

}
import Authchan = AuthchanModule.Authchan;

/**
 * For NodeJS/Mocha testing purposes
 */
//noinspection TypeScriptUnresolvedVariable
if (typeof module === 'object' && module.exports) {
    //noinspection TypeScriptUnresolvedVariable
    module.exports = Authchan;
}