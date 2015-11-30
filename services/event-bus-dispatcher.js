'use strict';

/**
 * @name keta.services.EventBusDispatcher
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.EventBusDispatcher
 * @description EventBusDispatcher Provider
 */

angular.module('keta.services.EventBusDispatcher',
	[
		'keta.services.AccessToken'
	])

	/**
	 * @class EventBusDispatcherProvider
	 * @propertyOf keta.services.EventBusDispatcher
	 * @description EventBusDispatcher Provider
	 */
	.provider('EventBusDispatcher', function EventBusDispatcherProvider() {

		this.$get = function EventBusDispatcherService($window, $timeout, AccessToken) {

			/**
			 * @private
			 * @memberOf EventBusDispatcher
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
			 * @class EventBusDispatcher
			 * @propertyOf EventBusDispatcherProvider
			 * @description EventBusDispatcher Service
			 */
			var api = {

				/**
				 * @const
				 * @memberOf EventBusDispatcher
				 * @description
				 * <p>
				 *   Connecting state constant.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         if (state === EventBusDispatcher.STATE_CONNECTING) {
				 *             // ...
				 *         }
				 *     });
				 */
				STATE_CONNECTING: 0,

				/**
				 * @const
				 * @memberOf EventBusDispatcher
				 * @description
				 * <p>
				 *   Open state constant.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         if (state === EventBusDispatcher.STATE_OPEN) {
				 *             // ...
				 *         }
				 *     });
				 */
				STATE_OPEN: 1,

				/**
				 * @const
				 * @memberOf EventBusDispatcher
				 * @description
				 * <p>
				 *   Closing state constant.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         if (state === EventBusDispatcher.STATE_CLOSING) {
				 *             // ...
				 *         }
				 *     });
				 */
				STATE_CLOSING: 2,

				/**
				 * @const
				 * @memberOf EventBusDispatcher
				 * @description
				 * <p>
				 *   Closed state constant.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         if (state === EventBusDispatcher.STATE_CLOSED) {
				 *             // ...
				 *         }
				 *     });
				 */
				STATE_CLOSED: 3,

				/**
				 * @const
				 * @memberOf EventBusDispatcher
				 * @description
				 * <p>
				 *   Response code 200.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         if (responseCode === EventBusDispatcher.RESPONSE_CODE_OK) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_CODE_OK: 200,

				/**
				 * @const
				 * @memberOf EventBusDispatcher
				 * @description
				 * <p>
				 *   Response code 204.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         if (responseCode === EventBusDispatcher.RESPONSE_CODE_NO_CONTENT) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_CODE_NO_CONTENT: 204,

				/**
				 * @const
				 * @memberOf EventBusDispatcher
				 * @description
				 * <p>
				 *   Response message 200.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         if (responseMessage === EventBusDispatcher.RESPONSE_MESSAGE_OK) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_MESSAGE_OK: 'OK',

				/**
				 * @const
				 * @memberOf EventBusDispatcher
				 * @description
				 * <p>
				 *   Response code 400.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         if (responseCode === EventBusDispatcher.RESPONSE_CODE_BAD_REQUEST) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_CODE_BAD_REQUEST: 400,

				/**
				 * @const
				 * @memberOf EventBusDispatcher
				 * @description
				 * <p>
				 *   Response message 400.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         if (responseMessage === EventBusDispatcher.RESPONSE_MESSAGE_BAD_REQUEST) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_MESSAGE_BAD_REQUEST: 'Bad Request',

				/**
				 * @const
				 * @memberOf EventBusDispatcher
				 * @description
				 * <p>
				 *   Response code 401.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         if (responseCode === EventBusDispatcher.RESPONSE_CODE_UNAUTHORIZED) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_CODE_UNAUTHORIZED: 401,

				/**
				 * @const
				 * @memberOf EventBusDispatcher
				 * @description
				 * <p>
				 *   Response message 401.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         if (responseMessage === EventBusDispatcher.RESPONSE_MESSAGE_UNAUTHORIZED) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_MESSAGE_UNAUTHORIZED: 'Unauthorized',

				/**
				 * @const
				 * @memberOf EventBusDispatcher
				 * @description
				 * <p>
				 *   Response code 404.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         if (responseCode === EventBusDispatcher.RESPONSE_CODE_NOT_FOUND) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_CODE_NOT_FOUND: 404,

				/**
				 * @const
				 * @memberOf EventBusDispatcher
				 * @description
				 * <p>
				 *   Response message 404.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         if (responseMessage === EventBusDispatcher.RESPONSE_MESSAGE_NOT_FOUND) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_MESSAGE_NOT_FOUND: 'Not Found',

				/**
				 * @const
				 * @memberOf EventBusDispatcher
				 * @description
				 * <p>
				 *   Response code 408.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         if (responseCode === EventBusDispatcher.RESPONSE_CODE_REQUEST_TIMEOUT) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_CODE_REQUEST_TIMEOUT: 408,

				/**
				 * @const
				 * @memberOf EventBusDispatcher
				 * @description
				 * <p>
				 *   Response message 408.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         if (responseMessage === EventBusDispatcher.RESPONSE_MESSAGE_REQUEST_TIMEOUT) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_MESSAGE_REQUEST_TIMEOUT: 'Request Time-out',

				/**
				 * @const
				 * @memberOf EventBusDispatcher
				 * @description
				 * <p>
				 *   Response code 419.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         if (responseCode === EventBusDispatcher.RESPONSE_CODE_AUTHENTICATION_TIMEOUT) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_CODE_AUTHENTICATION_TIMEOUT: 419,

				/**
				 * @const
				 * @memberOf EventBusDispatcher
				 * @description
				 * <p>
				 *   Response message 419.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         if (responseMessage === EventBusDispatcher.RESPONSE_MESSAGE_AUTHENTICATION_TIMEOUT) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_MESSAGE_AUTHENTICATION_TIMEOUT: 'Authentication Timeout',

				/**
				 * @const
				 * @memberOf EventBusDispatcher
				 * @description
				 * <p>
				 *   Response code 500.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         if (responseCode === EventBusDispatcher.RESPONSE_CODE_INTERNAL_SERVER_ERROR) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_CODE_INTERNAL_SERVER_ERROR: 500,

				/**
				 * @const
				 * @memberOf EventBusDispatcher
				 * @description
				 * <p>
				 *   Response message 500.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         if (responseMessage === EventBusDispatcher.RESPONSE_MESSAGE_INTERNAL_SERVER_ERROR) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_MESSAGE_INTERNAL_SERVER_ERROR: 'Internal Server Error',

				/**
				 * @const
				 * @memberOf EventBusDispatcher
				 * @description
				 * <p>
				 *   Response code 503.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         if (responseCode === EventBusDispatcher.RESPONSE_CODE_SERVICE_UNAVAILABLE) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_CODE_SERVICE_UNAVAILABLE: 503,

				/**
				 * @const
				 * @memberOf EventBusDispatcher
				 * @description
				 * <p>
				 *   Response message 503.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         if (responseMessage === EventBusDispatcher.RESPONSE_MESSAGE_SERVICE_UNAVAILABLE) {
				 *             // ...
				 *         }
				 *     });
				 */
				RESPONSE_MESSAGE_SERVICE_UNAVAILABLE: 'Service Unavailable',

				/**
				 * @function
				 * @memberOf EventBusDispatcher
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
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         EventBusDispatcher.send(eventBus, 'address', {
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

					// inject access token
					message.accessToken = AccessToken.get();

					var handler = function(reply) {
						if (reply && reply.code === api.RESPONSE_CODE_AUTHENTICATION_TIMEOUT) {
							// refresh access token
							AccessToken.refresh().then(function(response) {
								if (angular.isDefined(response.data.accessToken)) {
									AccessToken.set(response.data.accessToken);
									api.send(eventBus, address, message, replyHandler);
								} else {
									$window.location.reload();
								}
							}, function() {
								$window.location.reload();
							});
						} else if (angular.isFunction(replyHandler)) {
							replyHandler(reply);
						}
					};

					// call stub method
					if (angular.isDefined(replyHandler) && angular.isFunction(replyHandler)) {
						waitForOpen(eventBus, true, function() {
							eventBus.getInstance().send(address, message, handler);
						}, function() {
							replyHandler({
								code: 408,
								message: 'Request Time-out'
							});
						});
					} else {
						eventBus.getInstance().send(address, message, handler);
					}

				},

				/**
				 * @function
				 * @memberOf EventBusDispatcher
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
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         EventBusDispatcher.publish(eventBus, 'address', {
				 *             action: 'action',
				 *             body: {
				 *                 guid: 'guid'
				 *             }
				 *         });
				 *     });
				 */
				publish: function(eventBus, address, message) {

					// inject access token and call stub method
					message.accessToken = AccessToken.get();

					waitForOpen(eventBus, false, function() {
						eventBus.getInstance().publish(address, message);
					});

				},

				/**
				 * @function
				 * @memberOf EventBusDispatcher
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
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         EventBusDispatcher.registerHandler(eventBus, 'address', function(event) {
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
				 * @function
				 * @memberOf EventBusDispatcher
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
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         EventBusDispatcher.unregisterHandler(eventBus, 'address', function(event) {
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
				 * @function
				 * @memberOf EventBusDispatcher
				 * @description
				 * <p>
				 *   Closes connection to specified EventBus instance.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance
				 * @returns {void} returns nothing
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         EventBusDispatcher.close(eventBus);
				 *     });
				 */
				close: function(eventBus) {
					eventBus.getInstance().close();
				},

				/**
				 * @function
				 * @memberOf EventBusDispatcher
				 * @description
				 * <p>
				 *   Returns connection state of specified EventBus instance.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance
				 * @returns {number} connection state
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(EventBusDispatcher) {
				 *         var state = EventBusDispatcher.readyState(eventBus);
				 *     });
				 */
				readyState: function(eventBus) {
					return eventBus.getInstance().readyState();
				},

				/**
				 * @function
				 * @memberOf EventBusDispatcher
				 * @description
				 * <p>
				 *   Generates an UUID for handler.
				 * </p>
				 * @returns {string} uuid
				 * @example
				 * angular.module('exampleApp', ['keta.services.EventBusDispatcher'])
				 *     .controller('ExampleController', function(EventBusDispatcher) {
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
