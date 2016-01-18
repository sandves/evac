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
    var app = angular.module("evacApp", [ "ngRoute" ]);
    app.config(config);
}(), function() {
    "use strict";
    function beaconController($scope) {}
    angular.module("evacApp").controller("beacon.ctrl", beaconController), beaconController.$inject = [ "$scope" ];
}(), function() {
    "use strict";
    function homeController($scope) {
        $scope.test = "Test";
    }
    angular.module("evacApp").controller("home.ctrl", homeController), homeController.$inject = [ "$scope" ];
}();