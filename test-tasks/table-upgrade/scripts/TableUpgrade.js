
/**
 * TableUpgrade can sort rows in table by some column and
 * compute aggreagte functions results of some column.
 * @author Albert Bikeev
 * @module TableUpgrade
 */
var TableUpgrade = (function (dateFormat) {
	var _lastSortedCol = document.createElement('TH'), o;

	Construct.options = o = {
		/**
		 * Event on TH tag which starts sorting col
		 * @type {String}
		 */
		SORT_EVENT: 'click',
		/**
		 * Class added to each TD or TH tag in col
		 * @type {String}
		 */
		SORT_CLASS: 'sorted-col-data',
		/**
		 * Class added to TH tag in col sorted by asc order
		 * @type {String}
		 */
		ASC_SORT_CLASS: 'col-sorted-asc',
		/**
		 * Class added to TH tag in col sorted by desc order
		 * @type {String}
		 */
		DESC_SORT_CLASS: 'col-sorted-desc',
		/**
		 * Data-attribute for marking col types (use in TH tag)
		 * @type {String}
		 */
		DATA_TYPE: 'data-type', 
		/**
		 * Internal data-attribute for remember order of sort
		 * @type {String}
		 */
		DATA_ORDER: 'data-order',
		/**
		 * Data-attribute for marking col aggregate func (use in tFoot secion)
		 * @type {String}
		 */
		DATA_AGGREGATE: 'data-aggregate'
	};

	/**
	 * @param {HTMLTableElement} table
	 */
	function Construct(table) {
		this.table = window.table = table;
		this.tHead = table.tHead;
		this.tBody = table.tBodies[0];
		this.tFoot = table.tFoot;
		this.computeAggregateRow();
		this._addTHeadHandlers();
	}
	Construct.constructor = Construct;

	/**
	 * Apply TableUpgrade to finded table
	 * @param  {string} selector Of table
	 * @return {Construct} Instance
	 */
	Construct.applyTo = function (selector) {
		var table = document.querySelector(selector);
		if (table == null) {
			throw new Error('Not found any table by selector: ' + selector);
		}
		return new Construct(table);
	};

	/**
	 * Sort rows in table in order of sorted column
	 * @param {number} ind  Index of sorted column
	 * @param {String} type Type of column
     * @param {number} order Of sort
	 */
	Construct.prototype.sortCol = function (ind, type, order) {
		var rows = this.getRowsArr();
		rows.sort(Construct.ComparingFuncs.getFunc(ind, type, order));
		this.updateRowsOrder(rows);
	};

	/**
	 * Creates array by table rows
	 * @return {Array}
	 */
	Construct.prototype.getRowsArr = function () {
		var rows = [], row, i;
        for(i = 0; row = this.tBody.rows[i]; i++) {
          	rows.push(row);
        }
		return rows;
	};

	Construct.prototype.updateRowsOrder = function (rows) {
		for (var i = 0, len = rows.length; i < len; i++) {
			this.tBody.appendChild(rows[i]);
		}
	};

	Construct.prototype.computeAggregateRow = function () {
		var cells, type, aggrResult;
		if (this.tFoot == null) { return false; }
		cells = this.tFoot.querySelectorAll('td['+o.DATA_AGGREGATE+']');
		for (var i = 0, cell; cell = cells[i]; i++) {
			type = cell.getAttribute(o.DATA_AGGREGATE);
			aggrResult = Construct.AggregateFuncs[type](cell.cellIndex, this.tBody);
			this.tFoot.rows[0].cells[cell.cellIndex].innerHTML += aggrResult;
		}
		return true;
	};


	Construct.prototype._addTHeadHandlers = function () {
		var self = this;
		// Sort column by o.SORT_EVENT
		this.tHead.addEventListener(o.SORT_EVENT, function (event) {
			var e = event || window.event,
				target = e.target,
				type = target.getAttribute(o.DATA_TYPE),
				order = (target.getAttribute(o.DATA_ORDER) || -1)*1;

			if (target.tagName = 'TH' && type != null) {
				self.setColSeletion(target, order, target.cellIndex);
				self.sortCol(target.cellIndex, type, order);
				target.setAttribute(o.DATA_ORDER, order === 1 ? -1 : 1);
			}
		});
		// Cancel selecting of thead
		this.tHead.onselectstart = function () { return false; };
	};

	Construct.prototype.setColSeletion = function (target, order, ind) {
		var lastInd = _lastSortedCol.cellIndex;
		_lastSortedCol.classList.remove(o.ASC_SORT_CLASS, o.DESC_SORT_CLASS);
		target.classList.toggle(o.ASC_SORT_CLASS, order === 1);
		target.classList.toggle(o.DESC_SORT_CLASS, order === -1);
		for (var i = 0, row; row = this.table.rows[i]; i++) {
			lastInd !== -1 && row.cells[lastInd].classList.remove(o.SORT_CLASS);
			row.cells[ind].classList.add(o.SORT_CLASS);
		}
		_lastSortedCol = target;
	};

	/**
	 * Functions for colums sorting.
	 * May be extends
	 */
	Construct.ComparingFuncs = {
		/**
		 * Return comparing function by type 
		 * with necessary data binded in scope.
		 * @param  {number} ind Index of column
		 * @param  {String} type one of column types: <i>alphabetic, numeric, date</i>
		 * @param  {number} order Order of sort
		 * @return {function} binded by params comparing function     
		 */
		getFunc: function (ind, type, order) {
			return function (row1, row2) {
				this.ind = ind;
				this.order = order;
				return Construct.ComparingFuncs[type].call(this, row1, row2);
			}
		},

		alphabetic: function (row1, row2) {
			var str1 = row1.cells[this.ind].innerHTML.toLowerCase(),
				str2 = row2.cells[this.ind].innerHTML.toLowerCase();
			for (var i = 0, len = str1.length; i < len; i++) {
                if (str1.charAt(i) > str2.charAt(i)) {
                    return this.order;
                } else if (str1.charAt(i) < str2.charAt(i)) {
                    return -this.order;
                }
            }
            return 0;
		},

		numeric: function (row1, row2) {
			var num1 = row1.cells[this.ind].innerHTML*1,
				num2 = row2.cells[this.ind].innerHTML*1;
				if (num1 > num2) {
					return this.order;
				} else if (num1 < num2) {
					return -this.order;
				} else {
					return 0;
				}
		},

		date: function (row1, row2) {
			var date1 = (new Date(row1.cells[this.ind].innerHTML)).getTime(),
				date2 = (new Date(row2.cells[this.ind].innerHTML)).getTime();
			if (date1 > date2) {
				return this.order;
			} else if (date1 < date2) {
				return -this.order;
			} else {
				return 0;
			}
		}
	};

	/**
	 * Functions for aggregate column data.
	 * May be extends
	 */
	Construct.AggregateFuncs = {
		SUM: function (ind, tBody) {
			var sum = 0, val;
			for (var i = 0, row; row = tBody.rows[i]; i++) {
				val = row.cells[ind] != null && row.cells[ind].innerText*1;
				if (!isNaN(val)) {
					sum += val;
				}
			}
			return sum;
		},

		COUNT: function (ind, tBody) {
			var cnt = 0;
			for (var i = 0, row; row = tBody.rows[i]; i++) {
				if (row.cells[ind] != null) cnt++;
			}
			return cnt;
		},

        LAST_DATE: function (ind, tBody) {
			var max, curr, val, pattern;
			for (var i = 0, row; row = tBody.rows[i]; i++) {
				val = row.cells[ind] != null && row.cells[ind].innerText;
				curr = new Date(val);
				if (max < curr || max == null) {
					max = curr;
					pattern = val;
				}
			}
			return dateFormat(new Date(max), pattern);
		}
	};

	return Construct;

})(dateFormat);
