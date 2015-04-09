'use strict';

/**
 * @name keta.services.Logger
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.Logger
 * @description Logger Decorator
 */

/*eslint no-console:0*/

angular.module('keta.services.Logger', [])

	/**
	 * @class LoggerConfig
	 * @propertyOf keta.services.Logger
	 * @description Logger Config
	 */
	.config(function LoggerConfig($provide) {

		/**
		 * @class LoggerDecorator
		 * @propertyOf LoggerConfig
		 * @description Logger Decorator
		 * @param {Object} $delegate delegated implementation
		 */
		$provide.decorator('$log', function LoggerDecorator($delegate) {

			/**
			 * @name ADVANCED_FORMATTER
			 * @function
			 * @memberOf LoggerDecorator
			 * @description
			 * <p>
			 *   Formats a message in an advanced, colored manner.
			 * </p>
			 * @param {Array} messages Messages as array
			 * @returns {void} returns nothing
			 * @example
			 * angular.module('exampleApp', ['keta.services.Logger'])
			 *     .controller('ExampleController', function($log) {
			 *         $log.request([request, response], $log.ADVANCED_FORMATTER);
			 *     });
			 */
			$delegate.ADVANCED_FORMATTER = function(messages) {

				if (!angular.isArray(messages)) {
					messages = [messages];
				}

				var output = '%c[' + new Date().toISOString() + ']\n%c';
				angular.forEach(messages, function(message) {
					output += JSON.stringify(message, null, '\t') + '\n';
				});

				console.log(
					output,
					'color:#acbf2f;font-weight:bold;',
					'color:#333;font-weight:normal;'
				);

			};

			/**
			 * @name request
			 * @function
			 * @memberOf LoggerDecorator
			 * @description
			 * <p>
			 *   Logs a message-based request using <code>console.log</code>. Additionally a custom or
			 *   predefined formatter (<code>ADVANCED_FORMATTER</code>) can be specified.
			 * </p>
			 * @param {Array} messages Messages to log
			 * @param {function} [formatter] Formatter to use
			 * @returns {void} returns nothing
			 * @example
			 * angular.module('exampleApp', ['keta.services.Logger'])
			 *     .controller('ExampleController', function($log) {
			 *
			 *         // use no formatter
			 *         $log.request([request, response]);
			 *
			 *         // use ADVANCED_FORMATTER
			 *         $log.request([request, response], $log.ADVANCED_FORMATTER);
			 *
			 *         // use custom formatter
			 *         $log.request([request, response], function(messages) {
			 *             // custom logging
			 *         });
			 *
			 *     });
			 */
			$delegate.request = function(messages, formatter) {
				if (angular.isDefined(formatter) && angular.isFunction(formatter)) {
					formatter(messages);
				} else {
					console.log(messages);
				}
			};

			/**
			 * @name event
			 * @function
			 * @memberOf LoggerDecorator
			 * @description
			 * <p>
			 *   Logs a message-based event using <code>console.log</code>. Additionally a custom or
			 *   predefined formatter (<code>ADVANCED_FORMATTER</code>) can be specified.
			 * </p>
			 * @param {Array} messages Messages to log
			 * @param {function} [formatter] Formatter to use
			 * @returns {void} returns nothing
			 * @example
			 * angular.module('exampleApp', ['keta.services.Logger'])
			 *     .controller('ExampleController', function($log) {
			 *
			 *         // use no formatter
			 *         $log.event(event);
			 *
			 *         // use ADVANCED_FORMATTER
			 *         $log.event(event, $log.ADVANCED_FORMATTER);
			 *
			 *         // use custom formatter
			 *         $log.event(event, function(messages) {
			 *             // custom logging
			 *         });
			 *
			 *     });
			 */
			$delegate.event = function(messages, formatter) {
				$delegate.request(messages, formatter);
			};

			return $delegate;

		});

	});
