(function() {
'use strict';

    angular
        .module('app.floorplan')
        .controller('FloorplanController', FloorplanController);

    function FloorplanController() {
        var vm = this;
        
        vm.rooms = ['1012', '1013'];
    }
})();