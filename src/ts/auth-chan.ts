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

        private body : ACBody;
        private controls : ACControls;
        private data : ACDataManager;
        private modal : ACModal;
        private slides : ACSlideManager;

        constructor(parametrs : Object) {

        }

        get body(): ACBody {
            return this.body;
        }

        get controls(): ACControls {
            return this.controls;
        }

        get data(): ACDataManager {
            return this.data;
        }

        get modal(): ACModal {
            return this.modal;
        }

        get slides(): ACSlideManager {
            return this.slides;
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