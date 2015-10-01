/** Created on 20.01.14. */

define(
    function () {
        /**
         * @param {String} name
         * @constructor
         */
        function Sheet(name) {
            this._name = name;
            /** @type {Array.<Array.<*>>} */
            this._cells = [];
        }

        Sheet.prototype = {
            get name() { return this._name; }
        };

        /**
         * @param {number} x
         * @param {number} y
         * @param {*} data
         */
        Sheet.prototype.setCell = function (x, y, data) {
            if (this._cells[x] == null) {
                this._cells[x] = [];
            }
            this._cells[x][y] = data;
        };
        /**
         * @param {number} x
         * @param {number} y
         * @returns {*} Data object
         */
        Sheet.prototype.getCell = function (x, y) {
            if (this._cells[x] != null) {
                return this._cells[x][y];
            }
        };

        return Sheet;
    }
);