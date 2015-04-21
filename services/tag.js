'use strict';

/**
 * @name keta.servicesTag
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014
 * @module keta.servicesTag
 * @description Tag Provider
 */
angular.module('keta.servicesTag', ['keta.servicesEventBus', 'keta.servicesLogger'])

	/**
	 * @class ketaTagProvider
	 * @propertyOf keta.servicesTag
	 * @description Tag Provider
	 */
	.provider('ketaTag', function() {

		/**
		 * @const
		 * @private
		 * @description Service endpoint for messages.
		 */
		var SERVICE_ENDPOINT = 'deviceservice';

		/**
		 * @const
		 * @private
		 * @description Error message if an invalid sample rate was given.
		 */
		var ERROR_INVALID_SAMPLE_RATE = 'Invalid sample rate';

		/**
		 * @const
		 * @private
		 * @description Error message if an invalid handler was given.
		 */
		var ERROR_INVALID_HANDLER = 'Invalid handler';

		/**
		 * @const
		 * @private
		 * @description Minimum sample rate. We don't support sample rates less than 5 seconds.
		 */
		var MIN_SAMPLE_RATE = 5;

		// return service API
		this.$get = function($q, ketaEventBus, ketaLogger) {

			/**
			 * @private
			 * @function
			 * @description Reject promise with given code and message.
			 * @param {string} message return message
			 * @returns {promise}
			 */
			var responseReject = function(message) {
				var deferred = $q.defer();
				deferred.reject(message);
				return deferred.promise;
			};

			/**
			 * @class ketaTagService
			 * @propertyOf ketaTagProvider
			 * @description Tag Service
			 */
			var api = {

				/**
				 * @const
				 * @memberOf ketaTagService
				 * @description Error message if an invalid sample rate was given.
				 */
				ERROR_INVALID_SAMPLE_RATE: ERROR_INVALID_SAMPLE_RATE,

				/**
				 * @const
				 * @memberOf ketaTagService
				 * @description Error message if an invalid handler was given.
				 */
				ERROR_INVALID_HANDLER: ERROR_INVALID_HANDLER,

				/**
				 * @function
				 * @memberOf ketaTagService
				 * @description Register a tag value listener.
				 * @param {object} filter device filter (including tag names)
				 * @param {number} sampleRate sample rate in seconds (minimum 5)
				 * @param {function} handler tag value listener
				 * @returns {promise}
				 * @example
				 * angular.module('exampleApp', [])
				 *     .controller('ExampleController', function(ketaTag, ketaLogger) {
				 *         ketaTag.registerListener({
				 *             tags: ['StateDevice', 'PowerOut'],
				 *             guid: $routeParams.deviceGuid
				 *         }, 5, function(message) {
				 *             ketaLogger.info('tagValueListener', message);
				 *         });
				 *     });
				 */
				registerListener: function(filter, sampleRate, handler) {

					if (!angular.isNumber(sampleRate) || sampleRate < MIN_SAMPLE_RATE) {
						return responseReject({
							code: ketaEventBus.RESPONSE_CODE_BAD_REQUEST,
							message: ERROR_INVALID_SAMPLE_RATE
						});
					}

					if (!angular.isFunction(handler)) {
						return responseReject({
							code: ketaEventBus.RESPONSE_CODE_BAD_REQUEST,
							message: ERROR_INVALID_HANDLER
						});
					}

					var deferred = $q.defer();

					// generate UUID for listener
					var listenerUUID = 'CLIENT_' + ketaEventBus.generateUUID() + '_tagValueListener';

					// register handler for replyAddress
					ketaEventBus.registerBusHandler(listenerUUID, handler);

					// register listener for given address
					ketaEventBus.send(SERVICE_ENDPOINT, {
						action: 'registerTagValueListener',
						body: {
							filter: filter,
							sampleRate: sampleRate,
							replyAddress: listenerUUID
						}
					}, function(response) {
						if (response.code === ketaEventBus.RESPONSE_CODE_OK) {
							deferred.resolve(response);
						} else {
							ketaLogger.info(
								SERVICE_ENDPOINT + ':registerTagValueListener',
								response
							);
							deferred.reject(response);
						}
					});

					return deferred.promise;

				}

			};

			return api;

		};

	});
