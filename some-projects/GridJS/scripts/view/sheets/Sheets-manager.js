/** Created on 10.01.14. */

define(
    ['./Sheet', '../controls/Controls-manager'],
    function (Sheet, Controls) {
        /**
         * Manage operations with sheets
         * @param {Object} model Provides logic
         * @param {HTMLElement} [parentNode] Attaching point
         * @constructor
         */
        function SheetsManager(model, parentNode) {
            this._model = model;
            this._sheets = {};
            this._activeSheet = {};
            this._sheetsCnt = 0;
            this._sheetsIds = 0;
            this._htmlNode = document.createElement('DIV');
            this._mutationObserver = this._getMutationObserver();
            parentNode != null && parentNode.appendChild(this._htmlNode);
        }

        SheetsManager.prototype = {
            get htmlNode() { return this._htmlNode; },
            get sheetsLinks() { return this._sheets; },
            get activeSheet() { return this._activeSheet; },
            get sheetsCnt() { return this._sheetsCnt; }
        };

        /**
         * Create sheet with controls and add it to main html node
         * with link to it
         * @param {String} [title] Title for sheet link button
         * @param {String} [name] Internal name
         */
        SheetsManager.prototype.createSheet = function (title, name) {
            var sheet, sheetName = name || 'Sheet'+(++this._sheetsIds);
            sheet = new Sheet(sheetName);
            this._model.addSheet(sheetName);
            this._mutationObserver.observe(sheet.table);
            this._sheetsLinks.createControl(
                sheetName, title || sheetName, this._getSheetHandler(sheetName), this);
            this._sheets[sheetName] = sheet;
            this._htmlNode.appendChild(sheet.htmlNode);
            this.setActiveSheet(sheetName);
            return sheet;
        };

        SheetsManager.prototype.createControls = function () {
            this._controls = new Controls();
            this._sheetsLinks = new Controls();
            this._controls.createControl(
                'addList', 'Добавить лист', this.createSheet, this);
            this._htmlNode.appendChild(this._controls.htmlNode);
            this._htmlNode.appendChild(this._sheetsLinks.htmlNode);
        };

        SheetsManager.prototype.getSheet = function (name) {
            return this._sheets[name];
        };

        SheetsManager.prototype.rmSheet = function (name) {
            this._controls.sheetsLinks.rmControl(name);
            this._sheets[name] = null;
            this._model.rmSheet(name);
        };

        /** Hide actve sheet and show new sheet by name */
        SheetsManager.prototype.setActiveSheet = function (name) {
            if (this._activeSheet.htmlNode != null) {
                this.hideSheet(this._activeSheet.name);
            }
            this.showSheet(name);
            this._activeSheet = this._sheets[name]
            return this._activeSheet;
        };

        /** Show sheet and set its control link active */
        SheetsManager.prototype.showSheet = function (name) {
            this._sheets[name].show();
            this._sheetsLinks.getControl(name).setActive();
        };

        /** Hide sheet and set it control link unactive */
        SheetsManager.prototype.hideSheet = function (name) {
            this._sheets[name].hide();
            this._sheetsLinks.getControl(name).setUnactive();
        };

        SheetsManager.prototype._getSheetHandler = function (name) {
            var self = this;
            return function () {
                return self.setActiveSheet(name);
            };
        };

        /**
         * Object responce for send data to model, when view is changed
         * @returns {Object} handler, which can includ dom elements
         * in observers list
         */
        SheetsManager.prototype._getMutationObserver = function () {
            var inner, td, tr,
                self = this,
                observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        try {
                            inner = mutation.target.parentNode;
                            td = inner.parentNode;
                            tr = inner.parentNode.parentNode;
                            self._model.setCell(
                                self._activeSheet.name,
                                td.cellIndex, tr.sectionRowIndex,
                                inner.innerHTML
                            );
                            console.log(inner.innerHTML);
                        } catch (ex) {
                            console.log('Error found in MutationObserver', ex);
                        }
                    });
                }),
                config = { characterData: true, subtree: true };
            return {
                observe: function (target) {
                    observer.observe(target, config);
                }
            };
        };

        return SheetsManager;
    }
);