'use strict';

/**
 * @name keta.servicesAccessToken
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014
 * @module keta.servicesAccessToken
 * @description Access Token Factory
 */
angular.module('keta.servicesAccessToken', ['keta.servicesAppContext'])
	
	/**
	 * @class ketaAccessToken
	 * @propertyOf keta.servicesAccessToken
	 * @description Access Token Factory
	 */
	.factory('ketaAccessToken', function($http, ketaAppContext) {
		
		/**
		 * @private
		 * @description Internal representation of access token which was injected by web server into context.js.
		 */
		var accessToken = ketaAppContext.get('oauth.accessToken');

		/**
		 * @private
		 * @description Internal representation of the path to invoke refreshToken requests against.
		 */
		var refreshPath = ketaAppContext.get('oauth.refreshPath');
		if (refreshPath === null) {
			refreshPath = '/refreshAccessToken';
		}

		var api = {
			
			/**
			 * @function
			 * @memberOf ketaAccessToken
			 * @description Get access token.
			 * @returns {string} access token
			 * @example
			 * angular.module('exampleApp', [])
			 *     .controller('ExampleController', function(ketaAccessToken) {
			 *         var accessToken = ketaAccessToken.get();
			 *     });
			 */
			get: function() {
				return accessToken;
			},
			
			/**
			 * @function
			 * @memberOf ketaAccessToken
			 * @description Set access token.
			 * @param {string} token new access token
			 * @example
			 * angular.module('exampleApp', [])
			 *     .controller('ExampleController', function(ketaAccessToken) {
			 *         ketaAccessToken.set('new-token');
			 *     });
			 */
			set: function(token) {
				if (angular.isDefined(token) && angular.isString(token)) {
					accessToken = token;
				}
			},

			/**
			 * @function
			 * @memberOf ketaAccessToken
			 * @description Refresh access token by requesting backend.
			 * @returns {promise}
			 * @example
			 * angular.module('exampleApp', [])
			 *     .controller('ExampleController', function(ketaAccessToken) {
			 *         ketaAccessToken.refresh().then(
			 *             function(response) {
			 *                 if (angular.isDefined(response.data.accessToken)) {
			 *                     ketaAccessToken.set(response.data.accessToken);
			 *                 }
			 *             },
			 *             function(message) {
			 *                 console.error(message);
			 *             }
			 *         );
			 *     });
			 */
			refresh: function() {
				return $http({
					method: 'GET',
					url: refreshPath
				});
			}
		
		};
		
		return api;
		
	});
