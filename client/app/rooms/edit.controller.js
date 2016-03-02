(function() {
'use strict';

    angular
        .module('app.rooms')
        .controller('EditController', EditController);

    EditController.$inject = ['roomService', 'user'];
    function EditController(roomService, user) {
        var vm = this;
        
        vm.rooms = roomService.getRoomsByUser(user.uid);
    }
})();