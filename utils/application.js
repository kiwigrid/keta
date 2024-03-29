'use strict';

/**
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

	.constant('ketaApplicationUtilsConstants', {

		// media type of assets
		ASSET_MEDIA_TYPE: {
			APPICON: 'APPICON',
			FAVICON: 'FAVICON',
			SCREENSHOT: 'SCREENSHOT',
			TOUCHICON: 'TOUCHICON',
			VIDEO: 'VIDEO'
		},

		// type of authors
		AUTHOR_TYPE: {
			DEVELOPER: 'DEVELOPER',
			SELLER: 'SELLER'
		}

	})

	/**
	 * @class ApplicationUtils
	 * @propertyOf keta.utils.Application
	 * @description Application Utils Factory
	 */
	.factory('ketaApplicationUtils', function ApplicationUtils(
		$q,
		ketaApplicationSet, ketaEventBusManager, ketaCommonUtils,
		ketaApplicationUtilsConstants
	) {

		var deferred = {
			getAppList: null
		};

		return {

			/**
			 * @name getAppList
			 * @function
			 * @description
			 * <p>
			 *   Returns an array with all apps that are not blacklisted and have an entryUri. It is also
			 *   possible to get apps for a specific user by providing an appropriate filter with key userId.
			 * </p>
			 * @param {object} options options to configure the API call
			 * @returns {promise} app list promise
			 * @example
			 * angular.module('exampleApp', ['keta.utils.Application'])
			 *     .controller('ExampleController', function(ketaApplicationUtils) {
			 *
			 *         // get apps with default options
			 *         // eventBusId: kiwibus
			 *         // forceRefresh: false
			 *         // filter: {} (no filter applied)
			 *         ketaApplicationUtils.getAppList().then(function(apps) {
			 *             // ...
			 *         });
			 *
			 *         // get apps with options in place
			 *         ketaApplicationUtils.getAppList({
			 *             eventBusId: 'myCustomEventBusId',
			 *             forceRefresh: true,
			 *             filter: {
			 *                 userId: 'john.doe'
			 *             },
			 *             excludeAppIds: {
			 *                 'kiwigrid.usersettingsapp': true
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

					ketaApplicationSet.create(ketaEventBusManager.get(usedOptions.eventBusId))
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
										ketaCommonUtils.doesPropertyExist(app, 'meta.i18n.en.name')) {

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
			},

			/**
			 * @name getAppName
			 * @function
			 * @description
			 * <p>
			 *   uiLocale is the current (user set) UI language of the running app.
			 *   Can be either short ('de') or long ('en-US') format.
			 * </p>
			 * @param {object} app application instance
			 * @param {string} uiLocale current locale
			 * @returns {string|null} application localized application name
			 */

			getAppName: function getAppName(app, uiLocale) {
				return ketaCommonUtils.doesPropertyExist(app, 'meta.i18n') ?
					ketaCommonUtils.getLabelByLocale('name', app.meta.i18n, uiLocale) : null;
			},

			/**
			 * @name getAppIcon
			 * @function
			 * @description
			 * <p>
			 *   Returns app icon source from app meta object by using
			 *   link-element to easily access url params.
			 *   If app has no icon informations it return <code>null</code>.
			 * </p>
			 * @param {object} app application instance
			 * @param {string} language current language
			 * @returns {string} app icon src
			 */
			getAppIcon: function(app, language) {

				var appIcon = null,
					LOCALE_SHORT_LENGTH = 2;

				var mediaSource = ketaCommonUtils.doesPropertyExist(app, 'meta.i18n') &&
					angular.isDefined(app.meta.i18n[language]) &&
					angular.isDefined(app.meta.i18n[language].media) ?
					app.meta.i18n[language].media : null;


				if (mediaSource === null) {

					var languageShort = angular.isDefined(language) ? language.substr(0, LOCALE_SHORT_LENGTH) : 'en';

					mediaSource = ketaCommonUtils.doesPropertyExist(app, 'meta.i18n') &&
						angular.isDefined(app.meta.i18n[languageShort]) &&
						angular.isDefined(app.meta.i18n[languageShort].media) ?
						app.meta.i18n[languageShort].media : null;
				}

				if (mediaSource === null &&
					ketaCommonUtils.doesPropertyExist(app, 'meta.i18n.en.media')) {
					mediaSource = app.meta.i18n.en.media;
				}

				if (angular.isDefined(app.entryUri)) {

					var link = document.createElement('a');
					link.href = app.entryUri;

					var params = app.entryUri.split('?')[1];
					params = params ? '?' + params : '';

					var linkProtocol =
						link.protocol +
						(link.protocol[link.protocol.length - 1] === ':' ?
							'//' : '://');

					var linkPort =
						link.port !== '' && link.port !== '0' ?
							':' + link.port : '';

					// workaround for internet explorer not having "origin" property
					var linkOrigin =
						angular.isDefined(link.origin) ?
							link.origin :
							linkProtocol + link.hostname + linkPort;

					angular.forEach(mediaSource, function(media) {

						if (angular.isDefined(media.type) &&
							media.type === ketaApplicationUtilsConstants.ASSET_MEDIA_TYPE.APPICON &&
							angular.isDefined(media.src)) {

							appIcon =
								linkOrigin[linkOrigin.length - 1] !== '/' && media.src[0] !== '/' ?
									linkOrigin + '/' + media.src :
									linkOrigin + media.src;
							appIcon += params;
						}
					});
				}
				return appIcon;
			},

			/**
			 * @name getAppAuthor
			 * @function
			 * @description
			 * <p>
			 *   Returns author from type or the first author in app.meta.author array.
			 * </p>
			 * @param {object} app application instance
			 * @param {string} type author type
			 * @returns {string} app author name
			 */
			getAppAuthor: function(app, type) {

				var appAuthor = null;

				type = angular.isDefined(type) ? type : ketaApplicationUtilsConstants.AUTHOR_TYPE.SELLER;

				if (ketaCommonUtils.doesPropertyExist(app, 'meta.authors')) {

					angular.forEach(app.meta.authors, function(author) {

						if (author.type === type) {
							appAuthor = author.name;
						}

					});

					if (appAuthor === null) {
						appAuthor = app.meta.authors[0].name;
					}

				}

				return appAuthor;

			}

		};

	});
