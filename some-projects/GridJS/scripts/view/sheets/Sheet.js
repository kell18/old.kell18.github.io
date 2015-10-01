/** Created on 10.01.14. */

define(
    ['../controls/Controls-manager'],
    function (Controls) {
        /**
         * Provides sheet operations
         * @param {String} [name]
         * @param {HTMLElement} [parentEl] Point of attachment
         * @constructor
         */
        function Sheet(name, parentEl) {
            this._name = name;
            this._htmlNode = document.createElement('DIV');
            this._htmlNode.classList.add('gridjs-sheet');
            this._createControls();
            this._createTable();
            this._createBlankItems();
            parentEl != null && parentEl.appendChild(this._htmlNode);
        }

        Sheet.prototype = {
            get name() { return this._name; },
            get htmlNode() { return this._htmlNode; },
            get table() { return this._table; }
        };

        Sheet.prototype.addCol = function () {
            var i, len;
            if (this._table.rows.length === 0) {
                this.addRow();
            } else {
                for (i = 0, len = this._table.rows.length; i < len; i++) {
                    this._table.rows[i].appendChild(
                        this._blankCol.cloneNode(true)
                    );
                }
                this._blankRow.appendChild(this._blankCol.cloneNode(true));
            }
        };

        Sheet.prototype.addRow = function () {
            this._table.appendChild(this._blankRow.cloneNode(true));
        };

        /**
         * Set cell value. If table is to small,
         * then creates necessary rows/cols.
         */
        Sheet.prototype.setCell = function (x, y, data) {
            while (this._table.rows.length-1 < y) {
                this.addRow();
            }
            while (this._table.rows[y].cells.length-1 < x) {
                this.addCol();
            }
            this._table.rows[y].cells[x].firstChild.innerHTML = data;
        };

        Sheet.prototype.show = function () {
            this._htmlNode.classList.add('gridjs-open-sheet');
        };

        Sheet.prototype.hide = function () {
            this._htmlNode.classList.remove('gridjs-open-sheet');
        };

        Sheet.prototype._createTable = function () {
            this._table = document.createElement('TABLE');
            this._table.classList.add('gridjs-table');
            this._table.addEventListener('mousedown', tableHandler);
            this._table.addEventListener('dblclick', tableHandler);
            this._htmlNode.appendChild(this._table);
        };

        Sheet.prototype._createControls = function () {
            this._controls = new Controls();
            this._controls.createControl(
                'addRow', 'Добавить строку', this.addRow, this);
            this._controls.createControl(
                'addCol', 'Добавить колонку', this.addCol, this);
            this._htmlNode.appendChild(this._controls.htmlNode);
        };

        Sheet.prototype._createBlankItems = function () {
            this._blankRow = document.createElement('TR');
            this._blankCol = document.createElement('TD');
            this._blankCol.innerHTML = '<div class="gridjs-inner"></div>';
            this._blankRow.appendChild(this._blankCol);
        };

        function tableHandler(event) {
            var e = event || window.event,
                target = e.target || e.srcElement;
            try {
                if (target.classList.contains('gridjs-inner')) {
                    switch (e.type) {
                        case 'mousedown':
                            target.contentEditable = false;
                            break;
                        case 'dblclick':
                            target.contentEditable = true;
                            break;
                    }
                }
            } catch (ex) {
                console.warn('Error found in table event handling', ex);
            }
        }

        return Sheet;
    }
);