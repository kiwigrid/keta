'use strict';

/**
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.Device
 * @description Device Provider
 */

angular.module('keta.services.Device',
	[
		'keta.services.EventBusDispatcher',
		'keta.services.EventBusManager',
		'keta.services.Logger'
	])

	.constant('ketaDeviceConstants', {
		STATE: {
			OK: 'OK',
			ERROR: 'ERROR',
			FATAL: 'FATAL'
		},
		// TODO: include full device class list
		CLASS: {
			ENERGY_MANAGER: 'com.kiwigrid.devices.em.EnergyManager',
			LOCATION: 'com.kiwigrid.devices.location.Location',
			PV_PLANT: 'com.kiwigrid.devices.pvplant.PVPlant'
		},
		// TODO: avoid constant duplication in a certain manner
		ICON: {
			'com.kiwigrid.devices.batteryconverter.BatteryConverter': 'kiwigrid-device-icon-battery-converter',
			'com.kiwigrid.devices.plug.Plug': 'kiwigrid-device-icon-plug',
			'com.kiwigrid.devices.powermeter.PowerMeter': 'kiwigrid-device-icon-plug',
			'com.kiwigrid.devices.windturbine.WindTurbine': 'kiwigrid-device-icon-wind-turbine',
			'com.kiwigrid.devices.sensor.TemperatureSensor': 'kiwigrid-device-icon-temperature-sensor',
			'com.kiwigrid.devices.inverter.Inverter': 'kiwigrid-device-icon-inverter',
			'com.kiwigrid.devices.heatpump.HeatPump': 'kiwigrid-device-icon-smart-heat-pump',
			'com.kiwigrid.devices.microchp.MicroChpSystem': 'kiwigrid-device-icon-micro-combined-heat-pump',
			'com.kiwigrid.devices.ripplecontrolreceiver.RippleControlReceiver':
				'kiwigrid-device-icon-ripple-control-receiver',
			'com.kiwigrid.devices.smartheatpumps.SmartHeatPumps': 'kiwigrid-device-icon-smart-heat-pump',
			'com.kiwigrid.devices.pvplant.PVPlant': 'kiwigrid-device-icon-pv-plant'
		}
	})

	/**
	 * @class ketaDeviceProvider
	 * @propertyOf keta.services.Device
	 * @description Device Provider
	 */
	.provider('ketaDevice', function DeviceProvider() {

		this.$get = function DeviceService($q, $log, ketaEventBusDispatcher, ketaEventBusManager) {

			/**
			 * @class DeviceInstance
			 * @propertyOf Device
			 * @description Device Instance
			 * @param {EventBus} givenEventBus eventBus to use for DeviceInstance
			 * @param {Object} properties Properties to inject into DeviceInstance
			 */
			var DeviceInstance = function(givenEventBus, properties) {

				// keep reference
				var that = this;

				// save EventBus instance
				var eventBus = givenEventBus;

				// populate properties
				angular.forEach(properties, function(value, key) {
					that[key] = value;

					// save copy under $pristine
					if (!angular.isDefined(that.$pristine)) {
						that.$pristine = {};
					}

					that.$pristine[key] = angular.copy(value);
				});

				// send message and return promise
				var sendMessage = function(message) {
					var deferred = $q.defer();

					ketaEventBusDispatcher.send(eventBus, 'deviceservice', message, function(reply) {

						// log if in debug mode
						if (ketaEventBusManager.inDebugMode()) {
							$log.request(['deviceservice', message, reply], $log.ADVANCED_FORMATTER);
						}

						if (reply.code === ketaEventBusDispatcher.RESPONSE_CODE_OK) {
							deferred.resolve(reply);
						} else {
							deferred.reject(reply);
						}

					});

					return deferred.promise;
				};

				var returnRejectedPromise = function(message) {
					var deferred = $q.defer();
					deferred.reject(message);
					return deferred.promise;
				};

				/**
				 * @name $update
				 * @function
				 * @description
				 * <p>
				 *   Updates a remote DeviceInstance from local one the method is called on.
				 * </p>
				 * <p>
				 *   Only value changes in <code>tagValues</code> property will be recognized as changes.
				 * </p>
				 * @returns {promise} promise
				 * @example
				 * angular.module('exampleApp', ['keta.services.Device'])
				 *     .controller('ExampleController', function(ketaDevice) {
				 *         var device = ketaDevice.create({
				 *             guid: 'guid',
				 *             tagValues: {
				 *                 IdName: {
				 *                     name: 'IdName',
				 *                     value: 'Device',
				 *                     oca: 0,
				 *                     timestamp: 123456789
				 *                 }
				 *             }
				 *         });
				 *         device.tagValues.IdName.value = 'Modified Device';
				 *         device.$update()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 *     });
				 */
				that.$update = function() {

					// TODO: verify if there are use cases where not only tag values are changed

					// collect changes in tagValues property
					var changes = {
						tagValues: {}
					};

					angular.forEach(that.tagValues, function(tagValue, tagName) {
						if (!angular.isDefined(that.$pristine.tagValues[tagName]) ||
							!angular.equals(that.tagValues[tagName].value, that.$pristine.tagValues[tagName].value)) {
							changes.tagValues[tagName] = {};
							changes.tagValues[tagName].value = tagValue.value;
							changes.tagValues[tagName].oca = tagValue.oca;
						}
					});

					if (Object.keys(changes.tagValues).length) {
						var deferred = $q.defer();

						sendMessage({
							action: 'mergeDevice',
							params: {
								deviceId: that.guid
							},
							body: changes
						}).then(function(reply) {

							// process reply
							if (angular.isDefined(reply.result) &&
								angular.isDefined(reply.result.value) &&
								angular.isDefined(reply.result.value.tagValues)) {

								angular.forEach(reply.result.value.tagValues, function(tag) {

									var failed =
										angular.isDefined(reply.result.value.failedTagValues) &&
										angular.isDefined(reply.result.value.failedTagValues[tag.tagName]);

									if (!failed) {

										// update tag values (e.g. OCA)
										that.tagValues[tag.tagName] = tag;

										// update $pristine copy
										that.$pristine.tagValues[tag.tagName] =
											angular.copy(that.tagValues[tag.tagName]);

									}

								});

							}

							deferred.resolve(reply);
						}, function(reply) {
							deferred.reject(reply);
						});

						return deferred.promise;
					}
					return returnRejectedPromise('No changes found');
				};

				/**
				 * @name $delete
				 * @function
				 * @description
				 * <p>
				 *   Deletes a remote DeviceInstance from local one the method is called on.
				 * </p>
				 * @returns {promise} promise
				 * @example
				 * angular.module('exampleApp', ['keta.services.Device'])
				 *     .controller('ExampleController', function(ketaDevice) {
				 *         var device = ketaDevice.create({
				 *             guid: 'guid'
				 *         });
				 *         device.$delete()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 *     });
				 */
				that.$delete = function() {
					return sendMessage({
						action: 'deleteDevice',
						params: {
							deviceId: that.guid
						}
					});
				};

				/**
				 * @name $reset
				 * @function
				 * @description
				 * <p>
				 *   Resets a DeviceInstance to it's $pristine state.
				 * </p>
				 * @returns {undefined} nothing
				 * @example
				 * angular.module('exampleApp', ['keta.services.Device'])
				 *     .controller('ExampleController', function(ketaDevice) {
				 *         var device = ketaDevice.create({
				 *             guid: 'guid',
				 *             tagValues: {
				 *                 IdName: {
				 *                     name: 'IdName',
				 *                     value: 'Device',
				 *                     oca: 0,
				 *                     timestamp: 123456789
				 *                 }
				 *             }
				 *         });
				 *         device.tagValues.IdName.value = 'Modified Device';
				 *         device.$update()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 device.$reset();
				 *             });
				 *     });
				 */
				that.$reset = function() {

					// remove everything beside methods and $pristine copy
					angular.forEach(that, function(value, key) {
						if (!angular.isFunction(value) && key !== '$pristine') {
							delete that[key];
						}
					});

					// add copies of $pristine values
					angular.forEach(that.$pristine, function(value, key) {
						that[key] = angular.copy(value);
					});

				};

			};

			/**
			 * @class Device
			 * @propertyOf DeviceProvider
			 * @description Device Service
			 */
			var api = {

				/**
				 * @name create
				 * @function
				 * @description
				 * <p>
				 *   Creates a DeviceInstance with given EventBus instance and properties.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance to use for communication
				 * @param {Object} properties Properties to set upon DeviceInstance creation
				 * @returns {DeviceInstance} DeviceInstance created
				 * @example
				 * angular.module('exampleApp', ['keta.services.Device'])
				 *     .controller('ExampleController', function(ketaDevice) {
				 *         var device = ketaDevice.create(eventBus, {
				 *             tagValues: {
				 *                 IdName: {
				 *                     name: 'IdName',
				 *                     value: 'Device',
				 *                     oca: 0,
				 *                     timestamp: 123456789
				 *                 }
				 *             }
				 *         });
				 *     });
				 */
				create: function(eventBus, properties) {
					return new DeviceInstance(eventBus, properties);
				}

			};

			return api;

		};

	});
