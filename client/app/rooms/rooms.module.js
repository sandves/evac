(function () {
    'use strict';

    angular
        .module('app.rooms', ['xeditable'])
        .run(xeditableConfig);
    
    xeditableConfig.$inject = ['editableOptions'];
    
    function xeditableConfig(editableOptions) {
        editableOptions.theme = 'bs3';
    }
})();