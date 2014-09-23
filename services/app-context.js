'use strict';

/**
 * @name keta.servicesAppContext
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014
 * @module keta.servicesAppContext
 * @description App Context Provider
 */
angular.module('keta.servicesAppContext', [])
	
	/**
	 * @class ketaAppContextProvider
	 * @propertyOf keta.servicesAppContext
	 * @description App Context Provider
	 */
	.provider('ketaAppContext', function() {
		
		/**
		 * @private
		 * @description Internal representation of app context from global namespace injected by context.js.
		 */
		var appContext = (angular.isDefined(window.appContext)) ? window.appContext : {};
		
		/**
		 * @name get
		 * @function
		 * @memberOf ketaAppContextProvider
		 * @description Get value by key from app context object.
		 * @param {string} key key to retrieve from app context
		 * @returns {*}
		 * @example
		 * angular.module('exampleApp', [])
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
		
		this.$get = function() {
			
			var api = {
				
				/**
				 * @function
				 * @memberOf ketaAppContext
				 * @description Get value by key from app context object.
				 * @param {string} key key to retrieve from app context
				 * @returns {*}
				 * @example
				 * angular.module('exampleApp', [])
				 *     .controller('ExampleController', function(ketaAppContext) {
				 *         var socketURL = ketaAppContext.get('bus.url');
				 *     });
				 */
				get: this.get
			
			};
			
			return api;
			
		};
		
	});
