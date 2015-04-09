'use strict';

/**
 * @name keta.services.ApplicationSet
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.ApplicationSet
 * @description ApplicationSet Provider
 */

angular.module('keta.services.ApplicationSet',
	[
		'keta.services.Application'
	])

	/**
	 * @class ApplicationSetProvider
	 * @propertyOf keta.services.ApplicationSet
	 * @description ApplicationSet Provider
	 */
	.provider('ApplicationSet', function ApplicationSetProvider() {

		var DEFAULT_OFFSET = 0;
		var DEFAULT_LIMIT = 50;

		this.$get = function ApplicationSetService(
			$q, $rootScope, $log,
			Application, EventBusDispatcher, EventBusManager) {

			/**
			 * @class ApplicationSetInstance
			 * @propertyOf ApplicationSetProvider
			 * @description ApplicationSet Instance
			 * @param {EventBus} givenEventBus eventBus to use for ApplicationSetInstance
			 */
			var ApplicationSetInstance = function(givenEventBus) {

				// keep reference
				var that = this;

				// save EventBus instance
				var eventBus = givenEventBus;

				// internal params object
				var params = {};

				/**
				 * @name filter
				 * @function
				 * @memberOf ApplicationSetInstance
				 * @description
				 * <p>
				 *   Adds a filter before ApplicationSet query is sent to EventBus.
				 * </p>
				 * @param {Object} filter filter to use
				 * @returns {ApplicationSetInstance} ApplicationSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.ApplicationSet'])
				 *     .controller('ExampleController', function(ApplicationSet) {
				 *         ApplicationSet.create(eventBus)
				 *             .filter({
				 *                 userId: 'login'
				 *             })
				 *             .query()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 *     });
				 */
				that.filter = function(filter) {
					params.filter = filter;
					return that;
				};

				/**
				 * @name project
				 * @function
				 * @memberOf ApplicationSetInstance
				 * @description
				 * <p>
				 *   Adds a projection before ApplicationSet query is sent to EventBus.
				 * </p>
				 * @param {Object} projection projection to use
				 * @returns {ApplicationSetInstance} ApplicationSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.ApplicationSet'])
				 *     .controller('ExampleController', function(ApplicationSet) {
				 *         ApplicationSet.create(eventBus)
				 *             .filter({
				 *                 userId: 'login'
				 *             })
				 *             .project({
				 *                 appId: 1
				 *             })
				 *             .query()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 *     });
				 */
				that.project = function(projection) {
					params.projection = projection;
					return that;
				};

				/**
				 * @name sort
				 * @function
				 * @memberOf ApplicationSetInstance
				 * @description
				 * <p>
				 *   Adds a sorting before ApplicationSet query is sent to EventBus.
				 * </p>
				 * @param {Object} sorting sorting to use
				 * @returns {ApplicationSetInstance} ApplicationSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.ApplicationSet'])
				 *     .controller('ExampleController', function(ApplicationSet) {
				 *         ApplicationSet.create(eventBus)
				 *             .filter({
				 *                 userId: 'login'
				 *             })
				 *             .sort({
				 *                 'appId': 1
				 *             })
				 *             .query()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 *     });
				 */
				that.sort = function(sorting) {
					params.sorting = sorting;
					return that;
				};

				/**
				 * @name paginate
				 * @function
				 * @memberOf ApplicationSetInstance
				 * @description
				 * <p>
				 *   Adds a pagination before ApplicationSet query is sent to EventBus.
				 * </p>
				 * @param {Object} pagination pagination to use
				 * @returns {ApplicationSetInstance} ApplicationSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.ApplicationSet'])
				 *     .controller('ExampleController', function(ApplicationSet) {
				 *         ApplicationSet.create(eventBus)
				 *             .filter({
				 *                 userId: 'login'
				 *             })
				 *             .paginate({
				 *                 offset: 0,
				 *                 limit: 50
				 *             })
				 *             .query()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 *     });
				 */
				that.paginate = function(pagination) {
					if (angular.isDefined(pagination)) {
						params.offset = angular.isDefined(pagination.offset) ? pagination.offset : DEFAULT_OFFSET;
						params.limit = angular.isDefined(pagination.limit) ? pagination.limit : DEFAULT_LIMIT;
					} else {
						params.offset = DEFAULT_OFFSET;
						params.limit = DEFAULT_LIMIT;
					}
					return that;
				};

				/**
				 * @name query
				 * @function
				 * @memberOf ApplicationSetInstance
				 * @description
				 * <p>
				 *   Finally executes ApplicationSet query by sending it to the associated EventBus instance.
				 * </p>
				 * @returns {promise} Promise which is resolved when query is returned
				 * @example
				 * angular.module('exampleApp', ['keta.services.ApplicationSet'])
				 *     .controller('ExampleController', function(ApplicationSet) {
				 *         ApplicationSet.create(eventBus)
				 *             .filter({
				 *                 userId: 'login'
				 *             })
				 *             .query()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 *     });
				 */
				that.query = function() {
					var deferred = $q.defer();

					EventBusDispatcher.send(eventBus, 'appservice', {
						action: 'getAppsInfo',
						params: params
					}, function(reply) {
						if (reply) {
							// inject used params
							reply.params = params;

							if (reply.code === EventBusDispatcher.RESPONSE_CODE_OK) {

								// create ApplicationInstances
								if (angular.isDefined(reply.result) &&
									angular.isDefined(reply.result.items)) {
									angular.forEach(reply.result.items, function(item, index) {
										reply.result.items[index] = Application.create(eventBus, item);
									});
								}

								// log if in debug mode
								if (EventBusManager.inDebugMode()) {
									$log.request(['appservice', {
										action: 'getUserApplications',
										params: params
									}, reply], $log.ADVANCED_FORMATTER);
								}

								deferred.resolve(reply);
								$rootScope.$digest();

							} else {
								deferred.reject(reply);
							}
						} else {
							deferred.reject('Something bad happened. Got no reply.');
						}
					});

					return deferred.promise;
				};

			};

			/**
			 * @class ApplicationSet
			 * @propertyOf ApplicationSetProvider
			 * @description ApplicationSet Service
			 */
			var api = {

				/**
				 * @function
				 * @memberOf ApplicationSet
				 * @description
				 * <p>
				 *   Creates an ApplicationSetInstance with given EventBus instance.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance to use for communication
				 * @returns {ApplicationSetInstance} ApplicationSetInstance created
				 * @example
				 * angular.module('exampleApp', ['keta.services.ApplicationSet'])
				 *     .controller('ExampleController', function(ApplicationSet) {
				 *         var applicationSet = ApplicationSet.create(eventBus);
				 *     });
				 */
				create: function(eventBus) {
					return new ApplicationSetInstance(eventBus);
				},

				/**
				 * @function
				 * @memberOf ApplicationSet
				 * @description
				 * <p>
				 *   Returns index of given Application in ApplicationSet by comparing app IDs.
				 * </p>
				 * @param {ApplicationSetInstance} set ApplicationSetInstance to search in
				 * @param {ApplicationInstance} application ApplicationInstance to search for
				 * @returns {number} index
				 * @example
				 * angular.module('exampleApp', ['keta.services.ApplicationSet'])
				 *     .controller('ExampleController', function(ApplicationSet) {
				 *         ApplicationSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 // index equals 0 after the call
				 *                 var index = ApplicationSet.indexOf(reply, reply.result.items[0]);
				 *             });
				 *     });
				 */
				indexOf: function(set, application) {
					var index = -1;
					if (angular.isDefined(set.result) &&
						angular.isDefined(set.result.items)) {
						angular.forEach(set.result.items, function(item, key) {
							if (item.appId === application.appId) {
								index = key;
							}
						});
					}
					return index;
				},

				/**
				 * @function
				 * @memberOf ApplicationSet
				 * @description
				 * <p>
				 *   Returns number of applications in given ApplicationSet.
				 * </p>
				 * @param {ApplicationSetInstance} set ApplicationSetInstance to search in
				 * @returns {number} number of applications
				 * @example
				 * angular.module('exampleApp', ['keta.services.ApplicationSet'])
				 *     .controller('ExampleController', function(ApplicationSet) {
				 *         ApplicationSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 // length equals number of applications in ApplicationSet
				 *                 var length = ApplicationSet.length(reply);
				 *             });
				 *     });
				 */
				length: function(set) {
					var length =
						angular.isDefined(set.result) &&
						angular.isDefined(set.result.items) &&
						angular.isArray(set.result.items) ? set.result.items.length : 0;
					return length;
				},

				/**
				 * @function
				 * @memberOf ApplicationSet
				 * @description
				 * <p>
				 *   Returns application in given ApplicationSet by specified index.
				 * </p>
				 * @param {ApplicationSetInstance} set ApplicationSetInstance to search in
				 * @param {number} index Index of application to return
				 * @returns {ApplicationInstance} ApplicationInstance retrieved from set
				 * @example
				 * angular.module('exampleApp', ['keta.services.ApplicationSet'])
				 *     .controller('ExampleController', function(ApplicationSet) {
				 *         ApplicationSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 // application equals first item after the call
				 *                 var application = ApplicationSet.get(reply, 0);
				 *             });
				 *     });
				 */
				get: function(set, index) {
					var application =
						angular.isDefined(set.result) &&
						angular.isDefined(set.result.items) &&
						angular.isDefined(set.result.items[index]) ? set.result.items[index] : null;
					return application;
				},

				/**
				 * @function
				 * @memberOf ApplicationSet
				 * @description
				 * <p>
				 *   Returns all applications in given ApplicationSet.
				 * </p>
				 * @param {ApplicationSetInstance} set ApplicationSetInstance to search in
				 * @returns {Array} All ApplicationInstances retrieved from set
				 * @example
				 * angular.module('exampleApp', ['keta.services.ApplicationSet'])
				 *     .controller('ExampleController', function(ApplicationSet) {
				 *         ApplicationSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 var applications = ApplicationSet.getAll(reply);
				 *             });
				 *     });
				 */
				getAll: function(set) {
					var applications =
						angular.isDefined(set.result) &&
						angular.isDefined(set.result.items) ? set.result.items : [];
					return applications;
				}

			};

			return api;

		};

	});
