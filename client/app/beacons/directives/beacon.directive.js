var app = angular.module('beacon', []);

beaconDirective.$inject = ['$window'];

app.directive('beacon', beaconDirective);

function beaconDirective($window) {
    return {
        scope: {
            distance: '=',
            name: '@',
            x: '='
        },
        restrict: 'AE',
        templateUrl: 'app/beacons/directives/beacon.html',
        link: function (scope, element, attrs) {

            var w = angular.element($window);
            scope.getWindowDimensions = function () {
                return {
                    'h': w.height(),
                    'w': w.width()
                };
            };
            scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
                scope.windowHeight = newValue.h;

            }, true);

            scope.windowHeight = 500;

            scope.$watch('distance', function (value) {
                var yVal = d3.scale.linear()
                    .domain([0, 12])
                    .range([0, scope.windowHeight])(value);

                var tl = new TimelineLite();
                tl.add(TweenLite.to(element.find('.beacon'), 2, {
                    y: yVal,
                    x: scope.x,
                    ease: 'easeOutExpo'
                }));
                tl.play();
            });
        }
    };
}