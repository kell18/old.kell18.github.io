/**
 * GridJS - extensible grid table on javaScript.
 *
 * @author Albert Bikeev
 */

requirejs.config({
    baseUrl: './scripts',
    paths:{
        'GoogleJsApi':
            'https://www.google.com/jsapi?' +
            'autoload={"modules":[{"name":"visualization","version":"1"}]}'
    },
    shim: {
        'GoogleJsApi': {
            exports: 'google'
        }
    }
});

require(['controller/GridController', 'model/GridModel'],
    function (Controller, Model) {
        var controller = new Controller(new Model());

        controller.init();

        controller.createSheet('Hello, GridJS!', 'someList');
        controller.setCell('someList', 2, 5, 'Лист и ячейка, созданные из кода');
    }
);
