'use strict';

/**
 * @name keta.services.EventBusManager
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014
 * @module keta.services.EventBusManager
 * @description EventBusManager Provider
 */
angular.module('keta.services.EventBusManager', [])
	
	/**
	 * @class EventBusManagerProvider
	 * @propertyOf keta.services.EventBusManager
	 * @description EventBusManager Provider
	 */
	.provider('EventBusManager', function EventBusManagerProvider() {
		
		// keep reference
		var that = this;
		
		/**
		 * @private
		 * @description Internal list of EventBus instances.
		 */
		var eventBuses = {};
		
		/**
		 * @private
		 * @description Debug mode enabled or not.
		 */
		var debug = false;
		
		/**
		 * @name add
		 * @function
		 * @memberOf EventBusManagerProvider
		 * @description
		 * <p>
		 *   Adds an EventBus instance to internal list, from which it can be retrieved later on by it's id.
		 * </p>
		 * @param {EventBus} eventBus EventBus instance to add
		 * @returns {EventBusManagerProvider}
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(EventBusManagerProvider) {
		 *         EventBusManagerProvider
		 *             .add(eventBus)
		 *             .remove(eventBus);
		 *     });
		 */
		this.add = function(eventBus) {
			eventBuses[eventBus.getConfig().id] = eventBus;
			return that;
		};
		
		/**
		 * @name remove
		 * @function
		 * @memberOf EventBusManagerProvider
		 * @description
		 * <p>
		 *   Removes an EventBus instance from internal list.
		 * </p>
		 * @param {EventBus} eventBus EventBus instance to remove
		 * @returns {EventBusManagerProvider}
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(EventBusManagerProvider) {
		 *         EventBusManagerProvider
		 *             .add(eventBus)
		 *             .remove(eventBus);
		 *     });
		 */
		this.remove = function(eventBus) {
			if (angular.isDefined(eventBuses[eventBus.getConfig().id])) {
				delete eventBuses[eventBus.getConfig().id];
			}
			return that;
		};
		
		/**
		 * @name removeAll
		 * @function
		 * @memberOf EventBusManagerProvider
		 * @description
		 * <p>
		 *   Removes all EventBus instances from internal list.
		 * </p>
		 * @returns {EventBusManagerProvider}
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(EventBusManagerProvider) {
		 *         EventBusManagerProvider
		 *             .add(eventBus)
		 *             .removeAll();
		 *     });
		 */
		this.removeAll = function() {
			eventBuses = {};
			return that;
		};
		
		/**
		 * @name get
		 * @function
		 * @memberOf EventBusManagerProvider
		 * @description
		 * <p>
		 *   Gets an EventBus instance from internal list by specified id.
		 * </p>
		 * @param {string} eventBusId EventBus instance id to retrieve from internal list
		 * @returns {EventBus} EventBus instance if found, otherwise null
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(EventBusManagerProvider) {
		 *         var eventBus = EventBusManagerProvider.get('eventBus');
		 *     });
		 */
		this.get = function(eventBusId) {
			return (angular.isDefined(eventBuses[eventBusId])) ? eventBuses[eventBusId] : null;
		};
		
		/**
		 * @name getAll
		 * @function
		 * @memberOf EventBusManagerProvider
		 * @description
		 * <p>
		 *   Gets all EventBus instances from internal list.
		 * </p>
		 * @returns {Object} EventBus instances map (id as key)
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(EventBusManagerProvider) {
		 *         var eventBuses = EventBusManagerProvider.getAll();
		 *     });
		 */
		this.getAll = function() {
			return eventBuses;
		};
		
		/**
		 * @name enableDebug
		 * @function
		 * @memberOf EventBusManagerProvider
		 * @description
		 * <p>
		 *   Enables debug mode which outputs requests and responses to console.
		 * </p>
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(EventBusManagerProvider) {
		 *         EventBusManagerProvider.enableDebug();
		 *     });
		 */
		this.enableDebug = function() {
			debug = true;
		};
		
		/**
		 * @name disableDebug
		 * @function
		 * @memberOf EventBusManagerProvider
		 * @description
		 * <p>
		 *   Disables debug mode which normally outputs requests and responses to console.
		 * </p>
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(EventBusManagerProvider) {
		 *         EventBusManagerProvider.disableDebug();
		 *     });
		 */
		this.disableDebug = function() {
			debug = false;
		};
		
		/**
		 * @name inDebugMode
		 * @function
		 * @memberOf EventBusManagerProvider
		 * @description
		 * <p>
		 *   Returns true if currently in debug mode.
		 * </p>
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(EventBusManagerProvider) {
		 *         if (EventBusManagerProvider.inDebugMode()) {
		 *             // do something useful
		 *         }
		 *     });
		 */
		this.inDebugMode = function() {
			return (debug === true);
		};
		
		this.$get = function EventBusManagerService() {
			
			/**
			 * @class EventBusManager
			 * @propertyOf EventBusManagerProvider
			 * @description EventBusManager Service
			 */
			var api = {
				
				/**
				 * @memberOf EventBusManager
				 * @see EventBusManagerProvider.add
				 */
				add: this.add,
				
				/**
				 * @memberOf EventBusManager
				 * @see EventBusManagerProvider.remove
				 */
				remove: this.remove,
				
				/**
				 * @memberOf EventBusManager
				 * @see EventBusManagerProvider.removeAll
				 */
				removeAll: this.removeAll,
				
				/**
				 * @memberOf EventBusManager
				 * @see EventBusManagerProvider.get
				 */
				get: this.get,
				
				/**
				 * @memberOf EventBusManager
				 * @see EventBusManagerProvider.getAll
				 */
				getAll: this.getAll,
				
				/**
				 * @memberOf EventBusManager
				 * @see EventBusManagerProvider.enableDebug
				 */
				enableDebug: this.enableDebug,
				
				/**
				 * @memberOf EventBusManager
				 * @see EventBusManagerProvider.disableDebug
				 */
				disableDebug: this.disableDebug,
				
				/**
				 * @memberOf EventBusManager
				 * @see EventBusManagerProvider.inDebugMode
				 */
				inDebugMode: this.inDebugMode
				
			};
			
			return api;
			
		};
		
	});
