/*
 Auth-chan v0.1 (http://timbo.kz/Auth-chan/)
 Copyright (c) 2015 Timur Kuzhagaliyev (TimboKZ)
 */

(function () {

    this.Authchan = function () {

        this.version = 0.1;
        this.consolePrefix = '[Auth-chan v' + this.version + '] ';
        this.CP = 'auth-chan-';

        this.active = false;
        this.ready = true;
        this.currentStep = -1;
        this.totalSteps = 0;
        this.steps = [];
        this.results = {};

        this.chan = {};
        this.chan.container = null;
        this.chan.body = null;
        this.chan.extra = null;
        this.chan.eyebrows = null;
        this.chan.eyes = null;
        this.chan.mouth = null;
        this.chan.hair = null;
        this.chan.hands = null;

        this.chan.isBlinking = false;
        this.chan.blinkingIntervals = [];
        this.chan.isTalking = false;
        this.chan.talkingIntervals = [];
        this.chan.timeouts = [];

        this.modal = null;
        this.closeButton = null;
        this.nextButton = null;
        this.previousButton = null;
        this.overlay = null;

        var defaults = {

            skipIntroduction: false, // Skips the part where Auth-chan introduces herself
            skipFarewell: false, // Skips the part where Auth-chan says goodbye

            allowClose: true, // Allows users to dismiss Auth-chan by clicking the close button and/or the overlay
            closeOnOverlayClick: true, // Dismisses Auth-chan when the overlay is clicked

            discardChangesOnClose: false, // Discard all changes when Auth-chan is dismissed
            submitOnClose: true, // Determines whether Auth-chan should submit the information when window is closed
            submitIncomplete: false, // If set to false Auth-chan will only submit information after the last slide
            submitCallback: null, // Callback Auth-chan will fire when user will submit the information

            closeButtonText: 'Close', // The text that will appear on the last slide. If set to false, button will just be disabled.

            useCustomFont: true, // Use the custom font

            overlay: true
        };

        if (arguments[0] && typeof arguments[0] === "object") {
            this.settings = extendDefaults(defaults, arguments[0]);
        } else {
            this.settings = defaults;
        }

        if (this.settings.skipIntroduction) this.currentStep = 0;

        if (arguments[1] && typeof arguments[1] === "object") {
            this.totalSteps = arguments[1].length;
            this.steps = arguments[1];
            var defaultStep = {
                type: 'text',
                subtype: 'short',
                name: null,
                allowSkip: false,
                placeholder: 'Type here',
                value: null,
                settings: null,
                size: 'small',
                authchan: false,
                text: '...',

                saveResult: false
            };
            for (var i = 0; i < this.steps.length; i++) {
                var step = this.steps[i];
                for (var property in defaultStep) {
                    if (!step.hasOwnProperty(property) && defaultStep.hasOwnProperty(property)) {
                        step[property] = defaultStep[property];
                    }
                }
                if (['input', 'textarea', 'radio', 'checkbox', 'multichoice', 'dropdown'].indexOf(step.type) > -1 && step.name) {

                    this.results[step.name] = null;
                    step.saveResult = true;

                }
            }
        }

    };

    Authchan.prototype.open = function () {
        var that = this;

        if (this.active || !this.ready) {
            return;
        }
        this.ready = false;
        this.active = true;

        buildOut.call(this);
        updateControls.call(this);
        initialiseEvents.call(this);

        setTimeout(function () {
            that.ready = true;
            stepLoad.call(that);
        }, 1800);
    };

    Authchan.prototype.close = function () {
        var that = this;

        if (!this.active || !this.ready) {
            return;
        }

        this.ready = false;

        authchan.call(this, false);

        setTimeout(function () {
            that.modal.parentNode.removeChild(that.modal);
            that.overlay.parentNode.removeChild(that.overlay);
        }, 600);
        addClass(this.overlay, 'auth-chan-hidden');
        addClass(this.modal, 'auth-chan-hidden');

        this.active = false;
        setTimeout(function () {
            if (that.settings.discardChangesOnClose) {
                that.results = {};
                that.currentStep = that.settings.skipIntroduction ? 0 : -1;
            }
            that.ready = true;
        }, 600);

    };

    function buildOut() {
        var that = this;

        var docFrag = document.createDocumentFragment();

        this.modal = createElement('div', this.CP + 'modal ' + this.CP + 'hidden' + (this.settings.useCustomFont ? ' ' + this.CP + 'font-custom' : ' ' + this.CP + 'font-websafe'));

        this.chan.container = createElement('div', this.CP + 'auth-chan ' + this.CP + 'hidden');
        this.chan.body = createElement('div', this.CP + 'auth-chan-body', null, this.chan.container);
        this.chan.extra = createElement('div', this.CP + 'auth-chan-extra', null, this.chan.container);
        this.chan.eyebrows = createElement('div', this.CP + 'auth-chan-eyebrows', null, this.chan.container);
        this.chan.eyes = createElement('div', this.CP + 'auth-chan-eyes', null, this.chan.container);
        this.chan.mouth = createElement('div', this.CP + 'auth-chan-mouth', null, this.chan.container);
        this.chan.hair = createElement('div', this.CP + 'auth-chan-hair', null, this.chan.container);
        this.chan.hands = createElement('div', this.CP + 'auth-chan-hands ' + this.CP + 'hidden', null, this.chan.container);

        this.modal.appendChild(this.chan.container);
        this.overlay = createElement('div', this.CP + 'overlay ' + this.CP + 'hidden' + (this.settings.allowClose && this.settings.closeOnOverlayClick ? ' ' + this.CP + 'clickable' : ''), null, docFrag);
        if (this.settings.allowClose) this.closeButton = createElement('a', this.CP + 'close ' + this.CP + 'hidden', {
            href: '#',
            title: 'Click to close'
        }, this.modal);

        // Controls
        this.nextButton = createElement('a', this.CP + 'next ' + this.CP + 'hidden', {
            href: '#',
            title: 'Click to proceed'
        }, this.modal);
        this.nextButton.innerHTML = 'Next Step';
        this.previousButton = createElement('a', this.CP + 'previous ' + this.CP + 'hidden', {
            href: '#',
            title: 'Click to go back'
        }, this.modal);
        this.previousButton.innerHTML = 'Previous step';

        docFrag.appendChild(this.modal);
        document.body.appendChild(docFrag);

        setTimeout(function () {
            removeClass(that.modal, 'auth-chan-hidden');
            setTimeout(function () {
                removeClass(that.chan.container, 'auth-chan-hidden');
                setTimeout(function () {
                    removeClass(that.closeButton, 'auth-chan-hidden');
                    removeClass(that.nextButton, 'auth-chan-hidden');
                    removeClass(that.previousButton, 'auth-chan-hidden');
                    toggleBlinking(that, true);
                }, 600);
            }, 100);
        }, 600);
        setTimeout(function () {
            removeClass(that.overlay, 'auth-chan-hidden')
        }, 1);

    }

    function submit() {

        if (this.settings.submitCallback) {

            this.settings.submitCallback(this.results);

        }

    }

    // Auth-chan functions
    function authchan(action) {

        if (action == 'ok') {

            eyes(this, 'kawaii');
            mouth(this, 'kawaii');
            hands(this, 'ok');

        } else if (action == 'kawaii') {

            eyes(this, 'kawaii');
            mouth(this, 'kawaii');

        } else if (action == 'shy') {

            extra(this, 'blushing');
            eyebrows(this, 'angry');
            eyes(this, 'shy');
            toggleBlinking(this, true);
            mouth(this, 'angry');

        } else if (action == 'sad') {

            eyes(this, 'angry');
            mouth(this, 'angry');

        } else if (typeof action == 'boolean') {

            for (var i = 0; i < this.chan.timeouts.length; i++) {
                clearTimeout(this.chan.timeouts[i]);
            }
            this.chan.timeouts = [];
            toggleBlinking(this, authchan);
            toggleTalking(this.chan, false);
            extra(this, false);
            eyebrows(this, false);
            eyes(this, false);
            hands(this, false);
            mouth(this, false);

        }

    }

    function toggleBlinking(that, blink) {

        if (blink && !that.chan.isBlinking) {

            that.chan.isBlinking = true;
            that.chan.blinkingIntervals[0] = setInterval(function () {
                addClass(that.chan.eyes, that.CP + 'closed');
                setTimeout(function () {
                    removeClass(that.chan.eyes, that.CP + 'closed');
                }, 200)
            }, 1900);
            that.chan.blinkingIntervals[1] = setInterval(function () {
                addClass(that.chan.eyes, that.CP + 'closed');
                setTimeout(function () {
                    removeClass(that.chan.eyes, that.CP + 'closed');
                }, 200)
            }, 3500);

        } else if (!blink && that.chan.isBlinking) {

            for (var i = 0; i < that.chan.blinkingIntervals.length; i++) {
                clearInterval(that.chan.blinkingIntervals[i]);
            }
            removeClass(that.chan.eyes, that.CP + 'closed');
            that.chan.blinkingIntervals = [];
            that.chan.isBlinking = false;

        }

    }

    function toggleTalking(chan, talk) {

        if (talk && !chan.isTalking) {

            chan.isTalking = true;
            chan.talkingIntervals[0] = setInterval(function () {
                addClass(chan.mouth, 'auth-chan-talking');
                addClass(chan.extra, 'auth-chan-talking');
                setTimeout(function () {
                    removeClass(chan.mouth, 'auth-chan-talking');
                    removeClass(chan.extra, 'auth-chan-talking');
                }, 200);
            }, 550);
            chan.talkingIntervals[1] = setInterval(function () {
                addClass(chan.mouth, 'auth-chan-talking');
                addClass(chan.extra, 'auth-chan-talking');
                setTimeout(function () {
                    removeClass(chan.mouth, 'auth-chan-talking');
                    removeClass(chan.extra, 'auth-chan-talking');
                }, 200);
            }, 300);

        } else if (!talk && chan.isTalking) {

            for (var i = 0; i < chan.talkingIntervals.length; i++) {
                clearInterval(chan.talkingIntervals[i]);
            }
            removeClass(chan.mouth, 'auth-chan-talking');
            removeClass(chan.body, 'auth-chan-talking');
            chan.talkingIntervals = [];
            chan.isTalking = false;

        }

    }

    function eyebrows(that, action) {

        if (action) {

            addClass(that.chan.eyebrows, that.CP + action)

        } else {

            that.chan.eyebrows.className = that.CP + 'auth-chan-eyebrows';

        }

    }

    function eyes(that, action) {

        if (action) {

            toggleBlinking(that, false);
            addClass(that.chan.eyes, that.CP + action)

        } else {

            that.chan.eyes.className = that.CP + 'auth-chan-eyes';

        }

    }

    function mouth(that, action) {

        if (action) {

            addClass(that.chan.mouth, that.CP + action)

        } else {

            that.chan.mouth.className = that.CP + 'auth-chan-mouth';

        }

    }

    function extra(that, action) {

        if (action) {

            addClass(that.chan.extra, that.CP + action)

        } else {

            that.chan.extra.className = that.CP + 'auth-chan-extra';

        }

    }

    function hands(that, action) {

        if (action == 'wave') {

            addClass(that.chan.hands, that.CP + 'waving');
            setTimeout(function () {
                addClass(that.chan.hands, that.CP + 'animate');
            }, 600);
            removeClass(that.chan.hands, that.CP + 'hidden');

        } else if (action) {

            addClass(that.chan.hands, that.CP + action);
            removeClass(that.chan.hands, that.CP + 'hidden');

        } else {
            addClass(that.chan.hands, that.CP + 'hidden');
            setTimeout(function () {
                that.chan.hands.className = that.CP + 'auth-chan-hands';
            }, 600);
        }

    }

    // Step controlling functions
    function stepLoad() {
        var that = this;

        this.ready = false;

        if (this.currentStep == this.totalSteps) {

            if (this.totalSteps == 0) {

                if (this.settings.skipIntroduction) {
                    speechBubble.call(this, 'text', 'short', 'small', 'Looks like there\'s nothing for Auth-chan to do...');
                } else {
                    speechBubble.call(this, 'text', 'short', 'small', 'Looks like Auth-chan is done here...');
                }
                authchan.call(this, 'sad');

            } else {

                speechBubble.call(this, 'text', 'short', 'small', 'Thanks! Auth-chan is done here.');
                authchan.call(this, 'ok');

            }

        } else {

            if (this.currentStep <= -1) {

                speechBubble.call(this, 'text', 'short', 'small', 'Hello, I\'m Auth-chan! Click the <b>next step</b> button to continue.');

                setTimeout(function () {
                    toggleTalking(that.chan, true);
                    that.chan.timeouts.push(setTimeout(function () {
                        hands(that, false);
                    }, 8000));
                    that.chan.timeouts.push(setTimeout(function () {
                        toggleTalking(that.chan, false);
                    }, 5000));
                }, 600);
                hands(this, 'wave');

            } else {

                var currentStep = this.steps[this.currentStep];
                var talkingTimeout = 3000;

                if (currentStep.authchan) {

                    authchan.call(this, currentStep.authchan);

                }

                if (currentStep.type == 'text') {

                    speechBubble.call(this, currentStep.type, currentStep.subtype, currentStep.size, currentStep.text);

                    switch (currentStep.subtype) {
                        case 'short':
                            talkingTimeout = 3000;
                            break;
                        case 'medium':
                            talkingTimeout = 5000;
                            break;
                        case 'long':
                            talkingTimeout = 7000;
                            break;
                        default:
                            talkingTimeout = 4000;
                    }

                } else if (currentStep.type == 'input') {

                    speechBubble.call(this, currentStep.type, currentStep.subtype, currentStep.size, currentStep.name, currentStep.value, currentStep.placeholder, currentStep.text);

                } else if (currentStep.type == 'textarea') {

                    speechBubble.call(this, currentStep.type, currentStep.subtype, currentStep.size, currentStep.name, currentStep.value, currentStep.placeholder, currentStep.text);

                }

                setTimeout(function () {
                    toggleTalking(that.chan, true);
                    that.chan.timeouts.push(setTimeout(function () {
                        toggleTalking(that.chan, false);
                    }, talkingTimeout));
                }, 600);

            }

        }

        setTimeout(function () {
            updateControls.call(that);
            that.ready = true;
        }, 600);

    }

    function nextStep() {
        var that = this;

        if (!this.active || !this.ready) return;

        if (this.currentStep >= this.totalSteps || (this.settings.skipFarewell && this.currentStep >= this.totalSteps - 1)) {

            if (this.settings.closeButtonText) {

                if (this.settings.submitOnClose) {

                    submit.call(this);

                }

                this.close.call(this);
                return;

            } else {

                return;

            }

        }

        var currentStep = this.steps[this.currentStep];
        if (currentStep && currentStep.saveResult) {

            if (currentStep.type == 'input') {

                var input = document.getElementById(this.CP + 'input-' + this.currentStep);

                if (!currentStep.allowSkip && (!input || (input && !input.value.length > 0))) {

                    return;

                }

                this.results[currentStep.name] = input.value;
                currentStep.value = input.value;

            } else if (currentStep.type == 'textarea') {

                var textarea = document.getElementById(this.CP + 'textarea-' + this.currentStep);

                if (!currentStep.allowSkip && (!textarea || (textarea && !textarea.value.length > 0))) {

                    return;

                }

                this.results[currentStep.name] = textarea.value;
                currentStep.value = textarea.value;

            }

        }

        this.currentStep++;

        authchan.call(this, true);
        updateControls.call(this);
        clearSpeechBubbles.call(this);

        setTimeout(function () {
            stepLoad.call(that);
        }, 601);

    }

    function previousStep() {
        var that = this;

        if (!this.active || !this.ready) return;

        if ((this.settings.skipIntroduction && this.currentStep <= 0) || this.currentStep <= -1) return;

        this.currentStep--;

        authchan.call(this, true);
        updateControls.call(this);
        clearSpeechBubbles.call(this);

        setTimeout(function () {
            stepLoad.call(that);
        }, 601);

    }

    function speechBubble() {
        var that = this;
        var type = arguments[0];
        var subtype = arguments[1];
        var size = arguments[2];

        var speechBubble = createElement('div', this.CP + 'speech-bubble ' + this.CP + 'hidden');
        var content = createElement('div', this.CP + 'speech-bubble-content', null, speechBubble);
        var bubble = createElement('div', this.CP + 'speech-bubble-bubble ' + this.CP + size, null, speechBubble);

        if (type == 'text') {
            var text = createElement('div', this.CP + 'speech-bubble-content-text ' + this.CP + subtype, null, content);
            text.innerHTML = arguments[3];
        } else if (type == 'input') {

            var input = createElement('div', this.CP + 'speech-bubble-content-input ' + this.CP + subtype);
            var inputText = createElement('div', this.CP + 'speech-bubble-content-input-text', null, input);
            inputText.innerHTML = arguments[6];
            var attributes = {
                id: this.CP + 'input-' + this.currentStep,
                name: arguments[3]
            };
            if (arguments[4]) attributes['value'] = arguments[4];
            if (arguments[5]) attributes['placeholder'] = arguments[5];
            var field = createElement('input', this.CP + 'input-' + this.currentStep, attributes, input);
            field.addEventListener('keydown', updateControls.bind(this));
            field.addEventListener('keyup', updateControls.bind(this));
            field.addEventListener('change', updateControls.bind(this));
            content.appendChild(input);

        } else if (type == 'textarea') {

            var textarea = createElement('div', this.CP + 'speech-bubble-content-textarea ' + this.CP + subtype);
            var textareaText = createElement('div', this.CP + 'speech-bubble-content-textarea-text', null, textarea);
            textareaText.innerHTML = arguments[6];
            var attributes = {
                id: this.CP + 'textarea-' + this.currentStep,
                name: arguments[3]
            };
            if (arguments[5]) attributes['placeholder'] = arguments[5];
            var textareaInput = createElement('textarea', this.CP + 'textarea-' + this.currentStep, attributes, textarea);
            if (arguments[4]) textareaInput.value = arguments[4];
            textareaInput.addEventListener('keydown', updateControls.bind(this));
            textareaInput.addEventListener('keyup', updateControls.bind(this));
            textareaInput.addEventListener('change', updateControls.bind(this));
            content.appendChild(textarea);

        }

        this.modal.appendChild(speechBubble);
        setTimeout(function () {
            removeClass(speechBubble, that.CP + 'hidden')
        }, 100);
    }

    function clearSpeechBubbles() {

        var bubbles = this.modal.getElementsByClassName('auth-chan-speech-bubble');
        var nodes = [];
        for (var i = 0; i < bubbles.length; i++) {
            addClass(bubbles[i], this.CP + 'faded');
            nodes[i] = bubbles[i];
        }
        setTimeout(function () {
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].parentNode.removeChild(nodes[i]);
            }
        }, 600);

    }

    function updateControls() {

        if ((this.settings.skipIntroduction && this.currentStep <= 0) || this.currentStep <= -1) {

            addClass(this.previousButton, this.CP + 'disabled');

        } else {

            removeClass(this.previousButton, this.CP + 'disabled');

        }

        if (this.currentStep >= this.totalSteps || (this.settings.skipFarewell && this.currentStep >= this.totalSteps - 1)) {

            if (this.settings.closeButtonText) {

                this.nextButton.innerHTML = this.settings.closeButtonText;

            } else {

                this.nextButton.innerHTML = 'Next Step';
                addClass(this.nextButton, this.CP + 'disabled');

            }

        } else {

            var currentStep = this.steps[this.currentStep];
            if (currentStep && currentStep.saveResult && !currentStep.allowSkip) {

                if (currentStep.type == 'input') {

                    var input = document.getElementById(this.CP + 'input-' + this.currentStep);

                    if (!input || (input && !input.value.length > 0)) {

                        this.nextButton.innerHTML = 'Waiting...';
                        addClass(this.nextButton, this.CP + 'disabled');

                    } else {

                        this.nextButton.innerHTML = 'Next Step';
                        removeClass(this.nextButton, this.CP + 'disabled');

                    }

                } else if (currentStep.type == 'textarea') {

                    var textarea = document.getElementById(this.CP + 'textarea-' + this.currentStep);

                    if (!textarea || (textarea && !textarea.value.length > 0)) {

                        this.nextButton.innerHTML = 'Waiting...';
                        addClass(this.nextButton, this.CP + 'disabled');

                    } else {

                        this.nextButton.innerHTML = 'Next Step';
                        removeClass(this.nextButton, this.CP + 'disabled');

                    }

                }

            } else {

                this.nextButton.innerHTML = 'Next Step';
                removeClass(this.nextButton, this.CP + 'disabled');

            }


        }

    }

    // Utility functions
    function createElement() {

        var tag = arguments[0];
        var _class = arguments[1];
        var attributes = arguments[2];
        var parent = arguments[3];

        var element = document.createElement(tag);
        element.className = _class;

        if (attributes && typeof attributes === "object") {
            for (var attribute in attributes) {
                if (attributes.hasOwnProperty(attribute)) {
                    element.setAttribute(attribute, attributes[attribute]);
                }
            }
        }

        if (parent && typeof parent === "object") {
            parent.appendChild(element);
        }

        return element;

    }

    function hasClass(node, _class) {
        return new RegExp("(?:^|\\s+)" + _class + "(?:\\s+|$)").test(node.className);
    }

    function addClass(node, _class) {
        if (!hasClass(node, _class)) {
            node.className = node.className ? [node.className, _class].join(' ') : _class;
        }
    }

    function removeClass(node, _class) {
        if (hasClass(node, _class)) {
            var c = node.className;
            //node.className = c.replace(new RegExp("(?:^|\\s+)" + _class + "(?:\\s+|$)", "g"), "");
            node.className = c.replace(new RegExp('((?:^|\\s+)' + _class + '|' + _class + '(?:\\s+|$)|' + _class + ')', "g"), "");
        }
    }

    function initialiseEvents() {
        var that = this;

        if (this.settings.allowClose) {

            if (this.overlay && this.settings.closeOnOverlayClick) {
                this.overlay.addEventListener('click', this.close.bind(this));
            }

            if (this.closeButton) {
                this.closeButton.addEventListener('click', function (event) {
                    event.preventDefault();
                    that.close.call(that);
                });
            }

        }

        this.nextButton.addEventListener('click', function (event) {
            event.preventDefault();
            nextStep.call(that);
        });

        this.previousButton.addEventListener('click', function (event) {
            event.preventDefault();
            previousStep.call(that);
        });

    }

    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }

})();