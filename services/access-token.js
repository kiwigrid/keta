'use strict';

/**
 * @name keta.services.AccessToken
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014
 * @module keta.services.AccessToken
 * @description AccessToken Factory
 */
angular.module('keta.services.AccessToken',
	[
		'keta.services.AppContext'
	])
	
	/**
	 * @class AccessToken
	 * @propertyOf keta.services.AccessToken
	 * @description Access Token Factory
	 */
	.factory('AccessToken', function AccessTokenFactory($http, AppContext) {
		
		/**
		 * @private
		 * @description Internal representation of access token which was injected by web server into context.js.
		 */
		var accessToken = AppContext.get('oauth.accessToken');
		
		var api = {
			
			/**
			 * @function
			 * @memberOf AccessToken
			 * @description Get access token.
			 * @returns {string} access token
			 * @example
			 * angular.module('exampleApp', ['keta.services.AccessToken'])
			 *     .controller('ExampleController', function(AccessToken) {
			 *         var accessToken = AccessToken.get();
			 *     });
			 */
			get: function() {
				return accessToken;
			},
			
			/**
			 * @function
			 * @memberOf AccessToken
			 * @description Set access token.
			 * @param {string} token new access token
			 * @example
			 * angular.module('exampleApp', ['keta.services.AccessToken'])
			 *     .controller('ExampleController', function(AccessToken) {
			 *         AccessToken.set('new-token');
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
				var refreshUrl = AppContext.get('oauth.refreshTokenPath') || '/refreshAccessToken';
				return $http({
					method: 'GET',
					url: refreshUrl
				});
			}
		
		};
		
		return api;
		
	});
