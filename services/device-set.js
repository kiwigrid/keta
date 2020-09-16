'use strict';

/**
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.DeviceSet
 * @description DeviceSet Provider
 */

angular.module('keta.services.DeviceSet',
	[
		'keta.services.Device',
		'keta.services.DeviceEvent',
		'keta.services.DeviceSetPollers'
	])

	/**
	 * @class ketaDeviceSetProvider
	 * @propertyOf keta.services.DeviceSet
	 * @description DeviceSet Provider
	 */
	.provider('ketaDeviceSet', function DeviceSetProvider() {

		var DEFAULT_OFFSET = 0;
		var DEFAULT_LIMIT = 50;
		var DEFAULT_POLL_INTERVAL_MILLISECONDS = 15000;

		this.$get = function DeviceSetService(
			$q, $rootScope, $log, $interval,
			ketaDevice, ketaDeviceEvent, ketaDeviceSetPollers, ketaEventBusDispatcher, ketaEventBusManager) {

			// api reference
			var api;

			/**
			 * @class DeviceSetInstance
			 * @propertyOf DeviceSetProvider
			 * @description DeviceSet Instance
			 * @param {EventBus} givenEventBus eventBus to use for DeviceSetInstance
			 */
			var DeviceSetInstance = function(givenEventBus) {

				// keep reference
				var that = this;

				// save EventBus instance
				var eventBus = givenEventBus;

				// internal params object
				var params = {};

				// automatically register device set listener
				var registerListener = false;

				// internal set object
				var set = {};

				/**
				 * @name filter
				 * @function
				 * @description
				 * <p>
				 *   Adds a filter before DeviceSet query is sent to EventBus.
				 * </p>
				 * @param {Object} filter filter to use
				 * @returns {DeviceSetInstance} DeviceSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(ketaDeviceSet) {
				 *         ketaDeviceSet.create(eventBus)
				 *             .filter({
				 *                 guid: 'guid'
				 *             })
				 *             .query()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 *     });
				 */
				that.filter = function(filter) {
					params.filter = filter;
					return that;
				};

				/**
				 * @name project
				 * @function
				 * @description
				 * <p>
				 *   Adds a projection before DeviceSet query is sent to EventBus.
				 * </p>
				 * @param {Object} projection projection to use
				 * @returns {DeviceSetInstance} DeviceSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(ketaDeviceSet) {
				 *         ketaDeviceSet.create(eventBus)
				 *             .project({
				 *                 guid: 1,
				 *                 tagValues: {
				 *                     IdName: 1
				 *                 }
				 *             })
				 *             .query()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 *     });
				 */
				that.project = function(projection) {
					params.projection = projection;
					return that;
				};

				/**
				 * @name sort
				 * @function
				 * @description
				 * <p>
				 *   Adds a sorting before DeviceSet query is sent to EventBus.
				 * </p>
				 * @param {Object} sorting sorting to use
				 * @returns {DeviceSetInstance} DeviceSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(ketaDeviceSet) {
				 *         ketaDeviceSet.create(eventBus)
				 *             .sort({
				 *                 'tagValue.IdName.value': 1
				 *             })
				 *             .query()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 *     });
				 */
				that.sort = function(sorting) {
					params.sorting = sorting;
					return that;
				};

				/**
				 * @name paginate
				 * @function
				 * @description
				 * <p>
				 *   Adds a pagination before DeviceSet query is sent to EventBus.
				 * </p>
				 * @param {Object} pagination pagination to use
				 * @returns {DeviceSetInstance} DeviceSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(ketaDeviceSet) {
				 *         ketaDeviceSet.create(eventBus)
				 *             .paginate({
				 *                 offset: 0,
				 *                 limit: 50
				 *             })
				 *             .query()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 *     });
				 */
				that.paginate = function(pagination) {
					if (angular.isDefined(pagination)) {
						params.offset = angular.isDefined(pagination.offset) ? pagination.offset : DEFAULT_OFFSET;
						params.limit = angular.isDefined(pagination.limit) ? pagination.limit : DEFAULT_LIMIT;
					} else {
						params.offset = DEFAULT_OFFSET;
						params.limit = DEFAULT_LIMIT;
					}
					return that;
				};

				/**
				 * @name live
				 * @function
				 * @description
				 * <p>
				 *   Adds live update capabilities by registering a DeviceSetListener.
				 * </p>
				 * @returns {promise} DeviceSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(ketaDeviceSet) {
				 *         ketaDeviceSet.create(eventBus)
				 *             .live()
				 *             .query()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 */
				that.live = function() {
					registerListener = true;
					return that;
				};

				var fetchDevices = function(replyProcessor) {
					ketaEventBusDispatcher.send(eventBus, 'deviceservice', {
						action: 'getDevices',
						params: params
					}, replyProcessor);
				};

				var logFetchQueryReply = function(reply) {
					$log.request(['deviceservice', {
						action: 'getDevices',
						params: params
					}, reply], $log.ADVANCED_FORMATTER);
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

				var addToStored = function(device) {
					api.sync(set, ketaDeviceEvent.create(ketaDeviceEvent.CREATED, device), eventBus);
				};

				var deleteFromStored = function(device) {
					api.sync(set, ketaDeviceEvent.create(ketaDeviceEvent.DELETED, device), eventBus);
				};

				var updateStored = function(device) {
					api.sync(set, ketaDeviceEvent.create(ketaDeviceEvent.UPDATED, device), eventBus);
				};

				var synchroniseChangesToStoredDevices = function(fetchQueryReply) {
					var currentDevices = api.getAll(set)
						.slice()
						.sort(compareGuids);
					var fetchedDevices = api.getAll(fetchQueryReply)
						.sort(compareGuids);

					var c = 0;
					var f = 0;
					while (c < currentDevices.length && f < fetchedDevices.length) {
						if (currentDevices[c].guid < fetchedDevices[f].guid) {
							deleteFromStored(currentDevices[c]);
							c++;
						} else if (currentDevices[c].guid > fetchedDevices[f].guid) {
							addToStored(fetchedDevices[f]);
							f++;
						} else if (!angular.equals(currentDevices[c], fetchedDevices[f])) {
							updateStored(fetchedDevices[f]);
							c++;
							f++;
						} else {
							c++;
							f++;
						}
					}
					for (; c < currentDevices.length; c++) {
						deleteFromStored(currentDevices[c]);
					}
					for (; f < fetchedDevices.length; f++) {
						addToStored(fetchedDevices[f]);
					}
				};

				var fetchAndStoreDevices = function() {
					fetchDevices(function(reply) {
						if (!reply || reply.code !== ketaEventBusDispatcher.RESPONSE_CODE_OK) {
							logFetchQueryReply(reply);
							return;
						}

						synchroniseChangesToStoredDevices(reply);

						if (ketaEventBusManager.inDebugMode()) {
							logFetchQueryReply(reply);
						}
					});
				};

				var storeAndReturnFetchedDevices = function(queryReply, deferredResult) {
					if (!queryReply) {
						deferredResult.reject('Something bad happened. Got no reply.');
						return;
					}

					queryReply.params = params;
					if (queryReply.code !== ketaEventBusDispatcher.RESPONSE_CODE_OK) {
						deferredResult.reject(queryReply);
						return;
					}

					if (angular.isDefined(queryReply.result) &&
						angular.isDefined(queryReply.result.items)) {
						angular.forEach(queryReply.result.items, function(item, index) {
							queryReply.result.items[index] = ketaDevice.create(eventBus, item);
						});
						set = queryReply;
					} else {
						set = {};
					}

					if (ketaEventBusManager.inDebugMode()) {
						logFetchQueryReply(queryReply);
					}

					deferredResult.resolve(queryReply);
					$rootScope.$digest();
				};

				/**
				 * @name query
				 * @function
				 * @description
				 * <p>
				 *   Finally executes DeviceSet query by sending it to the associated EventBus instance.
				 * </p>
				 * @returns {promise} Promise which is resolved when query is returned
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(ketaDeviceSet) {
				 *         ketaDeviceSet.create(eventBus)
				 *             .query()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 *     });
				 */
				that.query = function() {
					if (registerListener) {
						// The listener functionality will be removed, so it is replaced with polling
						// here in order not to break the apps using KETA
						var poller = $interval(fetchAndStoreDevices, DEFAULT_POLL_INTERVAL_MILLISECONDS);
						ketaDeviceSetPollers.add(poller);
					}

					var deferred = $q.defer();
					fetchDevices(function(reply) {
						storeAndReturnFetchedDevices(reply, deferred);
					});
					return deferred.promise;
				};

			};

			/**
			 * @class DeviceSet
			 * @propertyOf DeviceSetProvider
			 * @description DeviceSet Service
			 */
			api = {

				/**
				 * @name create
				 * @function
				 * @description
				 * <p>
				 *   Creates a DeviceSetInstance with given EventBus instance.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance to use for communication
				 * @returns {DeviceSetInstance} DeviceSetInstance created
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(ketaDeviceSet) {
				 *         var deviceSet = ketaDeviceSet.create(eventBus);
				 *     });
				 */
				create: function(eventBus) {
					return new DeviceSetInstance(eventBus);
				},

				/**
				 * @name indexOf
				 * @function
				 * @description
				 * <p>
				 *   Returns index of given Device in DeviceSet by comparing GUIDs.
				 * </p>
				 * @param {DeviceSetInstance} set DeviceSetInstance to search in
				 * @param {DeviceInstance} device DeviceInstance to search for
				 * @returns {number} index
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(ketaDeviceSet) {
				 *         ketaDeviceSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 // index equals 0 after the call
				 *                 var index = ketaDeviceSet.indexOf(reply, reply.result.items[0]);
				 *             });
				 *     });
				 */
				indexOf: function(set, device) {
					var index = -1;
					if (angular.isDefined(set.result) &&
						angular.isDefined(set.result.items)) {
						angular.forEach(set.result.items, function(item, key) {
							if (item.guid === device.guid) {
								index = key;
							}
						});
					}
					return index;
				},

				/**
				 * @name length
				 * @function
				 * @description
				 * <p>
				 *   Returns number of devices in given DeviceSet.
				 * </p>
				 * @param {DeviceSetInstance} set DeviceSetInstance to search in
				 * @returns {number} number of devices
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(ketaDeviceSet) {
				 *         ketaDeviceSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 // length equals number of devices in DeviceSet
				 *                 var length = ketaDeviceSet.length(reply);
				 *             });
				 *     });
				 */
				length: function(set) {
					var length =
						angular.isDefined(set.result) &&
						angular.isDefined(set.result.items) &&
						angular.isArray(set.result.items) ? set.result.items.length : 0;
					return length;
				},

				/**
				 * @name get
				 * @function
				 * @description
				 * <p>
				 *   Returns device in given DeviceSet by specified index.
				 * </p>
				 * @param {DeviceSetInstance} set DeviceSetInstance to search in
				 * @param {number} index Index of device to return
				 * @returns {DeviceInstance} DeviceInstance retrieved from set
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(ketaDeviceSet) {
				 *         ketaDeviceSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 // device equals first item after the call
				 *                 var device = ketaDeviceSet.get(reply, 0);
				 *             });
				 *     });
				 */
				get: function(set, index) {
					var device =
						angular.isDefined(set.result) &&
						angular.isDefined(set.result.items) &&
						angular.isDefined(set.result.items[index]) ? set.result.items[index] : null;
					return device;
				},

				/**
				 * @name getAll
				 * @function
				 * @description
				 * <p>
				 *   Returns all devices in given DeviceSet.
				 * </p>
				 * @param {DeviceSetInstance} set DeviceSetInstance to search in
				 * @returns {Array} All DeviceInstances retrieved from set
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(ketaDeviceSet) {
				 *         ketaDeviceSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 var devices = ketaDeviceSet.getAll(reply);
				 *             });
				 *     });
				 */
				getAll: function(set) {
					var devices =
						angular.isDefined(set.result) &&
						angular.isDefined(set.result.items) ? set.result.items : [];
					return devices;
				},

				/**
				 * @name sync
				 * @function
				 * @description
				 * <p>
				 *   Synchronizes given DeviceSet with given DeviceEvent.
				 * </p>
				 * @param {DeviceSetInstance} set DeviceSetInstance to sync
				 * @param {DeviceEventInstance} event DeviceEventInstance to process
				 * @param {EventBus} eventBus EventBus instance to use for communication
				 * @returns {void} returns nothing
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(ketaDeviceSet, ketaDeviceEvent, ketaDevice) {
				 *         ketaDeviceSet.sync(
				 *             ketaDeviceSet.create().query(),
				 *             ketaDeviceEvent.create({
				 *                 type: ketaDeviceEvent.CREATED,
				 *                 device: ketaDevice.create(eventBus, {
				 *                     guid: 'guid'
				 *                 });
				 *             });
				 *         );
				 *     });
				 */
				sync: function(set, event, eventBus) {

					var modified = false;
					var device = ketaDevice.create(eventBus, event.getDevice());

					if (event.getType() === ketaDeviceEvent.CREATED) {
						set.result.items.push(device);
						modified = true;
					} else if (event.getType() === ketaDeviceEvent.DELETED) {
						set.result.items.splice(api.indexOf(set, device), 1);
						modified = true;
					} else if (event.getType() === ketaDeviceEvent.UPDATED) {
						var index = api.indexOf(set, device);
						if (index !== -1) {
							angular.extend(api.get(set, index), device);
							modified = true;
						}
					}

					// trigger scope digest if anything was modified and not automatically triggered
					if (modified && !$rootScope.$$phase) {
						$rootScope.$apply();
					}

				}

			};

			return api;

		};

	});
