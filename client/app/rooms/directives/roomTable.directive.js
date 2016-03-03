(function () {
    'use strict';

    angular
        .module('app.rooms')
        .directive('gzRoomTable', gzRoomTable);

    function gzRoomTable() {
        return {
            templateUrl: 'app/rooms/directives/roomTable.html',
            restrict: 'E',
            controller: RoomTableController,
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                rooms: '='
            }
        };
    }

    RoomTableController.$inject = ['$scope', 'roomService'];

    function RoomTableController($scope, roomService) {
        var vm = this;

        vm.removeRoom = removeRoom;
        vm.addRoom = addRoom;
        vm.saveRoom = saveRoom;
        vm.displayEditor = displayEditor;
        vm.validateIpAddress = validateIpAddress;
        vm.navigate = navigate;
        
        //////////

        function removeRoom(room) {
            vm.rooms.$remove(room);
        }

        function addRoom() {
            var newRoom = new roomService.Room();
            vm.rooms.$add(newRoom).then(function (ref) {
                vm.inserted = ref.key();
            });
        }

        function displayEditor(room) {
            return room.name === '' && room.address === '';
        }

        function saveRoom(room) {
            vm.rooms.$save(room);
        }

        // Key handler to enable save on enter and cancel on escape
        function navigate(event, form) {
            if (event.keyCode === 13) {
                form.$submit();
            } else if (event.keyCode === 27) {
                form.$cancel();
            }
        }

        function validateIpAddress(ip) {
            if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)) {
                if (ipAlreadyExists(ip)) {
                    return 'IP address must be unique';
                }
                return true;
            }
            return 'Not a valid IP address';
        }

        function ipAlreadyExists(ip) {
            var i;
            for (i = 0; i < vm.rooms.length; i++) {
                if (vm.rooms[i].address === ip) {
                    return true;
                }
            }
            return false;
        }
    }

})();