(function () {
	'use strict';

	angular
		.module('evacApp')
		.factory('socket', socket);

	socket.$inject = ['socketFactory'];

	function socket(socketFactory) {
		return socketFactory({
			ioSocket: io.connect('http://192.168.5.20:3000')
		});
	}

})();