'use strict';

/**
 * @name keta.services.DeviceSet
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014
 * @module keta.services.DeviceSet
 * @description DeviceSet Provider
 */
angular.module('keta.services.DeviceSet',
	[
		'keta.services.Device',
		'keta.services.DeviceEvent'
	])

	/**
	 * @class DeviceSetProvider
	 * @propertyOf keta.services.DeviceSet
	 * @description DeviceSet Provider
	 */
	.provider('DeviceSet', function DeviceSetProvider() {

		this.$get = function DeviceSetService(
			$q, $rootScope, $log,
			Device, DeviceEvent, EventBusDispatcher, EventBusManager) {

			/**
			 * @class DeviceSetInstance
			 * @propertyOf DeviceSetProvider
			 * @description DeviceSet Instance
			 */
			var DeviceSetInstance = function(givenEventBus) {

				// keep reference
				var that = this;

				// save EventBus instance
				var eventBus = givenEventBus;

				// internal params object
				var params = {};

				// internal set object
				var set = {};

				/**
				 * @name filter
				 * @function
				 * @memberOf DeviceSetInstance
				 * @description
				 * <p>
				 *   Adds a filter before DeviceSet query is sent to EventBus.
				 * </p>
				 * @param {Object} filter filter to use
				 * @returns {DeviceSetInstance}
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(DeviceSet) {
				 *         DeviceSet.create(eventBus)
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
				 * @memberOf DeviceSetInstance
				 * @description
				 * <p>
				 *   Adds a projection before DeviceSet query is sent to EventBus.
				 * </p>
				 * @param {Object} projection projection to use
				 * @returns {DeviceSetInstance}
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(DeviceSet) {
				 *         DeviceSet.create(eventBus)
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
				 * @memberOf DeviceSetInstance
				 * @description
				 * <p>
				 *   Adds a sorting before DeviceSet query is sent to EventBus.
				 * </p>
				 * @param {Object} sorting sorting to use
				 * @returns {DeviceSetInstance}
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(DeviceSet) {
				 *         DeviceSet.create(eventBus)
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
				 * @memberOf DeviceSetInstance
				 * @description
				 * <p>
				 *   Adds a pagination before DeviceSet query is sent to EventBus.
				 * </p>
				 * @param {Object} pagination pagination to use
				 * @returns {DeviceSetInstance}
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(DeviceSet) {
				 *         DeviceSet.create(eventBus)
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
						if (angular.isDefined(pagination.offset)) {
							params.offset = pagination.offset;
						}
						if (angular.isDefined(pagination.limit)) {
							params.limit = pagination.limit;
						}
					}
					return that;
				};

				/**
				 * @name live
				 * @function
				 * @memberOf DeviceSetInstance
				 * @description
				 * <p>
				 *   Adds live update capabilities by registering a DeviceSetListener.
				 * </p>
				 * @returns {promise}
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(DeviceSet) {
				 *         DeviceSet.create(eventBus)
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

					// generate UUID
					var liveHandlerUUID = 'CLIENT_' + EventBusDispatcher.generateUUID();

					// register handler under created UUID
					EventBusDispatcher.registerHandler(eventBus, liveHandlerUUID, function(event) {

						// process event using sync
						api.sync(set, DeviceEvent.create(event.type, event.value));

						// log if in debug mode
						if (EventBusManager.inDebugMode()) {
							$log.event([event], $log.ADVANCED_FORMATTER);
						}

					});

					// register device set listener
					EventBusDispatcher.send(eventBus, 'devices', {
						action: 'registerDeviceSetListener',
						body: {
							deviceFilter: params.filter,
							deviceProjection: params.projection,
							replyAddress: liveHandlerUUID
						}
					}, function(reply) {
						// log if in debug mode
						if (EventBusManager.inDebugMode()) {
							$log.request([{
								action: 'registerDeviceSetListener',
								body: {
									deviceFilter: params.filter,
									deviceProjection: params.projection,
									replyAddress: liveHandlerUUID
								}
							}, reply], $log.ADVANCED_FORMATTER);
						}
					});

					return that;
				};

				/**
				 * @name query
				 * @function
				 * @memberOf DeviceSetInstance
				 * @description
				 * <p>
				 *   Finally executes DeviceSet query by sending it to the associated EventBus instance.
				 * </p>
				 * @returns {promise}
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(DeviceSet) {
				 *         DeviceSet.create(eventBus)
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
					var deferred = $q.defer();

					EventBusDispatcher.send(eventBus, 'devices', {
						action: 'getDevices',
						params: params
					}, function(reply) {
						if (reply) {
							// inject used params
							reply.params = params;

							if (reply.code === 200) {

								// create DeviceInstances
								if (angular.isDefined(reply.result) &&
									angular.isDefined(reply.result.items)) {
									angular.forEach(reply.result.items, function(item, index) {
										reply.result.items[index] = Device.create(eventBus, item);
									});
									set = reply;
								} else {
									set = {};
								}

								// log if in debug mode
								if (EventBusManager.inDebugMode()) {
									$log.request([{
										action: 'getDevices',
										params: params
									}, reply], $log.ADVANCED_FORMATTER);
								}

								deferred.resolve(reply);
								$rootScope.$digest();

							} else {
								deferred.reject(reply);
							}
						} else {
							deferred.reject('Something bad happened. Got no reply.');
						}
					});

					return deferred.promise;
				};

			};

			/**
			 * @class DeviceSet
			 * @propertyOf DeviceSetProvider
			 * @description DeviceSet Service
			 */
			var api = {

				/**
				 * @function
				 * @memberOf DeviceSet
				 * @description
				 * <p>
				 *   Creates a DeviceSetInstance with given EventBus instance.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance to use for communication
				 * @returns {DeviceSetInstance}
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(DeviceSet) {
				 *         var deviceSet = DeviceSet.create(eventBus);
				 *     });
				 */
				create: function(eventBus) {
					return new DeviceSetInstance(eventBus);
				},

				/**
				 * @function
				 * @memberOf DeviceSet
				 * @description
				 * <p>
				 *   Returns index of given Device in DeviceSet by comparing GUIDs.
				 * </p>
				 * @param {DeviceSetInstance} set DeviceSetInstance to search in
				 * @param {DeviceInstance} device DeviceInstance to search for
				 * @returns {number} index
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(DeviceSet) {
				 *         DeviceSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 // index equals 0 after the call
				 *                 var index = DeviceSet.indexOf(reply, reply.result.items[0]);
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
				 * @function
				 * @memberOf DeviceSet
				 * @description
				 * <p>
				 *   Returns number of devices in given DeviceSet.
				 * </p>
				 * @param {DeviceSetInstance} set DeviceSetInstance to search in
				 * @returns {number} number of devices
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(DeviceSet) {
				 *         DeviceSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 // length equals number of devices in DeviceSet
				 *                 var length = DeviceSet.length(reply);
				 *             });
				 *     });
				 */
				length: function(set) {
					return (angular.isDefined(set.result.items)) ? set.result.items.length : 0;
				},

				/**
				 * @function
				 * @memberOf DeviceSet
				 * @description
				 * <p>
				 *   Returns device in given DeviceSet by specified index.
				 * </p>
				 * @param {DeviceSetInstance} set DeviceSetInstance to search in
				 * @param {number} index Index of device to return
				 * @returns {DeviceInstance}
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(DeviceSet) {
				 *         DeviceSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 // device equals first item after the call
				 *                 var device = DeviceSet.get(reply, 0);
				 *             });
				 *     });
				 */
				get: function(set, index) {
					return (angular.isDefined(set.result.items[index])) ? set.result.items[index] : null;
				},

				/**
				 * @function
				 * @memberOf DeviceSet
				 * @description
				 * <p>
				 *   Returns all devices in given DeviceSet.
				 * </p>
				 * @param {DeviceSetInstance} set DeviceSetInstance to search in
				 * @returns {Array}
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(DeviceSet) {
				 *         DeviceSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 var devices = DeviceSet.getAll(reply);
				 *             });
				 *     });
				 */
				getAll: function(set) {
					return (angular.isDefined(set.result.items)) ? set.result.items : [];
				},

				/**
				 * @function
				 * @memberOf DeviceSet
				 * @description
				 * <p>
				 *   Synchronizes given DeviceSet with given DeviceEvent.
				 * </p>
				 * @param {DeviceSetInstance} set DeviceSetInstance to sync
				 * @param {DeviceEventInstance} event DeviceEventInstance to process
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(DeviceSet) {
				 *         DeviceSet.sync(
				 *             DeviceSet.create().query(),
				 *             DeviceEvent.create({
				 *                 type: DeviceEvent.CREATED,
				 *                 device: Device.create(eventBus, {
				 *                     guid: 'guid'
				 *                 })
				 *             })
				 *         );
				 *     });
				 */
				sync: function(set, event) {

					var modified = false;

					if (event.getType() === DeviceEvent.CREATED) {
						set.result.items.push(event.getDevice());
						modified = true;
					} else if (event.getType() === DeviceEvent.DELETED) {
						set.result.items.splice(api.indexOf(set, event.getDevice()), 1);
						modified = true;
					} else if (event.getType() === DeviceEvent.UPDATED) {
						var index = api.indexOf(set, event.getDevice());
						if (index !== -1) {
							angular.extend(api.get(set, index), event.getDevice());
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
