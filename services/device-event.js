'use strict';

/**
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.DeviceEvent
 * @description DeviceEvent Provider
 */

angular.module('keta.services.DeviceEvent', [])

	/**
	 * @class ketaDeviceEventProvider
	 * @propertyOf keta.services.DeviceEvent
	 * @description DeviceEvent Provider
	 */
	.provider('ketaDeviceEvent', function DeviceEventProvider() {

		this.$get = function DeviceEventService() {

			/**
			 * @class DeviceEventInstance
			 * @propertyOf DeviceEvent
			 * @description DeviceEvent Instance
			 * @param {string} givenType DeviceEvent type
			 * @param {DeviceInstance} givenDevice DeviceInstance to be affected by event
			 */
			var DeviceEventInstance = function(givenType, givenDevice) {

				// keep reference
				var that = this;

				// internal DeviceEvent type
				var type = givenType;

				/**
				 * @name getType
				 * @function
				 * @description
				 * <p>
				 *   Returns type of DeviceEvent.
				 * </p>
				 * @returns {string} type
				 * @example
				 * angular.module('exampleApp', ['keta.services.Device', 'keta.services.DeviceEvent'])
				 *     .controller('ExampleController', function(ketaDevice, ketaDeviceEvent) {
				 *         var device = ketaDevice.create({
				 *             guid: 'guid'
				 *         });
				 *         var deviceEvent = ketaDeviceEvent.create(ketaDeviceEvent.TYPE_CREATED, device);
				 *         var deviceEventType = deviceEvent.getType();
				 *     });
				 */
				that.getType = function() {
					return type;
				};

				// internal DeviceEvent device
				var device = givenDevice;

				/**
				 * @name getDevice
				 * @function
				 * @description
				 * <p>
				 *   Returns device of DeviceEvent.
				 * </p>
				 * @returns {DeviceInstance} device
				 * @example
				 * angular.module('exampleApp', ['keta.services.Device', 'keta.services.DeviceEvent'])
				 *     .controller('ExampleController', function(ketaDevice, ketaDeviceEvent) {
				 *         var device = ketaDevice.create({
				 *             guid: 'guid'
				 *         });
				 *         var deviceEvent = ketaDeviceEvent.create(ketaDeviceEvent.TYPE_CREATED, device);
				 *         var deviceEventDevice = deviceEvent.getDevice();
				 *     });
				 */
				that.getDevice = function() {
					return device;
				};

			};

			/**
			 * @class DeviceEvent
			 * @propertyOf DeviceEventProvider
			 * @description DeviceEvent Service
			 */
			var api = {

				/**
				 * @name CREATED
				 * @constant
				 * @description
				 * <p>
				 *   Type for created event.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceEvent'])
				 *     .controller('ExampleController', function(ketaDeviceEvent) {
				 *         if (type === ketaDeviceEvent.CREATED) {
				 *             // ...
				 *         }
				 *     });
				 */
				CREATED: 'CREATED',

				/**
				 * @name UPDATED
				 * @constant
				 * @description
				 * <p>
				 *   Type for updated event.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceEvent'])
				 *     .controller('ExampleController', function(ketaDeviceEvent) {
				 *         if (type === ketaDeviceEvent.UPDATED) {
				 *             // ...
				 *         }
				 *     });
				 */
				UPDATED: 'UPDATED',

				/**
				 * @name DELETED
				 * @constant
				 * @description
				 * <p>
				 *   Type for deleted event.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceEvent'])
				 *     .controller('ExampleController', function(ketaDeviceEvent) {
				 *         if (type === ketaDeviceEvent.DELETED) {
				 *             // ...
				 *         }
				 *     });
				 */
				DELETED: 'DELETED',

				/**
				 * @name create
				 * @function
				 * @description
				 * <p>
				 *   Creates a DeviceEventInstance with given type and Device instance.
				 * </p>
				 * @param {string} type DeviceEvent type
				 * @param {DeviceInstance} device Device instance
				 * @returns {DeviceEventInstance} DeviceEventInstance created
				 * @example
				 * angular.module('exampleApp', ['keta.services.Device', 'keta.services.DeviceEvent'])
				 *     .controller('ExampleController', function(ketaDevice, ketaDeviceEvent) {
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
				 *         var deviceEvent = ketaDeviceEvent.create(DeviceEvent.TYPE_CREATED, device);
				 *     });
				 */
				create: function(type, device) {
					return new DeviceEventInstance(type, device);
				}

			};

			return api;

		};

	});
