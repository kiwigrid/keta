'use strict';

/**
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.EventBusManager
 * @description EventBusManager Provider
 */

angular.module('keta.services.EventBusManager', [])

	/**
	 * @class ketaEventBusManagerProvider
	 * @propertyOf keta.services.EventBusManager
	 * @description EventBusManager Provider
	 */
	.provider('ketaEventBusManager', function EventBusManagerProvider() {

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
		 * @description
		 * <p>
		 *   Adds an EventBus instance to internal list, from which it can be retrieved later on by it's id.
		 * </p>
		 * @param {EventBus} eventBus EventBus instance to add
		 * @returns {EventBusManagerProvider} EventBusManagerProvider to chain
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(ketaEventBusManagerProvider) {
		 *         ketaEventBusManagerProvider
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
		 * @description
		 * <p>
		 *   Removes an EventBus instance from internal list.
		 * </p>
		 * @param {EventBus} eventBus EventBus instance to remove
		 * @returns {EventBusManagerProvider} EventBusManagerProvider to chain
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(ketaEventBusManagerProvider) {
		 *         ketaEventBusManagerProvider
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
		 * @description
		 * <p>
		 *   Removes all EventBus instances from internal list.
		 * </p>
		 * @returns {EventBusManagerProvider} EventBusManagerProvider to chain
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(ketaEventBusManagerProvider) {
		 *         ketaEventBusManagerProvider
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
		 * @description
		 * <p>
		 *   Gets an EventBus instance from internal list by specified id.
		 * </p>
		 * @param {string} eventBusId EventBus instance id to retrieve from internal list
		 * @returns {EventBus} EventBus instance if found, otherwise null
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(ketaEventBusManagerProvider) {
		 *         var eventBus = ketaEventBusManagerProvider.get('eventBus');
		 *     });
		 */
		this.get = function(eventBusId) {
			return angular.isDefined(eventBuses[eventBusId]) ? eventBuses[eventBusId] : null;
		};

		/**
		 * @name getAll
		 * @function
		 * @description
		 * <p>
		 *   Gets all EventBus instances from internal list.
		 * </p>
		 * @returns {Object} EventBus instances map (id as key)
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(ketaEventBusManagerProvider) {
		 *         var eventBuses = ketaEventBusManagerProvider.getAll();
		 *     });
		 */
		this.getAll = function() {
			return eventBuses;
		};

		/**
		 * @name enableDebug
		 * @function
		 * @description
		 * <p>
		 *   Enables debug mode which outputs requests and responses to console.
		 * </p>
		 * @returns {void} returns nothing
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(ketaEventBusManagerProvider) {
		 *         ketaEventBusManagerProvider.enableDebug();
		 *     });
		 */
		this.enableDebug = function() {
			debug = true;
		};

		/**
		 * @name disableDebug
		 * @function
		 * @description
		 * <p>
		 *   Disables debug mode which normally outputs requests and responses to console.
		 * </p>
		 * @returns {void} returns nothing
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(ketaEventBusManagerProvider) {
		 *         ketaEventBusManagerProvider.disableDebug();
		 *     });
		 */
		this.disableDebug = function() {
			debug = false;
		};

		/**
		 * @name inDebugMode
		 * @function
		 * @description
		 * <p>
		 *   Returns true if currently in debug mode.
		 * </p>
		 * @returns {Boolean} true if debug mode is enabled
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(ketaEventBusManagerProvider) {
		 *         if (ketaEventBusManagerProvider.inDebugMode()) {
		 *             // do something useful
		 *         }
		 *     });
		 */
		this.inDebugMode = function() {
			return debug === true;
		};

		this.$get = function EventBusManagerService() {

			/**
			 * @class ketaEventBusManager
			 * @propertyOf EventBusManagerProvider
			 * @description EventBusManager Service
			 */
			var api = {

				add: this.add,

				remove: this.remove,

				removeAll: this.removeAll,

				get: this.get,

				getAll: this.getAll,

				enableDebug: this.enableDebug,

				disableDebug: this.disableDebug,

				inDebugMode: this.inDebugMode

			};

			return api;

		};

	});
