'use strict';

/**
 * @name keta.servicesDevice
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014
 * @module keta.servicesDevice
 * @description Device Provider
 */
angular.module('keta.servicesDevice', ['keta.servicesEventBus'])
	
	/**
	 * @class ketaDeviceProvider
	 * @propertyOf keta.servicesDevice
	 * @description Device Provider
	 */
	.provider('ketaDevice', function() {
		
		/**
		 * @const
		 * @private
		 * @description Service name used in log messages for instance.
		 */
		var SERVICE_NAME = 'ketaDevice';
		
		/**
		 * @const
		 * @private
		 * @description Service endpoint for messages.
		 */
		var SERVICE_ENDPOINT = 'devices';
		
		/**
		 * @const
		 * @private
		 * @description Error message if no GUID was found in given device object.
		 */
		var ERROR_NO_GUID = 'No guid found in device object';
		
		/**
		 * @const
		 * @private
		 * @description Return code if item was not found.
		 */
		var ERROR_ITEM_NOT_FOUND = -1;
		
		// return service API
		this.$get = function($rootScope, $q, $location, ketaEventBus) {
			
			/**
			 * @private
			 * @function
			 * @description Check if two devices match by comparing device properties.
			 * @param {object} deviceOne first device
			 * @param {object} deviceTwo second device
			 * @returns {boolean}
			 */
			var equals = function(deviceOne, deviceTwo) {
				var matches =
					angular.isDefined(deviceOne.guid) &&
					angular.isDefined(deviceTwo.guid) &&
					deviceOne.guid === deviceTwo.guid;
				return matches;
			};
			
			/**
			 * @private
			 * @function
			 * @description Return index of given item in given list
			 * @param {object} item item to search for
			 * @param {object[]} list list to search in
			 * @returns {number} index index of item or ERROR_ITEM_NOT_FOUND if not found
			 */
			var indexOfItem = function(item, list) {
				
				var index = ERROR_ITEM_NOT_FOUND;
				
				// filter objects and return index if match was found
				angular.forEach(list, function(object, idx) {
					if ((index === ERROR_ITEM_NOT_FOUND) && equals(item, object)) {
						index = idx;
					}
				});
				
				return index;
			};
			
			/**
			 * @private
			 * @function
			 * @description Process device event.
			 * @param {object} message message received from event bus
			 * @param {object[]} devices device list to apply event to
			 */
			var processEvent = function(message, devices) {
				
				if (angular.isDefined(message.type) &&
					angular.isDefined(message.value) &&
					angular.isDefined(message.value.guid)) {
					
					// save pristine copy of item
					var device = message.value;
					device.$$pristine = angular.copy(device);
					
					if (message.type === ketaEventBus.EVENT_CREATED) {
						
						devices.push(device);
						ketaEventBus.log(SERVICE_NAME + ':processEvent » device with guid "' + device.guid + '" created', device);
						
						// enforce digest cycle
						$rootScope.$apply();
						
					} else {
					
						// get index of item to apply event to
						var index = indexOfItem(device, devices);
						
						if (index !== ERROR_ITEM_NOT_FOUND) {
							
							if (message.type === ketaEventBus.EVENT_UPDATED) {
								devices[index] = device;
								ketaEventBus.log(SERVICE_NAME + ':processEvent » device with guid "' + device.guid + '" updated', device);
							}
							
							if (message.type === ketaEventBus.EVENT_DELETED) {
								devices.splice(index, 1);
								ketaEventBus.log(SERVICE_NAME + ':processEvent » device with guid "' + device.guid + '" deleted', device);
							}
							
							// enforce digest cycle
							$rootScope.$apply();
							
						} else {
							ketaEventBus.log(SERVICE_NAME + ':processEvent » device with guid "' + device.guid + '" not found');
						}
						
					}
					
				}
				
			};
			
			/**
			 * @private
			 * @function
			 * @description Process device action.
			 * @param {object} message message to send to event bus
			 * @param {boolean} registerListener flag to determine, if device set listener should be registered
			 * @returns {promise}
			 */
			var processAction = function(message, registerListener) {
				
				var deferred = $q.defer();
				
				ketaEventBus.send(SERVICE_ENDPOINT, message, function(response) {
					if (angular.isDefined(response.code) &&
						angular.isDefined(response.result) &&
						response.code === ketaEventBus.RESPONSE_CODE_OK) {
						
						// register device set listener
						if (registerListener) {
							
							// generate UUID for listener
							var listenerUUID = 'CLIENT_' + ketaEventBus.generateUUID() + '_deviceSetListener';
							
							// set device filter and projection
							var deviceFilter = {};
							var deviceProjection = {};
							
							if (angular.isDefined(message.params) && (message.params !== null)) {
								if (angular.isDefined(message.params.filter)) {
									deviceFilter = message.params.filter;
								}
								if (angular.isDefined(message.params.projection)) {
									deviceProjection = message.params.projection;
								}
							}
							
							// register handler for replyAddress
							ketaEventBus.registerBusHandler(listenerUUID, function(message) {
								processEvent(message, response.result.items);
							});
							
							// register listener for given address
							ketaEventBus.send(SERVICE_ENDPOINT, {
								action: 'registerDeviceSetListener',
								body: {
									deviceFilter: deviceFilter,
									deviceProjection: deviceProjection,
									replyAddress: listenerUUID
								}
							}, function(listenerResponse) {
								if (listenerResponse.code !== ketaEventBus.RESPONSE_CODE_OK) {
									ketaEventBus.log(SERVICE_ENDPOINT + ':registerDeviceSetListener', listenerResponse.message);
								}
							});
							
							// save listener UUID in result
							response.result.$$listenerUUID = listenerUUID;
							
							// save pristine copy of each item
							angular.forEach(response.result.items, function(item) {
								item.$$pristine = angular.copy(item);
							});
							
						}
						
						if (angular.isDefined(response.result.items)) {
							deferred.resolve(
								response.result.items,
								response.result.offset,
								response.result.limit,
								response.result.total
							);
						} else {
							if (angular.isDefined(response.result.type) &&
								response.result.type !== ketaEventBus.EVENT_FAILED) {
								if (response.result.type === ketaEventBus.EVENT_UPDATED) {
									deferred.resolve(response.result.value);
								} else {
									deferred.resolve(response.result);
								}
							} else {
								deferred.reject('Failed');
							}
						}
						
					} else {
						if (angular.isDefined(response.message)) {
							deferred.reject(response.message);
						} else {
							deferred.reject('Unknown error');
						}
					}
				}, function(error) {
					deferred.reject(error);
				});
				
				return deferred.promise;
				
			};
			
			/**
			 * @private
			 * @function
			 * @description Return promise with given code and message.
			 * @param {string} message return message
			 * @param {boolean} resolve resolve or reject
			 * @returns {promise}
			 */
			var responsePromise = function(message, resolve) {
				var deferred = $q.defer();
				if (resolve) {
					deferred.resolve(message);
				} else {
					deferred.reject(message);
				}
				return deferred.promise;
			};
			
			/**
			 * @private
			 * @function
			 * @description Detect changes in two tag value objects.
			 * @param {object} prevTags previous tags object
			 * @param {object} currentTags current tags object
			 * @returns {object|boolean}
			 */
			var getChanges = function(prevTags, currentTags) {
				
				var changes = {};
				
				angular.forEach(currentTags, function(tag, name) {
					if (!angular.isDefined(prevTags[name]) ||
						!angular.equals(prevTags[name].value, tag.value)) {
						changes[name] = {
							value: tag.value,
							oca: tag.oca
						};
					}
				});
				
				return (!angular.equals(changes, {})) ? changes : false;
			};
			
			/**
			 * @private
			 * @function
			 * @description Check if guid property is set in device object. If not return rejected promise.
			 * @param {object} device device object
			 * @returns {object|boolean}
			 */
			var checkIfGuidExists = function(device) {
				if (!angular.isDefined(device.guid)) {
					return responsePromise({
						code: ketaEventBus.RESPONSE_CODE_BAD_REQUEST,
						message: ERROR_NO_GUID
					}, false);
				} else {
					return true;
				}
			};
			
			/**
			 * @class ketaDeviceService
			 * @propertyOf ketaDeviceProvider
			 * @description Device Service
			 */
			var api = {
				
				/**
				 * @const
				 * @memberOf ketaDeviceService
				 * @description Error message if no GUID was found in given device object.
				 */
				ERROR_NO_GUID: ERROR_NO_GUID,
				
				/**
				 * @function
				 * @memberOf ketaDeviceService
				 * @description
				 * <p>
				 *   Read all devices with given filter and projection.
				 * </p>
				 * <p>
				 *   By default an empty filter and an empty projection is used which means, that
				 *   default projection is in place and all devices will be returned.
				 * </p>
				 * <p>
				 *   Automatically a device set listener is registered.
				 * </p>
				 * @param {object} [params={}] device parameter (filter, projection, offset and limit)
				 * @returns {promise}
				 * @example
				 * angular.module('exampleApp', [])
				 *     .controller('ExampleController', function(ketaDevice) {
				 *         ketaDevice.read().then(function(devices) {
				 *             $scope.devices = devices;
				 *         }, function(error) {
				 *             ketaEventBus.log('ketaDevice.read: error getting devices');
				 *         });
				 *     });
				 * @example
				 * angular.module('exampleApp', [])
				 *     .controller('ExampleController', function(ketaDevice) {
				 *         ketaDevice.read({
				 *            filter: {
				 *                guid: $routeParams.deviceGuid
				 *            }
				 *         }).then(function(devices) {
				 *             $scope.device = devices[0] || {};
				 *         }, function(error) {
				 *             ketaEventBus.log('ketaDevice.read: error getting device');
				 *         });
				 *     });
				 * @example
				 * angular.module('exampleApp', [])
				 *     .controller('ExampleController', function(ketaDevice) {
				 *         ketaDevice.read({
				 *             filter: {
				 *                 deviceClasses: ['device-class-a', 'device-class-b']
				 *             },
				 *             projection: {
				 *                 guid: 1,
				 *                 deviceClass: 1
				 *             },
				 *             offset: 10,
				 *             limit: 10
				 *         }).then(function(devices) {
				 *             $scope.devices = devices;
				 *         }, function(error) {
				 *             ketaEventBus.log('ketaDevice.read: error getting devices');
				 *         });
				 *     });
				 */
				read: function(params) {
					return processAction({
						action: 'getDevices',
						params: (angular.isDefined(params) ? params : null),
						body: null
					}, true);
				},
				
				/**
				 * @function
				 * @memberOf ketaDeviceService
				 * @description Create a device by given object.
				 * @param {object} device device object
				 * @returns {promise}
				 * @example
				 * angular.module('exampleApp', [])
				 *     .controller('ExampleController', function(ketaDevice) {
				 *         ketaDevice.create({
				 *             guid: 'new-guid',
				 *             currentAddress: 'new-address'
				 *         });
				 *     });
				 */
				create: function(device) {
					
					// check if guid property exists in device
					var valid = checkIfGuidExists(device);
					
					if (valid === true) {
						return processAction({
							action: 'createDevice',
							params: null,
							body: device
						});
					} else {
						return valid;
					}
					
				},
				
				/**
				 * @function
				 * @memberOf ketaDeviceService
				 * @description Update a device by given object.
				 * @param {object} device device object
				 * @returns {promise}
				 * @example
				 * angular.module('exampleApp', [])
				 *     .controller('ExampleController', function(ketaDevice) {
				 *         ketaDevice.update({
				 *             tagValues: {
				 *                 IdName: {
				 *                     value: 'new-name',
				 *                     oca: 1
				 *                 }
				 *             }
				 *         });
				 *     });
				 */
				update: function(device) {
					
					// check if guid property exists in device
					var valid = checkIfGuidExists(device);
					
					if (valid === true) {
						
						// get original device object
						var originalDevice = angular.copy(device.$$pristine);
						
						// get updated device object
						var updatedDevice = angular.copy(device);
						delete updatedDevice.$$pristine;
						
						var changes = getChanges(originalDevice.tagValues, updatedDevice.tagValues);
						
						if (changes) {
							return processAction({
								action: 'updateDevice',
								params: {
									deviceId: device.guid
								},
								body: {
									tagValues: changes
								}
							});
						} else {
							return responsePromise(device, true);
						}
						
					} else {
						return valid;
					}
					
				},
				
				/**
				 * @function
				 * @memberOf ketaDeviceService
				 * @description Delete a device by given object.
				 * @param {object} device device object
				 * @returns {promise}
				 * @example
				 * angular.module('exampleApp', [])
				 *     .controller('ExampleController', function(ketaDevice) {
				 *         ketaDevice.delete({
				 *             guid: 'guid'
				 *         });
				 *     });
				 */
				'delete': function(device) {
					
					// check if guid property exists in device
					var valid = checkIfGuidExists(device);
					
					if (valid === true) {
						return processAction({
							action: 'deleteDevice',
							params: {
								deviceId: device.guid
							},
							body: null
						});
					} else {
						return valid;
					}
				}
				
			};
			
			return api;
			
		};
		
	});
