var app = angular.module('beacon', []);

app.directive('beacon', function(){
    var linker = function (scope, element, attrs) {

    	var linearScale = d3.scale.linear()
        	.domain([0, 20])
        	.range([0, 500]);

        scope.$watch('distance', function (value) {
                var yVal = linearScale(value);

                var tl = new TimelineLite();
                tl.add(TweenLite.to(element.find('.beacon'), 2, {
                    y: yVal,
                    ease: 'easeOutExpo'
                }));
                tl.play();
        });
    };

    return {
        scope: {
            distance: '=',
            name: '@'
        },
        link: linker,
        restrict: 'AE',
        templateUrl: 'templates/beacon.tmpl.html'
    }
});