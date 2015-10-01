/** Created on 09.01.14. */

define(
    ['../util/observer/Observer', './sheets/Sheets-manager'],
    function (Observer, SheetsManager) {
        var parentNode, sheetsManager;

        /**
         * This view can draw sheets with tables and navigate across it.
         * Also being an observer of model
         * @param {Object} model Provides logic. Inherit Observable class
         * @constructor
         * @implements {Observer}
         */
        function GridView(model) {
            this._model = model;
        }
        GridView.prototype = Object.create(Observer.prototype);

        /**
         * @param {string} parentSelector selector to html tag of attachment
         */
        GridView.prototype.createView = function (parentSelector) {
            if (typeof(parentSelector) !== 'string') {
                throw new Error('Incorrect parentSelector arg');
            }
            this._model.addObserver(this);
            parentNode = document.querySelector(parentSelector);
            sheetsManager = new SheetsManager(this._model, parentNode);
        };

        /**
         * Creates global sheets controls
         * @returns {Controls}
         */
        GridView.prototype.createControls = function () {
            return sheetsManager.createControls();
        };

        /**
         * @param {string} [title] Use in sheet control btn
         * @param {string} [name] Internal name
         * @returns {Sheet}
         */
        GridView.prototype.createSheet = function (title, name) {
            return sheetsManager.createSheet(title || 'Sheet', name);
        };

        /**
         * @inheritDoc
         * @override
         */
        GridView.prototype._update = function (dataObject) {
            var sheet;
            try {
                sheet = sheetsManager.getSheet(dataObject.sheetName);
                sheet.setCell(
                    dataObject.x, dataObject.y, dataObject.data
                );
            } catch (ex) {
                console.warn('Error found in _update method', ex);
            }
        };

        return GridView;
    }
);