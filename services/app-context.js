'use strict';

/**
 * @name keta.services.AppContext
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014
 * @module keta.services.AppContext
 * @description AppContext Provider
 */
angular.module('keta.services.AppContext', [])
	
	/**
	 * @class AppContextProvider
	 * @propertyOf keta.services.AppContext
	 * @description App Context Provider
	 */
	.provider('AppContext', function AppContextProvider() {
		
		/**
		 * @private
		 * @description Internal representation of app context from global namespace injected by context.js.
		 */
		var appContext = (angular.isDefined(window.appContext)) ? window.appContext : {};
		
		/**
		 * @name get
		 * @function
		 * @memberOf AppContextProvider
		 * @description
		 * <p>
		 *   Get value by key from app context object. There <code>key</code> is a string in dot notation to describe
		 *   object properties with hierarchy.
		 * </p>
		 * @param {string} key key to retrieve from app context
		 * @returns {*}
		 * @example
		 * angular.module('exampleApp', ['keta.services.AppContext'])
		 *     .config(function(AppContextProvider) {
		 *         var socketURL = AppContextProvider.get('bus.url');
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
			 * @class AppContext
			 * @propertyOf AppContextProvider
			 * @description AppContext Service
			 */
			var api = {
				
				/**
				 * @function
				 * @memberOf AppContext
				 * @description
				 * <p>
				 *   Get value by key from app context object. There <code>key</code> is a string in dot notation
				 *   to describe object properties with hierarchy.
				 * </p>
				 * @param {string} key key to retrieve from app context
				 * @returns {*}
				 * @example
				 * angular.module('exampleApp', ['keta.services.AppContext'])
				 *     .controller('ExampleController', function(AppContext) {
				 *         var socketURL = AppContext.get('bus.url');
				 *     });
				 */
				get: this.get
			
			};
			
			return api;
			
		};
		
	});
