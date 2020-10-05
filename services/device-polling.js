'use strict';

angular.module('keta.services.DevicePolling', [])
	/**
	 * @class ketaDevicePolling
	 * @propertyOf keta.services.DevicePolling
	 * @description
	 * <p>
	 *   A service providing polling for devices and tag values as a replacement
	 *   for the listener functionality that is removed in the Kiwicloud device service
	 *   version 12.
	 * </p>
	 * <p>
	 *   It has been added as a temporary solution to be used until apps using listeners
	 *   are transitioned to work without that functionality.
	 * </p>
	 */
	.service('ketaDevicePolling', function DevicePolling(
		$interval, $log, $q,
		ketaEventBusDispatcher, ketaEventBusManager, ketaDeviceEvent, ketaDeviceSetPollers
	) {
		var DEFAULT_POLL_INTERVAL_SECONDS = 15;
		var MILLISECONDS_PER_SECOND = 1000;

		var isValid = function(queryReply) {
			return queryReply
				&& queryReply.code === ketaEventBusDispatcher.RESPONSE_CODE_OK
				&& angular.isDefined(queryReply.result)
				&& angular.isDefined(queryReply.result.items);
		};

		var logFetchQueryReply = function(queryParameters, reply) {
			$log.request(['deviceservice', {
				action: 'getDevices',
				params: queryParameters
			}, reply], $log.ADVANCED_FORMATTER);
		};

		var fetchDevices = function(eventBus, queryParameters) {
			var deferred = $q.defer();
			ketaEventBusDispatcher.send(eventBus, 'deviceservice', {
				action: 'getDevices',
				params: queryParameters
			}, function(reply) {
				if (!isValid(reply)) {
					logFetchQueryReply(reply);
					return;
				}

				if (ketaEventBusManager.inDebugMode()) {
					logFetchQueryReply(reply);
				}
				deferred.resolve(reply);
			});
			return deferred.promise;
		};

		var compareGuids = function(thisDevice, thatDevice) {
			if (thisDevice.guid < thatDevice.guid) {
				return -1;
			}
			if (thisDevice.guid > thatDevice.guid) {
				return 1;
			}
			return 0;
		};

		var emitDeletionEvent = function(device, receiver) {
			receiver(ketaDeviceEvent.create(ketaDeviceEvent.DELETED, device));
		};

		var emitCreationEvent = function(device, receiver) {
			receiver(ketaDeviceEvent.create(ketaDeviceEvent.CREATED, device));
		};

		var emitUpdateEvent = function(device, receiver) {
			receiver(ketaDeviceEvent.create(ketaDeviceEvent.UPDATED, device));
		};

		var compareDeviceLists = function(currentDevices, fetchedDevices, changeEventProcessor) {
			var c = 0;
			var f = 0;
			while (c < currentDevices.length && f < fetchedDevices.length) {
				if (currentDevices[c].guid < fetchedDevices[f].guid) {
					emitDeletionEvent(currentDevices[c], changeEventProcessor);
					c++;
				} else if (currentDevices[c].guid > fetchedDevices[f].guid) {
					emitCreationEvent(fetchedDevices[f], changeEventProcessor);
					f++;
				} else if (!angular.equals(currentDevices[c], fetchedDevices[f])) {
					emitUpdateEvent(fetchedDevices[f], changeEventProcessor);
					c++;
					f++;
				} else {
					c++;
					f++;
				}
			}
			for (; c < currentDevices.length; c++) {
				emitDeletionEvent(currentDevices[c], changeEventProcessor);
			}
			for (; f < fetchedDevices.length; f++) {
				emitCreationEvent(fetchedDevices[f], changeEventProcessor);
			}
		};

		/**
		 * @name pollDevices
		 * @function
		 * @description
		 * <p>
		 *   Poll devices defined by the query parameters in the specified interval.
		 * </p>
		 * <p>
		 *   If a device matching the query changes, an event is emitted to the
		 *   processing function.
		 * </p>
		 * <p>
		 *   This function is intended as a temporary replacement for the removed
		 *   registerDeviceSetListener endpoint of the device service.
		 * </p>
		 * @param {EventBus} eventBus An event bus instance to communicate with the
		 *   device service
		 * @param {Object} queryParameters An object containing the parameters for the
		 *   device service endpoint to query devices
		 * @param {function} changeEventProcessor A function receiving an emitted
		 *   device event upon a change in matching devices
		 * @param {number} [intervalSeconds=15] The time between each query
		 * @returns {void}
		 */
		this.pollDevices = function(eventBus, queryParameters, changeEventProcessor, intervalSeconds) {
			intervalSeconds = intervalSeconds || DEFAULT_POLL_INTERVAL_SECONDS;

			var currentDevices;
			fetchDevices(eventBus, queryParameters).then(function(reply) {
				currentDevices = reply.result.items.sort(compareGuids);
			});

			var poller = $interval(function() {
				fetchDevices(eventBus, queryParameters).then(function(reply) {
					var fetchedDevices = reply.result.items.sort(compareGuids);
					if (currentDevices) {
						compareDeviceLists(currentDevices, fetchedDevices, changeEventProcessor);
					}
					currentDevices = fetchedDevices;
				});
			}, intervalSeconds * MILLISECONDS_PER_SECOND);
			ketaDeviceSetPollers.add(poller);
		};

		var emitTagValues = function(changeEvent, receiver) {
			if (changeEvent.getType() !== ketaDeviceEvent.CREATED
				&& changeEvent.getType() !== ketaDeviceEvent.UPDATED) {
				return;
			}

			var tagValuesObject = changeEvent.getDevice().tagValues;

			// Object#keys has better browser compatibility than Object#values
			var tagValues = Object.keys(tagValuesObject).map(function(tagName) {
				return tagValuesObject[tagName];
			});
			receiver(tagValues);
		};

		/**
		 * @name pollTagValues
		 * @function
		 * @description
		 * <p>
		 *   Poll tag values defined by the device query parameters in the specified
		 *   interval.
		 * </p>
		 * <p>
		 *   If a device matching the query is added or changes, its tag values are
		 *   emitted to the processing function.
		 * </p>
		 * <p>
		 *   This function is intended as a temporary replacement for the removed
		 *   registerTagValueListener endpoint of the device service.
		 * </p>
		 * @param {EventBus} eventBus An event bus instance to communicate with the
		 *   device service
		 * @param {Object} queryParameters An object containing the parameters for the
		 *   device service endpoint to query devices
		 * @param {function} tagValuesProcessor A function receiving the emitted
		 *   array of tag values upon changes in matching devices
		 * @param {number} [intervalSeconds=15] The time between each query
		 * @returns {void}
		 */
		this.pollTagValues = function(eventBus, queryParameters, tagValuesProcessor, intervalSeconds) {
			this.pollDevices(eventBus, queryParameters, function(changeEvent) {
				emitTagValues(changeEvent, tagValuesProcessor);
			}, intervalSeconds);
		};
	});

