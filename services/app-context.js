'use strict';

/**
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.AppContext
 * @description AppContext Provider
 */

angular.module('keta.services.AppContext', [])

	/**
	 * @class ketaAppContextProvider
	 * @propertyOf keta.services.AppContext
	 * @description App Context Provider
	 */
	.provider('ketaAppContext', function AppContextProvider() {

		/**
		 * @private
		 * @description Internal representation of app context from global namespace injected by context.js.
		 */
		var appContext = angular.isDefined(window.appContext) ? window.appContext : {};

		/**
		 * @name get
		 * @function
		 * @description
		 * <p>
		 *   Get value by key from app context object. There <code>key</code> is a string in dot notation to describe
		 *   object properties with hierarchy.
		 * </p>
		 * @param {string} key key to retrieve from app context
		 * @returns {*} Object extracted from AppContext
		 * @example
		 * angular.module('exampleApp', ['keta.services.AppContext'])
		 *     .config(function(ketaAppContextProvider) {
		 *         var socketURL = ketaAppContextProvider.get('bus.url');
		 *     });
		 */
		this.get = function(key) {
			var obj = appContext;
			key = key.split('.');
			for (var i = 0, l = key.length; i < l; i++) {
				if (angular.isDefined(obj[key[i]])) {
					obj = obj[key[i]];
				} else {
					return null;
				}
			}
			return obj;
		};

		this.$get = function AppContextService() {

			/**
			 * @class ketaAppContext
			 * @propertyOf ketaAppContextProvider
			 * @description AppContext Service
			 */
			var api = {

				get: this.get

			};

			return api;

		};

	});
