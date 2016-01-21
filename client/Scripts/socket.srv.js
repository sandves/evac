(function () {
	'use strict';

	angular
		.module('evacApp')
		.factory('socket', socket);

	socket.$inject = ['socketFactory'];

	function socket(socketFactory) {
		return socketFactory({
			ioSocket: io.connect('http://localhost:3000')
		});
	}

})();