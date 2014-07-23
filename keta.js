'use strict';

/**
 * keta 0.2.0
 */

// source: components/services/access-token.js
/**
 * @name keta.servicesAccessToken
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014
 * @module keta.servicesAccessToken
 * @description Access Token Factory
 */
angular.module('keta.servicesAccessToken', ['keta.servicesAppContext'])
	
	/**
	 * @class ketaAccessToken
	 * @propertyOf keta.servicesAccessToken
	 * @description Access Token Factory
	 */
	.factory('ketaAccessToken', function($http, ketaAppContext) {
		
		/**
		 * @private
		 * @description Internal representation of access token which was injected by web server into context.js.
		 */
		var accessToken = ketaAppContext.get('oauth.accessToken');
		
		var api = {
			
			/**
			 * @function
			 * @memberOf ketaAccessToken
			 * @description Get access token.
			 * @returns {string} access token
			 * @example
			 * angular.module('exampleApp', [])
			 *     .controller('ExampleController', function(ketaAccessToken) {
			 *         var accessToken = ketaAccessToken.get();
			 *     });
			 */
			get: function() {
				return accessToken;
			},
			
			/**
			 * @function
			 * @memberOf ketaAccessToken
			 * @description Set access token.
			 * @param {string} token new access token
			 * @example
			 * angular.module('exampleApp', [])
			 *     .controller('ExampleController', function(ketaAccessToken) {
			 *         ketaAccessToken.set('new-token');
			 *     });
			 */
			set: function(token) {
				if (angular.isDefined(token) && angular.isString(token)) {
					accessToken = token;
				}
			},

			/**
			 * @function
			 * @memberOf ketaAccessToken
			 * @description Refresh access token by requesting backend.
			 * @returns {promise}
			 * @example
			 * angular.module('exampleApp', [])
			 *     .controller('ExampleController', function(ketaAccessToken) {
			 *         ketaAccessToken.refresh().then(
			 *             function(response) {
			 *                 if (angular.isDefined(response.data.accessToken)) {
			 *                     ketaAccessToken.set(response.data.accessToken);
			 *                 }
			 *             },
			 *             function(message) {
			 *                 console.error(message);
			 *             }
			 *         );
			 *     });
			 */
			refresh: function() {
				return $http({
					method: 'GET',
					url: '/refreshAccessToken'
				});
			}
		
		};
		
		return api;
		
	});

// source: components/services/app-context.js
/**
 * @name keta.servicesAppContext
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014
 * @module keta.servicesAppContext
 * @description App Context Factory
 */
angular.module('keta.servicesAppContext', [])
	
	/**
	 * @class ketaAppContext
	 * @propertyOf keta.servicesAppContext
	 * @description App Context Factory
	 */
	.factory('ketaAppContext', function($window) {
		
		/**
		 * @private
		 * @description Internal representation of app context from global namespace injected by context.js.
		 */
		var appContext = (angular.isDefined($window.appContext)) ? $window.appContext : '';
		
		var api = {
			
			/**
			 * @function
			 * @memberOf ketaAppContext
			 * @description Get value by key from app context object.
			 * @param {string} key key to retrieve from app context
			 * @returns {*}
			 * @example
			 * angular.module('exampleApp', [])
			 *     .controller('ExampleController', function(ketaAppContext) {
			 *         var socketURL = ketaAppContext.get('bus.url');
			 *     });
			 */
			get: function(key) {
				var obj = appContext;
				key = key.split('.');
				for (var i = 0, l = key.length; i < l; i++) {
					if (angular.isDefined(obj[key[i]])) {
						obj = obj[key[i]];
					} else {
						return null;
					}
				}
				return obj;
			}
		
		};
		
		return api;
		
	});

// source: components/services/device.js
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
			 * @returns {number} index index of item or -1 if not found
			 */
			var indexOfItem = function(item, list) {
				
				var index = -1;
				
				// filter objects and return index if match was found
				angular.forEach(list, function(object, idx) {
					if ((index === -1) && equals(item, object)) {
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
						
						if (index !== -1) {
							
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
							
							// set device filter
							var deviceFilter = {};
							
							if (angular.isDefined(message.params) &&
								(message.params !== null) &&
								angular.isDefined(message.params.filter) &&
								angular.isDefined(message.params.filter.guid)) {
								deviceFilter = {
									guid: message.params.filter.guid
								};
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
									deviceProjection: {},
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
							deferred.resolve(response.result);
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
			 * @description Detect changes between two device objects.
			 * @param {object} prev previous object version
			 * @param {object} current current object version
			 * @returns {object|boolean}
			 */
			var getChanges = function(prev, current) {
				
				var changes = {};
				var prop = null;
				
				for (prop in current) {
					if (current.hasOwnProperty(prop)) {
						if (!prev || prev[prop] !== current[prop]) {
							if (typeof current[prop] === 'object') {
								var c = getChanges(prev[prop], current[prop]);
								if (c) {
									changes[prop] = c;
								}
							} else {
								changes[prop] = current[prop];
							}
						}
					}
				}
				
				for (prop in changes) {
					if (changes.hasOwnProperty(prop)) {
						return changes;
					}
				}
				
				// false when unchanged
				return false;
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
					if (!angular.isDefined(device.guid)) {
						return responsePromise({
							code: ketaEventBus.RESPONSE_CODE_BAD_REQUEST,
							message: ERROR_NO_GUID
						}, false);
					}
					
					return processAction({
						action: 'createDevice',
						params: null,
						body: device
					});
					
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
				 *             guid: 'new-guid',
				 *             currentAddress: 'updated-address'
				 *         });
				 *     });
				 */
				update: function(device) {
					
					// check if guid property exists in device
					if (!angular.isDefined(device.guid)) {
						return responsePromise({
							code: ketaEventBus.RESPONSE_CODE_BAD_REQUEST,
							message: ERROR_NO_GUID
						}, false);
					}
					
					// get original device object
					var originalDevice = angular.copy(device.$$pristine);
					
					// get updated device object
					var updatedDevice = angular.copy(device);
					delete updatedDevice.$$pristine;
					
					var changes = getChanges(originalDevice, updatedDevice);
					
					if (changes) {
						
						// oca does not change, but must be included to fulfill api
						angular.forEach(changes.tagValues, function(tagValue, tagName) {
							changes.tagValues[tagName].oca = updatedDevice.tagValues[tagName].oca;
						});
						
						return processAction({
							action: 'updateDevice',
							params: {
								deviceId: device.guid
							},
							body: changes
						});
						
					} else {
						return responsePromise(device, true);
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
				 *             guid: 'new-guid'
				 *         });
				 *     });
				 */
				'delete': function(device) {
					
					// check if guid property exists in device
					if (!angular.isDefined(device.guid)) {
						return responsePromise({
							code: ketaEventBus.RESPONSE_CODE_BAD_REQUEST,
							message: ERROR_NO_GUID
						}, false);
					}
					
					return processAction({
						action: 'deleteDevice',
						params: {
							deviceId: device.guid
						},
						body: null
					});
				}
				
			};
			
			return api;
			
		};
		
	});

// source: components/services/event-bus.js
/**
 * @name keta.servicesEventBus
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014
 * @module keta.servicesEventBus
 * @description Event Bus Service
 */
angular.module('keta.servicesEventBus', ['keta.servicesAccessToken'])
	
	/**
	 * @class ketaEventBusProvider
	 * @propertyOf keta.servicesEventBus
	 * @description Event Bus Provider wrapping Vert.x event bus
	 */
	.provider('ketaEventBus', function() {
		
		/**
		 * @const
		 * @private
		 * @description Service name used in log messages for instance.
		 */
		var SERVICE_NAME = 'ketaEventBus';
		
		/**
		 * @const
		 * @private
		 * @description Default reconnect timeout.
		 */
		var DEFAULT_RECONNECT_TIMEOUT = 10;
		
		/**
		 * @const
		 * @private
		 * @description Default web socket URL.
		 */
		var DEFAULT_SOCKET_URL = 'https://localhost:10443/kiwibus';
		
		/**
		 * @const
		 * @private
		 * @description Connecting state constant.
		 */
		var STATE_CONNECTING = 0;
		
		/**
		 * @const
		 * @private
		 * @description Open state constant.
		 */
		var STATE_OPEN = 1;
		
		/**
		 * @const
		 * @private
		 * @description Closing state constant.
		 */
		var STATE_CLOSING = 2;
		
		/**
		 * @const
		 * @private
		 * @description Closed state constant.
		 */
		var STATE_CLOSED = 3;
		
		/**
		 * @const
		 * @private
		 * @description Unknown state constant.
		 */
		var STATE_UNKNOWN = 4;
		
		/**
		 * @const
		 * @private
		 * @description State labels.
		 */
		var STATE_LABELS = {};
		
		STATE_LABELS[STATE_CONNECTING] = 'connecting';
		STATE_LABELS[STATE_OPEN] = 'open';
		STATE_LABELS[STATE_CLOSING] = 'closing';
		STATE_LABELS[STATE_CLOSED] = 'closed';
		STATE_LABELS[STATE_UNKNOWN] = 'unknown';/**
		
		/*
		 * @const
		 * @private
		 * @description Created event id.
		 */
		var EVENT_CREATED = 'CREATED';
		
		/**
		 * @const
		 * @private
		 * @description Updated event id.
		 */
		var EVENT_UPDATED = 'UPDATED';
		
		/**
		 * @const
		 * @private
		 * @description Deleted event id.
		 */
		var EVENT_DELETED = 'DELETED';
		
		/**
		 * @const
		 * @private
		 * @description Response code if everything is fine.
		 */
		var RESPONSE_CODE_OK = 200;
		
		/**
		 * @const
		 * @private
		 * @description Response code if an API call was malformed.
		 */
		var RESPONSE_CODE_BAD_REQUEST = 400;
		
		/**
		 * @const
		 * @private
		 * @description Response code if something wasn't found.
		 */
		var RESPONSE_CODE_NOT_FOUND = 404;
		
		/**
		 * @const
		 * @private
		 * @description Response code if request timed out.
		 */
		var RESPONSE_CODE_TIMEOUT = 408;
		
		/**
		 * @const
		 * @private
		 * @description Response code if auth token expired.
		 */
		var RESPONSE_CODE_AUTH_TOKEN_EXPIRED = 419;
		
		/**
		 * @const
		 * @private
		 * @description Timeout in seconds for send method.
		 */
		var DEFAULT_SEND_TIMEOUT = 10;
		
		/**
		 * @const
		 * @private
		 * @description Internal stack for configuration.
		 * @property {string} socketURL socket url
		 * @property {number} socketState socket state
		 * @property {boolean} autoConnect auto connect to socket
		 * @property {boolean} reconnect reconnect if socket closed
		 * @property {number} reconnectTimeout reconnect timeout to open socket again
		 * @property {boolean} mockMode mock mode enabled
		 * @property {boolean} debugMode debug mode enabled
		 * @property {function|null} logFilter log filter callback method
		 * @property {number} sendTimeout timeout in seconds for send method
		 */
		var config = {
			socketURL: DEFAULT_SOCKET_URL,
			socketState: STATE_CLOSED,
			autoConnect: false,
			reconnect: true,
			reconnectTimeout: DEFAULT_RECONNECT_TIMEOUT,
			mockMode: false,
			debugMode: false,
			logFilter: null,
			sendTimeout: DEFAULT_SEND_TIMEOUT
		};
		
		/**
		 * @const
		 * @private
		 * @description Internal stack for mocked responses and handlers.
		 * @property {object} responses mocked responses
		 * @property {object} handlers mocked handlers
		 */
		var mocked = {
			responses: {},
			handlers: {}
		};
		
		/**
		 * @const
		 * @private
		 * @description Stubbed Vert.x event bus instance.
		 */
		var eventBus = null;
		
		/**
		 * @const
		 * @private
		 * @description Internal stack of on open handlers.
		 */
		var onOpenHandlers = {};
		
		/**
		 * @const
		 * @private
		 * @description Internal stack of on close handlers.
		 */
		var onCloseHandlers = {};
		
		/**
		 * @const
		 * @private
		 * @description Internal stack of registered bus handlers.
		 */
		var busHandlers = {};
		
		// CONFIG
		// ------
		
		/**
		 * @name setSocketURL
		 * @function
		 * @memberOf ketaEventBusProvider
		 * @description Set URL of web socket EventBus connects to.
		 * @param {string} [url=https://localhost:10443/kiwibus] URL of web socket
		 * @example
		 * angular.module('exampleApp', [])
		 *     .config(function(EventBusProvider) {
		 *         EventBusProvider.setSocketURL('http://localhost:8080/eventbus');
		 *     });
		 */
		this.setSocketURL = function(url) {
			config.socketURL = (angular.isString(url) ? String(url) : DEFAULT_SOCKET_URL);
		};
		
		/**
		 * @name enableAutoConnect
		 * @function
		 * @memberOf ketaEventBusProvider
		 * @description Enable automatic connect upon start.
		 * @param {boolean} [enabled=false] Flag
		 * @example
		 * angular.module('exampleApp', [])
		 *     .config(function(EventBusProvider) {
		 *         EventBusProvider.enableAutoConnect(true);
		 *     });
		 */
		this.enableAutoConnect = function(enabled) {
			config.autoConnect = ((enabled === true || enabled === false) ? Boolean(enabled) : false);
		};
		
		/**
		 * @name enableReconnect
		 * @function
		 * @memberOf ketaEventBusProvider
		 * @description Enable reconnect if web socket was closed.
		 * @param {boolean} [enabled=false] Flag
		 * @example
		 * angular.module('exampleApp', [])
		 *     .config(function(EventBusProvider) {
		 *         EventBusProvider.enableReconnect(true);
		 *     });
		 */
		this.enableReconnect = function(enabled) {
			config.reconnect = ((enabled === true || enabled === false) ? Boolean(enabled) : true);
		};
		
		/**
		 * @name setReconnectTimeout
		 * @function
		 * @memberOf ketaEventBusProvider
		 * @description Set timeout for retry of reconnect in case of closed web socket.
		 * @param {number} [timeout=10] Timeout in seconds
		 * @example
		 * angular.module('exampleApp', [])
		 *     .config(function(EventBusProvider) {
		 *         EventBusProvider.setReconnectTimeout(5);
		 *     });
		 */
		this.setReconnectTimeout = function(timeout) {
			config.reconnectTimeout =
				(angular.isDefined(timeout) && angular.isNumber(timeout) && (timeout > 0)) ?
					timeout : DEFAULT_RECONNECT_TIMEOUT;
		};
		
		/**
		 * @name enableMockMode
		 * @function
		 * @memberOf ketaEventBusProvider
		 * @description Enable mock mode to use event bus service without real socket.
		 * @param {boolean} [enabled=false] Flag
		 * @example
		 * angular.module('exampleApp', [])
		 *     .config(function(EventBusProvider) {
		 *         EventBusProvider.enableMockMode(true);
		 *     });
		 */
		this.enableMockMode = function(enabled) {
			config.mockMode = ((enabled === true || enabled === false) ? Boolean(enabled) : false);
		};
		
		/**
		 * @name enableDebugMode
		 * @function
		 * @memberOf ketaEventBusProvider
		 * @description Enable debug mode to print formatted outputs to dev tools console.
		 * @param {boolean} [enabled=false] Flag
		 * @example
		 * angular.module('exampleApp', [])
		 *     .config(function(EventBusProvider) {
		 *         EventBusProvider.enableDebugMode(true);
		 *     });
		 */
		this.enableDebugMode = function(enabled) {
			config.debugMode = ((enabled === true || enabled === false) ? Boolean(enabled) : false);
		};
		
		/**
		 * @name addMockResponse
		 * @function
		 * @memberOf ketaEventBusProvider
		 * @description
		 * <p>
		 *   Add mocked response for given id representing address and action on event bus.
		 * </p>
		 * <p>
		 *   Only works if mock mode is enabled.
		 * </p>
		 * @see ketaEventBusProvider.enableMockMode
		 * @param {string} id Address and action on event bus in format address:action
		 * @param {function} callback Callback method to return response
		 * @example
		 * angular.module('exampleApp', [])
		 *     .config(function(EventBusProvider) {
		 *     
		 *         // return static list of devices
		 *         EventBusProvider.addMockResponse('devices:getDevices', function(request) {
		 *             return {
		 *                 code: 200,
		 *                 message: null,
		 *                 result: [{
		 *                     guid: 'sample-guid',
		 *                     currentAddress: 'sample-current-address'
		 *                 }],
		 *                 status: 'ok'
		 *             };
		 *         });
		 *         
		 *     });
		 * @example
		 * angular.module('exampleApp', [])
		 *     .config(function(EventBusProvider) {
		 *     
		 *         // use request body and return it unmodified
		 *         EventBusProvider.addMockResponse('devices:createDevice', function(request) {
		 *             return {
		 *                 code: 200,
		 *                 message: null,
		 *                 result: request.body,
		 *                 status: 'ok'
		 *             };
		 *         });
		 *         
		 *     });
		 */
		this.addMockResponse = function(id, callback) {
			if (!angular.isDefined(mocked.responses[id]) &&	angular.isFunction(callback)) {
				mocked.responses[id] = callback;
			}
		};
		
		/**
		 * @name setLogFilter
		 * @function
		 * @memberOf ketaEventBusProvider
		 * @description
		 * <p>
		 *    Define filter method to be called by log method before outputting something.
		 * </p>
		 * <p>
		 *    Only works if debug mode is enabled.
		 * </p>
		 * @see ketaEventBusProvider.enableDebugMode
		 * @param {function} filter filter callback method
		 * @example
		 * angular.module('exampleApp', [])
		 *     .config(function(EventBusProvider) {
		 *         
		 *         // only log messages where action contains "Devices"
		 *         EventBusProvider.setLogFilter(function(headline, message) {
		 *             var matches =
		 *                 (angular.isDefined(message) &&
		 *                 angular.isDefined(message.action) &&
		 *                 message.action.indexOf('Devices') !== -1);
		 *             return matches;
		 *         });
		 *         
		 *     });
		 */
		this.setLogFilter = function(filter) {
			if (angular.isFunction(filter)) {
				config.logFilter = filter;
			}
		};
		
		/**
		 * @name setSendTimeout
		 * @function
		 * @memberOf ketaEventBusProvider
		 * @description Set timeout for send method.
		 * @param {number} [timeout=10] Timeout in seconds
		 * @example
		 * angular.module('exampleApp', [])
		 *     .config(function(EventBusProvider) {
		 *         EventBusProvider.setSendTimeout(5);
		 *     });
		 */
		this.setSendTimeout = function(timeout) {
			config.sendTimeout =
				(angular.isDefined(timeout) && angular.isNumber(timeout) && (timeout > 0)) ?
					timeout : DEFAULT_SEND_TIMEOUT;
		};
		
		/**
		 * @name getConfig
		 * @function
		 * @memberOf ketaEventBusProvider
		 * @description Get configuration object.
		 * @returns {object} config object
		 * @example
		 * angular.module('exampleApp')
		 *     .config(function(EventBusProvider) {
		 *         var config = EventBusProvider.getConfig();
		 *     });
		 */
		this.getConfig = function() {
			return config;
		};
		
		/**
		 * @name getMocked
		 * @function
		 * @memberOf ketaEventBusProvider
		 * @description Get mocked object.
		 * @returns {object} mocked object
		 * @example
		 * angular.module('exampleApp')
		 *     .config(function(EventBusProvider) {
		 *         var mocked = EventBusProvider.getMocked();
		 *     });
		 */
		this.getMocked = function() {
			return mocked;
		};
		
		/**
		 * @name getEventBus
		 * @function
		 * @memberOf ketaEventBusProvider
		 * @description Get event bus object.
		 * @returns {object} event bus object
		 * @example
		 * angular.module('exampleApp')
		 *     .config(function(EventBusProvider) {
		 *         var eventBus = EventBusProvider.getEventBus();
		 *     });
		 */
		this.getEventBus = function() {
			return eventBus;
		};
		
		// RUN
		// ---
		
		// keep reference
		var that = this;
		
		// return service API
		this.$get = function($rootScope, $location, $timeout, $window, ketaAccessToken) {
			
			// refresh default socket url
			DEFAULT_SOCKET_URL = $window.appContext.bus.url || DEFAULT_SOCKET_URL;
			config.socketURL = DEFAULT_SOCKET_URL;
			
			// Internal open handler, which calls all registered on open handlers.
			var openHandler = function() {
				
				// update internal socket state
				config.socketState = STATE_OPEN;
				
				// loop on open handlers
				angular.forEach(onOpenHandlers, function(handler) {
					if (angular.isFunction(handler)) {
						handler();
					}
				});
				
			};
			
			// Internal close handler, which calls all registered on close handlers and
			// automatically tries to reconnect if configured
			var closeHandler = function() {
				
				// update internal socket state
				config.socketState = STATE_CLOSED;
				
				// loop on close handlers
				angular.forEach(onCloseHandlers, function(handler) {
					if (angular.isFunction(handler)) {
						handler();
					}
				});
				
				// reconnect
				if (config.reconnect) {
					$timeout(function() {
						stub.open();
					}, config.reconnectTimeout * 1000);
				}
				
			};
			
			// matches mock handler by requested action and send corresponding event message
			var matchMockHandler = function(message, response) {
				
				// check mocked handlers
				angular.forEach(mocked.handlers, function(handlerConfig, id) {
					angular.forEach(handlerConfig.actions, function(action) {
						if (action === message.action) {
							stub.log(action + ' matched for handler ' + id);
							
							// build event message type
							var type = '';
							
							if (message.action.indexOf('create') === 0) {
								type = EVENT_CREATED;
							}
							if (message.action.indexOf('update') === 0) {
								type = EVENT_UPDATED;
							}
							if (message.action.indexOf('delete') === 0) {
								type = EVENT_DELETED;
							}
							
							handlerConfig.handler({
								type: type,
								value: response.result
							});
							
						}
					});
				});
				
			};
			
			// unregister all bus handlers upon route changes
			$rootScope.$on('$routeChangeStart', function() {
				
				// unregister all handlers
				angular.forEach(busHandlers, function(handler, uuid) {
					stub.unregisterBusHandler(uuid, handler);
				});
				
				// clear internal stack
				busHandlers = {};
			});
			
			/**
			 * @class ketaEventBusService
			 * @propertyOf ketaEventBusProvider
			 * @description Event Bus Service wrapping Vert.x event bus
			 */
			var stub = {
				
				/**
				 * @const
				 * @memberOf ketaEventBusService
				 * @description On open event id.
				 */
				EVENT_ON_OPEN: 'onOpen',
				
				/**
				 * @const
				 * @memberOf ketaEventBusService
				 * @description On close event id.
				 */
				EVENT_ON_CLOSE: 'onClose',
				
				/**
				 * @const
				 * @memberOf ketaEventBusService
				 * @description Created event id.
				 */
				EVENT_CREATED: EVENT_CREATED,
				
				/**
				 * @const
				 * @memberOf ketaEventBusService
				 * @description Updated event id.
				 */
				EVENT_UPDATED: EVENT_UPDATED,
				
				/**
				 * @const
				 * @memberOf ketaEventBusService
				 * @description Deleted event id.
				 */
				EVENT_DELETED: EVENT_DELETED,
				
				/**
				 * @const
				 * @memberOf ketaEventBusService
				 * @description Response code if everything is fine.
				 */
				RESPONSE_CODE_OK: RESPONSE_CODE_OK,
				
				/**
				 * @const
				 * @memberOf ketaEventBusService
				 * @description Response code if an API call was malformed.
				 */
				RESPONSE_CODE_BAD_REQUEST: RESPONSE_CODE_BAD_REQUEST,
				
				/**
				 * @const
				 * @memberOf ketaEventBusService
				 * @description Response code if something wasn't found.
				 */
				RESPONSE_CODE_NOT_FOUND: RESPONSE_CODE_NOT_FOUND,
				
				/**
				 * @const
				 * @memberOf ketaEventBusService
				 * @description Response code if request timed out.
				 */
				RESPONSE_CODE_TIMEOUT: RESPONSE_CODE_TIMEOUT,
				
				/**
				 * @const
				 * @memberOf ketaEventBusService
				 * @description Response code if auth token expired.
				 */
				RESPONSE_CODE_AUTH_TOKEN_EXPIRED: RESPONSE_CODE_AUTH_TOKEN_EXPIRED,
				
				/**
				 * @function
				 * @memberOf ketaEventBusService
				 * @description Get configured web socket URL.
				 * @returns {string} socketURL
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaEventBus) {
				 *         $scope.socketURL = ketaEventBus.getSocketURL();
				 *     });
				 */
				getSocketURL: function() {
					return config.socketURL;
				},
				
				/**
				 * @function
				 * @memberOf ketaEventBusService
				 * @description Get internal value of socket state.
				 * @returns {number} socketState
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaEventBus) {
				 *         // returns 0 for connecting, 1 for open, 2 for closing, 3 for closed, 4 for unknown
				 *         $scope.socketState = ketaEventBus.getSocketState();
				 *     });
				 */
				getSocketState: function() {
					return config.socketState;
				},
				
				/**
				 * @function
				 * @memberOf ketaEventBusService
				 * @description Get label of internal value of socket state.
				 * @returns {string}
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaEventBus) {
				 *         $scope.getSocketStateLabel = function() {
				 *             // returns 'connecting', 'open', 'closing', 'closed' or 'unknown'
				 *             return ketaEventBus.getSocketStateLabel();
				 *         };
				 *     });
				 */
				getSocketStateLabel: function() {
					return (angular.isDefined(STATE_LABELS[config.socketState])) ?
						STATE_LABELS[config.socketState] : STATE_LABELS[STATE_UNKNOWN];
				},
				
				/**
				 * @function
				 * @memberOf ketaEventBusService
				 * @description Check if auto connect is enabled.
				 * @returns {boolean} autoConnect
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaEventBus) {
				 *         $scope.autoConnectEnabled = function() {
				 *             return ketaEventBus.autoConnectEnabled();
				 *         };
				 *     });
				 * @example
				 * &lt;div data-ng-controller="exampleController"&gt;
				 *     &lt;p data-ng-show="autoConnectEnabled()"&gt;Auto connect on&lt;/p&gt;
				 *     &lt;p data-ng-hide="autoConnectEnabled()"&gt;Auto connect off&lt;/p&gt;
				 * &lt;/div&gt;
				 */
				autoConnectEnabled: function() {
					return config.autoConnect;
				},
				
				/**
				 * @function
				 * @memberOf ketaEventBusService
				 * @description Check if reconnect is enabled.
				 * @returns {boolean} reconnect
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaEventBus) {
				 *         $scope.reconnectEnabled = function() {
				 *             return ketaEventBus.reconnectEnabled();
				 *         };
				 *     });
				 * @example
				 * &lt;div data-ng-controller="exampleController"&gt;
				 *     &lt;p data-ng-show="reconnectEnabled()"&gt;Reconnect on&lt;/p&gt;
				 *     &lt;p data-ng-hide="reconnectEnabled()"&gt;Reconnect off&lt;/p&gt;
				 * &lt;/div&gt;
				 */
				reconnectEnabled: function() {
					return config.reconnect;
				},
				
				/**
				 * @function
				 * @memberOf ketaEventBusService
				 * @description Get reconnect timeout configured.
				 * @returns {number} reconnect timeout in seconds
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaEventBus) {
				 *         $scope.reconnectTimeout = ketaEventBus.getReconnectTimeout();
				 *     });
				 */
				getReconnectTimeout: function() {
					return config.reconnectTimeout;
				},
				
				/**
				 * @function
				 * @memberOf ketaEventBusService
				 * @description Check if mock mode is enabled.
				 * @returns {boolean} mockMode
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaEventBus) {
				 *         $scope.mockModeEnabled = function() {
				 *             return ketaEventBus.mockModeEnabled();
				 *         };
				 *     });
				 * @example
				 * &lt;div data-ng-controller="exampleController"&gt;
				 *     &lt;p data-ng-show="mockModeEnabled()"&gt;Mock mode on&lt;/p&gt;
				 *     &lt;p data-ng-hide="mockModeEnabled()"&gt;Mock mode off&lt;/p&gt;
				 * &lt;/div&gt;
				 */
				mockModeEnabled: function() {
					return config.mockMode;
				},
				
				/**
				 * @function
				 * @memberOf ketaEventBusService
				 * @description Check if debug mode is enabled.
				 * @returns {boolean} mockMode
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaEventBus) {
				 *         $scope.debugModeEnabled = function() {
				 *             return ketaEventBus.debugModeEnabled();
				 *         };
				 *     });
				 * @example
				 * &lt;div data-ng-controller="exampleController"&gt;
				 *     &lt;p data-ng-show="debugModeEnabled()"&gt;Debug mode on&lt;/p&gt;
				 *     &lt;p data-ng-hide="debugModeEnabled()"&gt;Debug mode off&lt;/p&gt;
				 * &lt;/div&gt;
				 */
				debugModeEnabled: function() {
					return config.debugMode;
				},
				
				/**
				 * @function
				 * @memberOf ketaEventBusService
				 * @description Get configuration object.
				 * @returns {object} config object
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaEventBus) {
				 *         $scope.config = ketaEventBus.getConfig();
				 *     });
				 */
				getConfig: that.getConfig,
				
				/**
				 * @function
				 * @memberOf ketaEventBusService
				 * @description Get mocked object.
				 * @returns {object} mocked object
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaEventBus) {
				 *         $scope.mocked = ketaEventBus.getMocked();
				 *     });
				 */
				getMocked: that.getMocked,
				
				/**
				 * @function
				 * @memberOf ketaEventBusService
				 * @description Get event bus object.
				 * @returns {object} event bus object
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaEventBus) {
				 *         $scope.eventBus = ketaEventBus.getEventBus();
				 *     });
				 */
				getEventBus: that.getEventBus,
				
				/**
				 * @function
				 * @memberOf ketaEventBusService
				 * @description Log pretty formatted data to dev tools console. Only enabled in debug mode.
				 * @see ketaEventBusProvider.enableDebugMode
				 * @param {string} headline headline printed in light grey
				 * @param {object} [data] data printed in dark grey
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaEventBus) {
				 *         ketaEventBus.log('ketaEventBus config', ketaEventBus.getConfig());
				 *     });
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaEventBus) {
				 *         ketaEventBus.log('simple log message');
				 *     });
				 */
				log: function(headline, data) {
					
					var logToConsole = function(headline, data) {
						console.log(
							'%c[' + new Date().toUTCString() + ']\n' + 
							'%c' + headline + '\n' + 
							'%c' + (angular.isDefined(data) ? JSON.stringify(data, null, 4) + '\n' : ''),
							'color:#acbf2f', 'color:#999', 'color:#333'
						);
					};
					
					if (config.debugMode) {
						if ((config.logFilter === null) ||
							(angular.isFunction(config.logFilter) && config.logFilter(headline, data))) {
							logToConsole(headline, data);
						}
					}
				},
				
				// VERT.X EVENT BUS STUB
				// ---------------------
				
				// socket states
				
				/**
				 * @const
				 * @memberOf ketaEventBusService
				 * @description State while connecting to web socket.
				 */
				STATE_CONNECTING: STATE_CONNECTING,
				
				/**
				 * @const
				 * @memberOf ketaEventBusService
				 * @description State while web socket is open.
				 */
				STATE_OPEN: STATE_OPEN,
				
				/**
				 * @const
				 * @memberOf ketaEventBusService
				 * @description State while closing web socket.
				 */
				STATE_CLOSING: STATE_CLOSING,
				
				/**
				 * @const
				 * @memberOf ketaEventBusService
				 * @description State while web socket is closed.
				 */
				STATE_CLOSED: STATE_CLOSED,
				
				/**
				 * @function
				 * @memberOf ketaEventBusService
				 * @description
				 * <p>
				 *   Open web socket connection to configured socket URL.
				 * </p>
				 * <p>
				 *   By default a generic open and close handler will be attached.
				 *   This means every handler registered via <i>registerOnOpenHandler</i> or
				 *   <i>registerOnCloseHandler</i> will be saved and called inside of generic handlers if
				 *   <i>onOpen</i> or <i>onClose</i> events occur.
				 * </p>
				 * <p>
				 *   If <i>autoConnect</i> is enabled no direct call to <i>ketaEventBus.open()</i> is necessary.
				 * </p>
				 * <p>
				 *   In mocked mode internal socket state is set to open immediately and open handler is called.
				 * </p>
				 * @see ketaEventBusProvider.enableAutoConnect
				 * @see ketaEventBusProvider.enableMockMode
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaEventBus) {
				 *         ketaEventBus.open();
				 *     });
				 */
				open: function() {
					
					if (config.socketState === STATE_CLOSED) {
						
						stub.log(SERVICE_NAME + '.open', stub.getConfig());
						
						if (!config.mockMode) {
							
							// establish web socket
							eventBus = new vertx.EventBus(config.socketURL);
							
							// register on open handler
							eventBus.onopen = openHandler;
							
							// register on close handler
							eventBus.onclose = closeHandler;
							
						} else {
							
							// set internal state to open
							config.socketState = STATE_OPEN;
							
							// call open handler
							openHandler();
							
						}
						
					}
					
				},
				
				/**
				 * @function
				 * @memberOf ketaEventBusService
				 * @description
				 * <p>
				 *   Close web socket connection.
				 * </p>
				 * <p>
				 *   In mocked mode internal socket state is set to closed immediately and close handler is called.
				 * </p>
				 * @see ketaEventBusProvider.enableMockMode
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaEventBus) {
				 *         ketaEventBus.close();
				 *     });
				 */
				close: function() {
					
					if (config.socketState === STATE_OPEN) {
						if (!config.mockMode) {
							
							// close web socket
							stub.getEventBus().close();
							
						} else {
							
							// set internal state to closed
							config.socketState = STATE_CLOSED;
							
							// call close handler
							closeHandler();
							
						}
					}
					
				},
				
				/**
				 * @function
				 * @memberOf ketaEventBusService
				 * @description
				 * <p>
				 *   Return state of web socket.
				 * </p>
				 * <p>
				 *   In mocked mode internal socket state is returned immediately.
				 * </p>
				 * @see ketaEventBusProvider.enableMockMode
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaEventBus) {
				 *         $scope.state = ketaEventBus.getState();
				 *     });
				 */
				getState: function() {
					
					var state = stub.getSocketState();
					
					if (!config.mockMode && stub.getEventBus()) {
						state = stub.getEventBus().readyState();
					}
					
					return state;
				},
				
				/**
				 * @function
				 * @memberOf ketaEventBusService
				 * @description
				 * <p>
				 *   Send message to given address and register response handler.
				 * </p>
				 * <p>
				 *   If access token has expired response code is 419, access token will be refreshed automatically and
				 *   request will be repeated. If access token could not be refreshed an error is thrown and the application halts.
				 * </p>
				 * <p>
				 *   In mocked mode registered responses are checked by matching given address and
				 *   mocked response is returned if one was found. Also a corresponding event will be
				 *   broadcasted if action within message matches registered actions of a listener.
				 * </p>
				 * @see ketaEventBusProvider.enableMockMode
				 * @param {string} address unique address on event bus
				 * @param {object} message message object to send
				 * @param {function} responseHandler handler to process response
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaEventBus) {
				 *         ketaEventBus.send('devices', {
				 *             action: 'getDevices'
				 *         }, function(response) {
				 *             ketaEventBus.log('ketaEventBus send reponse', response);
				 *         });
				 *     });
				 */
				send: function(address, message, responseHandler) {
					
					stub.log(SERVICE_NAME + '.send » request to ' + address + ':' + message.action, message);
					
					if (!config.mockMode && config.socketState === STATE_OPEN) {
						
						// inject access token
						message.accessToken = ketaAccessToken.get();
						
						var requestReturned = false;
						
						// start timeout
						$timeout(function() {
							if (!requestReturned && angular.isFunction(responseHandler)) {
								responseHandler({
									code: stub.RESPONSE_CODE_TIMEOUT,
									message: 'Response for ' + address + ':' + message.action + ' timed out'
								});
							}
						}, config.sendTimeout * 1000);
						
						// send message
						stub.getEventBus().send(address, message, function(reply) {
							
							requestReturned = true;
							
							if (reply.code === stub.RESPONSE_CODE_AUTH_TOKEN_EXPIRED) {
								
								// access token expired
								ketaAccessToken.refresh().then(function(response) {
									if (angular.isDefined(response.data.accessToken)) {
										ketaAccessToken.set(response.data.accessToken);
										stub.send(address, message, responseHandler);
									}
								}, function(error) {
									// TODO: process failure on refresh access token
									console.error(error);
								});
								
							} else {
								
								stub.log(SERVICE_NAME + '.send « response from ' + address + ':' + message.action, reply);
								
								// non-interceptable response code (200, 401, ...)
								if (angular.isFunction(responseHandler)) {
									responseHandler(reply);
								}
								
							}
							
						});
						
					} else {
						
						if (angular.isDefined(message.action) &&
							angular.isDefined(mocked.responses[address + ':' + message.action])) {
							
							// get response
							var response = mocked.responses[address + ':' + message.action](message);
							
							stub.log(SERVICE_NAME + '.send « response (mocked) from ' + address + ':' + message.action, response);
							
							// send mocked reply
							if (angular.isFunction(responseHandler)) {
								responseHandler(response);
							}
							
							// check mocked handlers
							matchMockHandler(message, response);
							
						} else {
							
							// if no mocked response was found send a 404 reply
							if (angular.isFunction(responseHandler)) {
								responseHandler({
									code: stub.RESPONSE_CODE_NOT_FOUND,
									message: 'No mocked response for ' + address + ':' + message.action + ' found'
								});
							}
							
						}
						
					}
					
				},
				
				/**
				 * @function
				 * @memberOf ketaEventBusService
				 * @description
				 * <p>
				 *   Publish message to given address.
				 * </p>
				 * <p>
				 *   In mocked mode nothing happens as there is no response handler for publishing messages.
				 * </p>
				 * @see ketaEventBusProvider.enableMockMode
				 * @param {string} address unique address on event bus
				 * @param {object} message message object to send
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaEventBus) {
				 *         ketaEventBus.publish('logger', {
				 *             action: 'log',
				 *             body: {
				 *                 message: 'log this'
				 *             }
				 *         });
				 *     });
				 */
				publish: function(address, message) {
					
					if (!config.mockMode && stub.getEventBus()) {
						
						// inject access token
						message.accessToken = ketaAccessToken.get();
						
						// send message
						stub.getEventBus().publish(address, message);
						
					}
					
				},
				
				/**
				 * @function
				 * @memberOf ketaEventBusService
				 * @description
				 * <p>
				 *   Register a handler with a universal unique identifier on event bus.
				 * </p>
				 * <p>
				 *   For mocked mode a third parameter exists, which defines actions the listener is responsible for.
				 *   The EventBusService holds a handler array internally in which handler UUID and actions are saved.
				 *   Inside <i>send</i> methods response handler a check is performed, if one of the registered actions
				 *   was received and in case of true the handler is called with a generated event message.
				 * </p>
				 * <p>
				 *   A handler UUID can be generated with <i>generateUUID</i>. Handler UUIDs are saved internally and
				 *   unregistered upon route changes.
				 * </p>
				 * @see ketaEventBusProvider.enableMockMode
				 * @see ketaEventBusService.send
				 * @see ketaEventBusService.generateUUID
				 * @param {string} uuid UUID on event bus
				 * @param {function} handler handler registered with UUID
				 * @param {string[]} [actions=[]] array of actions listener is responsible for
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaEventBus) {
				 *     
				 *         // generate handler uuid
				 *         var listenerUUID = ketaEventBus.generateUUID();
				 *     
				 *         // register bus handler with disabled mock mode
				 *         ketaEventBus.registerBusHandler(listenerUUID, function(message) {
				 *             ketaEventBus.log('ketaEventBus device set listener', message);
				 *         });
				 *         
				 *     });
				 * @example
				 * angular.module('exampleApp')
				 *     .config(function(EventBusProvider) {
				 *     
				 *         // enable mock mode
				 *         EventBusProvider.enableMockMode(true);
				 *         
				 *     })
				 *     .controller('exampleController', function(ketaEventBus) {
				 *     
				 *         // generate handler uuid
				 *         var listenerUUID = ketaEventBus.generateUUID();
				 *     
				 *         // register bus handler with enabled mock mode
				 *         ketaEventBus.registerBusHandler(listenerUUID, function(message) {
				 *             ketaEventBus.log('ketaEventBus device set listener', message);
				 *         }, ['createDevice', 'updateDevice', 'deleteDevice']);
				 *         
				 *     });
				 */
				registerBusHandler: function(uuid, handler, actions) {
					if (!config.mockMode && stub.getEventBus()) {
						stub.getEventBus().registerHandler(uuid, handler);
						busHandlers[uuid] = handler;
						stub.log(SERVICE_NAME + '.registerBusHandler ' + uuid);
					} else {
						if (!angular.isDefined(mocked.handlers[uuid])) {
							mocked.handlers[uuid] = {
								handler: handler,
								actions: actions
							};
							stub.log(SERVICE_NAME + '.registerBusHandler ' + uuid, mocked.handlers[uuid].actions);
						}
					}
				},
				
				/**
				 * @function
				 * @memberOf ketaEventBusService
				 * @description
				 * <p>
				 *   Unregister a handler with a universal unique identifier on event bus.
				 * </p>
				 * <p>
				 *   For mocked mode the internal handler list is updated by removing the specified handler with given UUID.
				 * </p>
				 * @see ketaEventBusProvider.enableMockMode
				 * @param {string} uuid UUID on event bus
				 * @param {function} handler handler registered with UUID
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaEventBus) {
				 *     
				 *         // generate handler uuid
				 *         var listenerUUID = ketaEventBus.generateUUID();
				 *         
				 *         // register bus handler with disabled mock mode
				 *         ketaEventBus.registerBusHandler(listenerUUID, function(message) {
				 *             ketaEventBus.log('ketaEventBus device set listener registered', message);
				 *         });
				 *     
				 *         // unregister bus handler with disabled mock mode
				 *         ketaEventBus.unregisterBusHandler(listenerUUID, function(message) {
				 *             ketaEventBus.log('ketaEventBus device set listener unregistered', message);
				 *         });
				 *         
				 *     });
				 */
				unregisterBusHandler: function(uuid, handler) {
					if (!config.mockMode && stub.getEventBus()) {
						stub.getEventBus().unregisterHandler(uuid, handler);
						stub.log(SERVICE_NAME + '.unregisterBusHandler ' + uuid);
					} else {
						if (angular.isDefined(mocked.handlers[uuid])) {
							var handlers = [];
							angular.forEach(mocked.handlers[uuid], function(h) {
								if (handler !== h) {
									handlers.push(h);
								}
							});
							mocked.handlers[uuid] = handlers;
							stub.log(SERVICE_NAME + '.unregisterBusHandler ' + uuid);
						} 
					}
				},
				
				/**
				 * @function
				 * @memberOf ketaEventBusService
				 * @description
				 * <p>
				 *   Register an event handler.
				 * </p>
				 * @see ketaEventBusService.EVENT_ON_OPEN
				 * @see ketaEventBusService.EVENT_ON_CLOSE
				 * @see ketaEventBusService.unregisterEventHandler
				 * @param {string} event event id
				 * @param {string} uuid UUID for internal list
				 * @param {function} handler handler registered with UUID
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaEventBus) {
				 *     
				 *         // generate handler uuids
				 *         var onOpenHandlerUUID = ketaEventBus.generateUUID();
				 *         var onCloseHandlerUUID = ketaEventBus.generateUUID();
				 *         
				 *         // register on open handler
				 *         ketaEventBus.registerOnOpenHandler(ketaEventBus.EVENT_ON_OPEN, onOpenHandlerUUID, function() {
				 *             ketaEventBus.log('ketaEventBus open');
				 *         });
				 *     
				 *         // register on close handler
				 *         ketaEventBus.registerOnCloseHandler(ketaEventBus.EVENT_ON_CLOSE, onCloseHandlerUUID, function() {
				 *             EventBus.log('ketaEventBus closed');
				 *         });
				 *         
				 *     });
				 */
				registerEventHandler: function(event, uuid, handler) {
					if (event === stub.EVENT_ON_OPEN) {
						if (!angular.isDefined(onOpenHandlers[uuid])) {
							onOpenHandlers[uuid] = handler;
						}
					}
					if (event === stub.EVENT_ON_CLOSE) {
						if (!angular.isDefined(onCloseHandlers[uuid])) {
							onCloseHandlers[uuid] = handler;
						}
					}
				},
				
				/**
				 * @function
				 * @memberOf ketaEventBusService
				 * @description
				 * <p>
				 *   Unregister an event handler.
				 * </p>
				 * @see ketaEventBusService.EVENT_ON_OPEN
				 * @see ketaEventBusService.EVENT_ON_CLOSE
				 * @see ketaEventBusService.registerEventHandler
				 * @param {string} event event id
				 * @param {string} uuid UUID for internal list
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaEventBus) {
				 *     
				 *         // generate handler uuids
				 *         var onOpenHandlerUUID = ketaEventBus.generateUUID();
				 *         var onCloseHandlerUUID = ketaEventBus.generateUUID();
				 *         
				 *         // register on open handler
				 *         ketaEventBus.registerOnOpenHandler(ketaEventBus.EVENT_ON_OPEN, onOpenHandlerUUID, function() {
				 *             ketaEventBus.log('ketaEventBus open');
				 *             ketaEventBus.unregisterOnOpenHandler(ketaEventBus.EVENT_ON_OPEN, onOpenHandlerUUID);
				 *         });
				 *     
				 *         // register on close handler
				 *         ketaEventBus.registerOnCloseHandler(ketaEventBus.EVENT_ON_CLOSE, onCloseHandlerUUID, function() {
				 *             ketaEventBus.log('ketaEventBus closed');
				 *             ketaEventBus.unregisterOnOpenHandler(ketaEventBus.EVENT_ON_CLOSE, onCloseHandlerUUID);
				 *         });
				 *         
				 *     });
				 */
				unregisterEventHandler: function(event, uuid) {
					if (event === stub.EVENT_ON_OPEN) {
						if (angular.isDefined(onOpenHandlers[uuid])) {
							delete onOpenHandlers[uuid];
						}
					}
					if (event === stub.EVENT_ON_CLOSE) {
						if (angular.isDefined(onCloseHandlers[uuid])) {
							delete onCloseHandlers[uuid];
						}
					}
				},
				
				/**
				 * @function
				 * @memberOf ketaEventBusService
				 * @description
				 * <p>
				 *   Generate an UUID for handler.
				 * </p>
				 * @returns {string} uuid
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaEventBus) {
				 *         var handlerUUID = ketaEventBus.generateUUID();
				 *     });
				 */
				generateUUID: function() {
					return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
						.replace(/[xy]/g, function(a, b) {
							return b = Math.random() * 16, (a === 'y' ? (b & 3 | 8) : (b | 0)).toString(16);
						});
				}
				
			};
			
			if (config.autoConnect) {
				stub.open();
			}
			
			return stub;
		};
		
	});

// source: components/services/tag.js
/**
 * @name keta.servicesTag
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014
 * @module keta.servicesTag
 * @description Tag Provider
 */
angular.module('keta.servicesTag', ['keta.servicesEventBus'])
	
	/**
	 * @class ketaTagProvider
	 * @propertyOf keta.servicesTag
	 * @description Tag Provider
	 */
	.provider('ketaTag', function() {
		
		/**
		 * @const
		 * @private
		 * @description Service endpoint for messages.
		 */
		var SERVICE_ENDPOINT = 'devices';
		
		/**
		 * @const
		 * @private
		 * @description Error message if an invalid sample rate was given.
		 */
		var ERROR_INVALID_SAMPLE_RATE = 'Invalid sample rate';
		
		/**
		 * @const
		 * @private
		 * @description Error message if an invalid handler was given.
		 */
		var ERROR_INVALID_HANDLER = 'Invalid handler';
		
		// return service API
		this.$get = function($q, ketaEventBus) {
			
			/**
			 * @private
			 * @function
			 * @description Return promise with given code and message.
			 * @param {string} message return message
			 * @param {boolean} [resolve=false] resolve or reject
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
			 * @class ketaTagService
			 * @propertyOf ketaTagProvider
			 * @description Tag Service
			 */
			var api = {
				
				/**
				 * @const
				 * @memberOf ketaTagService
				 * @description Error message if an invalid sample rate was given.
				 */
				ERROR_INVALID_SAMPLE_RATE: ERROR_INVALID_SAMPLE_RATE,
				
				/**
				 * @const
				 * @memberOf ketaTagService
				 * @description Error message if an invalid handler was given.
				 */
				ERROR_INVALID_HANDLER: ERROR_INVALID_HANDLER,
				
				/**
				 * @function
				 * @memberOf ketaTagService
				 * @description Register a tag value listener.
				 * @param {object} filter device filter (including tag names)
				 * @param {number} sampleRate sample rate in seconds (minimum 5)
				 * @param {function} handler tag value listener
				 * @returns {promise}
				 * @example
				 * angular.module('exampleApp', [])
				 *     .controller('ExampleController', function(ketaTag) {
				 *         ketaTag.registerListener({
				 *             tags: ['StateDevice', 'PowerOut'],
				 *             guid: $routeParams.deviceGuid
				 *         }, 5, function(message) {
				 *             ketaEventBus.log('tagValueListener', message);
				 *         });
				 *     });
				 */
				registerListener: function(filter, sampleRate, handler) {
					
					if (!angular.isNumber(sampleRate) || sampleRate < 5) {
						return responsePromise({
							code: ketaEventBus.RESPONSE_CODE_BAD_REQUEST,
							message: ERROR_INVALID_SAMPLE_RATE
						}, false);
					}
					
					if (!angular.isFunction(handler)) {
						return responsePromise({
							code: ketaEventBus.RESPONSE_CODE_BAD_REQUEST,
							message: ERROR_INVALID_HANDLER
						}, false);
					}
					
					var deferred = $q.defer();
					
					// generate UUID for listener
					var listenerUUID = 'CLIENT_' + ketaEventBus.generateUUID() + '_tagValueListener';
					
					// register handler for replyAddress
					ketaEventBus.registerBusHandler(listenerUUID, handler);
					
					// register listener for given address
					ketaEventBus.send(SERVICE_ENDPOINT, {
						action: 'registerTagValueListener',
						body: {
							deviceFilter: filter,
							sampleRate: sampleRate,
							replyAddress: listenerUUID
						}
					}, function(listenerResponse) {
						if (listenerResponse.code === ketaEventBus.RESPONSE_CODE_OK) {
							deferred.resolve(listenerResponse);
						} else {
							ketaEventBus.log(SERVICE_ENDPOINT + ':registerTagValueListener', listenerResponse.message);
							deferred.reject(listenerResponse.message);
						}
					});
					
					return deferred.promise;
					
				}
				
			};
			
			return api;
			
		};
		
	});
