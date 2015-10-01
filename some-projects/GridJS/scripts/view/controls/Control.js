/** Created on 10.01.14. */

define(
    function () {
        /**
         * @param {string} name Key in action object
         * @param {string} title Btn text in HTML controll elemnt
         * @param {function} handler Calls on click by HTML element
         * @constructor
         */
        function Control(name, title, handler) {
            this._name = name;
            this._title = title;
            this._handler = handler;
            this._htmlNode = document.createElement('BUTTON');
            this._htmlNode.innerText = title;
            this._htmlNode.dataset.gridjsCmd = name;
        }

        Control.prototype = {
            get name() { return this._name; },
            set name(name) { this._name = name; },

            get title() { return this._title; },
            set title(title) { this._title = title; },

            get handler() { return this._handler; },
            set handler(handler) { this._handler = handler; },

            get htmlNode() { return this._htmlNode; }
        };

        Control.prototype.setActive = function () {
            this._htmlNode.classList.add('gridjs-active-control');
        };

        Control.prototype.setUnactive = function () {
            this._htmlNode.classList.remove('gridjs-active-control');
        };

        return Control;
    }
);