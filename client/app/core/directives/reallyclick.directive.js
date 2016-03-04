/**
 * @fileoverview Directive that provides an attribute to make
 * the user confirm the click operation he just did by opening a modal dialog. 
 * Depends on ui-bootstrap (https://github.com/angular-ui/bootstrap) 
 *
 * Use as an attribute:
 *     <ANY
 *         ss-really-click="expression"
 *         ss-really-message="confirmation message"
 *     ...
 *     </ANY>
 */

(function () {
    'use strict';

    angular
        .module('ssReallyClick', ['ui.bootstrap'])
        .directive('ssReallyClick', reallyClick);

    reallyClick.$inject = ['$uibModal'];

    function reallyClick($uibModal) {

        ModalInstanceController.$inject = ['$scope', '$uibModalInstance'];
        
        function ModalInstanceController($scope, $uibModalInstance) {
            $scope.ok = function () {
                $uibModalInstance.close();
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }

        var directive = {
            restrict: 'A',
            scope: {
                ssReallyClick: '&'
            },
            link: function (scope, element, attrs) {
                element.bind('click', function () {
                    var message = attrs.ssReallyMessage || 'Are you sure?';

                    var modalHtml = '<div class="modal-body">' + message + '</div>';
                    modalHtml += '<div class="modal-footer">';
                    modalHtml += '<button class="btn btn-primary" ng-click="ok()">OK</button>';
                    modalHtml += '<button class="btn btn-warning" ng-click="cancel()">Cancel</button>';
                    modalHtml += '</div>';

                    var modalInstance = $uibModal.open({
                        template: modalHtml,
                        controller: ModalInstanceController
                    });

                    modalInstance.result.then(function () {
                        scope.ssReallyClick();
                    }, function () {
                        //Modal dismissed
                    });

                });

            }
        };

        return directive;
    }

})();