/** Created by Albert on 02.01.14. */

define(
    ['./Control'],
    function (Control) {
        /**
         * Class provides creation HTML controls
         * and handling actions with it.
         * @constructor
         */
        function Controls() {
            this._controlsList = {};
            this._htmlNode = this._createHtmlNode();
        }

        Controls.prototype = {
            get htmlNode() { return this._htmlNode; }
        };

        /**
         * Creates control element and add it to htmlNode
         * @param {string} name Key in action object
         * @param {string} title Btn text in HTML controll elemnt
         * @param {function} handler Calls on click by HTML element
         * @param {Object} [context] Context of the handler
         * @returns {Control}
         */
        Controls.prototype.createControl = function (name, title, handler, context) {
            var control;
            if (context != null) {
                handler = handler.bind(context);
            }
            control = new Control(name, title, handler);
            this._controlsList[name] = control;
            this._htmlNode.appendChild(control.htmlNode);
            return control;
        };

        Controls.prototype.getControl = function (name) {
            return this._controlsList[name];
        };

        Controls.prototype.rmControl = function (name) {
            this._controlsList[name] = null;
            this._htmlNode.removeChild(
                this._htmlNode.querySelector('[data-gridjs-cmd='+name+']'));
        };


        /** Creates HTML controls element by _controlsList object */
        Controls.prototype._createHtmlNode = function () {
            var controls = document.createElement('DIV');
            controls.classList.add('gridjs-controls');
            controls.addEventListener('click', this._getControlsHandler());
            return controls;
        };

        /** Return binded to current context handler function */
        Controls.prototype._getControlsHandler = function () {
            var self = this;
            return function (event) {
                var e = event || window.event,
                    target = e.target || e.srcElement;
                try {
                    if (target.dataset.gridjsCmd != null) {
                        // Call method from configs - actions
                        self._controlsList[target.dataset.gridjsCmd].handler();
                    }
                } catch(ex) {
                    console.warn('Error found in actions event handling', ex);
                }
            }
        };

        return Controls;
    }
);
