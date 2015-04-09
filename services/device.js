'use strict';

/**
 * @name keta.services.Device
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

	/**
	 * @class DeviceProvider
	 * @propertyOf keta.services.Device
	 * @description Device Provider
	 */
	.provider('Device', function DeviceProvider() {

		this.$get = function DeviceService($q, $log, EventBusDispatcher, EventBusManager) {

			// find device class recursively
			var findDeviceClass = function(deviceModel, deviceClassesArray) {
				if (angular.isDefined(deviceModel) && angular.isDefined(deviceModel.deviceClass)) {
					var parts = deviceModel.deviceClass.split('~');
					deviceClassesArray.push({
						deviceClass: parts[0],
						version: parts[1]
					});
					if (angular.isDefined(deviceModel.superclasses) &&
						angular.isArray(deviceModel.superclasses) &&
						deviceModel.superclasses.length > 0) {
						angular.forEach(deviceModel.superclasses, function(superclass) {
							findDeviceClass(superclass, deviceClassesArray);
						});
					}
				}
				return deviceClassesArray;
			};

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

					EventBusDispatcher.send(eventBus, 'deviceservice', message, function(reply) {

						// log if in debug mode
						if (EventBusManager.inDebugMode()) {
							$log.request([message, reply], $log.ADVANCED_FORMATTER);
						}

						if (reply.code === EventBusDispatcher.RESPONSE_CODE_OK) {
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
				 * @memberOf DeviceInstance
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
				 *     .controller('ExampleController', function(Device) {
				 *         var device = Device.create({
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

							// update $pristine copies after success
							angular.forEach(that.$pristine, function(value, key) {
								that.$pristine[key] = angular.copy(that[key]);
							});

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
				 * @memberOf DeviceInstance
				 * @description
				 * <p>
				 *   Deletes a remote DeviceInstance from local one the method is called on.
				 * </p>
				 * @returns {promise} promise
				 * @example
				 * angular.module('exampleApp', ['keta.services.Device'])
				 *     .controller('ExampleController', function(Device) {
				 *         var device = Device.create({
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

			};

			/**
			 * @class Device
			 * @propertyOf DeviceProvider
			 * @description Device Service
			 */
			var api = {

				/**
				 * @function
				 * @memberOf Device
				 * @description
				 * <p>
				 *   Creates a DeviceInstance with given EventBus instance and properties.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance to use for communication
				 * @param {Object} properties Properties to set upon DeviceInstance creation
				 * @returns {DeviceInstance} DeviceInstance created
				 * @example
				 * angular.module('exampleApp', ['keta.services.Device'])
				 *     .controller('ExampleController', function(Device) {
				 *         var device = Device.create(eventBus, {
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
				},

				/**
				 * @function
				 * @memberOf Device
				 * @description
				 * <p>
				 *   Returns a device-classes array of objects containing the <code>deviceClass</code> and
				 *   <code>version</code> as separate keys.
				 *   The first entry is the most specific class followed by its superclasses (if there are any).
				 *   The highest array-index represents the most general device-class for this device.
				 * </p>
				 * <p>
				 *   The returned array can be used to map the device-class to a device-icon.<br>
				 *   A default-mapping is provided by <code>ketaSharedConfig.DEVICE_ICON_MAP</code>.
				 *   So every application can use another mapping if the default-one is not suitable.
				 * </p>
				 * @param {DeviceInstance} device Device to get device classes from
				 * @returns {Array} deviceClasses
				 * @example
				 * angular.module('exampleApp', ['keta.services.Device'])
				 *     .controller('ExampleController', function(Device) {
				 *         var device = Device.create({
				 *             guid: 'guid',
				 *             deviceModel: {
				 *                 deviceClass: 'specificDeviceClass~1.1.0.3',
				 *                 superclasses: [{
				 *                     deviceClass: 'generalDeviceClass~1.1.0.3',
				 *                     superclasses: []
				 *                 }]
				 *             }
				 *         });
				 *         var deviceClassesArray = Device.getDeviceClasses(device);
				 *     });
				 */
				getDeviceClasses: function(device) {
					var deviceClasses = [];
					if (angular.isDefined(device.deviceModel)) {
						deviceClasses = findDeviceClass(device.deviceModel, deviceClasses);
					}
					return deviceClasses;
				}

			};

			return api;

		};

	});
