'use strict';

/**
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.EventBus
 * @description EventBus Provider
 */

angular.module('keta.services.EventBus', [])

	/**
	 * @class ketaEventBusProvider
	 * @propertyOf keta.services.EventBus
	 * @description EventBus Provider
	 */
	.provider('ketaEventBus', function EventBusProvider() {

		/**
		 * @class ketaEventBus
		 * @propertyOf keta.services.EventBus
		 * @description EventBus Instance
		 * @param {Object} givenConfig Config to use for EventBus
		 */
		var KetaEventBus = function KetaEventBus(givenConfig) {

			/**
			 * @private
			 * @description Default config for EventBus instances.
			 */
			var DEFAULT_CONFIG = {
				id: 'kiwibus',
				url: 'https://localhost:10443/kiwibus',
				reconnect: true,
				reconnectTimeout: 5,
				requestTimeout: 10,
				offlineMode: false
			};

			/**
			 * @name getDefaultConfig
			 * @function
			 * @description
			 * <p>
			 *   Returns default config used to merge in EventBus instance create method.
			 * </p>
			 * @returns {Object} default configuration
			 * @example
			 * angular.module('exampleApp', ['keta.services.EventBus'])
			 *     .controller('ExampleController', function(ketaEventBus) {
			 *         var defaultConfig = ketaEventBus.getDefaultConfig();
			 *     });
			 */
			this.getDefaultConfig = function() {
				return DEFAULT_CONFIG;
			};

			/**
			 * @private
			 * @description Effective config as merge result of given and default config.
			 */
			var config = angular.extend({}, DEFAULT_CONFIG, givenConfig);

			/**
			 * @name getConfig
			 * @function
			 * @description
			 * <p>
			 *   Returns effective config of EventBus instance.
			 * </p>
			 * @returns {Object} effective configuration
			 * @example
			 * angular.module('exampleApp', ['keta.services.EventBus'])
			 *     .controller('ExampleController', function(ketaEventBus) {
			 *         var effectiveConfig = ketaEventBus.getConfig();
			 *     });
			 */
			this.getConfig = function() {
				return config;
			};

			/**
			 * @private
			 * @description Internal reference to EventBus instance.
			 */
			var eb = null;

			/**
			 * @name getInstance
			 * @function
			 * @description
			 * <p>
			 *   Returns EventBus instance.
			 * </p>
			 * @returns {eb} EventBus instance
			 * @example
			 * angular.module('exampleApp', ['keta.services.EventBus'])
			 *     .controller('ExampleController', function(ketaEventBus) {
			 *         var instance = ketaEventBus.getInstance();
			 *     });
			 */
			this.getInstance = function() {
				return config.url !== false ? eb : null;
			};

			/**
			 * @name inOfflineMode
			 * @function
			 * @description
			 * <p>
			 *   Returns true if EventBus is configured to be in offline mode.
			 * </p>
			 * @returns {boolean} true if in offline mode
			 * @example
			 * angular.module('exampleApp', ['keta.services.EventBus'])
			 *     .controller('ExampleController', function(ketaEventBus) {
			 *         var inOfflineMode = ketaEventBus.inOfflineMode();
			 *     });
			 */
			this.inOfflineMode = function() {
				return config.offlineMode;
			};

			// init vertx.EventBus
			var init = function() {

				var MILLISECONDS = 1000;

				if (config.url !== false) {

					// instantiate vertx.EventBus
					if (typeof vertx !== 'undefined' && vertx.EventBus) {
						eb = new vertx.EventBus(config.url);
					} else {
						eb = new EventBus(config.url); // eslint-disable-line no-undef
					}

					// add onclose handler
					eb.onclose = function() {

						// reconnect if enabled
						if (config.reconnect) {
							window.setTimeout(function() {
								init();
							}, config.reconnectTimeout * MILLISECONDS);
						}

					};

				}

			};

			init();

		};

		/**
		 * @name create
		 * @function
		 * @description
		 * <p>
		 *   Creates an EventBus instance with given config, which is merged with the default config.
		 * </p>
		 * @param {Object} config config to use in created EventBus instance
		 * @returns {ketaEventBus} EventBus created
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBus'])
		 *     .config(function(ketaEventBusProvider) {
		 *         // create with default config
		 *         var eventBus = ketaEventBusProvider.create();
		 *     });
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBus'])
		 *     .config(function(ketaEventBusProvider) {
		 *         // create with custom id
		 *         var eventBus = ketaEventBusProvider.create({id: 'myEventBus'});
		 *     });
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBus'])
		 *     .config(function(ketaEventBusProvider) {
		 *
		 *         // create with custom config
		 *         // in this case it's exactly the default config
		 *         var eventBus = ketaEventBusProvider.create({
		 *             id: 'kiwibus',
		 *             url: 'https://localhost:10443/kiwibus',
		 *             reconnect: true,
		 *             reconnectTimeout: 5,
		 *             requestTimeout: 10
		 *         });
		 *
		 *     });
		 */
		this.create = function(config) {
			return new KetaEventBus(config);
		};

		this.$get = function EventBusService() {};

	});
