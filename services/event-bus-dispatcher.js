'use strict';

/**
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.EventBusDispatcher
 * @description EventBusDispatcher Provider
 */

angular.module('keta.services.EventBusDispatcher',
	[
		'keta.services.AccessToken',
		'keta.services.DeviceSetPollers'
	])

	/**
	 * @class ketaEventBusDispatcherProvider
	 * @propertyOf keta.services.EventBusDispatcher
	 * @description EventBusDispatcher Provider
	 */
	.provider('ketaEventBusDispatcher', function EventBusDispatcherProvider() {

		this.$get = function EventBusDispatcherService($window, $timeout, ketaAccessToken, ketaDeviceSetPollers) {

			/**
			 * @private
			 * @description
			 * <p>
			 *   Wait for EventBus to have open state before sending messages.
			 * </p>
			 * @param {EventBus} eventBus EventBus instance
			 * @param {boolean} replied Is message replied, so that we have to check for timeout?
			 * @param {Function} success Success handler to call when EventBus is in open state
			 * @param {Function} error Error handler to call when EventBus could not be opened within timeout
			 * @returns {void} returns nothing
			 */
			var waitForOpen = function(eventBus, replied, success, error) {

				var timeout = null;
				var MILLISECONDS = 1000;

				// set timeout
				if (replied) {
					timeout = $timeout(function() {
						error();
					}, eventBus.getConfig().requestTimeout * MILLISECONDS);
				}

				// wait if readyState isn't open
				if (eventBus.getInstance().readyState() !== 1) {

					// save current onopen
					var onopen = null;
					if (angular.isFunction(eventBus.getInstance().onopen)) {
						onopen = eventBus.getInstance().onopen;
					}

					// wait for open state
					eventBus.getInstance().onopen = function() {
						if (angular.isFunction(onopen)) {
							onopen();
						}
						if (timeout !== null) {
							$timeout.cancel(timeout);
						}
						success();
					};

				} else {
					$timeout.cancel(timeout);
					success();
				}

			};

			/**
			 * @class ketaEventBusDispatcher
			 * @propertyOf EventBusDispatcherProvider
			 * @description EventBusDispatcher Service
			 */
			var api = {

				/**
				 * @name STATE_CONNECTING
				 * @constant
				 * @description
				 * <p>
				 *   Connecting state constant.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         if (state === ketaEventBusDispatcher.STATE_CONNECTING) {
				 *             // ...
				 *         }
				 *     });
				 */
				STATE_CONNECTING: 0,

				/**
				 * @name STATE_OPEN
				 * @constant
				 * @description
				 * <p>
				 *   Open state constant.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         if (state === ketaEventBusDispatcher.STATE_OPEN) {
				 *             // ...
				 *         }
				 *     });
				 */
				STATE_OPEN: 1,

				/**
				 * @name STATE_CLOSING
				 * @constant
				 * @description
				 * <p>
				 *   Closing state constant.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         if (state === ketaEventBusDispatcher.STATE_CLOSING) {
				 *             // ...
				 *         }
				 *     });
				 */
				STATE_CLOSING: 2,

				/**
				 * @name STATE_CLOSED
				 * @constant
				 * @description
				 * <p>
				 *   Closed state constant.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         if (state === ketaEventBusDispatcher.STATE_CLOSED) {
				 *             // ...
				 *         }
				 *     });
				 */
				STATE_CLOSED: 3,

				/**
				 * @name RESPONSE_CODE_OK
				 * @constant
				 * @description
				 * <p>
				 *   Response code 200.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         if (responseCode === ketaEventBusDispatcher.RESPONSE_CODE_OK) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_CODE_OK: 200,

				/**
				 * @name RESPONSE_CODE_NO_CONTENT
				 * @constant
				 * @description
				 * <p>
				 *   Response code 204.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         if (responseCode === ketaEventBusDispatcher.RESPONSE_CODE_NO_CONTENT) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_CODE_NO_CONTENT: 204,

				/**
				 * @name RESPONSE_MESSAGE_OK
				 * @constant
				 * @description
				 * <p>
				 *   Response message 200.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         if (responseMessage === ketaEventBusDispatcher.RESPONSE_MESSAGE_OK) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_MESSAGE_OK: 'OK',

				/**
				 * @name RESPONSE_CODE_BAD_REQUEST
				 * @constant
				 * @description
				 * <p>
				 *   Response code 400.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         if (responseCode === ketaEventBusDispatcher.RESPONSE_CODE_BAD_REQUEST) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_CODE_BAD_REQUEST: 400,

				/**
				 * @name RESPONSE_MESSAGE_BAD_REQUEST
				 * @constant
				 * @description
				 * <p>
				 *   Response message 400.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         if (responseMessage === ketaEventBusDispatcher.RESPONSE_MESSAGE_BAD_REQUEST) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_MESSAGE_BAD_REQUEST: 'Bad Request',

				/**
				 * @name RESPONSE_CODE_UNAUTHORIZED
				 * @constant
				 * @description
				 * <p>
				 *   Response code 401.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         if (responseCode === ketaEventBusDispatcher.RESPONSE_CODE_UNAUTHORIZED) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_CODE_UNAUTHORIZED: 401,

				/**
				 * @name RESPONSE_MESSAGE_UNAUTHORIZED
				 * @constant
				 * @description
				 * <p>
				 *   Response message 401.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         if (responseMessage === ketaEventBusDispatcher.RESPONSE_MESSAGE_UNAUTHORIZED) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_MESSAGE_UNAUTHORIZED: 'Unauthorized',

				/**
				 * @name RESPONSE_CODE_NOT_FOUND
				 * @constant
				 * @description
				 * <p>
				 *   Response code 404.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         if (responseCode === ketaEventBusDispatcher.RESPONSE_CODE_NOT_FOUND) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_CODE_NOT_FOUND: 404,

				/**
				 * @name RESPONSE_MESSAGE_NOT_FOUND
				 * @constant
				 * @description
				 * <p>
				 *   Response message 404.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         if (responseMessage === ketaEventBusDispatcher.RESPONSE_MESSAGE_NOT_FOUND) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_MESSAGE_NOT_FOUND: 'Not Found',

				/**
				 * @name RESPONSE_CODE_REQUEST_TIMEOUT
				 * @constant
				 * @description
				 * <p>
				 *   Response code 408.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         if (responseCode === ketaEventBusDispatcher.RESPONSE_CODE_REQUEST_TIMEOUT) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_CODE_REQUEST_TIMEOUT: 408,

				/**
				 * @name RESPONSE_MESSAGE_REQUEST_TIMEOUT
				 * @constant
				 * @description
				 * <p>
				 *   Response message 408.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         if (responseMessage === ketaEventBusDispatcher.RESPONSE_MESSAGE_REQUEST_TIMEOUT) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_MESSAGE_REQUEST_TIMEOUT: 'Request Time-out',

				/**
				 * @name RESPONSE_CODE_AUTHENTICATION_TIMEOUT
				 * @constant
				 * @description
				 * <p>
				 *   Response code 419.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         if (responseCode === ketaEventBusDispatcher.RESPONSE_CODE_AUTHENTICATION_TIMEOUT) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_CODE_AUTHENTICATION_TIMEOUT: 419,

				/**
				 * @name RESPONSE_MESSAGE_AUTHENTICATION_TIMEOUT
				 * @constant
				 * @description
				 * <p>
				 *   Response message 419.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         if (responseMessage === ketaEventBusDispatcher.RESPONSE_MESSAGE_AUTHENTICATION_TIMEOUT) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_MESSAGE_AUTHENTICATION_TIMEOUT: 'Authentication Timeout',

				/**
				 * @name RESPONSE_CODE_INTERNAL_SERVER_ERROR
				 * @constant
				 * @description
				 * <p>
				 *   Response code 500.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         if (responseCode === ketaEventBusDispatcher.RESPONSE_CODE_INTERNAL_SERVER_ERROR) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_CODE_INTERNAL_SERVER_ERROR: 500,

				/**
				 * @name RESPONSE_MESSAGE_INTERNAL_SERVER_ERROR
				 * @constant
				 * @description
				 * <p>
				 *   Response message 500.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         if (responseMessage === ketaEventBusDispatcher.RESPONSE_MESSAGE_INTERNAL_SERVER_ERROR) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_MESSAGE_INTERNAL_SERVER_ERROR: 'Internal Server Error',

				/**
				 * @name RESPONSE_CODE_SERVICE_UNAVAILABLE
				 * @constant
				 * @description
				 * <p>
				 *   Response code 503.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         if (responseCode === ketaEventBusDispatcher.RESPONSE_CODE_SERVICE_UNAVAILABLE) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_CODE_SERVICE_UNAVAILABLE: 503,

				/**
				 * @name RESPONSE_MESSAGE_SERVICE_UNAVAILABLE
				 * @constant
				 * @description
				 * <p>
				 *   Response message 503.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         if (responseMessage === ketaEventBusDispatcher.RESPONSE_MESSAGE_SERVICE_UNAVAILABLE) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_MESSAGE_SERVICE_UNAVAILABLE: 'Service Unavailable',

				/**
				 * @name send
				 * @function
				 * @description
				 * <p>
				 *   Send a message to a specified address using the specified EventBus instance and
				 *   the specified replyHandler.
				 * </p>
				 * <p>
				 *   There is a reply interceptor to check whether the access token injected automatically
				 *   is expired or not. If it's expired the AccessToken service is used to refresh it and
				 *   repeat the original request. If access token could not be refreshed a full page reload
				 *   is performed which usually results in a redirection to the OAuth server.
				 * </p>
				 * @see AccessToken.refresh
				 * @param {EventBus} eventBus EventBus instance
				 * @param {string} address unique address on EventBus instance
				 * @param {object} message message object to send
				 * @param {function} replyHandler handler to process reply
				 * @returns {void} returns nothing
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         ketaEventBusDispatcher.send(eventBus, 'address', {
				 *             action: 'action',
				 *             body: {
				 *                 guid: 'guid'
				 *             }
				 *         }, function(reply) {
				 *             // ...
				 *         });
				 *     });
				 */
				send: function(eventBus, address, message, replyHandler) {
					if (message.action === 'unregisterAllListeners' ||
						message.action === 'unregisterAllDeviceSetListeners') {
						ketaDeviceSetPollers.stopAndRemoveAll();
					}

					// inject access token
					message.accessToken = ketaAccessToken.get();

					var handler = function(reply) {
						if (reply && reply.code === api.RESPONSE_CODE_AUTHENTICATION_TIMEOUT) {
							// refresh access token
							ketaAccessToken.refresh().then(function(response) {
								if (angular.isDefined(response.data) && angular.isDefined(response.data.accessToken)) {
									ketaAccessToken.set(response.data.accessToken);
									api.send(eventBus, address, message, replyHandler);
								} else if (angular.isDefined(response.access_token)) {
									ketaAccessToken.set(response.access_token);
									api.send(eventBus, address, message, replyHandler);
								} else {
									$window.location.reload();
								}
							}, function() {
								$window.location.reload();
							});
						} else if (angular.isFunction(replyHandler)) {
							if (reply) {
								replyHandler(reply);
							} else {
								replyHandler({
									code: 408,
									message: 'Request Time-out'
								});
							}
						}
					};

					var callReplyHandler = function(reply) {
						if (angular.isFunction(replyHandler)) {
							replyHandler(reply);
						}
					};

					if (!eventBus.inOfflineMode()) {

						// call stub method
						var eb = eventBus.getInstance();
						if (eb !== null) {
							waitForOpen(eventBus, true, function() {
								eventBus.getInstance().send(address, message, handler);
							}, function() {
								callReplyHandler({
									code: 408,
									message: 'Request Time-out'
								});
							});
						} else {
							callReplyHandler({
								code: 500,
								message: 'Internal Server Error'
							});
						}

					}

				},

				/**
				 * @name publish
				 * @function
				 * @description
				 * <p>
				 *   Publish a message to a specified address using the specified EventBus instance.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance
				 * @param {string} address unique address on EventBus instance
				 * @param {object} message message object to send
				 * @returns {void} returns nothing
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         ketaEventBusDispatcher.publish(eventBus, 'address', {
				 *             action: 'action',
				 *             body: {
				 *                 guid: 'guid'
				 *             }
				 *         });
				 *     });
				 */
				publish: function(eventBus, address, message) {

					// inject access token and call stub method
					message.accessToken = ketaAccessToken.get();

					waitForOpen(eventBus, false, function() {
						eventBus.getInstance().publish(address, message);
					});

				},

				/**
				 * @name registerHandler
				 * @function
				 * @description
				 * <p>
				 *   Registers a handler on a specified address using the specified EventBus instance.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance
				 * @param {string} address unique address on EventBus instance
				 * @param {function} handler handler to process messages coming in from EventBus instance
				 * @returns {void} returns nothing
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         ketaEventBusDispatcher.registerHandler(eventBus, 'address', function(event) {
				 *             // ...
				 *         });
				 *     });
				 */
				registerHandler: function(eventBus, address, handler) {
					waitForOpen(eventBus, false, function() {
						eventBus.getInstance().registerHandler(address, handler);
					});
				},

				/**
				 * @name unregisterHandler
				 * @function
				 * @description
				 * <p>
				 *   Unregisters a handler on a specified address using the specified EventBus instance.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance
				 * @param {string} address unique address on EventBus instance
				 * @param {function} handler handler to process messages coming in from EventBus instance
				 * @returns {void} returns nothing
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         ketaEventBusDispatcher.unregisterHandler(eventBus, 'address', function(event) {
				 *             // ...
				 *         });
				 *     });
				 */
				unregisterHandler: function(eventBus, address, handler) {
					waitForOpen(eventBus, false, function() {
						eventBus.getInstance().unregisterHandler(address, handler);
					});
				},

				/**
				 * @name close
				 * @function
				 * @description
				 * <p>
				 *   Closes connection to specified EventBus instance.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance
				 * @returns {void} returns nothing
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         ketaEventBusDispatcher.close(eventBus);
				 *     });
				 */
				close: function(eventBus) {
					eventBus.getInstance().close();
				},

				/**
				 * @name readyState
				 * @function
				 * @description
				 * <p>
				 *   Returns connection state of specified EventBus instance.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance
				 * @returns {number} connection state
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         var state = ketaEventBusDispatcher.readyState(eventBus);
				 *     });
				 */
				readyState: function(eventBus) {
					return eventBus.getInstance().readyState();
				},

				/**
				 * @name generateUUID
				 * @function
				 * @description
				 * <p>
				 *   Generates an UUID for handler.
				 * </p>
				 * @returns {string} uuid
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(ketaEventBusDispatcher) {
				 *         var handlerUUID = ketaEventBus.generateUUID();
				 *     });
				 */
				generateUUID: function() {
					var HEX_RANGE = 16;
					var BIT_HALF = 8;
					var BIT_SHIFT = 3;
					return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
						.replace(/[xy]/g, function(a, b) {
							b = Math.random() * HEX_RANGE;
							return (a === 'y' ? b & BIT_SHIFT | BIT_HALF : b | 0).toString(HEX_RANGE);
						});
				}

			};

			return api;

		};

	});
