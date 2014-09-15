'use strict';

/**
 * @name keta.servicesLogger
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014
 * @module keta.servicesLogger
 * @description Logger Service
 */
angular.module('keta.servicesLogger', [])
	
	/**
	 * @class ketaLoggerProvider
	 * @propertyOf keta.servicesLogger
	 * @description Logger Provider
	 */
	.provider('ketaLogger', function() {
		
		/**
		 * @const
		 * @private
		 * @description Log level for errors.
		 */
		var LOG_LEVEL_ERROR = 1;
		
		/**
		 * @const
		 * @private
		 * @description Log level for warnings.
		 */
		var LOG_LEVEL_WARNING = 2;
		
		/**
		 * @const
		 * @private
		 * @description Log level for information.
		 */
		var LOG_LEVEL_INFO = 4;
		
		/**
		 * @const
		 * @private
		 * @description Log level for debugging.
		 */
		var LOG_LEVEL_DEBUG = 8;
		
		/**
		 * @const
		 * @private
		 * @description Log level for all categories.
		 */
		var LOG_LEVEL_ALL =
			LOG_LEVEL_ERROR |
			LOG_LEVEL_WARNING |
			LOG_LEVEL_INFO |
			LOG_LEVEL_DEBUG;
		
		/**
		 * @const
		 * @private
		 * @description Log level mappings.
		 */
		var LOG_LEVEL_MAPPINGS = {};
		
		LOG_LEVEL_MAPPINGS[LOG_LEVEL_ERROR] = 'ERROR';
		LOG_LEVEL_MAPPINGS[LOG_LEVEL_WARNING] = 'WARNING';
		LOG_LEVEL_MAPPINGS[LOG_LEVEL_INFO] = 'INFO';
		LOG_LEVEL_MAPPINGS[LOG_LEVEL_DEBUG] = 'DEBUG';
		LOG_LEVEL_MAPPINGS[LOG_LEVEL_ALL] = 'ALL';
		
		/**
		 * @function
		 * @private
		 * @description Get mapping for given log level.
		 */
		var getLevelMapping = function(level) {
			return (angular.isDefined(LOG_LEVEL_MAPPINGS[level])) ?
				LOG_LEVEL_MAPPINGS[level] : 'LEVEL ' + level;
		};
		
		/**
		 * @const
		 * @private
		 * @description Simple logger method.
		 */
		var SIMPLE_LOGGER = function(level, message, request, response) {
			if (config.enabled && (config.level & level)) {
				console.log(getLevelMapping(level), message, request, response);
			}
		};
		
		/**
		 * @const
		 * @private
		 * @description Advanced logger method.
		 */
		var ADVANCED_LOGGER = function(level, message, request, response) {
			if (config.enabled && (config.level & level)) {
				console.log(
					'%c[' + getLevelMapping(level) + ' ' + new Date().toUTCString() + ']\n' +
					'%c' + message + '\n' +
					'%c' + (angular.isDefined(request) ? JSON.stringify(request, null, 4) + '\n' : '') +
					'%c' + (angular.isDefined(response) ? JSON.stringify(response, null, 4) + '\n' : ''),
					'color:#acbf2f', 'color:#333', 'color:#999', 'color:#333'
				);
			}
		};
		
		/**
		 * @const
		 * @private
		 * @description Internal stack for configuration.
		 * @property {boolean} enabled enable logging
		 * @property {number} level log level
		 * @property {function} logger logger method
		 */
		var config = {
			enabled: false,
			level: LOG_LEVEL_ERROR,
			logger: SIMPLE_LOGGER
		};
		
		// CONFIG
		// ------
		
		/**
		 * @name LOG_LEVEL_ERROR
		 * @const
		 * @memberOf ketaLoggerProvider
		 * @description Log level for errors.
		 */
		this.LOG_LEVEL_ERROR = LOG_LEVEL_ERROR;
		
		/**
		 * @name LOG_LEVEL_WARNING
		 * @const
		 * @memberOf ketaLoggerProvider
		 * @description Log level for warnings.
		 */
		this.LOG_LEVEL_WARNING = LOG_LEVEL_WARNING;
		
		/**
		 * @name LOG_LEVEL_INFO
		 * @const
		 * @memberOf ketaLoggerProvider
		 * @description Log level for information.
		 */
		this.LOG_LEVEL_INFO = LOG_LEVEL_INFO;
		
		/**
		 * @name LOG_LEVEL_DEBUG
		 * @const
		 * @memberOf ketaLoggerProvider
		 * @description Log level for debugging.
		 */
		this.LOG_LEVEL_DEBUG = LOG_LEVEL_DEBUG;
		
		/**
		 * @name LOG_LEVEL_ALL
		 * @const
		 * @memberOf ketaLoggerProvider
		 * @description Log level for all categories.
		 */
		this.LOG_LEVEL_ALL = LOG_LEVEL_ALL;
		
		/**
		 * @name LEVEL_MAPPINGS
		 * @const
		 * @memberOf ketaLoggerProvider
		 * @description Log level mappings.
		 */
		this.LOG_LEVEL_MAPPINGS = LOG_LEVEL_MAPPINGS;
		
		/**
		 * @name LEVEL_MAPPINGS
		 * @function
		 * @memberOf ketaLoggerProvider
		 * @description Get mapping for given log level.
		 */
		this.getLevelMapping = getLevelMapping;
		
		/**
		 * @name SIMPLE_LOGGER
		 * @const
		 * @memberOf ketaLoggerProvider
		 * @description Simple logger method.
		 */
		this.SIMPLE_LOGGER = SIMPLE_LOGGER;
		
		/**
		 * @name ADVANCED_LOGGER
		 * @const
		 * @memberOf ketaLoggerProvider
		 * @description Advanced logger method.
		 */
		this.ADVANCED_LOGGER = ADVANCED_LOGGER;
		
		/**
		 * @name enableLogging
		 * @function
		 * @memberOf ketaLoggerProvider
		 * @description Enable logging.
		 * @example
		 * angular.module('exampleApp', [])
		 *     .config(function(ketaLoggerProvider) {
		 *         ketaLoggerProvider.enableLogging();
		 *     });
		 */
		this.enableLogging = function() {
			config.enabled = true;
		};
		
		/**
		 * @name disableLogging
		 * @function
		 * @memberOf ketaLoggerProvider
		 * @description Disable logging.
		 * @example
		 * angular.module('exampleApp', [])
		 *     .config(function(ketaLoggerProvider) {
		 *         ketaLoggerProvider.disableLogging();
		 *     });
		 */
		this.disableLogging = function() {
			config.enabled = false;
		};
		
		/**
		 * @name setLevel
		 * @function
		 * @memberOf ketaLoggerProvider
		 * @description Set log level.
		 * @param {number} level log level
		 * @example
		 * angular.module('exampleApp', [])
		 *     .config(function(ketaLoggerProvider) {
		 *         ketaLoggerProvider.setLevel(ketaLoggerProvider.LOG_LEVEL_DEBUG);
		 *     });
		 */
		this.setLevel = function(level) {
			if (angular.isNumber(level)) {
				config.level = level;
			}
		};
		
		/**
		 * @name setLogger
		 * @function
		 * @memberOf ketaLoggerProvider
		 * @description Set logger method. Also capable for filtering log messages.
		 * @param {function} logger logger method
		 * @example
		 * angular.module('exampleApp', [])
		 *     .config(function(ketaLoggerProvider) {
		 *         ketaLoggerProvider.setLogger(ketaLoggerProvider.SIMPLE_LOGGER);
		 *     });
		 * @example
		 * angular.module('exampleApp', [])
		 *     .config(function(ketaLoggerProvider) {
		 *         ketaLoggerProvider.setLogger(ketaLoggerProvider.ADVANCED_LOGGER);
		 *     });
		 * @example
		 * angular.module('exampleApp', [])
		 *     .config(function(ketaLoggerProvider) {
		 *         ketaLoggerProvider.setLogger(function(level, message, request, response) {
		 *             if (message.indexOf('Devices') !== -1) {
		 *                 ketaLoggerProvider.SIMPLE_LOGGER(level, message, request, response);
		 *             }
		 *         });
		 *     });
		 */
		this.setLogger = function(logger) {
			if (angular.isFunction(logger)) {
				config.logger = logger;
			}
		};
		
		/**
		 * @name getConfig
		 * @function
		 * @memberOf ketaLoggerProvider
		 * @description Get configuration object.
		 * @returns {object} config object
		 * @example
		 * angular.module('exampleApp')
		 *     .config(function(ketaLoggerProvider) {
		 *         var config = ketaLoggerProvider.getConfig();
		 *     });
		 */
		this.getConfig = function() {
			return config;
		};
		
		// RUN
		// ---
		
		// keep reference
		var that = this;
		
		// return service API
		this.$get = function() {
			
			/**
			 * @class ketaLoggerService
			 * @propertyOf ketaLoggerProvider
			 * @description Logger Service
			 */
			var api = {
				
				/**
				 * @const
				 * @memberOf ketaLoggerService
				 * @description Log level for errors.
				 */
				LOG_LEVEL_ERROR: LOG_LEVEL_ERROR,
				
				/**
				 * @const
				 * @memberOf ketaLoggerService
				 * @description Log level for warnings.
				 */
				LOG_LEVEL_WARNING: LOG_LEVEL_WARNING,
				
				/**
				 * @const
				 * @memberOf ketaLoggerService
				 * @description Log level for information.
				 */
				LOG_LEVEL_INFO: LOG_LEVEL_INFO,
				
				/**
				 * @const
				 * @memberOf ketaLoggerService
				 * @description Log level for debugging.
				 */
				LOG_LEVEL_DEBUG: LOG_LEVEL_DEBUG,
				
				/**
				 * @const
				 * @memberOf ketaLoggerService
				 * @description Log level for all categories.
				 */
				LOG_LEVEL_ALL: LOG_LEVEL_ALL,
				
				/**
				 * @const
				 * @memberOf ketaLoggerService
				 * @description Log level mappings.
				 */
				LOG_LEVEL_MAPPINGS: LOG_LEVEL_MAPPINGS,
				
				/**
				 * @function
				 * @memberOf ketaLoggerService
				 * @description Get mapping for given log level.
				 * @param {number} level log level to map
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaLogger) {
				 *         var level = ketaLogger.getLevelMapping(ketaLogger.getLevel());
				 *     });
				 */
				getLevelMapping: that.getLevelMapping,
				
				/**
				 * @const
				 * @memberOf ketaLogger
				 * @description Simple logger method.
				 */
				SIMPLE_LOGGER: that.SIMPLE_LOGGER,
				
				/**
				 * @const
				 * @memberOf ketaLogger
				 * @description Advanced logger method.
				 */
				ADVANCED_LOGGER: that.ADVANCED_LOGGER,
				
				/**
				 * @function
				 * @memberOf ketaLoggerService
				 * @description Enable logging.
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaLogger) {
				 *         ketaLogger.enableLogging();
				 *     });
				 */
				enableLogging: that.enableLogging,
				
				/**
				 * @function
				 * @memberOf ketaLoggerService
				 * @description Disable logging.
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaLogger) {
				 *         ketaLogger.disableLogging();
				 *     });
				 */
				disableLogging: that.disableLogging,
				
				/**
				 * @function
				 * @memberOf ketaLoggerService
				 * @description Get configured log level.
				 * @returns {number} logLevel
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaLogger) {
				 *         var logLevel = ketaLogger.getLogLevel();
				 *     });
				 */
				getLevel: function() {
					return config.level;
				},
				
				/**
				 * @function
				 * @memberOf ketaLoggerService
				 * @description Set configured log level.
				 * @param {number} level log level to set
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaLogger) {
				 *         ketaLogger.setLogLevel(ketaLogger.LOG_LEVEL_DEBUG);
				 *     });
				 */
				setLevel: that.setLevel,
				
				/**
				 * @function
				 * @memberOf ketaLoggerService
				 * @description Set logger method. Also capable for filtering log messages.
				 * @param {function} logger logger method
				 * @example
				 * angular.module('exampleApp', [])
				 *     .config(function(ketaLogger) {
				 *         ketaLogger.setLogger(ketaLogger.SIMPLE_LOGGER);
				 *     });
				 * @example
				 * angular.module('exampleApp', [])
				 *     .config(function(ketaLogger) {
				 *         ketaLogger.setLogger(ketaLogger.ADVANCED_LOGGER);
				 *     });
				 * @example
				 * angular.module('exampleApp', [])
				 *     .config(function(ketaLogger) {
				 *         ketaLogger.setLogger(function(level, message, request, response) {
				 *             if (message.indexOf('Devices') !== -1) {
				 *                 ketaLogger.SIMPLE_LOGGER(level, message, request, response);
				 *             }
				 *         });
				 *     });
				 */
				setLogger: that.setLogger,
				
				/**
				 * @function
				 * @memberOf ketaLoggerService
				 * @description Log message with given level.
				 * @param {number} level log level to use
				 * @param {string} message log message
				 * @param {mixed} request request to log
				 * @param {mixed} response response to log
				 * @example
				 * angular.module('exampleApp')
				 *     .controller('exampleController', function(ketaLogger) {
				 *         
				 *         // define it
				 *         var level = ketaLogger.LOG_LEVEL_DEBUG;
				 *         var message = 'Log message';
				 *         var request = {
				 *             address: 'address',
				 *             params: {
				 *                 guid: 'GUID
				 *             }
				 *         };
				 *         var response = 'Nothing found';
				 *         
				 *         // log it
				 *         ketaLogger.log(level, message, request, response);
				 *         
				 *     });
				 */
				log: function(level, message, request, response) {
					config.logger(level, message, request, response);
				},
				
				/**
				 * @function
				 * @memberOf ketaLoggerService
				 * @description Log message with error level.
				 * @param {string} message log message
				 * @param {mixed} request request to log
				 * @param {mixed} response response to log
				 * @see ketaLoggerService.log
				 */
				error: function(message, request, response) {
					this.log(LOG_LEVEL_ERROR, message, request, response);
				},
				
				/**
				 * @function
				 * @memberOf ketaLoggerService
				 * @description Log message with warning level.
				 * @param {string} message log message
				 * @param {mixed} request request to log
				 * @param {mixed} response response to log
				 * @see ketaLoggerService.log
				 */
				warning: function(message, request, response) {
					this.log(LOG_LEVEL_WARNING, message, request, response);
				},
				
				/**
				 * @function
				 * @memberOf ketaLoggerService
				 * @description Log message with info level.
				 * @param {string} message log message
				 * @param {mixed} request request to log
				 * @param {mixed} response response to log
				 * @see ketaLoggerService.log
				 */
				info: function(message, request, response) {
					this.log(LOG_LEVEL_INFO, message, request, response);
				},
				
				/**
				 * @function
				 * @memberOf ketaLoggerService
				 * @description Log message with debug level.
				 * @param {string} message log message
				 * @param {mixed} request request to log
				 * @param {mixed} response response to log
				 * @see ketaLoggerService.log
				 */
				debug: function(message, request, response) {
					this.log(LOG_LEVEL_DEBUG, message, request, response);
				}
				
			};
			
			return api;
		};
		
	});
