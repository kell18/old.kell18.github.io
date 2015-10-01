/** Created on 09.01.14. */

define(
    function () {
        /**
         * Class, use in Observer pattern by subject.
         * @constructor
         */
        function Observable() {
            /** @type {Array.<Observer>} */
            this._observersList = [];
        }

        Observable.prototype.addObserver = function (observer) {
            this._observersList.push(observer);
        };

        Observable.prototype.rmObserver = function (observer) {
            var i = 0, len = this._observersList.length;
            for (i, len; i < len; i++) {
                if (JSON.stringify(this._observersList[i]) ===
                    JSON.stringify(observer))
                this._observersList[i] = null;
            }
        };

        /**
         * Method, forms dataObject (which can be overrided in sublasses) and
         * send notify all observers (call method _update(dataObject) on each
         * observer).
         */
        Observable.prototype.notifyObservers = function () {
            var dataObject = this._getDataObject();
            this._observersList.forEach(function (observer) {
                observer != null && observer._update(dataObject);
            });
            this._clearDataObject();
        };

        /**
         * Factory method, wich generte dataObject in notifyObservers method.
         * May be customize in subclasses.
         * @returns {null}
         * @protected
         */
        Observable.prototype._getDataObject = function () {
            return null;
        };

        /**
         * Factory method, wich clears dataObject in notifyObservers method.
         * May be customize in subclasses.
         * @protected
         */
        Observable.prototype._clearDataObject = function () {};

        return Observable;
    }
);