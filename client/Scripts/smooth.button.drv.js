var app = angular.module('smooth', []);

app.directive('smoothButton', function(){
    var linker = function (scope, element, attrs) {

    	var linearScale = d3.scale.linear()
        	.domain([0, 20])
        	.range([20, 1000]);

        var yVal = linearScale(5.0);

        var tl = new TimelineLite();
        var elements = element.children();
        tl.add(TweenLite.to(element.find('.red'), 0.4, {scaleX:1.8, scaleY:1.8, ease: Power2.easeOut}));
        tl.add(TweenLite.to(element.find('.orange'), 0.4, {scaleX:1.6, scaleY:1.6, ease: Power2.easeOut}), '-=0.2');
        tl.add(TweenLite.to(element.find('.yellow'), 0.4, {scaleX:1.4, scaleY:1.4, ease: Power2.easeOut}), '-=0.2');
        tl.add(TweenLite.to(element.find('.grey'), 2, {
            y: yVal,
            ease: 'easeOutExpo'
        }));
        tl.stop();

        scope.play = function() {
        	console.log('play');
            tl.play();
        };

        scope.reverse = function() {
        	console.log('reverse');
            tl.reverse();
        };
    };

    return {
        scope: true,
        link: linker,
        templateUrl: 'smooth-button.tmpl.html'
    }
});