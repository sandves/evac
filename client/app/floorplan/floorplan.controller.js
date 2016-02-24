(function () {
    'use strict';

    angular
        .module('app.floorplan')
        .controller('FloorplanController', FloorplanController);

    FloorplanController.$inject = ['$scope'];
    function FloorplanController($scope) {
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
                width: 100,
                height: 100,
                top: 100,
                left: 20
            },
            {
                name: 'Baz',
                width: 300,
                height: 180,
                top: 20,
                left: 150
            },
            {
                name: 'Qux',
                width: 300, 
                height: 300,
                top: 230,
                left: 150
                
            }, {
                name: 'Norf',
                width: 100,
                height: 300,
                top: 230,
                left: 20
            }
        ];
        
        vm.test = test;
        
        function test() {
            vm.rooms[3].name = 'stian';
        }
    }
})();