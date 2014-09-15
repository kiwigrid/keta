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
		var SERVICE_ENDPOINT = 'devices';
		
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
		
		// return service API
		this.$get = function($q, ketaEventBus, ketaLogger) {
			
			/**
			 * @private
			 * @function
			 * @description Return promise with given code and message.
			 * @param {string} message return message
			 * @param {boolean} [resolve=false] resolve or reject
			 * @returns {promise}
			 */
			var responsePromise = function(message, resolve) {
				var deferred = $q.defer();
				if (resolve) {
					deferred.resolve(message);
				} else {
					deferred.reject(message);
				}
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
					
					if (!angular.isNumber(sampleRate) || sampleRate < 5) {
						return responsePromise({
							code: ketaEventBus.RESPONSE_CODE_BAD_REQUEST,
							message: ERROR_INVALID_SAMPLE_RATE
						}, false);
					}
					
					if (!angular.isFunction(handler)) {
						return responsePromise({
							code: ketaEventBus.RESPONSE_CODE_BAD_REQUEST,
							message: ERROR_INVALID_HANDLER
						}, false);
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
							deviceFilter: filter,
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
							deferred.reject(response.message);
						}
					});
					
					return deferred.promise;
					
				}
				
			};
			
			return api;
			
		};
		
	});
