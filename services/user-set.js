'use strict';

/**
 * @name keta.services.UserSet
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.UserSet
 * @description UserSet Provider
 */

angular.module('keta.services.UserSet',
	[
		'keta.services.User'
	])

	/**
	 * @class UserSetProvider
	 * @propertyOf keta.services.UserSet
	 * @description UserSet Provider
	 */
	.provider('UserSet', function UserSetProvider() {

		var DEFAULT_OFFSET = 0;
		var DEFAULT_LIMIT = 50;

		this.$get = function UserSetService(
			$q, $rootScope, $log,
			User, EventBusDispatcher, EventBusManager) {

			/**
			 * @class UserSetInstance
			 * @propertyOf UserSetProvider
			 * @description UserSet Instance
			 * @param {EventBus} givenEventBus eventBus to use for UserSetInstance
			 */
			var UserSetInstance = function(givenEventBus) {

				// keep reference
				var that = this;

				// save EventBus instance
				var eventBus = givenEventBus;

				// internal params object
				var params = {};

				/**
				 * @name filter
				 * @function
				 * @memberOf UserSetInstance
				 * @description
				 * <p>
				 *   Adds a filter before UserSet query is sent to EventBus.
				 * </p>
				 * @param {Object} filter filter to use
				 * @returns {UserSetInstance} UserSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.UserSet'])
				 *     .controller('ExampleController', function(UserSet) {
				 *         UserSet.create(eventBus)
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
				 * @memberOf UserSetInstance
				 * @description
				 * <p>
				 *   Adds a projection before UserSet query is sent to EventBus.
				 * </p>
				 * @param {Object} projection projection to use
				 * @returns {UserSetInstance} UserSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.UserSet'])
				 *     .controller('ExampleController', function(UserSet) {
				 *         UserSet.create(eventBus)
				 *             .project({
				 *                 userId: 1
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
				 * @memberOf UserSetInstance
				 * @description
				 * <p>
				 *   Adds a sorting before UserSet query is sent to EventBus.
				 * </p>
				 * @param {Object} sorting sorting to use
				 * @returns {UserSetInstance} UserSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.UserSet'])
				 *     .controller('ExampleController', function(UserSet) {
				 *         UserSet.create(eventBus)
				 *             .sort({
				 *                 'userId': 1
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
				 * @memberOf UserSetInstance
				 * @description
				 * <p>
				 *   Adds a pagination before UserSet query is sent to EventBus.
				 * </p>
				 * @param {Object} pagination pagination to use
				 * @returns {UserSetInstance} UserSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.UserSet'])
				 *     .controller('ExampleController', function(UserSet) {
				 *         UserSet.create(eventBus)
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
				 * @memberOf UserSetInstance
				 * @description
				 * <p>
				 *   Finally executes UserSet query by sending it to the associated EventBus instance.
				 * </p>
				 * @returns {promise} Promise which is resolved when query is returned
				 * @example
				 * angular.module('exampleApp', ['keta.services.UserSet'])
				 *     .controller('ExampleController', function(UserSet) {
				 *         UserSet.create(eventBus)
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

					EventBusDispatcher.send(eventBus, 'userservice', {
						action: 'getUsers',
						params: params
					}, function(reply) {
						if (reply) {
							// inject used params
							reply.params = params;

							if (reply.code === EventBusDispatcher.RESPONSE_CODE_OK) {

								// create UserInstances
								if (angular.isDefined(reply.result) &&
									angular.isDefined(reply.result.items)) {
									angular.forEach(reply.result.items, function(item, index) {
										reply.result.items[index] = User.create(eventBus, item);
									});
								}

								// log if in debug mode
								if (EventBusManager.inDebugMode()) {
									$log.request([{
										action: 'getUsers',
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
			 * @class UserSet
			 * @propertyOf UserSetProvider
			 * @description UserSet Service
			 */
			var api = {

				/**
				 * @function
				 * @memberOf UserSet
				 * @description
				 * <p>
				 *   Creates a UserSetInstance with given EventBus instance.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance to use for communication
				 * @returns {UserSetInstance} UserSetInstance created
				 * @example
				 * angular.module('exampleApp', ['keta.services.UserSet'])
				 *     .controller('ExampleController', function(UserSet) {
				 *         var userSet = UserSet.create(eventBus);
				 *     });
				 */
				create: function(eventBus) {
					return new UserSetInstance(eventBus);
				},

				/**
				 * @function
				 * @memberOf UserSet
				 * @description
				 * <p>
				 *   Returns index of given User in UserSet by comparing user IDs.
				 * </p>
				 * @param {UserSetInstance} set UserSetInstance to search in
				 * @param {UserInstance} user UserInstance to search for
				 * @returns {number} index
				 * @example
				 * angular.module('exampleApp', ['keta.services.UserSet'])
				 *     .controller('ExampleController', function(UserSet) {
				 *         UserSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 // index equals 0 after the call
				 *                 var index = UserSet.indexOf(reply, reply.result.items[0]);
				 *             });
				 *     });
				 */
				indexOf: function(set, user) {
					var index = -1;
					if (angular.isDefined(set.result) &&
						angular.isDefined(set.result.items)) {
						angular.forEach(set.result.items, function(item, key) {
							if (item.userId === user.userId) {
								index = key;
							}
						});
					}
					return index;
				},

				/**
				 * @function
				 * @memberOf UserSet
				 * @description
				 * <p>
				 *   Returns number of users in given UserSet.
				 * </p>
				 * @param {UserSetInstance} set UserSetInstance to search in
				 * @returns {number} number of users
				 * @example
				 * angular.module('exampleApp', ['keta.services.UserSet'])
				 *     .controller('ExampleController', function(UserSet) {
				 *         UserSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 // length equals number of users in UserSet
				 *                 var length = UserSet.length(reply);
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
				 * @memberOf UserSet
				 * @description
				 * <p>
				 *   Returns user in given UserSet by specified index.
				 * </p>
				 * @param {UserSetInstance} set UserSetInstance to search in
				 * @param {number} index Index of user to return
				 * @returns {UserInstance} UserInstance retrieved from set
				 * @example
				 * angular.module('exampleApp', ['keta.services.UserSet'])
				 *     .controller('ExampleController', function(UserSet) {
				 *         UserSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 // user equals first item after the call
				 *                 var user = UserSet.get(reply, 0);
				 *             });
				 *     });
				 */
				get: function(set, index) {
					var user =
						angular.isDefined(set.result) &&
						angular.isDefined(set.result.items) &&
						angular.isDefined(set.result.items[index]) ? set.result.items[index] : null;
					return user;
				},

				/**
				 * @function
				 * @memberOf UserSet
				 * @description
				 * <p>
				 *   Returns all users in given UserSet.
				 * </p>
				 * @param {UserSetInstance} set UserSetInstance to search in
				 * @returns {Array} All UserInstances retrieved from set
				 * @example
				 * angular.module('exampleApp', ['keta.services.UserSet'])
				 *     .controller('ExampleController', function(UserSet) {
				 *         UserSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 var users = UserSet.getAll(reply);
				 *             });
				 *     });
				 */
				getAll: function(set) {
					var users =
						angular.isDefined(set.result) &&
						angular.isDefined(set.result.items) ? set.result.items : [];
					return users;
				}

			};

			return api;

		};

	});
