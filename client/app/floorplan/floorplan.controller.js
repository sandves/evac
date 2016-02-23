(function () {
    'use strict';

    angular
        .module('app.floorplan')
        .controller('FloorplanController', FloorplanController);

    function FloorplanController() {
        var vm = this;

        vm.rooms = [
            {
                name: 'Foo',
                width: 100,
                height: 50,
                top: 20,
                left: 20
            },
            {
                name: 'Bar',
                width: 50,
                height: 100,
                top: 100,
                left: 20
            }
        ];
    }
})();