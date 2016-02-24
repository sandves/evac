(function () {
	'use strict';

	angular
		.module('app.core')
		.factory('socket', socket);

	socket.$inject = ['socketFactory', 'SOCKET_URL'];

	function socket(socketFactory, SOCKET_URL) {
		return socketFactory({
			ioSocket: io.connect(SOCKET_URL)
		});
	}

})();