'use strict';

/**
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.Application
 * @description Application Provider
 */

angular.module('keta.services.Application',
	[
		'keta.services.EventBusDispatcher',
		'keta.services.EventBusManager',
		'keta.services.Logger'
	])

	/**
	 * @class ketaApplicationProvider
	 * @propertyOf keta.services.Application
	 * @description Application Provider
	 */
	.provider('ketaApplication', function ApplicationProvider() {

		this.$get = function ApplicationService() {

			/**
			 * @class ApplicationInstance
			 * @propertyOf Application
			 * @description Application Instance
			 * @param {EventBus} givenEventBus eventBus to use for ApplicationInstance
			 * @param {Object} properties Properties to inject into ApplicationInstance
			 */
			var ApplicationInstance = function(givenEventBus, properties) {

				// keep reference
				var that = this;

				// save EventBus instance
				// var eventBus = givenEventBus;

				// populate properties
				angular.forEach(properties, function(value, key) {
					that[key] = value;

					// save copy under $pristine
					if (!angular.isDefined(that.$pristine)) {
						that.$pristine = {};
					}

					that.$pristine[key] = angular.copy(value);
				});

			};

			/**
			 * @class ketaApplication
			 * @propertyOf ApplicationProvider
			 * @description Application Service
			 */
			var api = {

				/**
				 * @name create
				 * @function
				 * @description
				 * <p>
				 *   Creates an ApplicationInstance with given EventBus instance and properties.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance to use for communication
				 * @param {Object} properties Properties to set upon UserInstance creation
				 * @returns {ApplicationInstance} ApplicationInstance created
				 * @example
				 * angular.module('exampleApp', ['keta.services.Application'])
				 *     .controller('ExampleController', function(ketaApplication) {
				 *         var application = ketaApplication.create(eventBus, {
				 *             appId: 'company.app',
				 *             entryUri: 'https://...',
				 *             redirectUri: 'https://...',
				 *             iconUri: 'https://...',
				 *             names: {
				 *                 en: 'Company App',
				 *                 de: 'Firmenanwendung'
				 *             }
				 *         });
				 *     });
				 */
				create: function(eventBus, properties) {
					return new ApplicationInstance(eventBus, properties);
				}

			};

			return api;

		};

	});
