/** Created on 09.01.14. */

define(
    function () {
        /**
         * Interface, implements in Observer pattern by class,
         * whicth take notifications from Observable class.
         * @interface
         */
        function Observer() {}

        /**
         * Function, call by Observable class, when data is changed
         * @param {*} [dataObject] Passed data
         * @abstract
         */
        Observer.prototype._update = function (dataObject) {
            throw new Error('Unimplemented method');
        };

        return Observer;
    }
);