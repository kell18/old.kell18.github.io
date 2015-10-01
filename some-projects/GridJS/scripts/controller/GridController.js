/** Created by Albert on 01.01.14. */

define(
    ['../view/GridView'],
    function (GridView) {
        var model, view;

        /**
         * This controller provides grid table view and logic.
         * @param {Object} gridModel
         * @constructor
         */
        function GridController(gridModel) {
            model = gridModel;
            view = new GridView(model);
        }

        /**
         * Creates view, controls, and attach it to DOM
         */
        GridController.prototype.init = function () {
            view.createView('#gridjs');
            view.createControls();
        };

        /**
         * @param {String} title Use in header of list
         * @param {String} name Use for access to list
         */
        GridController.prototype.createSheet = function (title, name) {
            view.createSheet(title, name);
        };

        /**
         * @param {String} sheetName
         * @param {number} x
         * @param {number} y
         * @param {*} data
         */
        GridController.prototype.setCell = function (sheetName, x, y, data) {
            model.setCell(sheetName, x, y, data);
        };

        return GridController;
    }
);

