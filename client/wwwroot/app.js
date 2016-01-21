!function() {
    "use strict";
    function config($routeProvider, $locationProvider) {
        $routeProvider.when("/beacons", {
            templateUrl: "templates/beacons.html",
            controller: "beacon.ctrl"
        }).when("/home", {
            templateUrl: "templates/home.html",
            controller: "home.ctrl"
        }).otherwise({
            redirectTo: "/home"
        });
    }
    config.$inject = [ "$routeProvider", "$locationProvider" ];
    var app = angular.module("evacApp", [ "ngRoute", "btford.socket-io" ]);
    app.config(config);
}(), function() {
    "use strict";
    function beaconController($scope, socket) {
        $scope.rssi = 0, $scope.distance = 0, $scope.connected = !1, socket.on("beacon-updated", function(beaconData) {
            $scope.rssi = beaconData.rssi, $scope.distance = beaconData.distance.toFixed(2) + "m";
        }), socket.on("connected", function() {
            $scope.connected = !0;
        });
    }
    angular.module("evacApp").controller("beacon.ctrl", beaconController), beaconController.$inject = [ "$scope", "socket" ];
}(), function() {
    "use strict";
    function homeController($scope, $location) {
        $scope.test = "Test", $scope.login = function() {
            $location.path("/beacons");
        };
    }
    angular.module("evacApp").controller("home.ctrl", homeController), homeController.$inject = [ "$scope", "$location" ];
}(), function() {
    "use strict";
    function socket(socketFactory) {
        return socketFactory({
            ioSocket: io.connect("http://localhost:3000")
        });
    }
    angular.module("evacApp").factory("socket", socket), socket.$inject = [ "socketFactory" ];
}();