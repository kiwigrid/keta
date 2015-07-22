'use strict';

/**
 * @name keta.utils.Application
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.utils.Application
 * @description
 * <p>
 *   Application service utilities for cross-component usage.
 * </p>
 */

angular.module('keta.utils.Application',
	[
		'keta.services.ApplicationSet',
		'keta.utils.Common'
	])

	/**
	 * @class ApplicationUtils
	 * @propertyOf keta.utils.Application
	 * @description Application Utils Factory
	 */
	.factory('ApplicationUtils', function ApplicationUtils(
		$log, $q,
		ApplicationSet, EventBusManager, CommonUtils
	) {

		var deferred = {
			getAppList: null
		};

		return {

			/**
			 * @name getAppName
			 * @memberOf ApplicationUtils
			 * @description
			 * <p>
			 *   uiLocale is the current (user set) UI language of the running app.
			 *   Can be either short ('de') or long ('en-US') format.
			 * </p>
			 * @param {object} labels object of all labels grouped by locale keys
			 * @param {string} uiLocale current locale
			 * @returns {string} application localized application name
			 */

			getAppName: function getAppName(labels, uiLocale) {
				return CommonUtils.getLabelByLocale('name', labels, uiLocale);
			},

			/**
			 * @name getAppList
			 * @function
			 * @memberOf ApplicationUtils
			 * @description
			 * <p>
			 *   Returns an array with all apps that are not blacklisted and have an entryUri. It is also
			 *   possible to get apps for a specific user by providing an appropriate filter with key userId.
			 * </p>
			 * @param {object} options options to configure the API call
			 * @returns {promise} app list promise
			 * @example
			 * angular.module('exampleApp', ['keta.utils.Application'])
			 *     .controller('ExampleController', function(ApplicationUtils) {
			 *
			 *         // get apps with default options
			 *         // eventBusId: kiwibus
			 *         // forceRefresh: false
			 *         // filter: {} (no filter applied)
			 *         ApplicationUtils.getAppList().then(function(apps) {
			 *             // ...
			 *         });
			 *
			 *         // get apps with options in place
			 *         ApplicationUtils.getAppList({
			 *             eventBusId: 'myCustomEventBusId',
			 *             forceRefresh: true,
			 *             filter: {
			 *                 userId: 'john.doe'
			 *             },
			 *             excludeAppIds: {
			 *                 'kiwigrid.clouddesktop': true
			 *             }
			 *         }).then(function(apps) {
			 *             // ...
			 *         });
			 *
			 *     });
			 */
			getAppList: function getAppList(options) {

				var DEFAULT_OPTIONS = {
					eventBusId: 'kiwibus',
					forceRefresh: false,
					filter: {},
					excludeAppIds: {}
				};

				var usedOptions = angular.extend({}, DEFAULT_OPTIONS, options || {});

				if (deferred.getAppList === null || usedOptions.forceRefresh === true) {
					deferred.getAppList = $q.defer();

					ApplicationSet.create(EventBusManager.get(usedOptions.eventBusId))
						.filter(usedOptions.filter)
						.query()
						.then(function(reply) {

							if (angular.isDefined(reply.result) &&
								angular.isDefined(reply.result.items)) {

								var filteredApps = [];
								angular.forEach(reply.result.items, function(app) {
									if (angular.isDefined(app.appId) &&
										angular.isDefined(app.visible) &&
										app.visible === true &&
										!angular.isDefined(usedOptions.excludeAppIds[app.appId]) ||
										usedOptions.excludeAppIds[app.appId] === false	&&
										angular.isString(app.entryUri) && app.entryUri !== '' &&
										CommonUtils.doesPropertyExist(app, 'meta.i18n.en.name')) {

										filteredApps.push(app);
									}
								});

								deferred.getAppList.resolve(filteredApps);

							} else {
								var errorMessage = 'Something bad happened. Got no reply.';
								deferred.getAppList.reject(errorMessage);
							}
						}, function() {
							var errorMessage = 'Could not load application information.';
							deferred.getAppList.reject(errorMessage);
						});

				}

				return deferred.getAppList.promise;
			}

		};

	});
