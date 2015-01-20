'use strict';

/**
 * @name keta.services.EventBus
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014
 * @module keta.services.EventBus
 * @description EventBus Provider
 */
angular.module('keta.services.EventBus', [])
	
	/**
	 * @class EventBusProvider
	 * @propertyOf keta.services.EventBus
	 * @description EventBus Provider
	 */
	.provider('EventBus', function EventBusProvider() {
	
		/**
		 * @class EventBus
		 * @propertyOf keta.services.EventBus
		 * @description EventBus Instance
		 */
		var EventBus = function EventBus(givenConfig) {
			
			/**
			 * @private
			 * @description Default config for EventBus instances.
			 */
			var DEFAULT_CONFIG = {
				id: 'kiwibus',
				url: 'https://localhost:10443/kiwibus',
				reconnect: true,
				reconnectTimeout: 5,
				autoConnect: false,
				autoUnregister: true,
				requestTimeout: 10
			};
			
			/**
			 * @name getDefaultConfig
			 * @function
			 * @memberOf EventBus
			 * @description
			 * <p>
			 *   Returns default config used to merge in EventBus instance create method.
			 * </p>
			 * @returns {Object} default configuration
			 * @example
			 * angular.module('exampleApp', ['keta.services.EventBus'])
			 *     .controller('ExampleController', function(EventBus) {
			 *         var defaultConfig = eventBus.getDefaultConfig();
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
			 * @memberOf EventBus
			 * @description
			 * <p>
			 *   Returns effective config of EventBus instance.
			 * </p>
			 * @returns {Object} effective configuration
			 * @example
			 * angular.module('exampleApp', ['keta.services.EventBus'])
			 *     .controller('ExampleController', function(EventBus) {
			 *         var effectiveConfig = eventBus.getConfig();
			 *     });
			 */
			this.getConfig = function() {
				return config;
			};
			
			/**
			 * @private
			 * @description Internal reference to vertx.EventBus instance.
			 */
			var eb = null;
			
			/**
			 * @name getInstance
			 * @function
			 * @memberOf EventBus
			 * @description
			 * <p>
			 *   Returns vertx.EventBus instance.
			 * </p>
			 * @returns {vertx.EventBus} vertx.EventBus instance
			 * @example
			 * angular.module('exampleApp', ['keta.services.EventBus'])
			 *     .controller('ExampleController', function(EventBus) {
			 *         var instance = eventBus.getInstance();
			 *     });
			 */
			this.getInstance = function() {
				return eb;
			};
			
			// init vertx.EventBus
			var init = function() {
				
				// instantiate vertx.EventBus
				eb = new vertx.EventBus(config.url);
				
				// add onclose handler
				eb.onclose = function() {
					
					// reconnect if enabled
					if (config.reconnect) {
						window.setTimeout(function() {
							init();
						}, config.reconnectTimeout * 1000);
					}
					
				};
			
			};
			
			init();
			
		};
		
		/**
		 * @name create
		 * @function
		 * @memberOf EventBusProvider
		 * @description
		 * <p>
		 *   Creates an EventBus instance with given config, which is merged with the default config.
		 * </p>
		 * @param {Object} config config to use in created EventBus instance
		 * @returns {EventBus}
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBus'])
		 *     .config(function(EventBusProvider) {
		 *         // create with default config
		 *         var eventBus = EventBusProvider.create();
		 *     });
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBus'])
		 *     .config(function(EventBusProvider) {
		 *         // create with custom id
		 *         var eventBus = EventBusProvider.create({id: 'myEventBus'});
		 *     });
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBus'])
		 *     .config(function(EventBusProvider) {
		 *         
		 *         // create with custom config
		 *         // in this case it's exactly the default config
		 *         var eventBus = EventBusProvider.create({
		 *             id: 'kiwibus',
		 *             url: 'https://localhost:10443/kiwibus',
		 *             reconnect: true,
		 *             reconnectTimeout: 5,
		 *             autoConnect: false,
		 *             autoUnregister: true,
		 *             requestTimeout: 10
		 *         });
		 *         
		 *     });
		 */
		this.create = function(config) {
			return new EventBus(config);
		};
		
		this.$get = function EventBusService() {};
		
	});
