'use strict';

/**
 * @name keta.services.Logger
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.Logger
 * @description
 * <p>
 *   Logger Decorator
 * </p>
 * <p>
 *   A bitmask is used to define the <code>logLevel</code> of the whole application
 *   (if <code>'common.logLevel'</code> is set in <code>AppContext</code>). The numeric <code>logLevel</code>
 *   constants are defined on the <code>$log</code> service as <code>$log.LOG_LEVEL_LOG</code>,
 *   <code>$log.LOG_LEVEL_DEBUG</code> and so on.
 * </p>
 * <p>
 *   Because a bitwise & is used to determine the <code>logLevel</code> you have to specify all levels you want to
 *   have enabled using a bitwise | operator. You get the same logLevel by adding up the numeric value of all
 *   wanted levels and subtracting 1 from the result.
 * </p>
 * <p>
 *   The decorator also provides the new logging methods <code>$log.request(logMessage)</code> and
 *   <code>$log.event(logMessage)</code> which are described inside of <code>LoggerDecorator</code>.
 *   This section also provides information about the usage of <code>$log.ADVANCED_FORMATTER</code>.
 * </p>
  * @example
 * // enable levels 'log', 'debug', 'info'
 * "logLevel": $log.LOG_LEVEL_LOG | $log.LOG_LEVEL_DEBUG | $log.LOG_LEVEL_INFO
 * // same logLevel in numeric notation ($log.LOG_LEVEL_LOG + $log.LOG_LEVEL_DEBUG + $log.LOG_LEVEL_INFO)
 * "logLevel": 7
 */

angular.module('keta.services.Logger',
	[
		'keta.services.AppContext'
	])

	/**
	 * @class LoggerConfig
	 * @propertyOf keta.services.Logger
	 * @description Logger Config
	 */
	.config(function LoggerConfig($provide, AppContextProvider) {

		/**
		 * @class LoggerDecorator
		 * @propertyOf LoggerConfig
		 * @description Logger Decorator
		 * @param {Object} $delegate delegated implementation
		 */
		$provide.decorator('$log', function LoggerDecorator($delegate) {

			// logLevel constants

			/**
			 * @name LOG_LEVEL_LOG
			 * @memberOf LoggerDecorator
			 * @constant {number}
			 * @description
			 * <p>
			 *   Usage of $log.log is enabled.
			 * </p>
			 */
			$delegate.LOG_LEVEL_LOG = 1;

			/**
			 * @name LOG_LEVEL_DEBUG
			 * @memberOf LoggerDecorator
			 * @constant {number}
			 * @description
			 * <p>
			 *   Usage of $log.debug is enabled.
			 * </p>
			 */
			$delegate.LOG_LEVEL_DEBUG = 2;

			/**
			 * @name LOG_LEVEL_INFO
			 * @memberOf LoggerDecorator
			 * @constant {number}
			 * @description
			 * <p>
			 *   Usage of $log.info is enabled.
			 * </p>
			 */
			$delegate.LOG_LEVEL_INFO = 4;

			/**
			 * @name LOG_LEVEL_WARN
			 * @memberOf LoggerDecorator
			 * @constant {number}
			 * @description
			 * <p>
			 *   Usage of $log.warn is enabled.
			 * </p>
			 */
			$delegate.LOG_LEVEL_WARN = 8;

			/**
			 * @name LOG_LEVEL_ERROR
			 * @memberOf LoggerDecorator
			 * @constant {number}
			 * @description
			 * <p>
			 *   Usage of $log.error is enabled.
			 * </p>
			 */
			$delegate.LOG_LEVEL_ERROR = 16;

			// decorate given logging method
			var decorateLogger = function(originalFn, bitValue) {
				return function() {
					var args = Array.prototype.slice.call(arguments);

					// check logLevel and adjust console output accordingly through bitmask
					if (AppContextProvider.get('common.logLevel') === null ||
						AppContextProvider.get('common.logLevel') === 0 ||
						(AppContextProvider.get('common.logLevel') & bitValue) === bitValue) {
						originalFn.apply(null, args);
					}
				};
			};

			// decorate all the common logging methods
			angular.forEach(['log', 'debug', 'info', 'warn', 'error'], function(o) {
				var bitValue = $delegate['LOG_LEVEL_' + o.toUpperCase()];
				$delegate[o] = decorateLogger($delegate[o], bitValue);
				// this keeps angular-mocks happy
				$delegate[o].logs = [];
			});

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

				$delegate.log(
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
					$delegate.log(messages);
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
