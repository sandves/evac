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
        vm.checkNotEmpty = checkNotEmpty;
        vm.cancel = cancel;
        
        vm.user = {
            state: 'Arizona'
        };
        
        vm.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
        
        //////////

        function removeRoom(room) {
            vm.rooms.$remove(room);
        }

        function addRoom() {
            var newRoom = new roomService.Room();
            vm.rooms.$add(newRoom).then(function (ref) {
                vm.inserted = ref.key();
            });
            
            // Clear search field so that the new row
            // becomes visible in the table.
            if (vm.search) {
                vm.search = '';
            }
        }

        function displayEditor(room) {
            return room.name === '' && room.address === '';
        }

        function saveRoom(room) {
            vm.rooms.$save(room);
        }

        function cancel(room, rowform) {
            rowform.$cancel();
            // Remove room if empty. This is because validation is ommited if
            // the user adds a new room, and then hits cancel without adding
            // any information about the room.
            if (room.name === '' && room.address === '') {
                removeRoom(room);
            }
        }

        // Key handler to enable save on enter and cancel on escape
        function navigate(event, form) {
            if (event.keyCode === 13) {
                form.$submit();
            } else if (event.keyCode === 27) {
                form.$cancel();
            }
        }

        function checkNotEmpty(name) {
            if (!name) {
                return 'Name cannot be empty!';
            }
        }

        var ipRegex = new RegExp('' +
            /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\./.source +
            /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\./.source +
            /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\./.source +
            /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.source
            );

        function validateIpAddress(ip, room) {
            if (ipRegex.test(ip)) {
                if (ipAlreadyExists(ip, room)) {
                    return 'IP address must be unique';
                }
                return undefined;
            }
            return 'Not a valid IP address';
        }

        function ipAlreadyExists(ip, room) {
            var i;
            for (i = 0; i < vm.rooms.length; i++) {
                // The second check is to disable validation if the user
                // hits edit and then save, without modifying the IP address.
                // Without this check the user would be warned that the
                // address is not unique and would not be able to close the 
                // inline editor.
                if (vm.rooms[i].address === ip && vm.rooms[i].$id !== room.$id) {
                    return true;
                }
            }
            return false;
        }
    }

})();