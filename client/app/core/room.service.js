(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('roomService', roomService);

  roomService.$inject = ['$firebaseArray', 'firebaseDataService'];

  function roomService($firebaseArray, firebaseDataService) {

    var rooms = null;
    
    var service = {
      Room: Room,
      getRoomsByUser: getRoomsByUser,
      reset: reset
    };

    return service;

    ////////////

    function Room() {
      this.name = '';
      this.address = '';
    }

    function getRoomsByUser(uid) {
      if (!rooms) {
        rooms = $firebaseArray(firebaseDataService.users.child(uid).child('rooms'));
      }
      return rooms;
    }

    function reset() {
      if (rooms) {
        rooms.$destroy();
        rooms = null;
      }
    }

  }

})();