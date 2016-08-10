'use strict';

/**
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.AccessToken
 * @description AccessToken Factory
 */

angular.module('keta.services.AccessToken',
	[
		'keta.services.AppContext'
	])

	/**
	 * @class AccessTokenConstants
	 * @propertyOf keta.services.AccessToken
	 * @description Access Token Constants
	 */
	.constant('AccessTokenConstants', {

		// session types
		SESSION_TYPE: {
			NORMAL: 'normal',
			IMPERSONATED: 'impersonated'
		}

	})

	/**
	 * @class AccessToken
	 * @propertyOf keta.services.AccessToken
	 * @description Access Token Factory
	 */
	.factory('AccessToken', function AccessTokenFactory(
		$http, $q,
		AppContext, AccessTokenConstants
	) {

		/**
		 * @private
		 * @description Internal representation of access token which was injected by web server into context.js.
		 */
		var accessToken = AppContext.get('oauth.accessToken');

		/**
		 * @private
		 * @description Decoded access token.
		 */
		var decodedAccessToken = null;

		/**
		 * @private
		 * @description Refresh promise.
		 */
		var refreshPromise = null;

		/**
		 * @private
		 * @description Flag if refresh call is currently in progress.
		 */
		var refreshInProgress = false;

		/*eslint-disable no-magic-numbers */
		var Base64 = {

			keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

			decode: function(input) {
				var output = '';
				var chr1, chr2, chr3;
				var enc1, enc2, enc3, enc4;
				var i = 0;

				input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

				while (i < input.length) {

					enc1 = this.keyStr.indexOf(input.charAt(i++));
					enc2 = this.keyStr.indexOf(input.charAt(i++));
					enc3 = this.keyStr.indexOf(input.charAt(i++));
					enc4 = this.keyStr.indexOf(input.charAt(i++));

					chr1 = enc1 << 2 | enc2 >> 4;
					chr2 = (enc2 & 15) << 4 | enc3 >> 2;
					chr3 = (enc3 & 3) << 6 | enc4;

					output += String.fromCharCode(chr1);

					if (enc3 !== 64) {
						output += String.fromCharCode(chr2);
					}
					if (enc4 !== 64) {
						output += String.fromCharCode(chr3);
					}

				}

				return Base64.utf8Decode(output);
			},

			encode: function(input) {
				var output = '';
				var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
				var i = 0;

				input = Base64.utf8Encode(input);

				while (i < input.length) {

					chr1 = input.charCodeAt(i++);
					chr2 = input.charCodeAt(i++);
					chr3 = input.charCodeAt(i++);

					enc1 = chr1 >> 2;
					enc2 = (chr1 & 3) << 4 | chr2 >> 4;
					enc3 = (chr2 & 15) << 2 | chr3 >> 6;
					enc4 = chr3 & 63;

					if (isNaN(chr2)) {
						enc3 = enc4 = 64;
					} else if (isNaN(chr3)) {
						enc4 = 64;
					}

					output = output +
						this.keyStr.charAt(enc1) +
						this.keyStr.charAt(enc2) +
						this.keyStr.charAt(enc3) +
						this.keyStr.charAt(enc4);

				}

				return output;
			},

			utf8Decode: function(utfText) {
				var string = '';
				var i = 0;
				var c = 0, c2 = 0, c3 = 0;

				while (i < utfText.length) {

					c = utfText.charCodeAt(i);

					if (c < 128) {
						string += String.fromCharCode(c);
						i++;
					} else if (c > 191 && c < 224) {
						c2 = utfText.charCodeAt(i + 1);
						string += String.fromCharCode((c & 31) << 6 | c2 & 63);
						i += 2;
					} else {
						c2 = utfText.charCodeAt(i + 1);
						c3 = utfText.charCodeAt(i + 2);
						string += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
						i += 3;
					}

				}

				return string;
			},

			utf8Encode: function(string) {
				string = string.replace(/\r\n/g, '\n');
				var utfText = '';

				for (var n = 0; n < string.length; n++) {

					var c = string.charCodeAt(n);

					if (c < 128) {
						utfText += String.fromCharCode(c);
					} else if (c > 127 && c < 2048) {
						utfText += String.fromCharCode(c >> 6 | 192);
						utfText += String.fromCharCode(c & 63 | 128);
					} else {
						utfText += String.fromCharCode(c >> 12 | 224);
						utfText += String.fromCharCode(c >> 6 & 63 | 128);
						utfText += String.fromCharCode(c & 63 | 128);
					}

				}

				return utfText;
			}

		};
		/*eslint-enable no-magic-numbers */

		/**
		 * @private
		 * @param {string} property property to extract from token
		 * @returns {*} property value
		 */
		var getProperty = function(property) {
			return decodedAccessToken !== null &&
				angular.isDefined(decodedAccessToken[property]) ?
					decodedAccessToken[property] : null;
		};

		var api = {

			/**
			 * @name get
			 * @function
			 * @description Get access token.
			 * @param {boolean} decoded Return in decoded or raw format.
			 * @returns {string} access token
			 * @example
			 * angular.module('exampleApp', ['keta.services.AccessToken'])
			 *     .controller('ExampleController', function(AccessToken) {
			 *         var accessToken = AccessToken.get();
			 *     });
			 */
			get: function(decoded) {
				if (accessToken !== null && decodedAccessToken === null) {
					decodedAccessToken = api.decode(accessToken);
				}
				return angular.isDefined(decoded) && decoded === true ? decodedAccessToken : accessToken;
			},

			/**
			 * @name set
			 * @function
			 * @description Set access token.
			 * @param {string} token new access token
			 * @returns {void} returns nothing
			 * @example
			 * angular.module('exampleApp', ['keta.services.AccessToken'])
			 *     .controller('ExampleController', function(AccessToken) {
			 *         AccessToken.set('new-token');
			 *     });
			 */
			set: function(token) {
				if (angular.isDefined(token) && angular.isString(token)) {
					accessToken = token;
					decodedAccessToken = api.decode(token);
				}
			},

			/**
			 * @name decode
			 * @function
			 * @description Decode access token.
			 * @param {string} token access token to decode
			 * @returns {Object} access token properties
			 * @example
			 * angular.module('exampleApp', ['keta.services.AccessToken'])
			 *     .controller('ExampleController', function(AccessToken) {
			 *         var accessTokenProps = AccessToken.decode(AccessToken.get());
			 *     });
			 */
			decode: function(token) {
				var props = {};
				try {
					var decoded = Base64.decode(token);

					// strip away everything after }.
					if (decoded.indexOf('}.') !== -1) {
						decoded = decoded.substr(0, decoded.indexOf('}.') + 1);
					}

					props = JSON.parse(decoded);
				} catch (e) {
					return null;
				}
				return props;
			},

			/**
			 * @name encode
			 * @function
			 * @description Encode access token properties.
			 * @param {Object} props access token properties to encode
			 * @returns {string} access token
			 * @example
			 * angular.module('exampleApp', ['keta.services.AccessToken'])
			 *     .controller('ExampleController', function(AccessToken) {
			 *         var accessTokenProps = AccessToken.decode(AccessToken.get());
			 *         accessTokenProps.loaded = true;
			 *         var accessToken = AccessToken.encode(accessTokenProps);
			 *     });
			 */
			encode: function(props) {
				return Base64.encode(JSON.stringify(props));
			},

			/**
			 * @name refresh
			 * @function
			 * @description Refresh access token by requesting backend.
			 * @returns {promise} Promise which is resolved when query is returned
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

				if (refreshPromise === null || !refreshInProgress) {
					refreshPromise = $q.defer();
					refreshInProgress = true;

					var refreshUrl = AppContext.get('oauth.refreshTokenPath') || '/refreshAccessToken';

					$http({method: 'GET', url: refreshUrl}).then(
						function(response) {
							refreshPromise.resolve(response);
							refreshInProgress = false;
						},
						function() {
							refreshPromise.reject('Could not refresh access token');
							refreshInProgress = false;
						}
					);
				}

				return refreshPromise.promise;
			},

			/**
			 * @name hasPermission
			 * @function
			 * @description Checks if current user has a certain permission.
			 * @param {string} permission permission to check
			 * @returns {boolean} result
			 */
			hasPermission: function(permission) {
				var has = false;

				var decoded = api.get(true);
				if (decoded !== null &&
					angular.isArray(decoded.scope)) {
					has = decoded.scope.indexOf(permission) !== -1;
				}

				return has;
			},

			/**
			 * @name isType
			 * @function
			 * @description Checks if session is of a certain type.
			 * @param {string} type session type (use AccessTokenConstants.SESSION_TYPE)
			 * @returns {boolean} result
			 */
			isType: function(type) {

				var decoded = api.get(true);

				return decoded !== null &&
					angular.isDefined(decoded.session) &&
					angular.isDefined(decoded.session.type) &&
					decoded.session.type === type;
			},

			/**
			 * @name getBackUrl
			 * @function
			 * @description Returns back URL for an impersonated session.
			 * @returns {string} back URL
			 */
			getBackUrl: function() {
				var backUrl = null;

				if (api.isType(AccessTokenConstants.SESSION_TYPE.IMPERSONATED)) {
					var decoded = api.get(true);
					if (decoded !== null &&
						angular.isDefined(decoded.session) &&
						angular.isDefined(decoded.session.backUrl)) {
						backUrl = decoded.session.backUrl;
					}
				}

				return backUrl;
			},

			/**
			 * @name getUserId
			 * @function
			 * @description Get user id from token.
			 * @returns {string} user id
			 */
			getUserId: function() {
				return getProperty('user_id');
			},

			/**
			 * @name getChannel
			 * @function
			 * @description Get channel from token.
			 * @returns {string} channel
			 */
			getChannel: function() {
				return getProperty('channel');
			}

		};

		return api;

	});
