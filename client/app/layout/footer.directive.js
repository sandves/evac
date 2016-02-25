(function() {
    'use strict';

    angular
        .module('app.layout')
        .directive('gzFooter', gzFooter);

    function gzFooter() {
        var directive = {
            templateUrl: 'app/layout/footer.html',
            restrict: 'E',
            scope: {}
        };
        return directive;
    }

})();