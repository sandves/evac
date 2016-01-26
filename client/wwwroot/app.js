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
    var app = angular.module("evacApp", [ "ngRoute", "btford.socket-io", "angularMoment", "smooth" ]);
    app.config(config);
}(), function() {
    "use strict";
    function beaconController($scope, socket) {
        function getRange(txCalibratedPower, rssi) {
            var ratio_db = txCalibratedPower - rssi, ratio_linear = Math.pow(10, ratio_db / 10), r = Math.sqrt(ratio_linear) / 100;
            return parseFloat(r.toFixed(3));
        }
        $scope.rssi = null, $scope.distance = null, $scope.connected = !1, $scope.lastUpdate = null, 
        $scope.connectionState = "closed", $scope.url = "", socket.on("beacon-updated", function(beacon) {
            $scope.rssi = beacon.rssi + "dBm";
            var distance = "unknown";
            if ("undefined" != typeof beacon.distance) var distance = beacon.distance.toFixed(3) + "m";
            var calculatedDistance = getRange(beacon.txPower, beacon.rssi);
            isNaN(calculatedDistance) ? calculatedDistance = "unknown" : calculatedDistance += "m", 
            $scope.distance = distance + " (" + calculatedDistance + ")", $scope.lastUpdate = new Date(), 
            $scope.url = beacon.url;
        }), socket.on("connected", function() {
            $scope.connected = !0, $scope.connectionState = "open";
        }), socket.on("disconnect", function() {
            $scope.connected = !1, $scope.connectionState = "closed", $scope.rssi = null, $scope.distance = null;
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
}();

var app = angular.module("smooth", []);

app.directive("smoothButton", function() {
    var linker = function(scope, element, attrs) {
        var linearScale = d3.scale.linear().domain([ 0, 20 ]).range([ 20, 1e3 ]), yVal = linearScale(5), tl = new TimelineLite();
        element.children();
        tl.add(TweenLite.to(element.find(".red"), .4, {
            scaleX: 1.8,
            scaleY: 1.8,
            ease: Power2.easeOut
        })), tl.add(TweenLite.to(element.find(".orange"), .4, {
            scaleX: 1.6,
            scaleY: 1.6,
            ease: Power2.easeOut
        }), "-=0.2"), tl.add(TweenLite.to(element.find(".yellow"), .4, {
            scaleX: 1.4,
            scaleY: 1.4,
            ease: Power2.easeOut
        }), "-=0.2"), tl.add(TweenLite.to(element.find(".grey"), 2, {
            y: yVal,
            ease: "easeOutExpo"
        })), tl.stop(), scope.play = function() {
            console.log("play"), tl.play();
        }, scope.reverse = function() {
            console.log("reverse"), tl.reverse();
        };
    };
    return {
        scope: !0,
        link: linker,
        templateUrl: "smooth-button.tmpl.html"
    };
}), function() {
    "use strict";
    function socket(socketFactory) {
        return socketFactory({
            ioSocket: io.connect("http://localhost:3000")
        });
    }
    angular.module("evacApp").factory("socket", socket), socket.$inject = [ "socketFactory" ];
}();