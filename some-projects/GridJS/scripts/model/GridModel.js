/** Created on 09.01.14. */

define(
    ['../util/observer/Observable', './Sheet'],
    function (Observable, Sheet) {
        /**
         * This model stores data from grid table and notify
         * observers (views) if data was changed
         * @constructor
         * @extends {Observable}
         */
        function GridModel() {
            Observable.apply(this, arguments);
            this._sheets = {};
            this._lastChangedCell = {};
        }
        GridModel.prototype = Object.create(Observable.prototype);

        GridModel.prototype.addSheet = function (name) {
            this._sheets[name] = new Sheet(name);
        };

        GridModel.prototype.getSheet = function (name) {
            return this._sheets[name];
        };

        GridModel.prototype.rmSheet = function (name) {
            this._sheets[name] = null;
        };

        GridModel.prototype.setCell = function (sheetName, x, y, data) {
            if (this._sheets[sheetName] == null) {
                throw  new Error('Sheet ' + sheetName + ' is not exist');
            }
            this._sheets[sheetName].setCell(x, y, data);
            this._lastChangedCell = {
                x: x, y: y,
                data: data,
                sheetName: sheetName
            };
            this.notifyObservers();
        };

        GridModel.prototype.getCell = function (sheetName, x, y) {
            if (this._sheets[sheetName] != null) {
                return this._sheets[sheetName].getCell(x, y);
            }
        };

        /**
         * @override
         * @inheritDoc
         * @returns {Object}
         */
        GridModel.prototype._getDataObject = function () {
            return this._lastChangedCell;
        };

        /**
         * @override
         * @inheritDoc
         */
        GridModel.prototype._clearDataObject = function () {
            this._lastChangedCell = null;
        };

        return GridModel;
    }
);
