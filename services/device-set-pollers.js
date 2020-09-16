'use strict';

angular.module('keta.services.DeviceSetPollers', [])
	.service('ketaDeviceSetPollers', function DeviceSetPollers($interval) {
		var pollerPromises = [];

		this.add = function(pollerPromise) {
			pollerPromises.push(pollerPromise);
		};

		this.stopAndRemoveAll = function() {
			while (pollerPromises.length) {
				$interval.cancel(pollerPromises.pop());
			}
		};
	});
