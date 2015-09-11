'use strict';

// root module
angular.module('keta', [
	'keta.directives.AppBar',
	'keta.directives.ExtendedTable',
	'keta.directives.MainMenu',
	'keta.directives.Sidebar',
	'keta.filters.OrderObjectBy',
	'keta.filters.Slice',
	'keta.filters.Unit',
	'keta.services.AccessToken',
	'keta.services.AppContext',
	'keta.services.ApplicationSet',
	'keta.services.Application',
	'keta.services.DeviceEvent',
	'keta.services.DeviceSet',
	'keta.services.Device',
	'keta.services.EventBusDispatcher',
	'keta.services.EventBusManager',
	'keta.services.EventBus',
	'keta.services.Logger',
	'keta.services.TagSet',
	'keta.services.Tag',
	'keta.services.UserSet',
	'keta.services.User',
	'keta.utils.Application',
	'keta.utils.Common',
	'keta.utils.Country'
]);// source: dist/directives/app-bar.js
/**
 * @name keta.directives.AppBar
 * @author Vincent Romanus <vincent.romanus@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.directives.AppBar
 * @description
 * <p>
 *   Horizontal navigation bar called AppBar with multiple menus (World Switcher, Menu Bar Toggle, Notification Bar
 *   Toggle, App Title, User Menu, Language Menu and Energy Manager Menu).
 * </p>
 * @example
 * &lt;div data-app-bar
 *     data-event-bus-id="eventBusId"
 *     data-locales="locales"
 *     data-current-locale="currentLocale"
 *     data-labels="labels"
 *     data-links="links"
 *     data-worlds="worlds"
 *     data-display-modes="displayModes"
 *     data-root-app="rootApp"&gt;
 *     &lt;a data-ng-href="{{rootApp.link}}" title="{{rootApp.name[currentLocale]}}"&gt;
 *         &lt;img src="img/logo.svg"&gt;
 *     &lt;/a&gt;
 * &lt;/div&gt;
 * @example
 * &lt;div data-app-bar
 *     data-event-bus-id="eventBusId"
 *     data-locales="locales"
 *     data-current-locale="currentLocale"
 *     data-labels="labels"
 *     data-links="links"
 *     data-worlds="worlds"
 *     data-display-modes="displayModes"&gt;
 *     &lt;a data-ng-href="/" title="My App root"&gt;
 *         &lt;img src="img/logo.svg"&gt;
 *     &lt;/a&gt;
 * &lt;/div&gt;
 * @example
 * angular.module('exampleApp', ['keta.directives.AppBar'])
 *     .controller('ExampleController', function($scope, AppBarMessageKeys) {
 *
 *         // id of eventBus instance to use to retrieve data
 *         $scope.eventBusId = 'kiwibus';
 *
 *         // array of locales to use for language menu
 *         $scope.locales = [{
 *             name: 'Deutsch',
 *             nameShort: 'DE',
 *             code: 'de'
 *         }, {
 *             name: 'English',
 *             nameShort: 'EN',
 *             code: 'en'
 *         }];
 *
 *         // current locale
 *         $scope.currentLocale = 'de';
 *
 *         // override default-labels if necessary
 *         // get default labels
 *         $scope.labels = AppBarMessageKeys;
 *
 *         // use case 1: overwrite specific key
 *         $scope.labels.de['__keta.directives.AppBar_app_title'] = 'Meine App';
 *
 *         // use case 2: add locale
 *         $scope.labels.fr = {
 *             '__keta.directives.AppBar_app_title': 'Applications',
 *             '__keta.directives.AppBar_all_apps': 'Toutes les applications',
 *             '__keta.directives.AppBar_all_energy_managers': 'toutes les Energy-Managers',
 *             '__keta.directives.AppBar_energy_manager': 'Energy-Manager',
 *             '__keta.directives.AppBar_user_logout': 'Se Déconnecter',
 *             '__keta.directives.AppBar_user_profile': 'Profil de l'utilisateur'
 *         };
 *
 *         // object of link to use in template
 *         // the directive sets default links that can be overwritten by the keys of this object
 *         $scope.links = {
 *             ALL_APPS: '/#/applications/',
 *             ALL_ENERGY_MANAGERS: '/#/devices?deviceClass=com.kiwigrid.devices.EnergyManager',
 *             APP_ROOT: '/#/landing-page',
 *             USER_PROFILE: '/#/users/profile',
 *             USER_LOGOUT: '/#/users/logout'
 *         };
 *
 *         // array of worlds to display in world switcher
 *         // the first world ('Desktop') is automatically prepended as first menu-entry
 *         $scope.worlds = [{
 *             name: 'Market',
 *             link: 'https://market.mycompany.com'
 *         }, {
 *             name: 'Service',
 *             link: 'https://service.mycompany.com'
 *         }];
 *
 *         // object to configure display modes at size xxs, xs, sm, md, and lg
 *         $scope.displayModes = {
 *             worldSwitcher: {
 *                 xxs: 'hidden',
 *                 xs: 'hidden',
 *                 sm: 'hidden',
 *                 md: 'hidden',
 *                 lg: 'hidden'
 *             },
 *             menuBarToggle: {
 *                 xxs: 'hidden',
 *                 xs: 'compact',
 *                 sm: 'full',
 *                 md: 'full',
 *                 lg: 'full'
 *             },
 *             notificationBarToggle: {
 *                 xxs: 'hidden',
 *                 xs: 'hidden',
 *                 sm: 'hidden',
 *                 md: 'hidden',
 *                 lg: 'hidden'
 *             },
 *             appTitle: {
 *                 xxs: 'hidden',
 *                 xs: 'hidden',
 *                 sm: 'full',
 *                 md: 'full',
 *                 lg: 'full'
 *             },
 *             userMenu: {
 *                 xxs: 'hidden',
 *                 xs: 'compact',
 *                 sm: 'full',
 *                 md: 'full',
 *                 lg: 'full'
 *             },
 *             languageMenu: {
 *                 xxs: 'hidden',
 *                 xs: 'compact',
 *                 sm: 'full',
 *                 md: 'full',
 *                 lg: 'full'
 *             },
 *             energyManagerMenu: {
 *                 xxs: 'hidden',
 *                 xs: 'compact',
 *                 sm: 'full',
 *                 md: 'full',
 *                 lg: 'full'
 *             },
 *             compactMenu: {
 *                 xxs: 'full',
 *                 xs: 'full',
 *                 sm: 'hidden',
 *                 md: 'hidden',
 *                 lg: 'hidden'
 *             }
 *         };
 *
 *         // object of root app to use in transclusion template
 *         // will be filled automatically by directive
 *         $scope.rootApp = {};
 *
 *     });
 */

angular.module('keta.directives.AppBar',
	[
		'keta.directives.Sidebar',
		'keta.services.EventBusManager',
		'keta.services.Device',
		'keta.services.DeviceSet',
		'keta.services.ApplicationSet',
		'keta.services.User',
		'keta.utils.Common'
	])

	.constant('AppBarConstants', {
		COMPONENT: {
			WORLD_SWITCHER: 'worldSwitcher',
			MENU_BAR_TOGGLE: 'menuBarToggle',
			NOTIFICATION_BAR_TOGGLE: 'notificationBarToggle',
			APP_TITLE: 'appTitle',
			USER_MENU: 'userMenu',
			LANGUAGE_MENU: 'languageMenu',
			ENERGY_MANAGER_MENU: 'energyManagerMenu',
			COMPACT_MENU: 'compactMenu'
		},
		SIZE: {
			XXS: 'xxs',
			XS: 'xs',
			SM: 'sm',
			MD: 'md',
			LG: 'lg'
		},
		STATE: {
			HIDDEN: 'hidden',
			FULL: 'full',
			COMPACT: 'compact'
		},
		ROOT_APP_ID: 'kiwigrid.clouddesktop'
	})

	// message keys with default values
	.constant('AppBarMessageKeys', {
		'en': {
			'__keta.directives.AppBar_app_title': 'Application',
			'__keta.directives.AppBar_all_apps': 'All Apps',
			'__keta.directives.AppBar_all_energy_managers': 'All Energy-Managers',
			'__keta.directives.AppBar_energy_manager': 'Energy-Manager',
			'__keta.directives.AppBar_user_logout': 'Logout',
			'__keta.directives.AppBar_user_profile': 'User Account'
		},
		'de': {
			'__keta.directives.AppBar_app_title': 'Applikation',
			'__keta.directives.AppBar_all_apps': 'Alle Apps',
			'__keta.directives.AppBar_all_energy_managers': 'Alle Energy-Manager',
			'__keta.directives.AppBar_energy_manager': 'Energy-Manager',
			'__keta.directives.AppBar_user_logout': 'Abmelden',
			'__keta.directives.AppBar_user_profile': 'Benutzerkonto'
		}
	})

	.directive('appBar', function AppBarDirective(
		$rootScope, $window, $document, $timeout, $filter,
		EventBusManager, DeviceSet, ApplicationSet, User,
		AppBarConstants, AppBarMessageKeys, DeviceConstants, SidebarConstants, CommonUtils) {

		return {
			restrict: 'EA',
			replace: true,
			scope: {

				// id of eventBus instance to use to retrieve data
				eventBusId: '=?',

				// array of locales to use for language menu
				// this will be sorted alphabetically in ascending order
				locales: '=?',

				// current locale
				currentLocale: '=?',

				// object of labels to use in template
				labels: '=?',

				// object of link to use in template
				links: '=?',

				// array of worlds with label and link
				worlds: '=?',

				// display mode configuration object
				displayModes: '=?',

				// environment-specific link to the root app and all available translations as an object.
				// It will be set by the appBar directive itself and can be used by the parent scope afterwards
				// (e.g. to set the logo link and title tag in the top left corner).
				// The object-keys are 'name' (object with keys for all supported languages) and 'link'.
				rootApp: '=?'

			},
			transclude: true,
			templateUrl: '/components/directives/app-bar.html',
			link: function linkAppBarDirective(scope, element) {

				// get menu data
				scope.user = {};
				scope.menus = {};
				scope.worlds = scope.worlds || [];
				scope.locales = scope.locales || [];
				scope.energyManagers = [];

				// sort locales
				scope.locales = $filter('orderBy')(scope.locales, 'name');

				// event bus
				scope.eventBusId = scope.eventBusId || 'kiwibus';
				var eventBus = EventBusManager.get(scope.eventBusId);

				var STATES = AppBarConstants.STATE;
				var SIZES = AppBarConstants.SIZE;

				var DEFAULT_CONTAINER_HEIGHT = 120;

				scope.MENU_ELEMENTS = AppBarConstants.COMPONENT;

				var DECIMAL_RADIX = 10,
					HIDDEN_CLASS_PREFIX = 'hidden-',
					VISIBLE_CLASS_PREFIX = 'visible-';

				// all sizes have NONE state
				var sizesFullState = {};
				sizesFullState[SIZES.XXS] = STATES.FULL;
				sizesFullState[SIZES.XS] = STATES.FULL;
				sizesFullState[SIZES.SM] = STATES.FULL;
				sizesFullState[SIZES.MD] = STATES.FULL;
				sizesFullState[SIZES.LG] = STATES.FULL;

				// standard STATES for userMenu, energyManagerMenu and languageMenu
				var	sizesDefaultState = {};
				sizesDefaultState[SIZES.XXS] = STATES.HIDDEN;
				sizesDefaultState[SIZES.XS] = STATES.HIDDEN;
				sizesDefaultState[SIZES.SM] = STATES.COMPACT;
				sizesDefaultState[SIZES.MD] = STATES.COMPACT;
				sizesDefaultState[SIZES.LG] = STATES.FULL;

				var defaultDisplayModes = {};
				defaultDisplayModes[scope.MENU_ELEMENTS.WORLD_SWITCHER] = sizesFullState;
				defaultDisplayModes[scope.MENU_ELEMENTS.MENU_BAR_TOGGLE] = sizesFullState;
				defaultDisplayModes[scope.MENU_ELEMENTS.NOTIFICATION_BAR_TOGGLE] = sizesFullState;
				defaultDisplayModes[scope.MENU_ELEMENTS.APP_TITLE] = sizesFullState;
				defaultDisplayModes[scope.MENU_ELEMENTS.USER_MENU] = sizesDefaultState;
				defaultDisplayModes[scope.MENU_ELEMENTS.ENERGY_MANAGER_MENU] = sizesDefaultState;
				defaultDisplayModes[scope.MENU_ELEMENTS.LANGUAGE_MENU] = sizesDefaultState;

				defaultDisplayModes[scope.MENU_ELEMENTS.COMPACT_MENU] = {};
				defaultDisplayModes[scope.MENU_ELEMENTS.COMPACT_MENU][SIZES.XXS] = STATES.COMPACT;
				defaultDisplayModes[scope.MENU_ELEMENTS.COMPACT_MENU][SIZES.XS] = STATES.COMPACT;
				defaultDisplayModes[scope.MENU_ELEMENTS.COMPACT_MENU][SIZES.SM] = STATES.HIDDEN;
				defaultDisplayModes[scope.MENU_ELEMENTS.COMPACT_MENU][SIZES.MD] = STATES.HIDDEN;
				defaultDisplayModes[scope.MENU_ELEMENTS.COMPACT_MENU][SIZES.LG] = STATES.HIDDEN;

				/**
				 * @description	Checks if the given menu is visible in all screen sizes
				 * @param {object} menuElement The menu element
				 * @returns {boolean} Returns true if the menu is visible in any screen size
				 */
				var isMenuVisible = function isMenuVisible(menuElement) {
					var isVisible = false;
					angular.forEach(SIZES, function(size) {
						if (scope.displayModes[menuElement][size] !== STATES.HIDDEN) {
							isVisible = true;
						}
					});
					return isVisible;
				};

				/**
				 * merges two objects, customObject overwrites values in defaultObject
				 * @param {object} customObject custom object
				 * @param {object} defaultObject default object to merge into custom object
				 * @returns {object} merged result
				 */
				var mergeObjects = function mergeObjects(customObject, defaultObject) {
					var result = {},
						value;
					for (value in customObject) {
						// if it's an object, merge
						if (value in defaultObject && typeof customObject[value] === 'object' && value !== null) {
							result[value] = mergeObjects(customObject[value], defaultObject[value]);
							// add it to result
						} else {
							result[value] = customObject[value];
						}
					}
					// add the remaining properties from defaultObject
					for (value in defaultObject) {
						if (value in result) {
							continue;
						}
						result[value] = defaultObject[value];
					}
					return result;
				};

				scope.displayModes = mergeObjects(scope.displayModes, defaultDisplayModes);

				// default container height
				var scrollContainerHeight = DEFAULT_CONTAINER_HEIGHT,
					container = element,
					// navbar-level-1
					navbarFirst = container.children()[0],
					// navbar-level-2
					navbarSecond = container.children()[1],
					navbarFirstHeight = 0,
					navbarSecondHeight = 0,
					navbarSecondMarginBottom = 0;

				$timeout(function() {
					navbarFirstHeight = navbarFirst.offsetHeight;
					navbarSecondHeight = navbarSecond.offsetHeight;
					navbarSecondMarginBottom = parseInt(
						$window.getComputedStyle(navbarSecond, null).getPropertyValue('margin-bottom'),
						DECIMAL_RADIX
					);
					// container height for fixed navigation
					scrollContainerHeight = navbarFirstHeight + navbarSecondHeight + navbarSecondMarginBottom;
				});

				scope.currentLocale = scope.currentLocale || 'en';

				// object of labels
				scope.MESSAGE_KEY_PREFIX = '__keta.directives.AppBar';
				scope.labels = angular.extend(AppBarMessageKeys, scope.labels);

				scope.getLabel = function getLabel(key) {
					return CommonUtils.getLabelByLocale(key, scope.labels, scope.currentLocale);
				};

				var defaultLinks = {
					ALL_APPS: null,
					ALL_ENERGY_MANAGERS: null,
					APP_ROOT: '#/',
					USER_PROFILE: null,
					USER_LOGOUT: null
				};

				// type constants used in ng-repeats orderBy filter
				scope.TYPES = {
					ENERGY_MANAGER: 'ENERGY_MANAGER'
				};

				// limit constants used in ng-repeats limit filter
				scope.LIMITS = {
					ENERGY_MANAGER: 3
				};

				// order predicates and reverse flags
				var PREDICATES = {
					ENERGY_MANAGER: {
						field: 'name',
						reverse: false
					}
				};

				scope.links = angular.isDefined(scope.links) ?
					angular.extend(defaultLinks, scope.links) : defaultLinks;

				/**
				 * set default links that can be overwritten by the scope.links property
				 * @returns {void} nothing
				 */
				var setDefaultLinks = function setDefaultLinks() {

					scope.links.USER_LOGOUT =
						angular.isString(scope.links.USER_LOGOUT) ? scope.links.USER_LOGOUT : '/rest/auth/logout';

					// TODO: re-enable filter if it is used on backend
					if (eventBus !== null) {
						ApplicationSet.create(eventBus)
							/*
							.filter({
								appId: AppBarConstants.ROOT_APP_ID
							})
							*/
							.query()
							.then(function(reply) {
								if (angular.isDefined(reply.result) &&
									angular.isDefined(reply.result.items)) {

									var entryUri = null;
									var name = {};
									scope.rootApp = null;
									angular.forEach(reply.result.items, function(app) {
										if (angular.isDefined(app.appId) &&
											// app.appId === AppBarConstants.ROOT_APP_ID &&
											(app.appId === AppBarConstants.ROOT_APP_ID ||
											app.appId === 'kiwigrid.desktop') &&
											angular.isDefined(app.entryUri)) {
											entryUri = app.entryUri;
											if (CommonUtils.doesPropertyExist(app, 'meta.i18n')) {
												angular.forEach(Object.keys(app.meta.i18n), function(locale) {
													name[locale] = app.meta.i18n[locale].name;
												});
											}
										}
									});
									// use link-element to easily access url params
									var link = document.createElement('a');
									link.href = entryUri;

									if (entryUri !== null) {
										scope.rootApp = {};
										scope.rootApp.link = entryUri;
										scope.rootApp.name = name;
										scope.worlds.unshift({
											name: 'Desktop',
											link: scope.rootApp.link
										});
									}

									scope.links.ALL_APPS = angular.isString(scope.links.ALL_APPS) ?
										scope.links.ALL_APPS : link.origin + '/#/applications' + link.search;

									scope.links.USER_PROFILE = angular.isString(scope.links.USER_PROFILE) ?
										scope.links.USER_PROFILE : link.origin + '/#/user' + link.search;

									if (!angular.isString(scope.links.ALL_ENERGY_MANAGERS)) {
										scope.links.ALL_ENERGY_MANAGERS = link.origin + '/#/devices';
										if (link.search.length > 0) {
											scope.links.ALL_ENERGY_MANAGERS += link.search + '&';
										} else {
											scope.links.ALL_ENERGY_MANAGERS += link.search + '?';
										}
										scope.links.ALL_ENERGY_MANAGERS +=
											'deviceClass=com.kiwigrid.devices.em.EnergyManager';
									}
								}
							});
					}
				};

				var allLinkKeysAlreadySet = true;
				angular.forEach(Object.keys(defaultLinks), function(linkKey) {
					if (defaultLinks[linkKey] === null) {
						allLinkKeysAlreadySet = false;
					}
				});

				if (allLinkKeysAlreadySet === false) {
					setDefaultLinks();
				}

				/**
				 * get display mode classes
				 * @param {string} menuName name of the menu
				 * @param {string} elementType either 'menu' or 'label'
				 * @returns {string} all css classes that should be applied to this element in the template
				 */
				scope.getClasses = function getClasses(menuName, elementType) {
					var classes = [];

					if (!angular.isDefined(elementType)) {
						elementType = 'menu';
					}

					if (angular.isDefined(scope.menus[menuName]) && angular.isDefined(scope.menus[menuName].isOpen)) {
						if (scope.menus[menuName].isOpen) {
							classes.push('open');
						}
					}

					angular.forEach(SIZES, function(size) {

						var state = scope.displayModes[menuName][size];

						switch (elementType) {
							case 'menu':
								switch (state) {
									case STATES.HIDDEN:
										classes.push(HIDDEN_CLASS_PREFIX + size);
										break;
									case STATES.FULL:
										classes.push(VISIBLE_CLASS_PREFIX + size);
										break;
									case STATES.COMPACT:
										classes.push(VISIBLE_CLASS_PREFIX + size);
										break;
									default:
										break;
								}
								break;
							case 'label':
								if (state === STATES.COMPACT) {
									classes.push(HIDDEN_CLASS_PREFIX + size);
								}
								break;
							default:
								break;
						}

					});
					return classes.join(' ');

				};

				/**
				 * query energy managers, format: {name: 'ERC02-000001051', link: 'http://192.168.125.81'}
				 * @returns {void} nothing
				 */
				var getDevices = function getDevices() {

					if (eventBus !== null &&
						angular.isDefined(scope.user.userId) &&
						isMenuVisible(scope.MENU_ELEMENTS.ENERGY_MANAGER_MENU)) {

						DeviceSet.create(eventBus)
							.filter({
								'deviceModel.deviceClass': {
									'$in': [DeviceConstants.CLASS.ENERGY_MANAGER]
								},
								owner: scope.user.userId
							})
							.project({
								tagValues: {
									IdName: 1,
									SettingsNetworkMap: 1
								}
							})
							.query()
							.then(function(reply) {
								if (angular.isDefined(reply.result) &&
									angular.isDefined(reply.result.items)) {

									var energyManagers = [];
									angular.forEach(reply.result.items, function(item) {
										var emIP =
											angular.isDefined(item.tagValues) &&
											angular.isDefined(item.tagValues.SettingsNetworkMap) &&
											angular.isDefined(item.tagValues.SettingsNetworkMap.value) &&
											angular.isDefined(item.tagValues.SettingsNetworkMap.value.ipv4) ?
												item.tagValues.SettingsNetworkMap.value.ipv4 : null;
										if (emIP !== null) {

											energyManagers.push({
												name: item.tagValues.IdName.value,
												link: 'http://' + emIP
											});
										}
									});

									scope.energyManagers = energyManagers;
								}
							});

					}

				};

				/**
				 * returns the currently active entry in the language menu
				 * @returns {object} active entry in language menu
				 */
				var getActiveLangEntry = function getActiveLangEntry() {
					var activeLangEntry = scope.locales[0] || {};
					angular.forEach(scope.locales, function(value) {
						if (value.code === scope.currentLocale) {
							activeLangEntry = value;
						}
					});
					return activeLangEntry;
				};

				/**
				 * updates the open state and currently active entry in the language menu
				 * @returns {void} nothing
				 */
				var updateMenus = function updateMenus() {
					scope.menus = {};
					scope.menus[scope.MENU_ELEMENTS.COMPACT_MENU] = {isOpen: false};
					scope.menus[scope.MENU_ELEMENTS.WORLD_SWITCHER] = {isOpen: false};
					scope.menus[scope.MENU_ELEMENTS.ENERGY_MANAGER_MENU] = {isOpen: false};
					scope.menus[scope.MENU_ELEMENTS.USER_MENU] = {isOpen: false};
					scope.menus[scope.MENU_ELEMENTS.LANGUAGE_MENU] = {
						isOpen: false,
						activeEntry: getActiveLangEntry()
					};
				};

				updateMenus();

				// query current user
				if (eventBus !== null) {
					User.getCurrent(eventBus)
						.then(function(reply) {
							scope.user = reply;
							getDevices();
						});
				}

				// LOGIC ---

				/**
				 * order elements by predicate
				 * @param {string} type component type to order
				 * @returns {function} ordering function that is used by ng-repeat in the template
				 */
				scope.order = function order(type) {
					var field = angular.isDefined(PREDICATES[type]) ? PREDICATES[type].field : 'name';
					return function(item) {
						return angular.isDefined(item[field]) ? item[field] : '';
					};
				};

				/**
				 * returns if reverse ordering is active or not
				 * @param {string} type component type to determine for
				 * @returns {boolean} reverse ordering or not
				 */
				scope.reverse = function reverse(type) {
					return angular.isDefined(PREDICATES[type]) && angular.isDefined(PREDICATES[type].reverse) ?
						PREDICATES[type].reverse : false;
				};

				scope.scrollOverNavbarFirst = false;

				angular.element($window).bind('scroll', function scroll() {

					if (angular.isDefined(navbarFirst)) {
						// scroll over navbar-level-1
						if (this.scrollY > navbarFirstHeight) {
							scope.scrollOverNavbarFirst = true;
							// compensate empty space of fixed navbar with placeholder height
							element.css('height', scrollContainerHeight + 'px');
						} else {
							scope.scrollOverNavbarFirst = false;
							element.css('height', 'auto');
						}
						scope.menus.worldSwitcher.isOpen = false;
						scope.$digest();
					}
				});

				/**
				 * toggle state of menu
				 * @param {string} menuName name of the menu to toggle
				 * @returns {void} nothing
				 */
				scope.toggleOpenState = function toggleOpenState(menuName) {
					if (angular.isDefined(scope.menus[menuName])) {
						var currentState = angular.copy(scope.menus[menuName].isOpen);
						scope.closeAllMenus();
						if (currentState === scope.menus[menuName].isOpen) {
							scope.menus[menuName].isOpen = !scope.menus[menuName].isOpen;
						}
					}
				};

				/**
				 * close all menus by switching boolean flag isOpen
				 * @returns {void} nothing
				 */
				scope.closeAllMenus = function closeAllMenus() {
					scope.menus[scope.MENU_ELEMENTS.WORLD_SWITCHER].isOpen = false;
					scope.menus[scope.MENU_ELEMENTS.USER_MENU].isOpen = false;
					scope.menus[scope.MENU_ELEMENTS.ENERGY_MANAGER_MENU].isOpen = false;
					scope.menus[scope.MENU_ELEMENTS.COMPACT_MENU].isOpen = false;
					scope.menus[scope.MENU_ELEMENTS.LANGUAGE_MENU].isOpen = false;
				};

				/**
				 * set locale if user selects another entry in the language menu
				 * @param {object} locale new locale to set
				 * @returns {void} nothing
				 */
				scope.setLocale = function setLocale(locale) {
					scope.currentLocale = locale.code;
					scope.menus[scope.MENU_ELEMENTS.LANGUAGE_MENU].activeEntry = locale;
					scope.closeAllMenus();
				};

				scope.$on('$locationChangeStart', function $locationChangeStart() {
					scope.closeAllMenus();
				});

				/**
				 * check if a given entry is active to set corresponding css class
				 * @param {string} menuName menu name
				 * @param {object} entry menu entry object with all flags
				 * @returns {boolean} flag menu entry is open or not
				 */
				scope.isActive = function isActive(menuName, entry) {
					return angular.isDefined(scope.menus[menuName]) && scope.menus[menuName].activeEntry === entry;
				};

				/**
				 * toggle sidebar if button is clicked
				 * @param {object} $event jqLite event object
				 * @param {string} position position of the sidebar ('left' or 'right')
				 * @returns {void} nothing
				 */
				scope.toggleSidebar = function toggleSidebar($event, position) {
					$event.stopPropagation();
					scope.closeAllMenus();
					if (position === SidebarConstants.POSITION.LEFT) {
						$rootScope.$broadcast(SidebarConstants.EVENT.TOGGLE_SIDEBAR_LEFT);
					} else if (position === SidebarConstants.POSITION.RIGHT) {
						$rootScope.$broadcast(SidebarConstants.EVENT.TOGGLE_SIDEBAR_RIGHT);
					}
				};

				$document.bind('click', function click(event) {
					var appBarHtml = element.html(),
						targetElementHtml = angular.element(event.target).html();
					if (appBarHtml.indexOf(targetElementHtml) !== -1) {
						return;
					}
					scope.closeAllMenus();
					scope.$digest();
				});

				scope.$watch('energyManagers', function watchEnergyManagers(newValue, oldValue) {
					if (newValue !== oldValue) {
						updateMenus();
					}
				});

			}
		};

	});

// prepopulate template cache
angular.module('keta.directives.AppBar')
	.run(function($templateCache) {
		$templateCache.put('/components/directives/app-bar.html', '<div class="navigation-container">' +
'	<nav class="navbar navbar-level-1 brand-bar" role="navigation">' +
'		<div class="container-fluid">' +
'			<div class="pull-left">' +
'				<div data-ng-transclude></div>' +
'			</div>' +
'			<div class="dropdown pull-right"' +
'				data-ng-show="worlds.length > 0"' +
'				data-ng-class="getClasses(MENU_ELEMENTS.WORLD_SWITCHER)">' +
'				<a href="" class="dropdown-toggle" data-ng-click="toggleOpenState(MENU_ELEMENTS.WORLD_SWITCHER)">' +
'					<span class="glyphicon glyphicon-th"></span>' +
'				</a>' +
'				<ul class="dropdown-menu">' +
'					<li data-ng-repeat="world in worlds">' +
'						<a data-ng-href="{{ world.link }}">{{ world.name }}</a>' +
'					</li>' +
'				</ul>' +
'			</div>' +
'		</div>' +
'	</nav>' +
'' +
'	<nav class="navbar navbar-default navbar-level-2" data-ng-class="{\'navbar-fixed-top\': scrollOverNavbarFirst}"' +
'		role="navigation">' +
'		<div class="container-fluid">' +
'' +
'			<ul class="nav navbar-nav">' +
'				<li class="menu-navbar" data-ng-class="getClasses(MENU_ELEMENTS.MENU_BAR_TOGGLE)">' +
'					<a href="" data-ng-click="toggleSidebar($event, \'left\')">' +
'						<span class="glyphicon glyphicon-align-justify"></span>' +
'					</a>' +
'				</li>' +
'				<li data-ng-class="getClasses(MENU_ELEMENTS.APP_TITLE)">' +
'					<a data-ng-if="links.APP_ROOT !== null" class="application-title"' +
'						data-ng-href="{{ links.APP_ROOT }}">{{ getLabel(MESSAGE_KEY_PREFIX + \'_app_title\') }}</a>' +
'					<span data-ng-if="links.APP_ROOT === null" class="application-title">' +
'						{{ getLabel(MESSAGE_KEY_PREFIX + \'_app_title\') }}' +
'					</span>' +
'				</li>' +
'			</ul>' +
'' +
'			<ul class="nav navbar-nav navbar-right">' +
'' +
'				<li class="dropdown" data-ng-class="getClasses(MENU_ELEMENTS.USER_MENU)">' +
'					<a href="" data-ng-click="toggleOpenState(MENU_ELEMENTS.USER_MENU)">' +
'						<span class="glyphicon glyphicon-user"></span>' +
'						<span class="navbar-label" data-ng-class="getClasses(MENU_ELEMENTS.USER_MENU, \'label\')">' +
'							{{ user.givenName }} {{ user.familyName }}' +
'						</span>' +
'						<span class="caret"></span>' +
'					</a>' +
'					<ul class="dropdown-menu dropdown-menu-right">' +
'						<li>' +
'							<a data-ng-href="{{ links.USER_PROFILE }}" data-ng-click="closeAllMenus()">' +
'								{{ getLabel(MESSAGE_KEY_PREFIX + \'_user_profile\') }}' +
'							</a>' +
'						</li>' +
'						<li>' +
'							<a data-ng-href="{{ links.USER_LOGOUT }}" data-ng-click="closeAllMenus()">' +
'								{{ getLabel(MESSAGE_KEY_PREFIX + \'_user_logout\') }}' +
'							</a>' +
'						</li>' +
'					</ul>' +
'				</li>' +
'' +
'				<li class="dropdown"' +
'					data-ng-show="energyManagers.length > 0"' +
'					data-ng-class="getClasses(MENU_ELEMENTS.ENERGY_MANAGER_MENU)">' +
'					<a href="" class="dropdown-toggle"' +
'						data-ng-click="toggleOpenState(MENU_ELEMENTS.ENERGY_MANAGER_MENU)">' +
'						<span class="glyphicon glyphicon-tasks" title="Energy-Manager"></span>' +
'						<span class="navbar-label"' +
'							data-ng-class="getClasses(MENU_ELEMENTS.ENERGY_MANAGER_MENU, \'label\')">' +
'							{{ getLabel(MESSAGE_KEY_PREFIX + \'_energy_manager\') }}' +
'						</span>' +
'						<span>({{ energyManagers.length }})</span>' +
'						<span class="caret"></span>' +
'					</a>' +
'					<ul class="dropdown-menu">' +
'						<li data-ng-repeat="' +
'							entry in energyManagers |' +
'							orderBy:order(TYPES.ENERGY_MANAGER):reverse(TYPES.ENERGY_MANAGER) |' +
'							limitTo:LIMITS.ENERGY_MANAGER">' +
'							<a data-ng-href="{{ entry.link }}" data-ng-click="closeAllMenus()">' +
'								{{ entry.name }}' +
'							</a>' +
'						</li>' +
'						<li data-ng-if="energyManagers.length > LIMITS.ENERGY_MANAGER &&' +
'							links.ALL_ENERGY_MANAGERS !== null &&' +
'							labels.ALL_ENERGY_MANAGERS !== null">' +
'							<a data-ng-href="{{ links.ALL_ENERGY_MANAGERS }}" data-ng-click="closeAllMenus()">' +
'								{{ getLabel(MESSAGE_KEY_PREFIX + \'_all_energy_managers\') }}' +
'								({{ energyManagers.length }})' +
'							</a>' +
'						</li>' +
'					</ul>' +
'				</li>' +
'' +
'				<li class="dropdown"' +
'					data-ng-show="locales.length > 0"' +
'					data-ng-class="getClasses(MENU_ELEMENTS.LANGUAGE_MENU)">' +
'					<a href="" class="dropdown-toggle" data-ng-click="toggleOpenState(MENU_ELEMENTS.LANGUAGE_MENU)">' +
'						<span class="glyphicon glyphicon-flag"' +
'							title="{{ menus.languageMenu.activeEntry.nameShort }}"></span>' +
'						<span class="navbar-label" data-ng-class="getClasses(MENU_ELEMENTS.LANGUAGE_MENU, \'label\')">' +
'							{{ menus.languageMenu.activeEntry.nameShort }}' +
'						</span>' +
'						<span class="caret"></span>' +
'					</a>' +
'					<ul class="dropdown-menu">' +
'						<li data-ng-repeat="locale in locales"' +
'							data-ng-class="{ active: isActive(MENU_ELEMENTS.LANGUAGE_MENU, locale) }">' +
'							<a href="" data-ng-click="setLocale(locale)">{{ locale.name }}</a>' +
'						</li>' +
'					</ul>' +
'				</li>' +
'' +
'				<li class="dropdown" data-ng-class="getClasses(MENU_ELEMENTS.COMPACT_MENU)">' +
'					<a href="" data-ng-click="toggleOpenState(MENU_ELEMENTS.COMPACT_MENU)">' +
'						<span class="glyphicon glyphicon-option-vertical"></span>' +
'					</a>' +
'					<ul class="dropdown-menu dropdown-menu-right">' +
'						<li>' +
'							<a data-ng-href="{{ links.USER_PROFILE }}" data-ng-click="closeAllMenus()">' +
'								{{ getLabel(MESSAGE_KEY_PREFIX + \'_user_profile\') }}' +
'							</a>' +
'						</li>' +
'						<li>' +
'							<a data-ng-href="{{ links.USER_LOGOUT }}" data-ng-click="closeAllMenus()">' +
'								{{ getLabel(MESSAGE_KEY_PREFIX + \'_user_logout\') }}' +
'							</a>' +
'						</li>' +
'						<li class="divider" data-ng-if="energyManagers.length"></li>' +
'						<li data-ng-repeat="' +
'							entry in energyManagers |' +
'							orderBy:order(TYPES.ENERGY_MANAGER):reverse(TYPES.ENERGY_MANAGER) |' +
'							limitTo:LIMITS.ENERGY_MANAGER">' +
'							<a data-ng-href="{{ entry.link }}" data-ng-click="closeAllMenus()">' +
'								{{ entry.name }}' +
'							</a>' +
'						</li>' +
'						<li data-ng-if="energyManagers.length > LIMITS.ENERGY_MANAGER">' +
'							<a data-ng-href="{{ links.ALL_ENERGY_MANAGERS }}" data-ng-click="closeAllMenus()">' +
'								{{ getLabel(MESSAGE_KEY_PREFIX + \'_all_energy_managers\') }}' +
'								({{ energyManagers.length }})' +
'							</a>' +
'						</li>' +
'						<li class="divider" data-ng-if="locales"></li>' +
'						<li data-ng-repeat="entry in locales"' +
'							data-ng-class="{ active: isActive(MENU_ELEMENTS.LANGUAGE_MENU, entry) }">' +
'							<a href="" data-ng-click="setLocale(entry)">{{ entry.name }}</a>' +
'						</li>' +
'					</ul>' +
'				</li>' +
'' +
'				<li data-ng-class="getClasses(MENU_ELEMENTS.NOTIFICATION_BAR_TOGGLE)">' +
'					<a href="" id="toggleSidebarButton" data-ng-click="toggleSidebar($event, \'right\')">' +
'						<span class="glyphicon glyphicon-bell"' +
'							title="{{ getLabel(MESSAGE_KEY_PREFIX + \'_notifications\') }}"></span>' +
'						<span data-ng-show="notifications.length > 0" class="badge">{{notifications.length}}</span>' +
'					</a>' +
'				</li>' +
'' +
'			</ul>' +
'		</div>' +
'	</nav>' +
'	<div class="nav-backdrop"></div>' +
'</div>' +
'');
	});

// source: dist/directives/extended-table.js
/**
 * @name keta.directives.ExtendedTable
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.directives.ExtendedTable
 * @description
 * <p>
 *   A table directive with extended functionality as column sorting, column customizing, paging
 *   and filtering.
 * </p>
 * <p>
 *   Basic principle is the usage of optional parameters and callbacks, which offer a really
 *   flexible API for customizing the table to you very own needs.
 * </p>
 * @example
 * &lt;div data-extended-table
 *     data-rows="rows"
 *     data-current-locale="currentLocale"
 *     data-label-add-column="labelAddColumn"
 *     data-disabled-components="disabledComponents"
 *     data-switchable-columns="switchableColumns"
 *     data-group-by-property="groupByProperty"
 *     data-order-by-property="orderByProperty"
 *     data-visible-columns="visibleColumns"
 *     data-header-label-callback="headerLabelCallback"
 *     data-operations-mode="operationsMode"
 *     data-row-sort-enabled="rowSortEnabled"
 *     data-row-sort-criteria="rowSortCriteria"
 *     data-row-sort-order-ascending="rowSortOrderAscending"
 *     data-action-list="actionList"
 *     data-cell-renderer="cellRenderer"
 *     data-column-class-callback="columnClassCallback"
 *     data-table-class-callback="tableClassCallback"
 *     data-pager="pager"
 *     data-search="search"
 *     data-search-results="searchResults"&gt;&lt;/div&gt;
 * @example
 * angular.module('exampleApp', ['keta.directives.ExtendedTable', 'keta.services.Device'])
 *     .controller('ExampleController', function(
 *         $scope,
 *         ExtendedTableConstants, ExtendedTableMessageKeys, DeviceConstants) {
 *
 *         // data as array of objects, keys from first element are taken as headers
 *         $scope.rows = [{
 *             guid: 'guid-1',
 *             idName: 'Device 1',
 *             stateDevice: 'OK',
 *             deviceClass: 'class-1'
 *         }, {
 *             guid: 'guid-2',
 *             idName: 'Device 2',
 *             stateDevice: 'ERROR',
 *             deviceClass: 'class-2'
 *         }, {
 *             guid: 'guid-3',
 *             idName: 'Device 3',
 *             stateDevice: 'FATAL',
 *             deviceClass: 'class-3'
 *         }];
 *
 *         // override default-labels if necessary
 *         // get default labels
 *         $scope.labels = ExtendedTableMessageKeys;
 *
 *         // use case 1: overwrite specific key
 *         $scope.labels.de['__keta.directives.ExtendedTable_search'] = 'Finde';
 *
 *         // use case 2: add locale
 *         $scope.labels.fr = {
 *             '__keta.directives.ExtendedTable_search': 'Recherche',
 *             '__keta.directives.ExtendedTable_add_column': 'Ajouter colonne',
 *             '__keta.directives.ExtendedTable_remove_column': 'Retirer la colonne',
 *             '__keta.directives.ExtendedTable_sort': 'Sorte',
 *             '__keta.directives.ExtendedTable_no_entries': 'Pas d’entrées'
 *         };
 *
 *         // array of disabled components (default: everything except the table itself is disabled)
 *         $scope.disabledComponents = [
 *             // the table itself
 *             ExtendedTableConstants.COMPONENT.TABLE,
 *             // an input field to search throughout the full dataset
 *             ExtendedTableConstants.COMPONENT.FILTER,
 *             // a selector to add columns to table
 *             ExtendedTableConstants.COMPONENT.SELECTOR,
 *             // a pager to navigate through paged data
 *             ExtendedTableConstants.COMPONENT.PAGER
 *         ];
 *
 *         // array of switchable columns (empty by default)
 *         // together with selector component the given columns can be removed from
 *         // table and added to table afterwards
 *         // to support grouping in select field an array of objects is required (match is compared by id property)
 *         $scope.switchableColumns = [{
 *             id: 'deviceClass'
 *         }];
 *
 *         // property to group selector by
 *         $scope.groupByProperty = 'column.deviceName';
 *
 *         // property to order selector by
 *         $scope.orderByProperty = 'tagName';
 *
 *         // array of visible columns (full by default)
 *         // use this property to filter out columns like primary keys
 *         $scope.visibleColumns = ['idName', 'stateDevice', 'deviceClass'];
 *
 *         // callback method to specify header labels (instead of using auto-generated ones)
 *         $scope.headerLabelCallback = function(column) {
 *             var mappings = {
 *                 idName: 'Name',
 *                 stateDevice: 'State',
 *                 deviceClass: 'Device Class'
 *             };
 *             return (angular.isDefined(mappings[column])) ? mappings[column] : column;
 *         };
 *
 *         // operations mode ("view" for frontend or "data" for backend)
 *         // by defining operations mode as "view" the directive itself manages sorting,
 *         // paging and filtering; if you just pass a pre-sorted, pre-paged and pre-filtered
 *         // dataset by querying a backend, you have to use "data"
 *         $scope.operationsMode = ExtendedTableConstants.OPERATIONS_MODE.VIEW;
 *
 *         // boolean flag to enable or disable row sorting in frontend by showing appropriate icons
 *         $scope.rowSortEnabled = true;
 *
 *         // criteria to sort for as string
 *         $scope.rowSortCriteria = 'idName';
 *
 *         // boolean flag to determine if sort order is ascending (true by default)
 *         $scope.rowSortOrderAscending = true;
 *
 *         // Array of actions to render for each row.
 *         // getLink method will be used to construct a link with the help of the row object,
 *         // getLabel is used as callback to retrieve value for title-tag,
 *         // icon is used as icon-class for visualizing the action.
 *         // runAction is a callback-function that will be executed when the user clicks on
 *         // the corresponding button. To use this functionality it is necessary to provide the type-parameter
 *         // with the value 'action'.
 *         // type can have the values 'link' (a normal link with href-attribute will be rendered) or
 *         // 'action' (a link with ng-click attribute to execute a callback will be rendered).
 *         // For simplicity the type-property can be left out. In this case the directive renders
 *         // a normal link-tag (same as type 'link').
 *         // display is an optional callback to return condition for displaying action item based on given row
 *         $scope.actionList = [{
 *             getLink: function(row) {
 *                 return 'edit/' + row.guid;
 *             },
 *             getLabel: function() {
 *                 return 'Edit';
 *             },
 *             icon: 'glyphicon glyphicon-pencil',
 *             type: ExtendedTableConstants.ACTION_LIST_TYPE.LINK
 *         }, {
 *             runAction: function(row) {
 *                 console.log('action called with ', row);
 *             },
 *             getLabel: function() {
 *                 return 'Remove';
 *             },
 *             icon: 'glyphicon glyphicon-remove'
 *             type: ExtendedTableConstants.ACTION_LIST_TYPE.ACTION,
 *             display: function(row) {
 *                 return row.type !== 'EnergyManager';
 *             }
 *         }];
 *
 *         // callback method to render each cell individually
 *         // with the help of this method you can overwrite default cell rendering behavior,
 *         // e.g. suppressing output for stateDevice property
 *         $scope.cellRenderer = function(row, column) {
 *             var value = angular.isDefined(row[column]) ? row[column] : null;
 *             if (column === 'stateDevice') {
 *                 value = '';
 *             }
 *             return value;
 *         };
 *
 *         // callback method to return class attribute for each column
 *         // in this example together with cellRenderer the deviceState column is
 *         // expressed as just a table data element with css classes
 *         $scope.columnClassCallback = function(row, column, isHeader) {
 *             var columnClass = '';
 *             if (column === 'stateDevice') {
 *                 columnClass = 'state';
 *                 if (row.state === DeviceConstants.STATE.OK && !isHeader) {
 *                     columnClass+= ' state-success';
 *                 }
 *                 if (row.state === DeviceConstants.STATE.ERROR && !isHeader) {
 *                     columnClass+= ' state-warning';
 *                 }
 *                 if (row.state === DeviceConstants.STATE.FATAL && !isHeader) {
 *                     columnClass+= ' state-danger';
 *                 }
 *             }
 *             return columnClass;
 *         };
 *
 *         // callback method to return class array for table
 *         $scope.tableClassCallback = function() {
 *             return ['table-striped'];
 *         };
 *
 *         // object for pager configuration (total, limit, offset)
 *         // with this configuration object you are able to manage paging
 *         // total is the total number of rows in the dataset
 *         // limit is the number of rows shown per page
 *         // offset is the index in the dataset to start from
 *         var pager = {};
 *         pager[ExtendedTableConstants.PAGER.TOTAL] = $scope.allRows.length;
 *         pager[ExtendedTableConstants.PAGER.LIMIT] = 5;
 *         pager[ExtendedTableConstants.PAGER.OFFSET] = 0;
 *         $scope.pager = pager;
 *
 *         // search term to filter the table
 *         // as two-way-binded property this variable contains the search string
 *         // typed by the user in the frontend and can therefor be used for querying
 *         // the backend, if watched here additionally
 *         $scope.search = null;
 *
 *         // array of search results e.g. for usage in headlines
 *         // defaults to $scope.rows, typically not set directly by controller
 *         //$scope.searchResults = $scope.rows;
 *
 *     });
 *
 */

angular.module('keta.directives.ExtendedTable',
	[
		'ngSanitize',
		'keta.filters.OrderObjectBy',
		'keta.filters.Slice',
		'keta.filters.Unit',
		'keta.utils.Common'
	])

	.constant('ExtendedTableConstants', {
		COMPONENT: {
			TABLE: 'table',
			FILTER: 'filter',
			SELECTOR: 'selector',
			PAGER: 'pager'
		},
		OPERATIONS_MODE: {
			DATA: 'data',
			VIEW: 'view'
		},
		PAGER: {
			TOTAL: 'total',
			LIMIT: 'limit',
			OFFSET: 'offset'
		},
		ACTION_LIST_TYPE: {
			LINK: 'link',
			ACTION: 'action'
		}
	})

	// message keys with default values
	.constant('ExtendedTableMessageKeys', {
		'en': {
			'__keta.directives.ExtendedTable_search': 'Search',
			'__keta.directives.ExtendedTable_add_column': 'Add column',
			'__keta.directives.ExtendedTable_remove_column': 'Remove column',
			'__keta.directives.ExtendedTable_sort': 'Sort',
			'__keta.directives.ExtendedTable_no_entries': 'No entries',
			'__keta.directives.ExtendedTable_of': 'of'
		},
		'de': {
			'__keta.directives.ExtendedTable_search': 'Suche',
			'__keta.directives.ExtendedTable_add_column': 'Spalte hinzufügen',
			'__keta.directives.ExtendedTable_remove_column': 'Spalte entfernen',
			'__keta.directives.ExtendedTable_sort': 'Sortieren',
			'__keta.directives.ExtendedTable_no_entries': 'Keine Einträge',
			'__keta.directives.ExtendedTable_of': 'von'
		}
	})

	.directive('extendedTable', function ExtendedTableDirective(
		$compile, $filter,
		ExtendedTableConstants, ExtendedTableMessageKeys, CommonUtils) {
		return {
			restrict: 'EA',
			replace: true,
			scope: {

				// data as array of objects, keys from first element are taken as headers
				rows: '=',

				// current locale
				currentLocale: '=?',

				// label prefixed to selector-component
				labels: '=?',

				// array of disabled components (empty by default)
				disabledComponents: '=?',

				// array of switchable columns (empty by default)
				switchableColumns: '=?',

				// property to group selector by
				groupByProperty: '=?',

				// property to order selector by
				orderByProperty: '=?',

				// array of visible columns (full by default)
				visibleColumns: '=?',

				// callback method to specify header labels (instead of using auto-generated ones)
				headerLabelCallback: '=?',

				// operations mode ("view" for frontend or "data" for backend)
				operationsMode: '=?',

				// boolean flag to enable or disable row sorting in frontend
				rowSortEnabled: '=?',

				// criteria to sort for as string
				rowSortCriteria: '=?',

				// boolean flag to enable ascending sort order for rows
				rowSortOrderAscending: '=?',

				// array of actions to render for each row
				actionList: '=?',

				// callback method to render each cell individually
				cellRenderer: '=?',

				// callback method to return class attribute for each column
				columnClassCallback: '=?',

				// callback method to return class array for table
				tableClassCallback: '=?',

				// object for pager configuration (total, limit, offset)
				pager: '=?',

				// search term to filter the table
				search: '=?',

				// array of search results
				searchResults: '=?'

			},
			templateUrl: '/components/directives/extended-table.html',
			link: function(scope) {

				// rows
				scope.rows =
					angular.isDefined(scope.rows) && angular.isArray(scope.rows) ? scope.rows : [];

				scope.currentLocale = scope.currentLocale || 'en';

				// object of labels
				scope.MESSAGE_KEY_PREFIX = '__keta.directives.ExtendedTable';
				scope.labels = angular.extend(ExtendedTableMessageKeys, scope.labels);

				scope.getLabel = function getLabel(key) {
					return CommonUtils.getLabelByLocale(key, scope.labels, scope.currentLocale);
				};

				// headers to save
				scope.headers =
					angular.isDefined(scope.rows) && angular.isDefined(scope.rows[0]) ?
						scope.rows[0] : {};

				// disabledComponents
				scope.disabledComponents = scope.disabledComponents || [
					scope.COMPONENTS_FILTER,
					scope.COMPONENTS_SELECTOR,
					scope.COMPONENTS_PAGER
				];

				// switchableColumns
				scope.switchableColumns = scope.switchableColumns || [];
				scope.resetSelectedColumn();

				// groupByProperty
				scope.groupByProperty = scope.groupByProperty || null;

				// orderByProperty
				scope.orderByProperty = scope.orderByProperty || '';

				// visibleColumns
				scope.visibleColumns =
					scope.visibleColumns ||
					(angular.isDefined(scope.rows) && angular.isDefined(scope.rows[0]) ?
						Object.keys(scope.rows[0]) : []);

				// headerLabelCallback
				scope.headerLabelCallback = scope.headerLabelCallback || function(column) {
					return column;
				};

				// operationsMode
				scope.operationsMode = scope.operationsMode || scope.OPERATIONS_MODE_VIEW;

				// rowSortEnabled
				scope.rowSortEnabled =
					angular.isDefined(scope.rowSortEnabled) ?
						scope.rowSortEnabled : false;

				// rowSortCriteria
				scope.rowSortCriteria =
					scope.rowSortCriteria ||
					(angular.isDefined(scope.rows) && angular.isDefined(scope.rows[0]) ?
						Object.keys(scope.rows[0])[0] : null);

				// rowSortOrderAscending
				scope.rowSortOrderAscending =
					angular.isDefined(scope.rowSortOrderAscending) ?
						scope.rowSortOrderAscending : true;

				// actionList
				scope.actionList = scope.actionList || [];

				// cellRenderer
				scope.cellRenderer = scope.cellRenderer || function(row, column) {
					return angular.isDefined(row[column]) ? row[column] : null;
				};

				// columnClassCallback
				scope.columnClassCallback = scope.columnClassCallback || function() {
					// parameters: row, column, isHeader
					return '';
				};

				// tableClassCallback
				scope.tableClassCallback = scope.tableClassCallback || function() {
					return ['table-striped'];
				};

				// pager
				var defaultPager = {};
				defaultPager[scope.PAGER_TOTAL] = scope.rows.length;
				defaultPager[scope.PAGER_LIMIT] = scope.rows.length;
				defaultPager[scope.PAGER_OFFSET] = 0;
				scope.pager = angular.extend(defaultPager, scope.pager);
				scope.resetPager();

				// search
				scope.search = scope.search || null;

				// array of search results
				scope.searchResults = scope.searchResults || scope.rows;

			},
			controller: function($scope) {

				// CONSTANTS ---

				$scope.COMPONENTS_FILTER = ExtendedTableConstants.COMPONENT.FILTER;
				$scope.COMPONENTS_SELECTOR = ExtendedTableConstants.COMPONENT.SELECTOR;
				$scope.COMPONENTS_TABLE = ExtendedTableConstants.COMPONENT.TABLE;
				$scope.COMPONENTS_PAGER = ExtendedTableConstants.COMPONENT.PAGER;

				$scope.OPERATIONS_MODE_DATA = ExtendedTableConstants.OPERATIONS_MODE.DATA;
				$scope.OPERATIONS_MODE_VIEW = ExtendedTableConstants.OPERATIONS_MODE.VIEW;

				$scope.PAGER_TOTAL = ExtendedTableConstants.PAGER.TOTAL;
				$scope.PAGER_LIMIT = ExtendedTableConstants.PAGER.LIMIT;
				$scope.PAGER_OFFSET = ExtendedTableConstants.PAGER.OFFSET;

				$scope.ACTION_LIST_TYPE_LINK = ExtendedTableConstants.ACTION_LIST_TYPE.LINK;
				$scope.ACTION_LIST_TYPE_ACTION = ExtendedTableConstants.ACTION_LIST_TYPE.ACTION;

				// VARIABLES ---

				$scope.pages = [];
				$scope.currentPage = 0;
				$scope.selectedColumn = null;

				// HELPER ---

				/**
				 * Checkout all keys and fill empty keys with null
				 * @param {Array} objects array with objects to fill
				 * @returns {Object} filled object
				 */
				var fillAllKeys = function(objects) {
					var keys = [];

					// get all keys
					angular.forEach(objects, function(obj) {
						angular.forEach(obj, function(value, key) {

							if (keys.indexOf(key) === -1) {
								keys.push(key);
							}

						});
					});

					// fill empty keys
					angular.forEach(objects, function(obj) {
						angular.forEach(keys, function(key) {

							obj[key] = angular.isDefined(obj[key]) ? obj[key] : null;

						});
					});

					return objects;
				};

				// update properties without using defaults
				var update = function() {

					if (angular.isDefined($scope.rows) && angular.isDefined($scope.rows[0])) {

						// fill all keys
						$scope.rows = fillAllKeys($scope.rows);

						// headers to save
						if (angular.equals($scope.headers, {})) {
							$scope.headers = $scope.rows[0];
						}

						// visibleColumns
						if (angular.equals($scope.visibleColumns, [])) {
							$scope.visibleColumns = Object.keys($scope.rows[0]);
						}

						// rowSortCriteria
						if ($scope.rowSortCriteria === null) {
							$scope.rowSortCriteria = Object.keys($scope.rows[0])[0];
						}

					} else {
						$scope.headers = {};
						$scope.visibleColumns = [];
						$scope.rowSortCriteria = null;
					}

				};

				// check if element exists in array
				var inArray = function(array, element) {
					var found = false;
					angular.forEach(array, function(item) {
						if (item === element) {
							found = true;
						}
					});
					return found;
				};

				// fill all keys initial
				$scope.rows = fillAllKeys($scope.rows);

				// reset pager object regarding filtered rows
				$scope.resetPager = function() {

					// update pager
					if ($scope.operationsMode === $scope.OPERATIONS_MODE_VIEW) {
						var rowsLength = $scope.search !== null ?
							$filter('filter')($scope.rows, $scope.search).length : $scope.rows.length;
						$scope.pager[$scope.PAGER_TOTAL] = rowsLength;
						if ($scope.pager[$scope.PAGER_LIMIT] === 0) {
							$scope.pager[$scope.PAGER_LIMIT] = rowsLength;
						}
						if ($scope.pager[$scope.PAGER_OFFSET] > rowsLength - 1) {
							$scope.pager[$scope.PAGER_OFFSET] = 0;
						}
					}

					// determine array of pages
					if (angular.isNumber($scope.pager[$scope.PAGER_TOTAL]) &&
						angular.isNumber($scope.pager[$scope.PAGER_LIMIT])) {
						$scope.pages = [];
						var numOfPages = Math.ceil($scope.pager[$scope.PAGER_TOTAL] / $scope.pager[$scope.PAGER_LIMIT]);
						for (var i = 0; i < numOfPages; i++) {
							$scope.pages.push(i + 1);
						}
					}

					// determine current page
					if (angular.isNumber($scope.pager[$scope.PAGER_LIMIT]) &&
						angular.isNumber($scope.pager[$scope.PAGER_OFFSET])) {
						$scope.currentPage =
							Math.floor($scope.pager[$scope.PAGER_OFFSET] / $scope.pager[$scope.PAGER_LIMIT]) + 1;
					}

				};

				// reset selected column
				$scope.resetSelectedColumn = function() {
					var possibleColumns = $filter('filter')($scope.switchableColumns, function(column) {
						return !inArray($scope.visibleColumns, column.id);
					});
					var stillPossible = false;
					angular.forEach(possibleColumns, function(column) {
						if (column.id === $scope.selectedColumn) {
							stillPossible = true;
						}
					});
					if (!stillPossible) {
						possibleColumns = $filter('orderBy')(possibleColumns, $scope.orderByProperty);
						$scope.selectedColumn = angular.isDefined(possibleColumns[0]) ? possibleColumns[0].id : null;
					}
				};

				// check if action list item should be shown
				$scope.showActionListItem = function(item, row) {
					var show = true;
					if (angular.isFunction(item.display)) {
						show = item.display(row);
					}
					return show;
				};

				// WATCHER ---

				$scope.$watch('rows', function(newValue, oldValue) {
					if (newValue !== null && newValue !== oldValue) {
						update();
						$scope.resetPager();
					}
				}, true);

				$scope.$watch('pager', function(newValue, oldValue) {
					if (newValue !== null && newValue !== oldValue) {
						$scope.resetPager();
					}
				}, true);

				$scope.$watch('search', function(newValue, oldValue) {
					if (newValue !== null && newValue !== oldValue) {
						$scope.resetPager();
						$scope.searchResults = $filter('filter')($scope.rows, $scope.searchIn);
					}
				});

				$scope.$watch('switchableColumns', function(newValue, oldValue) {
					if (newValue !== null && newValue !== oldValue) {
						$scope.resetSelectedColumn();
					}
				}, true);

				// ACTIONS ---

				$scope.getTableClasses = function() {
					var configuredClasses = $scope.tableClassCallback();
					configuredClasses.push('table');
					configuredClasses.push('form-group');
					return configuredClasses.join(' ');
				};

				$scope.isDisabled = function(key) {
					return inArray($scope.disabledComponents, key);
				};

				$scope.isSwitchable = function(key) {
					var switchable = false;
					angular.forEach($scope.switchableColumns, function(column) {
						if (column.id === key) {
							switchable = true;
						}
					});
					return switchable;
				};

				$scope.isSortCriteria = function(key) {
					return $scope.rowSortCriteria !== null ? key === $scope.rowSortCriteria : false;
				};

				$scope.sortBy = function(column) {
					if ($scope.rowSortEnabled &&
						$scope.headerLabelCallback(column) !== null &&
						$scope.headerLabelCallback(column) !== '') {
						if ($scope.rowSortCriteria === column) {
							$scope.rowSortOrderAscending = !$scope.rowSortOrderAscending;
						} else {
							$scope.rowSortCriteria = column;
						}
					}
				};

				$scope.searchIn = function(row) {
					if (!angular.isDefined($scope.search) || $scope.search === null || $scope.search === '') {
						return true;
					}
					var match = false;
					angular.forEach($scope.visibleColumns, function(column) {
						if (angular.isDefined(row[column]) && row[column] !== null) {

							if (angular.isObject(row[column]) && !angular.isArray(row[column])) {
								var deepMatch = false;
								angular.forEach(row[column], function(prop) {
									if (String(prop).toLowerCase().indexOf($scope.search.toLowerCase()) !== -1) {
										deepMatch = true;
									}
								});
								if (deepMatch === true) {
									match = true;
								}
							} else if (String(row[column]).toLowerCase().indexOf($scope.search.toLowerCase()) !== -1) {
								match = true;
							}

						}
					});
					return match;
				};

				$scope.filterColumns = function(column) {
					return !inArray($scope.visibleColumns, column.id);
				};

				$scope.addColumn = function(column) {
					$scope.visibleColumns.push(column);
					$scope.resetSelectedColumn();
				};

				$scope.removeColumn = function(column) {
					var columns = [];
					angular.forEach($scope.visibleColumns, function(col) {
						if (col !== column) {
							columns.push(col);
						}
					});
					$scope.visibleColumns = columns;
					$scope.resetSelectedColumn();
				};

				/**
				 * @description Jumps to the given page and updates the view accordingly.
				 * @param {number} page The number of the page to go to.
				 * @returns {void} nothing
				 */
				$scope.goToPage = function(page) {
					if (page > 0 && page <= $scope.pages.length) {
						$scope.pager[$scope.PAGER_OFFSET] = $scope.pager[$scope.PAGER_LIMIT] * (page - 1);
						$scope.resetPager();
					}
				};

				/**
				 * @description Resets the pager input (page number) to a valid numeric value if the user
				 * has accidently entered something else and jumps to the page afterwards.
				 * @param {*} currentPage The current input by the user.
				 * @returns {void} nothing
				 */
				var resetPagerInputIfNecessary = function resetPagerInputIfNecessary(currentPage) {
					var parsingRadix = 10;
					var pageAsNumber = parseInt(currentPage, parsingRadix);
					var newPage = pageAsNumber;
					if (!angular.isNumber(pageAsNumber) || isNaN(pageAsNumber) || pageAsNumber <= 0) {
						newPage = 1;
					} else if (pageAsNumber > $scope.pages.length) {
						newPage = $scope.pages.length;
					}
					$scope.goToPage(newPage);
				};

				/**
				 * @description
				 * <p>
				 *   Checks the input (on specific events) that the user makes for the pager's current page
				 *   and resets the input to a valid number if something else (e.g. characters) were entered.
				 * </p>
				 * @param {*} currentPage The current input by the user.
				 * @param {object} $event The jQlite event that is connected with the user interaction.
				 * @returns {void} nothing
				 */
				$scope.checkPagerInput = function checkPagerInput(currentPage, $event) {
					switch ($event.type) {
						case 'keypress':
							if ($event.keyCode === 13) {
								resetPagerInputIfNecessary(currentPage);
							}
							break;
						case 'blur':
							resetPagerInputIfNecessary(currentPage);
							break;
						default:
							break;
					}
				};

			}
		};
	});

// prepopulate template cache
angular.module('keta.directives.ExtendedTable')
	.run(function($templateCache) {
		$templateCache.put('/components/directives/extended-table.html', '<div data-ng-class="{' +
'	\'keta-extended-table\': true' +
'}">' +
'' +
'	<div class="row" data-ng-show="!isDisabled(COMPONENTS_FILTER) || !isDisabled(COMPONENTS_SELECTOR)">' +
'		<div class="col-xs-12 col-sm-6">' +
'' +
'			<!-- FILTER -->' +
'			<div data-ng-show="!isDisabled(COMPONENTS_FILTER)">' +
'				<div class="form-group form-inline">' +
'					<div class="input-group col-xs-12 col-sm-8 col-md-6">' +
'						<input type="text" class="form-control"' +
'							placeholder="{{ getLabel(MESSAGE_KEY_PREFIX + \'_search\') }}" data-ng-model="search">' +
'						<div class="input-group-addon"><span class="glyphicon glyphicon-search"></span></div>' +
'					</div>' +
'				</div>' +
'			</div>' +
'' +
'		</div>' +
'		<div class="col-xs-12 col-sm-6 col-md-6 col-lg-5 pull-right">' +
'' +
'			<!-- SELECTOR -->' +
'			<div data-ng-show="!isDisabled(COMPONENTS_SELECTOR)">' +
'				<div class="form-group pull-right" data-ng-show="selectedColumn !== null">' +
'					<div class="form-group">' +
'						<div class="button-form">' +
'							<label for="columnSelector">{{ getLabel(MESSAGE_KEY_PREFIX + \'_add_column\') }}</label>' +
'							<div class="input-group">' +
'								<select id="columnSelector"' +
'									class="add-select form-control"' +
'									data-ng-if="groupByProperty !== null"' +
'									data-ng-model="$parent.selectedColumn"' +
'									data-ng-options="' +
'										column.id as headerLabelCallback(column.id)' +
'											group by {{groupByProperty}} for column in switchableColumns |' +
'										filter:filterColumns |' +
'										orderBy:orderByProperty">' +
'								</select>' +
'								<select id="columnSelector"' +
'									class="add-select form-control"' +
'									data-ng-if="groupByProperty === null"' +
'									data-ng-model="$parent.selectedColumn"' +
'									data-ng-options="' +
'										column.id as headerLabelCallback(column.id) for column in switchableColumns |' +
'										filter:filterColumns |' +
'										orderBy:orderByProperty">' +
'								</select>' +
'								<div class="stepper-buttons input-group-btn">' +
'									<button type="button" class="btn btn-primary"' +
'										data-ng-click="addColumn(selectedColumn)">' +
'										<i class="glyphicon glyphicon-plus"></i>' +
'									</button>' +
'								</div>' +
'							</div>' +
'						</div>' +
'					</div>' +
'				</div>' +
'			</div>' +
'' +
'		</div>' +
'	</div>' +
'' +
'	<!-- TABLE -->' +
'	<div class="row" data-ng-show="!isDisabled(COMPONENTS_TABLE)">' +
'		<div class="col-xs-12">' +
'			<div class="table-responsive table-data">' +
'				<table data-ng-class="getTableClasses()">' +
'					<thead>' +
'						<tr>' +
'							<th class="{{columnClassCallback(headers, column, true)}} sortable"' +
'								data-ng-repeat="column in headers | orderObjectBy:visibleColumns:true"' +
'								data-ng-if="rowSortEnabled"' +
'								data-ng-class="{sort: isSortCriteria(column)}">' +
'								<a class="header" title="{{ getLabel(MESSAGE_KEY_PREFIX + \'_sort\') }}"' +
'									data-ng-click="sortBy(column)">{{headerLabelCallback(column)}}</a>' +
'								<a class="sort" title="{{ getLabel(MESSAGE_KEY_PREFIX + \'_sort\') }}"' +
'									data-ng-if="isSortCriteria(column) && rowSortOrderAscending"' +
'									data-ng-click="sortBy(column)"><span' +
'									class="glyphicon glyphicon-sort-by-alphabet"></span></a>' +
'								<a class="sort" title="{{ getLabel(MESSAGE_KEY_PREFIX + \'_sort\') }}"' +
'								   data-ng-if="isSortCriteria(column) && !rowSortOrderAscending"' +
'								   data-ng-click="sortBy(column)"><span' +
'									class="glyphicon glyphicon-sort-by-alphabet-alt"></span></a>' +
'								<a class="unsort" title="{{ getLabel(MESSAGE_KEY_PREFIX + \'_sort\') }}"' +
'									data-ng-if="!isSortCriteria(column) && headerLabelCallback(column) !== null"' +
'									data-ng-click="sortBy(column)"><span' +
'									class="glyphicon glyphicon-sort"></span></a>' +
'								<a class="operation" title="{{ getLabel(MESSAGE_KEY_PREFIX + \'_remove_column\') }}"' +
'									data-ng-if="isSwitchable(column)"' +
'									data-ng-click="removeColumn(column)"><span' +
'									class="glyphicon glyphicon-minus-sign"></span></a>' +
'							</th>' +
'							<th class="{{columnClassCallback(headers, column, true)}}"' +
'								data-ng-repeat="column in headers | orderObjectBy:visibleColumns:true"' +
'								data-ng-if="!rowSortEnabled">' +
'								{{headerLabelCallback(column)}}' +
'								<a class="operation" data-ng-if="isSwitchable(column)"' +
'									data-ng-click="removeColumn(column)"><span' +
'									class="glyphicon glyphicon-minus-sign"></span></a>' +
'							</th>' +
'							<th data-ng-if="actionList.length">' +
'								{{headerLabelCallback(\'actions\')}}' +
'							</th>' +
'						</tr>' +
'					</thead>' +
'					<tbody>' +
'						<!-- operationsMode: data -->' +
'						<tr data-ng-if="operationsMode === OPERATIONS_MODE_DATA"' +
'							data-ng-repeat="row in rows">' +
'							<td data-ng-repeat="column in row | orderObjectBy:visibleColumns:true"' +
'								class="{{columnClassCallback(row, column, false)}}">' +
'								<span data-ng-bind-html="cellRenderer(row, column)"></span>' +
'							</td>' +
'							<td data-ng-if="row && actionList.length">' +
'								<div class="btn-group" role="group">' +
'									<span data-ng-repeat="item in actionList"' +
'										data-ng-if="showActionListItem(item, row)">' +
'										<a class="btn-link"' +
'											data-ng-href="{{item.getLink(row)}}"' +
'											data-ng-if="!item.type || item.type === ACTION_LIST_TYPE_LINK"' +
'											title="{{item.getLabel()}}"><span' +
'											class="{{item.icon}}" aria-hidden="true"></span></a>' +
'										<a class="btn-link"	href=""' +
'											data-ng-click="item.runAction(row)"' +
'											data-ng-if="item.type === ACTION_LIST_TYPE_ACTION"' +
'											title="{{item.getLabel()}}"><span' +
'											class="{{item.icon}}" aria-hidden="true"></span></a>' +
'									</span>' +
'								</div>' +
'							</td>' +
'						</tr>' +
'						<!-- operationsMode: view -->' +
'						<tr data-ng-if="operationsMode === OPERATIONS_MODE_VIEW"' +
'							data-ng-repeat="' +
'								row in rows |' +
'								filter:searchIn |' +
'								orderBy:rowSortCriteria:!rowSortOrderAscending |' +
'								slice:pager[PAGER_OFFSET]:pager[PAGER_LIMIT]">' +
'							<td data-ng-repeat="column in row | orderObjectBy:visibleColumns:true"' +
'								class="{{columnClassCallback(row, column, false)}}">' +
'								<span data-ng-bind-html="cellRenderer(row, column)"></span>' +
'							</td>' +
'							<td data-ng-if="row && actionList.length">' +
'								<div class="btn-group" role="group">' +
'									<span data-ng-repeat="item in actionList"' +
'										data-ng-if="showActionListItem(item, row)">' +
'										<a class="btn-link"' +
'											data-ng-href="{{item.getLink(row)}}"' +
'											data-ng-if="!item.type || item.type === ACTION_LIST_TYPE_LINK"' +
'											title="{{item.getLabel()}}"><span' +
'											class="{{item.icon}}" aria-hidden="true"></span></a>' +
'										<a class="btn-link"	href=""' +
'											data-ng-click="item.runAction(row)"' +
'											data-ng-if="item.type === ACTION_LIST_TYPE_ACTION"' +
'											title="{{item.getLabel()}}"><span' +
'											class="{{item.icon}}" aria-hidden="true"></span></a>' +
'									</span>' +
'								</div>' +
'							</td>' +
'						</tr>' +
'						<tr data-ng-if="' +
'							operationsMode === OPERATIONS_MODE_VIEW &&' +
'							(rows |' +
'								filter:searchIn |' +
'								orderBy:rowSortCriteria:!rowSortOrderAscending |' +
'								slice:pager[PAGER_OFFSET]:pager[PAGER_LIMIT]).length === 0">' +
'							<td colspan="{{(rows[0] | orderObjectBy:visibleColumns:true).length + 1}}">' +
'								{{ getLabel(MESSAGE_KEY_PREFIX + \'_no_entries\') }}' +
'							</td>' +
'						</tr>' +
'					</tbody>' +
'				</table>' +
'			</div>' +
'		</div>' +
'	</div>' +
'' +
'	<!-- PAGER -->' +
'	<div class="row" data-ng-show="!isDisabled(COMPONENTS_PAGER) && pager !== null && pages.length > 1">' +
'		<div class="col-xs-12 col-sm-6">' +
'			<div class="pager max-width">' +
'				<div class="input-group">' +
'					<div class="pager-buttons input-group-btn">' +
'						<button type="button" class="btn btn-default" data-ng-click="goToPage(currentPage - 1)">' +
'							<i class="glyphicon glyphicon-chevron-left"></i>' +
'						</button>' +
'					</div>' +
'					<input type="text" class="form-control pager-input"' +
'						data-ng-model="currentPage"' +
'						data-ng-keypress="checkPagerInput(currentPage, $event)"' +
'						data-ng-blur="checkPagerInput(currentPage, $event)">' +
'					<span class="input-group-addon">' +
'						{{ getLabel(MESSAGE_KEY_PREFIX + \'_of\') }} {{pages.length}}' +
'					</span>' +
'					<div class="pager-buttons input-group-btn">' +
'						<button type="button" class="btn btn-default" data-ng-click="goToPage(currentPage + 1)">' +
'							<i class="glyphicon glyphicon-chevron-right"></i>' +
'						</button>' +
'					</div>' +
'				</div>' +
'			</div>' +
'		</div>' +
'	</div>' +
'' +
'</div>' +
'');
	});

// source: dist/directives/main-menu.js
/**
 * @name keta.directives.MainMenu
 * @author Jan Uhlmann <jan.uhlmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.directives.MainMenu
 * @description
 * <p>
 *   Main menu with marking of currently active menu-entry. The menu can be nested (maximum 3 levels) with automatic
 *   expand/fold functionality.
 * </p>
 * <p>
 *   The optional property toggleBroadcast is used to execute events from the $rootScope. For example
 *   if the menu is inside an opened sidebar the event is used to close
 *   the sidebar (if the current path-route is the same as in the clicked link).
 * </p>
 * @example
 * &lt;div data-main-menu data-configuration="menuConfiguration" data-title-callback="getAppTitle"&gt;&lt;/div&gt;
 * @example
 * angular.module('exampleApp', ['keta.directives.MainMenu', 'keta.directives.Sidebar'])
 *     .controller('ExampleController', function($scope, SidebarConfig) {
 *
 *         // menu object to use as input for directive
 *         $scope.menuConfiguration = {
 *             items: [{
 *                 name: 'Dashboard',
 *                 link: '/dashboard',
 *                 icon: 'signal'
 *             }, {
 *                 name: 'Applications',
 *                 icon: 'th-large',
 *                 items: [{
 *                     name: 'Application 1',
 *                     link: '/applications/1'
 *                 }, {
 *                     name: 'All Apps',
 *                     items: [{
 *                         name: 'Application 2',
 *                         link: '/applications/2'
 *                     }, {
 *                         name: 'Application 3',
 *                         link: '/applications/3'
 *                     }]
 *                 }]
 *             }],
 *             compactMode: false,
 *             toggleBroadcast: SidebarConfig.EVENT.TOGGLE_SIDEBAR_LEFT
 *         };
 *
 *         // return app-title depending on current language
 *         $scope.getAppTitle = function() {
 *             return 'My App';
 *         };
 *
 *     });
 */

angular.module('keta.directives.MainMenu', [])
	.directive('mainMenu', function MainMenuDirective($location, $rootScope) {
		return {
			restrict: 'EA',
			replace: true,
			scope: {
				configuration: '=',
				titleCallback: '=?'
			},
			templateUrl: '/components/directives/main-menu.html',
			link: function(scope) {

				scope.titleCallback = scope.titleCallback || function() {
					return '';
				};

				var checkPaths = function checkPaths(currentMenuLevelParts, locationLevelParts, activeFlag) {
					for (var i = 1; i < currentMenuLevelParts.length; i++) {
						if (currentMenuLevelParts[i] !== locationLevelParts[i]) {
							activeFlag = false;
						}
					}
					return activeFlag;
				};

				scope.isActive = function(menuEntry) {
					var currentMenuLevelParts = menuEntry.link.split('/');
					var locationLevelParts = $location.path().split('/');
					var isActive = true;

					// Menu-entries with sub-entries have another active-class
					// to visualize the breadcrumb-path (in normal menu mode, see function isActiveParent)
					if (angular.isArray(menuEntry.items) && menuEntry.items.length > 0) {
						return false;
					}

					isActive = checkPaths(currentMenuLevelParts, locationLevelParts, isActive);
					return isActive;
				};

				scope.isActiveParent = function(menuEntry) {
					var currentMenuLevelParts = menuEntry.link.split('/');
					var locationLevelParts = $location.path().split('/');
					var isActiveParent = false;

					if (angular.isArray(menuEntry.items) && menuEntry.items.length > 0) {
						isActiveParent = true;
						isActiveParent = checkPaths(currentMenuLevelParts, locationLevelParts, isActiveParent);
					}
					return isActiveParent;
				};

				scope.checkExpand = function(menuEntry, $event) {
					// close sidebar when route-links (of current route and menu-entry) are equal
					if ($location.path() === menuEntry.link &&
						angular.isDefined(scope.configuration.toggleBroadcast)) {
						$event.stopPropagation();
						$rootScope.$broadcast(scope.configuration.toggleBroadcast);
					}

					if (angular.isArray(menuEntry.items) && menuEntry.items.length > 0) {
						// prevent route-redirect when clicking an expand-menu-entry
						$event.preventDefault();
						if (angular.isUndefined(menuEntry.expanded) || menuEntry.expanded === false) {
							menuEntry.expanded = true;
						} else {
							menuEntry.expanded = !menuEntry.expanded;
						}
					}

				};

			}
		};
	});

// prepopulate template cache
angular.module('keta.directives.MainMenu')
	.run(function($templateCache) {
		$templateCache.put('/components/directives/main-menu.html', '<div>' +
'	<div data-ng-show="titleCallback()" class="sidebar-title">' +
'		<span>{{ titleCallback() }}</span>' +
'	</div>' +
'	<ul class="nav nav-pills nav-stacked keta-main-menu">' +
'		<li data-ng-repeat="entry in configuration.items"' +
'			data-ng-class="{' +
'				\'active\': isActive(entry),' +
'				\'active-parent\': isActiveParent(entry)' +
'			}">' +
'			<a data-ng-href="{{ entry.link }}" data-ng-click="checkExpand(entry, $event)"' +
'			   title="{{ entry.name }}">' +
'				<span class="{{ entry.icon }}"></span>' +
'				<span class="list-item">{{ entry.name }}</span>' +
'				<span class="expander glyphicon"' +
'					data-ng-if="entry.items"' +
'					data-ng-class="{ \'glyphicon-minus\': entry.expanded, \'glyphicon-plus\': !entry.expanded }">' +
'				</span>' +
'			</a>' +
'			<ul class="nav nav-pills nav-stacked expanded nav-sub-level" data-ng-show="entry.expanded">' +
'				<li data-ng-repeat="entryLevel2 in entry.items"' +
'					data-ng-class="{' +
'						\'active\': isActive(entryLevel2),' +
'						\'active-parent\': isActiveParent(entryLevel2)' +
'					}">' +
'					<a data-ng-href="{{ entryLevel2.link }}" data-ng-click="checkExpand(entryLevel2, $event)">' +
'						<span data-ng-if="entryLevel2.icon" class="{{ entryLevel2.icon }}"></span>' +
'						<span>{{ entryLevel2.name }}</span>' +
'						<span class="expander glyphicon"' +
'							data-ng-if="entryLevel2.items"' +
'							data-ng-class="{ \'glyphicon-minus\': entryLevel2.expanded, \'glyphicon-plus\': !entryLevel2.expanded }">' +
'						</span>' +
'					</a>' +
'					<ul class="nav nav-pills nav-stacked expanded nav-sub-level" data-ng-show="entryLevel2.expanded">' +
'						<li data-ng-repeat="entryLevel3 in entryLevel2.items"' +
'							data-ng-class="{ \'active\': isActive(entryLevel3) }">' +
'							<a data-ng-href="{{ entryLevel3.link }}">' +
'								<span data-ng-if="entryLevel3.icon" class="{{ entryLevel3.icon }}"></span>' +
'								<span>{{ entryLevel3.name }}</span>' +
'							</a>' +
'						</li>' +
'					</ul>' +
'				</li>' +
'			</ul>' +
'		</li>' +
'	</ul>' +
'</div>' +
'');
	});

// source: dist/directives/sidebar.js
/**
 * @name keta.directives.Sidebar
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.directives.Sidebar
 * @description
 * <p>
 *   Sidebar with expand/fold functionality, configurable position and toggle area label.
 * </p>
 * @example
 * &lt;div data-sidebar data-configuration="{position: 'left', label: 'Fold'}"&gt;&lt;/div&gt;
 */

angular.module('keta.directives.Sidebar', [])

	.constant('SidebarConstants', {
		POSITION: {
			LEFT: 'left',
			RIGHT: 'right'
		},
		CSS: {
			OFFCANVAS: 'offcanvas',
			BRAND_BAR: 'brand-bar'
		},
		OFFSET: {
			TOGGLE_AREA: 5,
			TRANSCLUDE: 15
		},
		EVENT: {
			TOGGLE_SIDEBAR_LEFT: 'TOGGLE_SIDEBAR_LEFT',
			TOGGLE_SIDEBAR_RIGHT: 'TOGGLE_SIDEBAR_RIGHT'
		}
	})

	.directive('sidebar', function SidebarDirective($document, SidebarConstants) {
		return {
			restrict: 'EA',
			replace: true,
			scope: {
				configuration: '='
			},
			templateUrl: '/components/directives/sidebar.html',
			transclude: true,
			link: function(scope, element) {

				// set default values
				scope.configuration.position =
					angular.isDefined(scope.configuration.position) ?
						scope.configuration.position :
						SidebarConstants.POSITION.LEFT;

				// flag for showing toggle area in sidebar
				scope.showToggleArea = angular.isDefined(scope.configuration.label);
				scope.toggleAreaTop = 0;
				scope.transcludeTop = 0;

				// get body element to toggle css classes
				var bodyElem = angular.element(document).find('body');

				// toggle css class on body element
				scope.toggleSideBar = function() {
					bodyElem.toggleClass(SidebarConstants.CSS.OFFCANVAS + '-' + scope.configuration.position);
				};

				// close open sidebars if location change starts
				scope.$on('$locationChangeStart', function() {
					bodyElem.removeClass(SidebarConstants.CSS.OFFCANVAS + '-' + scope.configuration.position);
				});

				// if sidebars are toggled from outside toggle css class on body element
				var toggleBodyClass = function(position) {
					if (scope.configuration.position === position) {
						bodyElem.toggleClass(
							SidebarConstants.CSS.OFFCANVAS + '-' + scope.configuration.position
						);
					}
				};

				// sidebar left
				scope.$on(SidebarConstants.EVENT.TOGGLE_SIDEBAR_LEFT, function() {
					toggleBodyClass(SidebarConstants.POSITION.LEFT);
				});

				// sidebar right
				scope.$on(SidebarConstants.EVENT.TOGGLE_SIDEBAR_RIGHT, function() {
					toggleBodyClass(SidebarConstants.POSITION.RIGHT);
				});

				// position toggle area according to height of brand bar
				if (scope.showToggleArea) {

					// determine brand bar height
					var brandBarElem = bodyElem[0].getElementsByClassName(SidebarConstants.CSS.BRAND_BAR);
					var brandBarHeight = angular.isDefined(brandBarElem[0]) ? brandBarElem[0].clientHeight : 0;

					scope.toggleAreaTop = brandBarHeight + SidebarConstants.OFFSET.TOGGLE_AREA;
					scope.transcludeTop = SidebarConstants.OFFSET.TRANSCLUDE;

				}

				// close on click outside
				$document.bind('click', function(event) {
					if (bodyElem.hasClass(
							SidebarConstants.CSS.OFFCANVAS + '-' + scope.configuration.position
						)) {
						var sideBarHtml = element.html(),
							targetElementHtml = angular.element(event.target).html();

						if (sideBarHtml.indexOf(targetElementHtml) !== -1 && targetElementHtml.length !== 0) {
							return;
						}
						scope.toggleSideBar();
					}
				});

			}
		};
	});

// prepopulate template cache
angular.module('keta.directives.Sidebar')
	.run(function($templateCache) {
		$templateCache.put('/components/directives/sidebar.html', '<div class="sidebar-offcanvas sidebar-{{configuration.position}} keta-sidebar">' +
'	<div class="sidebar-inner">' +
'		' +
'		<!-- extended navigation -->' +
'		<ul class="nav nav-pills nav-stacked nav-extended nav-extended-toggle"' +
'			data-ng-if="showToggleArea" data-ng-style="{marginTop: toggleAreaTop + \'px\'}">' +
'			<li>' +
'				<a href="" data-ng-click="toggleSideBar()">' +
'					<span class="glyphicon glyphicon-align-justify"></span>' +
'					<span>{{ configuration.label }}</span>' +
'				</a>' +
'			</li>' +
'		</ul>' +
'		' +
'		<!-- compact navigation -->' +
'		<ul class="nav nav-pills nav-stacked nav-compact nav-compact-toggle"' +
'			data-ng-if="showToggleArea">' +
'			<li>' +
'				<a href="" data-ng-click="toggleSideBar()">' +
'					<span class="glyphicon glyphicon-align-justify"></span>' +
'				</a>' +
'			</li>' +
'		</ul>' +
'		' +
'		<!--  transcluded content -->' +
'		<div data-ng-transclude class="sidebar-transclude" data-ng-style="{marginTop: transcludeTop + \'px\'}"></div>' +
'		' +
'	</div>' +
'</div>');
	});

// source: dist/filters/order-object-by.js
/**
 * @name keta.filters.OrderObjectBy
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.filters.OrderObjectBy
 * @description
 * <p>
 *   A filter to extract <code>limit</code> elements beginning at <code>offset</code>
 *   out of an array.
 * </p>
 * @example
 * {{ row | orderObjectBy:['col1', 'col2'] }}
 * {{ row | orderObjectBy:['col1', 'col2']:true }}
 * @example
 * angular.module('exampleApp', ['keta.filters.OrderObjectBy'])
 *     .controller('ExampleController', function($scope) {
 *
 *         // return object values in given order (all other values are dismissed)
 *         $scope.orderedProps = $filter('orderObjectBy')($scope.row, ['col1', 'col2']);
 *
 *         // return object keys in given order (all other keys are dismissed)
 *         $scope.orderedProps = $filter('orderObjectBy')($scope.row, ['col1', 'col2'], true);
 *
 *     });
 */

angular.module('keta.filters.OrderObjectBy', [])
	.filter('orderObjectBy', function() {
		return function(input, order, returnKey) {

			if (!angular.isObject(input)) {
				return input;
			}

			returnKey = returnKey || false;

			var fields = [];

			// default sort order
			if (!angular.isDefined(order) || order === null) {
				angular.forEach(input, function(value, key) {
					if (key.indexOf('$') !== 0) {
						fields.push(key);
					}
				});
			} else {
				fields = order;
			}

			// sort by fields
			var sorted = [];

			angular.forEach(fields, function(field) {
				if (angular.isDefined(input[field])) {
					sorted.push(returnKey ? field : input[field]);
				}
			});

			return sorted;
		};
	});

// source: dist/filters/slice.js
/**
 * @name keta.filters.Slice
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.filters.Slice
 * @description
 * <p>
 *   A filter to extract <code>limit</code> elements beginning at <code>offset</code>
 *   out of an array.
 * </p>
 * @example
 * {{ rows | slice:0:5 }}
 * @example
 * angular.module('exampleApp', ['keta.filters.Slice'])
 *     .controller('ExampleController', function($scope) {
 *
 *         // extract 5 elements starting at offset 0
 *         $scope.pagedRows = $filter('slice')($scope.rows, 0, 5);
 *
 *     });
 */

angular.module('keta.filters.Slice', [])
	.filter('slice', function() {
		return function(arr, offset, limit) {
			if (!angular.isDefined(arr) || !angular.isArray(arr)) {
				arr = [];
			}
			if (!angular.isDefined(offset) || !angular.isNumber(offset)) {
				offset = 0;
			}
			if (!angular.isDefined(limit) || !angular.isNumber(limit)) {
				limit = arr.length;
			}
			return arr.slice(offset, offset + limit);
		};
	});

// source: dist/filters/unit.js
/**
 * @name keta.filters.Unit
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.filters.Unit
 * @description
 * <p>
 *   A filter using SI prefixes to format numeric values.
 * </p>
 * <p>
 *   The filter takes a couple of parameters to configure it. <code>unit</code> defines the unit
 *   as string to append to formatted value (e.g. <code>'W'</code>, defaults to empty string).
 *   <code>precision</code> defines the number of digits to appear after the decimal point as integer
 *   (e.g. <code>2</code>, defaults to <code>0</code>). <code>precisionRanges</code> defines used
 *   precision in a more flexible way by defining an array of precisions with <code>min</code> (included)
 *   and/or <code>max</code> (excluded) value. <code>isBytes</code> is a boolean flag to
 *   specify if the given number is bytes and therefor 1024-based (defaults to <code>false</code>).
 *   <code>separate</code> is a boolean flag (defaults to <code>false</code>) which defines whether
 *   to return a single string or an object with separated values <code>numberFormatted</code> (String),
 *   <code>numberRaw</code> (Number) and <code>unit</code> (String).
 * </p>
 * <p>
 *   If <code>precisionRanges</code> is set to:
 * </p>
 * <pre>[
 *     {max: 1000, precision: 0},
 *     {min: 1000, precision: 1}
 * ]</pre>
 * <p>
 *   numeric values which are less than 1000 are formatted with a precision of 0, as numeric values
 *   equal or greater than 1000 are formatted with a precision of 1.
 * </p>
 * <p>
 *   If <code>separate</code> is set to <code>true</code> the filter returns an object in the
 *   following manner if for instance German is the current locale:
 * </p>
 * <pre>{
 *     numberFormatted: '1,546',
 *     numberRaw: 1.546,
 *     unit: 'kW'
 * }</pre>
 * @example
 * {{ 1234.56 | unit:{unit: 'W', precision: 1, isBytes: false} }}
 *
 * Number: {{ (1234.56 | unit:{unit: 'W', precision: 1, isBytes: false, separate:true}).numberFormatted }}
 * Unit: {{ (1234.56 | unit:{unit: 'W', precision: 1, isBytes: false, separate:true}).unit }}
 * @example
 * angular.module('exampleApp', ['keta.filters.Unit'])
 *     .controller('ExampleController', function($scope) {
 *
 *         // use unit filter to return formatted number value
 *         // $scope.value equals string '1.2 kW'
 *         $scope.value = $filter('unit')(1234.56, {
 *             unit: 'W',
 *             precision: 1,
 *             isBytes: false
 *         });
 *
 *         // use unit filter to return object for number formatting
 *         // $scope.valueSeparated equals object {numberFormatted: '1.2', numberRaw: 1.2, unit: 'kW'}
 *         // as numberFormatted is locale-aware, numberRaw remains a real number to calculate with
 *         // e.g. for German numberFormatted would be formatted to '1,2' and numberRaw would still be 1.2
 *         $scope.valueSeparated = $filter('unit')(1234.56, {
 *             unit: 'W',
 *             precision: 1,
 *             isBytes: false,
 *             separate: true
 *         });
 *
 *         // use unit filter with precision ranges
 *         // for the example below all values which are less than 1000 are formatted with a precision of 0
 *         // and all values equal or greater than 1000 are formatted with a precision of 1
 *         $scope.valueRanges = $filter('unit')(1234.56, {
 *             unit: 'W',
 *             precision: 1,
 *             precisionRanges: [
 *                 {max: 1000, precision: 0},
 *                 {min: 1000, precision: 1}
 *             ],
 *             isBytes: false
 *         });
 *
 *     });
 */

angular.module('keta.filters.Unit',
	[
		'keta.services.Tag'
	])
	.filter('unit', function($filter, TagConstants) {

		var unitFilter = function unitFilter(input, configuration) {

			if (!angular.isNumber(input)) {
				return input;
			}

			var precision = 0,
				precisionRanges = [],
				unit = '',
				isBytes = false,
				separate = false,
				separated = {
					numberFormatted: null,
					numberRaw: null,
					unit: null
				};

			if (angular.isDefined(configuration)) {

				// general precision (defaults to 0)
				precision =
					angular.isNumber(configuration.precision) ?
						configuration.precision : precision;

				// precision ranges (defaults to [])
				precisionRanges =
					angular.isArray(configuration.precisionRanges) ?
						configuration.precisionRanges : precisionRanges;

				// unit to use (defaults to '')
				unit =
					angular.isDefined(configuration.unit) ?
						configuration.unit : unit;

				// flag if value reprensents bytes (defaults to false)
				isBytes =
					angular.isDefined(configuration.isBytes) ?
						configuration.isBytes : isBytes;

				// flag if result should be returned separate (defaults to false)
				separate =
					angular.isDefined(configuration.separate) ?
						configuration.separate : separate;

			}

			// reset precision if precision range matches
			angular.forEach(precisionRanges, function(range) {
				var matching = true;
				if (angular.isDefined(range.min) && input < range.min) {
					matching = false;
				}
				if (angular.isDefined(range.max) && input >= range.max) {
					matching = false;
				}
				if (!angular.isDefined(range.min) && !angular.isDefined(range.max)) {
					matching = false;
				}
				if (matching && angular.isNumber(range.precision)) {
					precision = range.precision;
				}
			});

			if (input === 0) {
				precision = 0;
			}

			var sizes = isBytes ? ['Bytes', 'KB', 'MB', 'GB', 'TB'] : ['', 'k', 'M', 'G', 'T'];

			if (unit === TagConstants.UNIT.EURO ||
				unit === TagConstants.UNIT.KILOMETER ||
				unit === TagConstants.UNIT.DOLLAR ||
				unit === TagConstants.UNIT.POUND) {
				return $filter('number')(input, precision) + ' ' + unit;
			}

			var multiplicator = input < 0 ? -1 : 1;
			var oneKiloByte = 1024;
			var oneKilo = 1000;
			var parseBase = 10;
			input *= multiplicator;

			if (input >= 1) {

				var i = parseInt(
					Math.floor(Math.log(input) / Math.log(isBytes ? oneKiloByte : oneKilo)),
					parseBase
				);

				var siInput = input / Math.pow(isBytes ? oneKiloByte : oneKilo, i) * multiplicator;
				var siInputFixed = Number(siInput.toFixed(precision));
				if (siInputFixed >= oneKilo) {
					i++;
					siInputFixed /= oneKilo;
				}

				separated.numberFormatted = $filter('number')(siInputFixed);
				separated.numberRaw = siInputFixed;
				separated.unit = sizes[i] + unit;

				input =
					separated.numberFormatted +
						(sizes[i] !== '' ? ' ' + sizes[i] : '');

			} else {

				separated.numberFormatted = $filter('number')(input, precision);
				separated.numberRaw = input;
				separated.unit = unit;

				input = separated.numberFormatted;

			}

			if (!isBytes && unit !== '') {
				input += input.indexOf(' ') === -1 ? ' ' + unit : unit;
			}

			if (separate) {
				return separated;
			}

			return input;
		};

		unitFilter.$stateful = true;

		return unitFilter;

	});

// source: dist/services/access-token.js
/**
 * @name keta.services.AccessToken
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.AccessToken
 * @description AccessToken Factory
 */

angular.module('keta.services.AccessToken',
	[
		'keta.services.AppContext'
	])

	/**
	 * @class AccessToken
	 * @propertyOf keta.services.AccessToken
	 * @description Access Token Factory
	 */
	.factory('AccessToken', function AccessTokenFactory($http, AppContext) {

		/**
		 * @private
		 * @description Internal representation of access token which was injected by web server into context.js.
		 */
		var accessToken = AppContext.get('oauth.accessToken');

		// buddy ignore:start
		var Base64 = {

			keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

			decode: function(input) {
				var output = '';
				var chr1, chr2, chr3;
				var enc1, enc2, enc3, enc4;
				var i = 0;

				input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

				while (i < input.length) {

					enc1 = this.keyStr.indexOf(input.charAt(i++));
					enc2 = this.keyStr.indexOf(input.charAt(i++));
					enc3 = this.keyStr.indexOf(input.charAt(i++));
					enc4 = this.keyStr.indexOf(input.charAt(i++));

					chr1 = enc1 << 2 | enc2 >> 4;
					chr2 = (enc2 & 15) << 4 | enc3 >> 2;
					chr3 = (enc3 & 3) << 6 | enc4;

					output += String.fromCharCode(chr1);

					if (enc3 !== 64) {
						output += String.fromCharCode(chr2);
					}
					if (enc4 !== 64) {
						output += String.fromCharCode(chr3);
					}

				}

				return Base64.utf8Decode(output);
			},

			encode: function(input) {
				var output = '';
				var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
				var i = 0;

				input = Base64.utf8Encode(input);

				while (i < input.length) {

					chr1 = input.charCodeAt(i++);
					chr2 = input.charCodeAt(i++);
					chr3 = input.charCodeAt(i++);

					enc1 = chr1 >> 2;
					enc2 = (chr1 & 3) << 4 | chr2 >> 4;
					enc3 = (chr2 & 15) << 2 | chr3 >> 6;
					enc4 = chr3 & 63;

					if (isNaN(chr2)) {
						enc3 = enc4 = 64;
					} else if (isNaN(chr3)) {
						enc4 = 64;
					}

					output = output +
						this.keyStr.charAt(enc1) +
						this.keyStr.charAt(enc2) +
						this.keyStr.charAt(enc3) +
						this.keyStr.charAt(enc4);

				}

				return output;
			},

			utf8Decode: function(utfText) {
				var string = '';
				var i = 0;
				var c = 0, c2 = 0, c3 = 0;

				while (i < utfText.length) {

					c = utfText.charCodeAt(i);

					if (c < 128) {
						string += String.fromCharCode(c);
						i++;
					} else if (c > 191 && c < 224) {
						c2 = utfText.charCodeAt(i + 1);
						string += String.fromCharCode((c & 31) << 6 | c2 & 63);
						i += 2;
					} else {
						c2 = utfText.charCodeAt(i + 1);
						c3 = utfText.charCodeAt(i + 2);
						string += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
						i += 3;
					}

				}

				return string;
			},

			utf8Encode: function(string) {
				string = string.replace(/\r\n/g, '\n');
				var utfText = '';

				for (var n = 0; n < string.length; n++) {

					var c = string.charCodeAt(n);

					if (c < 128) {
						utfText += String.fromCharCode(c);
					} else if (c > 127 && c < 2048) {
						utfText += String.fromCharCode(c >> 6 | 192);
						utfText += String.fromCharCode(c & 63 | 128);
					} else {
						utfText += String.fromCharCode(c >> 12 | 224);
						utfText += String.fromCharCode(c >> 6 & 63 | 128);
						utfText += String.fromCharCode(c & 63 | 128);
					}

				}

				return utfText;
			}

		};
		// buddy ignore:end

		var api = {

			/**
			 * @function
			 * @memberOf AccessToken
			 * @description Get access token.
			 * @returns {string} access token
			 * @example
			 * angular.module('exampleApp', ['keta.services.AccessToken'])
			 *     .controller('ExampleController', function(AccessToken) {
			 *         var accessToken = AccessToken.get();
			 *     });
			 */
			get: function() {
				return accessToken;
			},

			/**
			 * @function
			 * @memberOf AccessToken
			 * @description Set access token.
			 * @param {string} token new access token
			 * @returns {void} returns nothing
			 * @example
			 * angular.module('exampleApp', ['keta.services.AccessToken'])
			 *     .controller('ExampleController', function(AccessToken) {
			 *         AccessToken.set('new-token');
			 *     });
			 */
			set: function(token) {
				if (angular.isDefined(token) && angular.isString(token)) {
					accessToken = token;
				}
			},

			/**
			 * @function
			 * @memberOf AccessToken
			 * @description Decode access token.
			 * @param {string} token access token to decode
			 * @returns {Object} access token properties
			 * @example
			 * angular.module('exampleApp', ['keta.services.AccessToken'])
			 *     .controller('ExampleController', function(AccessToken) {
			 *         var accessTokenProps = AccessToken.decode(AccessToken.get());
			 *     });
			 */
			decode: function(token) {
				var props = {};
				try {
					var decoded = Base64.decode(token);

					// strip away everything after }.
					if (decoded.indexOf('}.') !== -1) {
						decoded = decoded.substr(0, decoded.indexOf('}.') + 1);
					}

					props = JSON.parse(decoded);
				} catch (e) {
					return null;
				}
				return props;
			},

			/**
			 * @function
			 * @memberOf AccessToken
			 * @description Encode access token properties.
			 * @param {Object} props access token properties to encode
			 * @returns {string} access token
			 * @example
			 * angular.module('exampleApp', ['keta.services.AccessToken'])
			 *     .controller('ExampleController', function(AccessToken) {
			 *         var accessTokenProps = AccessToken.decode(AccessToken.get());
			 *         accessTokenProps.loaded = true;
			 *         var accessToken = AccessToken.encode(accessTokenProps);
			 *     });
			 */
			encode: function(props) {
				return Base64.encode(JSON.stringify(props));
			},

			/**
			 * @function
			 * @memberOf ketaAccessToken
			 * @description Refresh access token by requesting backend.
			 * @returns {promise} Promise which is resolved when query is returned
			 * @example
			 * angular.module('exampleApp', [])
			 *     .controller('ExampleController', function(ketaAccessToken) {
			 *         ketaAccessToken.refresh().then(
			 *             function(response) {
			 *                 if (angular.isDefined(response.data.accessToken)) {
			 *                     ketaAccessToken.set(response.data.accessToken);
			 *                 }
			 *             },
			 *             function(message) {
			 *                 console.error(message);
			 *             }
			 *         );
			 *     });
			 */
			refresh: function() {
				var refreshUrl = AppContext.get('oauth.refreshTokenPath') || '/refreshAccessToken';
				return $http({
					method: 'GET',
					url: refreshUrl
				});
			}

		};

		return api;

	});

// source: dist/services/app-context.js
/**
 * @name keta.services.AppContext
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.AppContext
 * @description AppContext Provider
 */

angular.module('keta.services.AppContext', [])

	/**
	 * @class AppContextProvider
	 * @propertyOf keta.services.AppContext
	 * @description App Context Provider
	 */
	.provider('AppContext', function AppContextProvider() {

		/**
		 * @private
		 * @description Internal representation of app context from global namespace injected by context.js.
		 */
		var appContext = angular.isDefined(window.appContext) ? window.appContext : {};

		/**
		 * @name get
		 * @function
		 * @memberOf AppContextProvider
		 * @description
		 * <p>
		 *   Get value by key from app context object. There <code>key</code> is a string in dot notation to describe
		 *   object properties with hierarchy.
		 * </p>
		 * @param {string} key key to retrieve from app context
		 * @returns {*} Object extracted from AppContext
		 * @example
		 * angular.module('exampleApp', ['keta.services.AppContext'])
		 *     .config(function(AppContextProvider) {
		 *         var socketURL = AppContextProvider.get('bus.url');
		 *     });
		 */
		this.get = function(key) {
			var obj = appContext;
			key = key.split('.');
			for (var i = 0, l = key.length; i < l; i++) {
				if (angular.isDefined(obj[key[i]])) {
					obj = obj[key[i]];
				} else {
					return null;
				}
			}
			return obj;
		};

		this.$get = function AppContextService() {

			/**
			 * @class AppContext
			 * @propertyOf AppContextProvider
			 * @description AppContext Service
			 */
			var api = {

				/**
				 * @function
				 * @memberOf AppContext
				 * @description
				 * <p>
				 *   Get value by key from app context object. There <code>key</code> is a string in dot notation
				 *   to describe object properties with hierarchy.
				 * </p>
				 * @param {string} key key to retrieve from app context
				 * @returns {*}
				 * @example
				 * angular.module('exampleApp', ['keta.services.AppContext'])
				 *     .controller('ExampleController', function(AppContext) {
				 *         var socketURL = AppContext.get('bus.url');
				 *     });
				 */
				get: this.get

			};

			return api;

		};

	});

// source: dist/services/application-set.js
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
										action: 'getAppsInfo',
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

// source: dist/services/application.js
/**
 * @name keta.services.Application
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.Application
 * @description Application Provider
 */

angular.module('keta.services.Application',
	[
		'keta.services.EventBusDispatcher',
		'keta.services.EventBusManager',
		'keta.services.Logger'
	])

	/**
	 * @class ApplicationProvider
	 * @propertyOf keta.services.Application
	 * @description Application Provider
	 */
	.provider('Application', function ApplicationProvider() {

		this.$get = function ApplicationService() {

			/**
			 * @class ApplicationInstance
			 * @propertyOf Application
			 * @description Application Instance
			 * @param {EventBus} givenEventBus eventBus to use for ApplicationInstance
			 * @param {Object} properties Properties to inject into ApplicationInstance
			 */
			var ApplicationInstance = function(givenEventBus, properties) {

				// keep reference
				var that = this;

				// save EventBus instance
				// var eventBus = givenEventBus;

				// populate properties
				angular.forEach(properties, function(value, key) {
					that[key] = value;

					// save copy under $pristine
					if (!angular.isDefined(that.$pristine)) {
						that.$pristine = {};
					}

					that.$pristine[key] = angular.copy(value);
				});

			};

			/**
			 * @class Application
			 * @propertyOf ApplicationProvider
			 * @description Application Service
			 */
			var api = {

				/**
				 * @function
				 * @memberOf Application
				 * @description
				 * <p>
				 *   Creates an ApplicationInstance with given EventBus instance and properties.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance to use for communication
				 * @param {Object} properties Properties to set upon UserInstance creation
				 * @returns {ApplicationInstance} ApplicationInstance created
				 * @example
				 * angular.module('exampleApp', ['keta.services.Application'])
				 *     .controller('ExampleController', function(Application) {
				 *         var application = Application.create(eventBus, {
				 *             appId: 'company.app',
				 *             entryUri: 'https://...',
				 *             redirectUri: 'https://...',
				 *             iconUri: 'https://...',
				 *             names: {
				 *                 en: 'Company App',
				 *                 de: 'Firmenanwendung'
				 *             }
				 *         });
				 *     });
				 */
				create: function(eventBus, properties) {
					return new ApplicationInstance(eventBus, properties);
				}

			};

			return api;

		};

	});

// source: dist/services/device-event.js
/**
 * @name keta.services.DeviceEvent
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.DeviceEvent
 * @description DeviceEvent Provider
 */

angular.module('keta.services.DeviceEvent', [])

	/**
	 * @class DeviceEventProvider
	 * @propertyOf keta.services.DeviceEvent
	 * @description DeviceEvent Provider
	 */
	.provider('DeviceEvent', function DeviceEventProvider() {

		this.$get = function DeviceEventService() {

			/**
			 * @class DeviceEventInstance
			 * @propertyOf DeviceEvent
			 * @description DeviceEvent Instance
			 * @param {string} givenType DeviceEvent type
			 * @param {DeviceInstance} givenDevice DeviceInstance to be affected by event
			 */
			var DeviceEventInstance = function(givenType, givenDevice) {

				// keep reference
				var that = this;

				// internal DeviceEvent type
				var type = givenType;

				/**
				 * @name getType
				 * @function
				 * @memberOf DeviceEventInstance
				 * @description
				 * <p>
				 *   Returns type of DeviceEvent.
				 * </p>
				 * @returns {string} type
				 * @example
				 * angular.module('exampleApp', ['keta.services.Device', 'keta.services.DeviceEvent'])
				 *     .controller('ExampleController', function(Device, DeviceEvent) {
				 *         var device = Device.create({
				 *             guid: 'guid'
				 *         });
				 *         var deviceEvent = DeviceEvent.create(DeviceEvent.TYPE_CREATED, device);
				 *         var deviceEventType = deviceEvent.getType();
				 *     });
				 */
				that.getType = function() {
					return type;
				};

				// internal DeviceEvent device
				var device = givenDevice;

				/**
				 * @name getDevice
				 * @function
				 * @memberOf DeviceEventInstance
				 * @description
				 * <p>
				 *   Returns device of DeviceEvent.
				 * </p>
				 * @returns {DeviceInstance} device
				 * @example
				 * angular.module('exampleApp', ['keta.services.Device', 'keta.services.DeviceEvent'])
				 *     .controller('ExampleController', function(Device, DeviceEvent) {
				 *         var device = Device.create({
				 *             guid: 'guid'
				 *         });
				 *         var deviceEvent = DeviceEvent.create(DeviceEvent.TYPE_CREATED, device);
				 *         var deviceEventDevice = deviceEvent.getDevice();
				 *     });
				 */
				that.getDevice = function() {
					return device;
				};

			};

			/**
			 * @class DeviceEvent
			 * @propertyOf DeviceEventProvider
			 * @description DeviceEvent Service
			 */
			var api = {

				/**
				 * @const
				 * @memberOf DeviceEvent
				 * @description
				 * <p>
				 *   Type for created event.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceEvent'])
				 *     .controller('ExampleController', function(DeviceEvent) {
				 *         if (type === DeviceEvent.CREATED) {
				 *             // ...
				 *         }
				 *     });
				 */
				CREATED: 'CREATED',

				/**
				 * @const
				 * @memberOf DeviceEvent
				 * @description
				 * <p>
				 *   Type for updated event.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceEvent'])
				 *     .controller('ExampleController', function(DeviceEvent) {
				 *         if (type === DeviceEvent.UPDATED) {
				 *             // ...
				 *         }
				 *     });
				 */
				UPDATED: 'UPDATED',

				/**
				 * @const
				 * @memberOf DeviceEvent
				 * @description
				 * <p>
				 *   Type for deleted event.
				 * </p>
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceEvent'])
				 *     .controller('ExampleController', function(DeviceEvent) {
				 *         if (type === DeviceEvent.DELETED) {
				 *             // ...
				 *         }
				 *     });
				 */
				DELETED: 'DELETED',

				/**
				 * @function
				 * @memberOf DeviceEvent
				 * @description
				 * <p>
				 *   Creates a DeviceEventInstance with given type and Device instance.
				 * </p>
				 * @param {string} type DeviceEvent type
				 * @param {DeviceInstance} device Device instance
				 * @returns {DeviceEventInstance} DeviceEventInstance created
				 * @example
				 * angular.module('exampleApp', ['keta.services.Device', 'keta.services.DeviceEvent'])
				 *     .controller('ExampleController', function(Device, DeviceEvent) {
				 *         var device = Device.create(eventBus, {
				 *             tagValues: {
				 *                 IdName: {
				 *                     name: 'IdName',
				 *                     value: 'Device',
				 *                     oca: 0,
				 *                     timestamp: 123456789
				 *                 }
				 *             }
				 *         });
				 *         var deviceEvent = DeviceEvent.create(DeviceEvent.TYPE_CREATED, device);
				 *     });
				 */
				create: function(type, device) {
					return new DeviceEventInstance(type, device);
				}

			};

			return api;

		};

	});

// source: dist/services/device-set.js
/**
 * @name keta.services.DeviceSet
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.DeviceSet
 * @description DeviceSet Provider
 */

angular.module('keta.services.DeviceSet',
	[
		'keta.services.Device',
		'keta.services.DeviceEvent'
	])

	/**
	 * @class DeviceSetProvider
	 * @propertyOf keta.services.DeviceSet
	 * @description DeviceSet Provider
	 */
	.provider('DeviceSet', function DeviceSetProvider() {

		var DEFAULT_OFFSET = 0;
		var DEFAULT_LIMIT = 50;

		this.$get = function DeviceSetService(
			$q, $rootScope, $log,
			Device, DeviceEvent, EventBusDispatcher, EventBusManager) {

			// api reference
			var api;

			/**
			 * @class DeviceSetInstance
			 * @propertyOf DeviceSetProvider
			 * @description DeviceSet Instance
			 * @param {EventBus} givenEventBus eventBus to use for DeviceSetInstance
			 */
			var DeviceSetInstance = function(givenEventBus) {

				// keep reference
				var that = this;

				// save EventBus instance
				var eventBus = givenEventBus;

				// internal params object
				var params = {};

				// automatically register device set listener
				var registerListener = false;

				// internal set object
				var set = {};

				/**
				 * @name filter
				 * @function
				 * @memberOf DeviceSetInstance
				 * @description
				 * <p>
				 *   Adds a filter before DeviceSet query is sent to EventBus.
				 * </p>
				 * @param {Object} filter filter to use
				 * @returns {DeviceSetInstance} DeviceSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(DeviceSet) {
				 *         DeviceSet.create(eventBus)
				 *             .filter({
				 *                 guid: 'guid'
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
				 * @memberOf DeviceSetInstance
				 * @description
				 * <p>
				 *   Adds a projection before DeviceSet query is sent to EventBus.
				 * </p>
				 * @param {Object} projection projection to use
				 * @returns {DeviceSetInstance} DeviceSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(DeviceSet) {
				 *         DeviceSet.create(eventBus)
				 *             .project({
				 *                 guid: 1,
				 *                 tagValues: {
				 *                     IdName: 1
				 *                 }
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
				 * @memberOf DeviceSetInstance
				 * @description
				 * <p>
				 *   Adds a sorting before DeviceSet query is sent to EventBus.
				 * </p>
				 * @param {Object} sorting sorting to use
				 * @returns {DeviceSetInstance} DeviceSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(DeviceSet) {
				 *         DeviceSet.create(eventBus)
				 *             .sort({
				 *                 'tagValue.IdName.value': 1
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
				 * @memberOf DeviceSetInstance
				 * @description
				 * <p>
				 *   Adds a pagination before DeviceSet query is sent to EventBus.
				 * </p>
				 * @param {Object} pagination pagination to use
				 * @returns {DeviceSetInstance} DeviceSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(DeviceSet) {
				 *         DeviceSet.create(eventBus)
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
				 * @name live
				 * @function
				 * @memberOf DeviceSetInstance
				 * @description
				 * <p>
				 *   Adds live update capabilities by registering a DeviceSetListener.
				 * </p>
				 * @returns {promise} DeviceSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(DeviceSet) {
				 *         DeviceSet.create(eventBus)
				 *             .live()
				 *             .query()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 */
				that.live = function() {
					registerListener = true;
					return that;
				};

				/**
				 * @name query
				 * @function
				 * @memberOf DeviceSetInstance
				 * @description
				 * <p>
				 *   Finally executes DeviceSet query by sending it to the associated EventBus instance.
				 * </p>
				 * @returns {promise} Promise which is resolved when query is returned
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(DeviceSet) {
				 *         DeviceSet.create(eventBus)
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

					// register device set listener if configured
					if (registerListener) {

						// generate UUID
						var liveHandlerUUID = 'CLIENT_' + EventBusDispatcher.generateUUID();

						// register handler under created UUID
						EventBusDispatcher.registerHandler(eventBus, liveHandlerUUID, function(event) {

							// inject guid if missing
							if (!angular.isDefined(event.value.guid) &&
								angular.isDefined(event.value.tagValues)) {
								var tagValueKeys = Object.keys(event.value.tagValues);
								event.value.guid = event.value.tagValues[tagValueKeys[0]].guid;
							}

							// process event using sync
							api.sync(set, DeviceEvent.create(event.type, event.value), eventBus);

							// log if in debug mode
							if (EventBusManager.inDebugMode()) {
								$log.event([event], $log.ADVANCED_FORMATTER);
							}

						});

						// register device set listener
						EventBusDispatcher.send(eventBus, 'deviceservice', {
							action: 'registerDeviceSetListener',
							body: {
								filter: params.filter,
								projection: params.projection,
								replyAddress: liveHandlerUUID
							}
						}, function(reply) {
							// log if in debug mode
							if (EventBusManager.inDebugMode()) {
								$log.request(['deviceservice', {
									action: 'registerDeviceSetListener',
									body: {
										filter: params.filter,
										projection: params.projection,
										replyAddress: liveHandlerUUID
									}
								}, reply], $log.ADVANCED_FORMATTER);
							}
						});

					}

					EventBusDispatcher.send(eventBus, 'deviceservice', {
						action: 'getDevices',
						params: params
					}, function(reply) {
						if (reply) {
							// inject used params
							reply.params = params;

							if (reply.code === EventBusDispatcher.RESPONSE_CODE_OK) {

								// create DeviceInstances
								if (angular.isDefined(reply.result) &&
									angular.isDefined(reply.result.items)) {
									angular.forEach(reply.result.items, function(item, index) {
										reply.result.items[index] = Device.create(eventBus, item);
									});
									set = reply;
								} else {
									set = {};
								}

								// log if in debug mode
								if (EventBusManager.inDebugMode()) {
									$log.request(['deviceservice', {
										action: 'getDevices',
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
			 * @class DeviceSet
			 * @propertyOf DeviceSetProvider
			 * @description DeviceSet Service
			 */
			api = {

				/**
				 * @function
				 * @memberOf DeviceSet
				 * @description
				 * <p>
				 *   Creates a DeviceSetInstance with given EventBus instance.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance to use for communication
				 * @returns {DeviceSetInstance} DeviceSetInstance created
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(DeviceSet) {
				 *         var deviceSet = DeviceSet.create(eventBus);
				 *     });
				 */
				create: function(eventBus) {
					return new DeviceSetInstance(eventBus);
				},

				/**
				 * @function
				 * @memberOf DeviceSet
				 * @description
				 * <p>
				 *   Returns index of given Device in DeviceSet by comparing GUIDs.
				 * </p>
				 * @param {DeviceSetInstance} set DeviceSetInstance to search in
				 * @param {DeviceInstance} device DeviceInstance to search for
				 * @returns {number} index
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(DeviceSet) {
				 *         DeviceSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 // index equals 0 after the call
				 *                 var index = DeviceSet.indexOf(reply, reply.result.items[0]);
				 *             });
				 *     });
				 */
				indexOf: function(set, device) {
					var index = -1;
					if (angular.isDefined(set.result) &&
						angular.isDefined(set.result.items)) {
						angular.forEach(set.result.items, function(item, key) {
							if (item.guid === device.guid) {
								index = key;
							}
						});
					}
					return index;
				},

				/**
				 * @function
				 * @memberOf DeviceSet
				 * @description
				 * <p>
				 *   Returns number of devices in given DeviceSet.
				 * </p>
				 * @param {DeviceSetInstance} set DeviceSetInstance to search in
				 * @returns {number} number of devices
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(DeviceSet) {
				 *         DeviceSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 // length equals number of devices in DeviceSet
				 *                 var length = DeviceSet.length(reply);
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
				 * @memberOf DeviceSet
				 * @description
				 * <p>
				 *   Returns device in given DeviceSet by specified index.
				 * </p>
				 * @param {DeviceSetInstance} set DeviceSetInstance to search in
				 * @param {number} index Index of device to return
				 * @returns {DeviceInstance} DeviceInstance retrieved from set
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(DeviceSet) {
				 *         DeviceSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 // device equals first item after the call
				 *                 var device = DeviceSet.get(reply, 0);
				 *             });
				 *     });
				 */
				get: function(set, index) {
					var device =
						angular.isDefined(set.result) &&
						angular.isDefined(set.result.items) &&
						angular.isDefined(set.result.items[index]) ? set.result.items[index] : null;
					return device;
				},

				/**
				 * @function
				 * @memberOf DeviceSet
				 * @description
				 * <p>
				 *   Returns all devices in given DeviceSet.
				 * </p>
				 * @param {DeviceSetInstance} set DeviceSetInstance to search in
				 * @returns {Array} All DeviceInstances retrieved from set
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(DeviceSet) {
				 *         DeviceSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 var devices = DeviceSet.getAll(reply);
				 *             });
				 *     });
				 */
				getAll: function(set) {
					var devices =
						angular.isDefined(set.result) &&
						angular.isDefined(set.result.items) ? set.result.items : [];
					return devices;
				},

				/**
				 * @function
				 * @memberOf DeviceSet
				 * @description
				 * <p>
				 *   Synchronizes given DeviceSet with given DeviceEvent.
				 * </p>
				 * @param {DeviceSetInstance} set DeviceSetInstance to sync
				 * @param {DeviceEventInstance} event DeviceEventInstance to process
				 * @param {EventBus} eventBus EventBus instance to use for communication
				 * @returns {void} returns nothing
				 * @example
				 * angular.module('exampleApp', ['keta.services.DeviceSet'])
				 *     .controller('ExampleController', function(DeviceSet) {
				 *         DeviceSet.sync(
				 *             DeviceSet.create().query(),
				 *             DeviceEvent.create({
				 *                 type: DeviceEvent.CREATED,
				 *                 device: Device.create(eventBus, {
				 *                     guid: 'guid'
				 *                 })
				 *             })
				 *         );
				 *     });
				 */
				sync: function(set, event, eventBus) {

					var modified = false;
					var device = Device.create(eventBus, event.getDevice());

					if (event.getType() === DeviceEvent.CREATED) {
						set.result.items.push(device);
						modified = true;
					} else if (event.getType() === DeviceEvent.DELETED) {
						set.result.items.splice(api.indexOf(set, device), 1);
						modified = true;
					} else if (event.getType() === DeviceEvent.UPDATED) {
						var index = api.indexOf(set, device);
						if (index !== -1) {
							angular.extend(api.get(set, index), device);
							modified = true;
						}
					}

					// trigger scope digest if anything was modified and not automatically triggered
					if (modified && !$rootScope.$$phase) {
						$rootScope.$apply();
					}

				}

			};

			return api;

		};

	});

// source: dist/services/device.js
/**
 * @name keta.services.Device
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.Device
 * @description Device Provider
 */

angular.module('keta.services.Device',
	[
		'keta.services.EventBusDispatcher',
		'keta.services.EventBusManager',
		'keta.services.Logger'
	])

	.constant('DeviceConstants', {
		STATE: {
			OK: 'OK',
			ERROR: 'ERROR',
			FATAL: 'FATAL'
		},
		// TODO: include full device class list
		CLASS: {
			ENERGY_MANAGER: 'com.kiwigrid.devices.em.EnergyManager',
			LOCATION: 'com.kiwigrid.devices.location.Location',
			PV_PLANT: 'com.kiwigrid.devices.pvplant.PVPlant'
		},
		// TODO: avoid constant duplication in a certain manner
		ICON: {
			'com.kiwigrid.devices.batteryconverter.BatteryConverter': 'kiwigrid-device-icon-battery-converter',
			'com.kiwigrid.devices.plug.Plug': 'kiwigrid-device-icon-plug',
			'com.kiwigrid.devices.powermeter.PowerMeter': 'kiwigrid-device-icon-plug',
			'com.kiwigrid.devices.windturbine.WindTurbine': 'kiwigrid-device-icon-wind-turbine',
			'com.kiwigrid.devices.sensor.TemperatureSensor': 'kiwigrid-device-icon-temperature-sensor',
			'com.kiwigrid.devices.inverter.Inverter': 'kiwigrid-device-icon-inverter',
			'com.kiwigrid.devices.heatpump.HeatPump': 'kiwigrid-device-icon-smart-heat-pump',
			'com.kiwigrid.devices.microchp.MicroChpSystem': 'kiwigrid-device-icon-micro-combined-heat-pump',
			'com.kiwigrid.devices.ripplecontrolreceiver.RippleControlReceiver':
				'kiwigrid-device-icon-ripple-control-receiver',
			'com.kiwigrid.devices.smartheatpumps.SmartHeatPumps': 'kiwigrid-device-icon-smart-heat-pump',
			'com.kiwigrid.devices.pvplant.PVPlant': 'kiwigrid-device-icon-pv-plant'
		}
	})

	/**
	 * @class DeviceProvider
	 * @propertyOf keta.services.Device
	 * @description Device Provider
	 */
	.provider('Device', function DeviceProvider() {

		this.$get = function DeviceService($q, $log, EventBusDispatcher, EventBusManager) {

			/**
			 * @class DeviceInstance
			 * @propertyOf Device
			 * @description Device Instance
			 * @param {EventBus} givenEventBus eventBus to use for DeviceInstance
			 * @param {Object} properties Properties to inject into DeviceInstance
			 */
			var DeviceInstance = function(givenEventBus, properties) {

				// keep reference
				var that = this;

				// save EventBus instance
				var eventBus = givenEventBus;

				// populate properties
				angular.forEach(properties, function(value, key) {
					that[key] = value;

					// save copy under $pristine
					if (!angular.isDefined(that.$pristine)) {
						that.$pristine = {};
					}

					that.$pristine[key] = angular.copy(value);
				});

				// send message and return promise
				var sendMessage = function(message) {
					var deferred = $q.defer();

					EventBusDispatcher.send(eventBus, 'deviceservice', message, function(reply) {

						// log if in debug mode
						if (EventBusManager.inDebugMode()) {
							$log.request(['deviceservice', message, reply], $log.ADVANCED_FORMATTER);
						}

						if (reply.code === EventBusDispatcher.RESPONSE_CODE_OK) {
							deferred.resolve(reply);
						} else {
							deferred.reject(reply);
						}

					});

					return deferred.promise;
				};

				var returnRejectedPromise = function(message) {
					var deferred = $q.defer();
					deferred.reject(message);
					return deferred.promise;
				};

				/**
				 * @name $update
				 * @function
				 * @memberOf DeviceInstance
				 * @description
				 * <p>
				 *   Updates a remote DeviceInstance from local one the method is called on.
				 * </p>
				 * <p>
				 *   Only value changes in <code>tagValues</code> property will be recognized as changes.
				 * </p>
				 * @returns {promise} promise
				 * @example
				 * angular.module('exampleApp', ['keta.services.Device'])
				 *     .controller('ExampleController', function(Device) {
				 *         var device = Device.create({
				 *             guid: 'guid',
				 *             tagValues: {
				 *                 IdName: {
				 *                     name: 'IdName',
				 *                     value: 'Device',
				 *                     oca: 0,
				 *                     timestamp: 123456789
				 *                 }
				 *             }
				 *         });
				 *         device.tagValues.IdName.value = 'Modified Device';
				 *         device.$update()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 *     });
				 */
				that.$update = function() {

					// TODO: verify if there are use cases where not only tag values are changed

					// collect changes in tagValues property
					var changes = {
						tagValues: {}
					};

					angular.forEach(that.tagValues, function(tagValue, tagName) {
						if (!angular.isDefined(that.$pristine.tagValues[tagName]) ||
							!angular.equals(that.tagValues[tagName].value, that.$pristine.tagValues[tagName].value)) {
							changes.tagValues[tagName] = {};
							changes.tagValues[tagName].value = tagValue.value;
							changes.tagValues[tagName].oca = tagValue.oca;
						}
					});

					if (Object.keys(changes.tagValues).length) {
						var deferred = $q.defer();

						sendMessage({
							action: 'mergeDevice',
							params: {
								deviceId: that.guid
							},
							body: changes
						}).then(function(reply) {

							// update $pristine copies of succeeded tag values
							if (angular.isDefined(reply.result) &&
								angular.isDefined(reply.result.value) &&
								angular.isDefined(reply.result.value.tagValues)) {
								angular.forEach(reply.result.value.tagValues, function(tag) {
									if (angular.isDefined(that.tagValues[tag.tagName])) {
										that.$pristine.tagValues[tag.tagName] =
											angular.copy(that.tagValues[tag.tagName]);
									}
								});
							}

							deferred.resolve(reply);
						}, function(reply) {
							deferred.reject(reply);
						});

						return deferred.promise;
					}
					return returnRejectedPromise('No changes found');
				};

				/**
				 * @name $delete
				 * @function
				 * @memberOf DeviceInstance
				 * @description
				 * <p>
				 *   Deletes a remote DeviceInstance from local one the method is called on.
				 * </p>
				 * @returns {promise} promise
				 * @example
				 * angular.module('exampleApp', ['keta.services.Device'])
				 *     .controller('ExampleController', function(Device) {
				 *         var device = Device.create({
				 *             guid: 'guid'
				 *         });
				 *         device.$delete()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 *     });
				 */
				that.$delete = function() {
					return sendMessage({
						action: 'deleteDevice',
						params: {
							deviceId: that.guid
						}
					});
				};

				/**
				 * @name $reset
				 * @function
				 * @memberOf DeviceInstance
				 * @description
				 * <p>
				 *   Resets a DeviceInstance to it's $pristine state.
				 * </p>
				 * @returns {undefined} nothing
				 * @example
				 * angular.module('exampleApp', ['keta.services.Device'])
				 *     .controller('ExampleController', function(Device) {
				 *         var device = Device.create({
				 *             guid: 'guid',
				 *             tagValues: {
				 *                 IdName: {
				 *                     name: 'IdName',
				 *                     value: 'Device',
				 *                     oca: 0,
				 *                     timestamp: 123456789
				 *                 }
				 *             }
				 *         });
				 *         device.tagValues.IdName.value = 'Modified Device';
				 *         device.$update()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 device.$reset();
				 *             });
				 *     });
				 */
				that.$reset = function() {

					// remove everything beside methods and $pristine copy
					angular.forEach(that, function(value, key) {
						if (!angular.isFunction(value) && key !== '$pristine') {
							delete that[key];
						}
					});

					// add copies of $pristine values
					angular.forEach(that.$pristine, function(value, key) {
						that[key] = angular.copy(value);
					});

				};

			};

			/**
			 * @class Device
			 * @propertyOf DeviceProvider
			 * @description Device Service
			 */
			var api = {

				/**
				 * @function
				 * @memberOf Device
				 * @description
				 * <p>
				 *   Creates a DeviceInstance with given EventBus instance and properties.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance to use for communication
				 * @param {Object} properties Properties to set upon DeviceInstance creation
				 * @returns {DeviceInstance} DeviceInstance created
				 * @example
				 * angular.module('exampleApp', ['keta.services.Device'])
				 *     .controller('ExampleController', function(Device) {
				 *         var device = Device.create(eventBus, {
				 *             tagValues: {
				 *                 IdName: {
				 *                     name: 'IdName',
				 *                     value: 'Device',
				 *                     oca: 0,
				 *                     timestamp: 123456789
				 *                 }
				 *             }
				 *         });
				 *     });
				 */
				create: function(eventBus, properties) {
					return new DeviceInstance(eventBus, properties);
				}

			};

			return api;

		};

	});

// source: dist/services/event-bus-dispatcher.js
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

				// set timeout
				if (replied) {
					timeout = $timeout(function() {
						error();
					}, eventBus.getConfig().requestTimeout * 1000);
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
						if (reply && reply.code === 419) {
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

// source: dist/services/event-bus-manager.js
/**
 * @name keta.services.EventBusManager
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.EventBusManager
 * @description EventBusManager Provider
 */

angular.module('keta.services.EventBusManager', [])

	/**
	 * @class EventBusManagerProvider
	 * @propertyOf keta.services.EventBusManager
	 * @description EventBusManager Provider
	 */
	.provider('EventBusManager', function EventBusManagerProvider() {

		// keep reference
		var that = this;

		/**
		 * @private
		 * @description Internal list of EventBus instances.
		 */
		var eventBuses = {};

		/**
		 * @private
		 * @description Debug mode enabled or not.
		 */
		var debug = false;

		/**
		 * @name add
		 * @function
		 * @memberOf EventBusManagerProvider
		 * @description
		 * <p>
		 *   Adds an EventBus instance to internal list, from which it can be retrieved later on by it's id.
		 * </p>
		 * @param {EventBus} eventBus EventBus instance to add
		 * @returns {EventBusManagerProvider} EventBusManagerProvider to chain
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(EventBusManagerProvider) {
		 *         EventBusManagerProvider
		 *             .add(eventBus)
		 *             .remove(eventBus);
		 *     });
		 */
		this.add = function(eventBus) {
			eventBuses[eventBus.getConfig().id] = eventBus;
			return that;
		};

		/**
		 * @name remove
		 * @function
		 * @memberOf EventBusManagerProvider
		 * @description
		 * <p>
		 *   Removes an EventBus instance from internal list.
		 * </p>
		 * @param {EventBus} eventBus EventBus instance to remove
		 * @returns {EventBusManagerProvider} EventBusManagerProvider to chain
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(EventBusManagerProvider) {
		 *         EventBusManagerProvider
		 *             .add(eventBus)
		 *             .remove(eventBus);
		 *     });
		 */
		this.remove = function(eventBus) {
			if (angular.isDefined(eventBuses[eventBus.getConfig().id])) {
				delete eventBuses[eventBus.getConfig().id];
			}
			return that;
		};

		/**
		 * @name removeAll
		 * @function
		 * @memberOf EventBusManagerProvider
		 * @description
		 * <p>
		 *   Removes all EventBus instances from internal list.
		 * </p>
		 * @returns {EventBusManagerProvider} EventBusManagerProvider to chain
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(EventBusManagerProvider) {
		 *         EventBusManagerProvider
		 *             .add(eventBus)
		 *             .removeAll();
		 *     });
		 */
		this.removeAll = function() {
			eventBuses = {};
			return that;
		};

		/**
		 * @name get
		 * @function
		 * @memberOf EventBusManagerProvider
		 * @description
		 * <p>
		 *   Gets an EventBus instance from internal list by specified id.
		 * </p>
		 * @param {string} eventBusId EventBus instance id to retrieve from internal list
		 * @returns {EventBus} EventBus instance if found, otherwise null
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(EventBusManagerProvider) {
		 *         var eventBus = EventBusManagerProvider.get('eventBus');
		 *     });
		 */
		this.get = function(eventBusId) {
			return angular.isDefined(eventBuses[eventBusId]) ? eventBuses[eventBusId] : null;
		};

		/**
		 * @name getAll
		 * @function
		 * @memberOf EventBusManagerProvider
		 * @description
		 * <p>
		 *   Gets all EventBus instances from internal list.
		 * </p>
		 * @returns {Object} EventBus instances map (id as key)
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(EventBusManagerProvider) {
		 *         var eventBuses = EventBusManagerProvider.getAll();
		 *     });
		 */
		this.getAll = function() {
			return eventBuses;
		};

		/**
		 * @name enableDebug
		 * @function
		 * @memberOf EventBusManagerProvider
		 * @description
		 * <p>
		 *   Enables debug mode which outputs requests and responses to console.
		 * </p>
		 * @returns {void} returns nothing
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(EventBusManagerProvider) {
		 *         EventBusManagerProvider.enableDebug();
		 *     });
		 */
		this.enableDebug = function() {
			debug = true;
		};

		/**
		 * @name disableDebug
		 * @function
		 * @memberOf EventBusManagerProvider
		 * @description
		 * <p>
		 *   Disables debug mode which normally outputs requests and responses to console.
		 * </p>
		 * @returns {void} returns nothing
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(EventBusManagerProvider) {
		 *         EventBusManagerProvider.disableDebug();
		 *     });
		 */
		this.disableDebug = function() {
			debug = false;
		};

		/**
		 * @name inDebugMode
		 * @function
		 * @memberOf EventBusManagerProvider
		 * @description
		 * <p>
		 *   Returns true if currently in debug mode.
		 * </p>
		 * @returns {Boolean} true if debug mode is enabled
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(EventBusManagerProvider) {
		 *         if (EventBusManagerProvider.inDebugMode()) {
		 *             // do something useful
		 *         }
		 *     });
		 */
		this.inDebugMode = function() {
			return debug === true;
		};

		this.$get = function EventBusManagerService() {

			/**
			 * @class EventBusManager
			 * @propertyOf EventBusManagerProvider
			 * @description EventBusManager Service
			 */
			var api = {

				/**
				 * @memberOf EventBusManager
				 * @see EventBusManagerProvider.add
				 */
				add: this.add,

				/**
				 * @memberOf EventBusManager
				 * @see EventBusManagerProvider.remove
				 */
				remove: this.remove,

				/**
				 * @memberOf EventBusManager
				 * @see EventBusManagerProvider.removeAll
				 */
				removeAll: this.removeAll,

				/**
				 * @memberOf EventBusManager
				 * @see EventBusManagerProvider.get
				 */
				get: this.get,

				/**
				 * @memberOf EventBusManager
				 * @see EventBusManagerProvider.getAll
				 */
				getAll: this.getAll,

				/**
				 * @memberOf EventBusManager
				 * @see EventBusManagerProvider.enableDebug
				 */
				enableDebug: this.enableDebug,

				/**
				 * @memberOf EventBusManager
				 * @see EventBusManagerProvider.disableDebug
				 */
				disableDebug: this.disableDebug,

				/**
				 * @memberOf EventBusManager
				 * @see EventBusManagerProvider.inDebugMode
				 */
				inDebugMode: this.inDebugMode

			};

			return api;

		};

	});

// source: dist/services/event-bus.js
/**
 * @name keta.services.EventBus
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.EventBus
 * @description EventBus Provider
 */

angular.module('keta.services.EventBus', [])

	/**
	 * @class EventBusProvider
	 * @propertyOf keta.services.EventBus
	 * @description EventBus Provider
	 */
	.provider('EventBus', function EventBusProvider() {

		/**
		 * @class EventBus
		 * @propertyOf keta.services.EventBus
		 * @description EventBus Instance
		 * @param {Object} givenConfig Config to use for EventBus
		 */
		var EventBus = function EventBus(givenConfig) {

			/**
			 * @private
			 * @description Default config for EventBus instances.
			 */
			var DEFAULT_CONFIG = {
				id: 'kiwibus',
				url: 'https://localhost:10443/kiwibus',
				reconnect: true,
				reconnectTimeout: 5,
				requestTimeout: 10
			};

			/**
			 * @name getDefaultConfig
			 * @function
			 * @memberOf EventBus
			 * @description
			 * <p>
			 *   Returns default config used to merge in EventBus instance create method.
			 * </p>
			 * @returns {Object} default configuration
			 * @example
			 * angular.module('exampleApp', ['keta.services.EventBus'])
			 *     .controller('ExampleController', function(EventBus) {
			 *         var defaultConfig = eventBus.getDefaultConfig();
			 *     });
			 */
			this.getDefaultConfig = function() {
				return DEFAULT_CONFIG;
			};

			/**
			 * @private
			 * @description Effective config as merge result of given and default config.
			 */
			var config = angular.extend({}, DEFAULT_CONFIG, givenConfig);

			/**
			 * @name getConfig
			 * @function
			 * @memberOf EventBus
			 * @description
			 * <p>
			 *   Returns effective config of EventBus instance.
			 * </p>
			 * @returns {Object} effective configuration
			 * @example
			 * angular.module('exampleApp', ['keta.services.EventBus'])
			 *     .controller('ExampleController', function(EventBus) {
			 *         var effectiveConfig = eventBus.getConfig();
			 *     });
			 */
			this.getConfig = function() {
				return config;
			};

			/**
			 * @private
			 * @description Internal reference to vertx.EventBus instance.
			 */
			var eb = null;

			/**
			 * @name getInstance
			 * @function
			 * @memberOf EventBus
			 * @description
			 * <p>
			 *   Returns vertx.EventBus instance.
			 * </p>
			 * @returns {vertx.EventBus} vertx.EventBus instance
			 * @example
			 * angular.module('exampleApp', ['keta.services.EventBus'])
			 *     .controller('ExampleController', function(EventBus) {
			 *         var instance = eventBus.getInstance();
			 *     });
			 */
			this.getInstance = function() {
				return eb;
			};

			// init vertx.EventBus
			var init = function() {

				// instantiate vertx.EventBus
				eb = new vertx.EventBus(config.url);

				// add onclose handler
				eb.onclose = function() {

					// reconnect if enabled
					if (config.reconnect) {
						window.setTimeout(function() {
							init();
						}, config.reconnectTimeout * 1000);
					}

				};

			};

			init();

		};

		/**
		 * @name create
		 * @function
		 * @memberOf EventBusProvider
		 * @description
		 * <p>
		 *   Creates an EventBus instance with given config, which is merged with the default config.
		 * </p>
		 * @param {Object} config config to use in created EventBus instance
		 * @returns {EventBus} EventBus created
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBus'])
		 *     .config(function(EventBusProvider) {
		 *         // create with default config
		 *         var eventBus = EventBusProvider.create();
		 *     });
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBus'])
		 *     .config(function(EventBusProvider) {
		 *         // create with custom id
		 *         var eventBus = EventBusProvider.create({id: 'myEventBus'});
		 *     });
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBus'])
		 *     .config(function(EventBusProvider) {
		 *
		 *         // create with custom config
		 *         // in this case it's exactly the default config
		 *         var eventBus = EventBusProvider.create({
		 *             id: 'kiwibus',
		 *             url: 'https://localhost:10443/kiwibus',
		 *             reconnect: true,
		 *             reconnectTimeout: 5,
		 *             requestTimeout: 10
		 *         });
		 *
		 *     });
		 */
		this.create = function(config) {
			return new EventBus(config);
		};

		this.$get = function EventBusService() {};

	});

// source: dist/services/logger.js
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

// source: dist/services/tag-set.js
/**
 * @name keta.services.TagSet
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.TagSet
 * @description TagSet Provider
 */

angular.module('keta.services.TagSet',
	[
		'keta.services.Tag'
	])

	/**
	 * @class TagSetProvider
	 * @propertyOf keta.services.TagSet
	 * @description TagSet Provider
	 */
	.provider('TagSet', function TagSetProvider() {

		this.$get = function TagSetService() {

			/**
			 * @class TagSetInstance
			 * @propertyOf TagSetProvider
			 * @description TagSet Instance
			 */
			var TagSetInstance = function() {

				// keep reference
				var that = this;

				// internal array of tags
				var tags = [];

				// internal map of tags
				var tagsAsHierarchy = {};

				/**
				 * @name getTags
				 * @function
				 * @memberOf TagSetInstance
				 * @description
				 * <p>
				 *   Returns tags as an Array.
				 * </p>
				 * @returns {Array} tags
				 * @example
				 * angular.module('exampleApp', ['keta.services.TagSet'])
				 *     .controller('ExampleController', function(TagSet) {
				 *         var tagSet = TagSet.create();
				 *         var tags = tagSet.getTags();
				 *     });
				 */
				that.getTags = function() {
					return tags;
				};

				/**
				 * @name getTagsAsHierarchy
				 * @function
				 * @memberOf TagSetInstance
				 * @description
				 * <p>
				 *   Returns tags as hierarchically organized Object. First level represents devices
				 *   specified by <code>guid</code> property. On the second level <code>name</code> property
				 *   is used as key pointing to the <code>Tag</code> object.
				 * </p>
				 * @returns {Object} tagsAsHierarchy
				 * @example
				 * angular.module('exampleApp', ['keta.services.TagSet'])
				 *     .controller('ExampleController', function(TagSet) {
				 *         var tagSet = TagSet.create();
				 *         var hierarchy = tagSet.getTagsAsHierarchy();
				 *     });
				 */
				that.getTagsAsHierarchy = function() {
					return tagsAsHierarchy;
				};

				/**
				 * @name add
				 * @function
				 * @memberOf TagSetInstance
				 * @description
				 * <p>
				 *   Adds a <code>Tag</code> object to the <code>TagSet</code> if it doesn't exist already.
				 *   In this case nothing will be changed.
				 * </p>
				 * @param {TagInstance} tag Tag to add
				 * @returns {TagSetInstance} TagSetInstance with added TagInstance
				 * @example
				 * angular.module('exampleApp', ['keta.services.TagSet'])
				 *     .controller('ExampleController', function(TagSet) {
				 *         TagSet
				 *             .create()
				 *             .add(Tag.create({
				 *                 guid: 'guid',
				 *                 name: 'name',
				 *                 sampleRate: 10
				 *             }));
				 *     });
				 */
				that.add = function(tag) {
					if (!angular.isDefined(tagsAsHierarchy[tag.getGuid()]) ||
						!angular.isDefined(tagsAsHierarchy[tag.getGuid()][tag.getName()])) {
						if (!angular.isDefined(tagsAsHierarchy[tag.getGuid()])) {
							tagsAsHierarchy[tag.getGuid()] = {};
						}
						tagsAsHierarchy[tag.getGuid()][tag.getName()] = tag;
						tags.push(tag);
					}
					return that;
				};

				/**
				 * @name remove
				 * @function
				 * @memberOf TagSetInstance
				 * @description
				 * <p>
				 *   Removes a <code>Tag</code> object from the <code>TagSet</code> if it still exists.
				 *   Otherwise nothing will be changed.
				 * </p>
				 * @param {TagInstance} tag Tag to remove
				 * @returns {TagSetInstance} TagSetInstance with removed TagInstance
				 * @example
				 * angular.module('exampleApp', ['keta.services.TagSet'])
				 *     .controller('ExampleController', function(TagSet) {
				 *         var tag = Tag.create({
				 *             guid: 'guid',
				 *             name: 'name',
				 *             sampleRate: 10
				 *         });
				 *         TagSet
				 *             .create()
				 *             .add(tag)
				 *             .remove(tag);
				 *     });
				 */
				that.remove = function(tag) {
					if (angular.isDefined(tagsAsHierarchy[tag.getGuid()][tag.getName()])) {
						delete tagsAsHierarchy[tag.getGuid()][tag.getName()];
						if (Object.keys(tagsAsHierarchy[tag.getGuid()]).length === 0) {
							delete tagsAsHierarchy[tag.getGuid()];
						}
						tags.splice(tags.indexOf(tag), 1);
					}
					return that;
				};

			};

			/**
			 * @class TagSet
			 * @propertyOf TagSetProvider
			 * @description TagSet Service
			 */
			var api = {

				/**
				 * @function
				 * @memberOf TagSet
				 * @description
				 * <p>
				 *   Creates a TagSetInstance.
				 * </p>
				 * @returns {TagSetInstance} TagSetInstance created
				 * @example
				 * angular.module('exampleApp', ['keta.services.TagSet'])
				 *     .controller('ExampleController', function(TagSet) {
				 *         var tagSet = TagSet.create();
				 *     });
				 */
				create: function() {
					return new TagSetInstance();
				}

			};

			return api;

		};

	});

// source: dist/services/tag.js
/**
 * @name keta.services.Tag
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.Tag
 * @description Tag Provider
 */

angular.module('keta.services.Tag', [])

	.constant('TagConstants', {
		// TODO: include full tag unit list
		UNIT: {
			WATTS: 'W',
			WATTHOURS: 'Wh',
			PERCENT: '%',
			EURO: '€',
			DOLLAR: '$',
			POUND: '£',
			KILOMETER: 'km'
		}
	})

	/**
	 * @class TagProvider
	 * @propertyOf keta.services.Tag
	 * @description Tag Provider
	 */
	.provider('Tag', function TagProvider() {

		this.$get = function TagService() {

			/**
			 * @class TagInstance
			 * @propertyOf TagSetProvider
			 * @description Tag Instance
			 * @param {Object} properties Properties to inject into TagInstance
			 */
			var TagInstance = function(properties) {

				// guid of device tag belongs to
				var guid = angular.isDefined(properties.guid) ? properties.guid : null;

				/**
				 * @name getGuid
				 * @function
				 * @memberOf TagInstance
				 * @description
				 * <p>
				 *   Returns <code>guid</code> property of Tag.
				 * </p>
				 * @returns {string} guid
				 * @example
				 * angular.module('exampleApp', ['keta.services.Tag'])
				 *     .controller('ExampleController', function(Tag) {
				 *         var tag = Tag.create({
				 *             guid: 'guid',
				 *             name: 'name',
				 *             sampleRate: 10
				 *         });
				 *         var tagGuid = tag.getGuid();
				 *     });
				 */
				this.getGuid = function() {
					return guid;
				};

				// tag name
				var name = angular.isDefined(properties.name) ? properties.name : null;

				/**
				 * @name getName
				 * @function
				 * @memberOf TagInstance
				 * @description
				 * <p>
				 *   Returns <code>name</code> property of Tag.
				 * </p>
				 * @returns {string} name
				 * @example
				 * angular.module('exampleApp', ['keta.services.Tag'])
				 *     .controller('ExampleController', function(Tag) {
				 *         var tag = Tag.create({
				 *             guid: 'guid',
				 *             name: 'name',
				 *             sampleRate: 10
				 *         });
				 *         var tagName = tag.getName();
				 *     });
				 */
				this.getName = function() {
					return name;
				};

				// sample rate
				var sampleRate =
					angular.isDefined(properties.sampleRate) && properties.sampleRate >= 5 ?
						properties.sampleRate : null;

				/**
				 * @name getSampleRate
				 * @function
				 * @memberOf TagInstance
				 * @description
				 * <p>
				 *   Returns <code>sampleRate</code> property of Tag.
				 * </p>
				 * @returns {number} sampleRate
				 * @example
				 * angular.module('exampleApp', ['keta.services.Tag'])
				 *     .controller('ExampleController', function(Tag) {
				 *         var tag = Tag.create({
				 *             guid: 'guid',
				 *             name: 'name',
				 *             sampleRate: 10
				 *         });
				 *         var tagSampleRate = tag.getSampleRate();
				 *     });
				 */
				this.getSampleRate = function() {
					return sampleRate;
				};

			};

			/**
			 * @class Tag
			 * @propertyOf TagProvider
			 * @description Tag Service
			 */
			var api = {

				/**
				 * @function
				 * @memberOf Tag
				 * @description
				 * <p>
				 *   Creates a TagInstance.
				 * </p>
				 * @param {Object} properties Properties to inject into TagInstance
				 * @returns {TagInstance} TagInstance created
				 * @example
				 * angular.module('exampleApp', ['keta.services.Tag'])
				 *     .controller('ExampleController', function(Tag) {
				 *         var tag = Tag.create({
				 *             guid: 'guid',
				 *             name: 'IdName',
				 *             sampleRate: 10
				 *         });
				 *     });
				 */
				create: function(properties) {
					return new TagInstance(properties);
				}

			};

			return api;

		};

	});

// source: dist/services/user-set.js
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
									$log.request(['userservice', {
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

// source: dist/services/user.js
/**
 * @name keta.services.User
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.User
 * @description User Provider
 */

angular.module('keta.services.User',
	[
		'keta.services.EventBusDispatcher',
		'keta.services.EventBusManager',
		'keta.services.Logger'
	])

	/**
	 * @class UserProvider
	 * @propertyOf keta.services.User
	 * @description User Provider
	 */
	.provider('User', function UserProvider() {

		this.$get = function UserService($q, $log, EventBusDispatcher, EventBusManager) {

			// send message and return promise
			var sendMessage = function(eventBus, message) {
				var deferred = $q.defer();

				EventBusDispatcher.send(eventBus, 'userservice', message, function(reply) {

					// log if in debug mode
					if (EventBusManager.inDebugMode()) {
						$log.request(['userservice', message, reply], $log.ADVANCED_FORMATTER);
					}

					if (reply.code === EventBusDispatcher.RESPONSE_CODE_OK) {
						deferred.resolve(reply);
					} else {
						deferred.reject(reply);
					}

				});

				return deferred.promise;
			};

			var returnRejectedPromise = function(message) {
				var deferred = $q.defer();
				deferred.reject(message);
				return deferred.promise;
			};

			/**
			 * @class UserInstance
			 * @propertyOf User
			 * @description User Instance
			 * @param {EventBus} givenEventBus eventBus to use for UserInstance
			 * @param {Object} properties Properties to inject into UserInstance
			 */
			var UserInstance = function(givenEventBus, properties) {

				// keep reference
				var that = this;

				// save EventBus instance
				var eventBus = givenEventBus;

				// populate properties
				angular.forEach(properties, function(value, key) {
					that[key] = value;

					// save copy under $pristine
					if (!angular.isDefined(that.$pristine)) {
						that.$pristine = {};
					}

					that.$pristine[key] = angular.copy(value);
				});

				/**
				 * @name $create
				 * @function
				 * @memberOf UserInstance
				 * @description
				 * <p>
				 *   Creates a remote UserInstance from local one the method is called on.
				 * </p>
				 * @returns {promise} promise
				 * @example
				 * angular.module('exampleApp', ['keta.services.User'])
				 *     .controller('ExampleController', function(User) {
				 *
				 *         var user = User.create({
				 *             userId: 'userId'
				 *         });
				 *
				 *         user.$create()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 *
				 *     });
				 */
				that.$create = function() {

					var cleanedUser = {};
					for (var el in that) {
						if (that.hasOwnProperty(el) && !angular.isFunction(that[el]) && el !== '$pristine') {
							cleanedUser[el] = angular.copy(that[el]);
						}
					}

					return sendMessage(eventBus, {
						action: 'createUser',
						params: {
							userId: cleanedUser.userId
						},
						body: cleanedUser
					});

				};

				/**
				 * @name $update
				 * @function
				 * @memberOf UserInstance
				 * @description
				 * <p>
				 *   Updates a remote UserInstance from local one the method is called on.
				 * </p>
				 * @returns {promise} promise
				 * @example
				 * angular.module('exampleApp', ['keta.services.User'])
				 *     .controller('ExampleController', function(User) {
				 *
				 *         var user = User.create({
				 *             userId: 'john.doe',
				 *             channel: 'channel',
				 *             givenName: 'John',
				 *             familyName: 'Doe',
				 *             email: 'john.doe@test.com',
				 *             address: {
				 *                 street: 'Main Street',
				 *                 number: '100 E',
				 *                 city: 'Phoenix',
				 *                 country: 'USA',
				 *                 zip: '85123'
				 *             },
				 *             properties: {
				 *                 position: 'left'
				 *             }
				 *         });
				 *
				 *         user.email = 'john.doe@kiwigrid.com';
				 *         delete user.properties.position;
				 *
				 *         user.$update()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 *
				 *     });
				 */
				that.$update = function() {

					// create cleaned copies
					var cleanedUser = angular.copy(that);
					var cleanedUserOriginal = angular.copy(that.$pristine);
					delete cleanedUser.$pristine;
					delete cleanedUser.$create;
					delete cleanedUser.$update;
					delete cleanedUser.$delete;
					delete cleanedUser.$reset;

					// collect changes
					// changes on second level are not merged and therefor objects have to be transmitted in full
					// except "properties", which are merged on second level too
					var changes = {};

					angular.forEach(cleanedUser, function(value, key) {
						if (key === 'properties') {
							if (!angular.isDefined(cleanedUserOriginal.properties) ||
								cleanedUserOriginal.properties === null ||
								angular.equals(cleanedUserOriginal.properties, {})) {
								changes.properties = value;
							} else {
								angular.forEach(value, function(propValue, propKey) {
									if (!angular.isDefined(cleanedUserOriginal.properties[propKey]) ||
										!angular.equals(
											cleanedUser.properties[propKey],
											cleanedUserOriginal.properties[propKey]
										)
									) {
										if (!angular.isDefined(changes.properties)) {
											changes.properties = {};
										}
										changes.properties[propKey] = propValue;
									}
								});
							}
						} else if (!angular.equals(cleanedUser[key], cleanedUserOriginal[key])) {
							changes[key] = value;
						}
					});

					if (Object.keys(changes).length) {
						var deferred = $q.defer();

						sendMessage(eventBus, {
							action: 'mergeUser',
							params: {
								userId: that.userId
							},
							body: changes
						}).then(function(reply) {

							// reset $pristine copies after success
							that.$pristine = {};
							angular.forEach(that, function(value, key) {
								if (!angular.isFunction(that[key])) {
									that.$pristine[key] = angular.copy(that[key]);
								}
							});

							deferred.resolve(reply);
						}, function(reply) {
							deferred.reject(reply);
						});

						return deferred.promise;
					}

					return returnRejectedPromise('No changes found');
				};

				/**
				 * @name $delete
				 * @function
				 * @memberOf UserInstance
				 * @description
				 * <p>
				 *   Deletes a remote UserInstance from local one the method is called on.
				 * </p>
				 * @returns {promise} promise
				 * @example
				 * angular.module('exampleApp', ['keta.services.User'])
				 *     .controller('ExampleController', function(User) {
				 *
				 *         var user = User.create({
				 *             userId: 'userId'
				 *         });
				 *
				 *         user.$delete()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 *
				 *     });
				 */
				that.$delete = function() {
					return sendMessage(eventBus, {
						action: 'deleteUser',
						params: {
							userId: that.userId
						}
					});
				};

				/**
				 * @name $reset
				 * @function
				 * @memberOf UserInstance
				 * @description
				 * <p>
				 *   Resets a UserInstance to it's $pristine state.
				 * </p>
				 * @returns {undefined} nothing
				 * @example
				 * angular.module('exampleApp', ['keta.services.User'])
				 *     .controller('ExampleController', function(User) {
				 *
				 *         var user = User.create({
				 *             userId: 'john.doe',
				 *             channel: 'channel',
				 *             givenName: 'John',
				 *             familyName: 'Doe',
				 *             email: 'john.doe@test.com',
				 *             address: {
				 *                 street: 'Main Street',
				 *                 number: '100 E',
				 *                 city: 'Phoenix',
				 *                 country: 'USA',
				 *                 zip: '85123'
				 *             },
				 *             properties: {
				 *                 position: 'left'
				 *             }
				 *         });
				 *
				 *         user.email = 'john.doe@kiwigrid.com';
				 *         delete user.properties.position;
				 *
				 *         user.$update()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 user.$reset();
				 *             });
				 *
				 *     });
				 */
				that.$reset = function() {

					// remove everything beside methods and $pristine copy
					angular.forEach(that, function(value, key) {
						if (!angular.isFunction(value) && key !== '$pristine') {
							delete that[key];
						}
					});

					// add copies of $pristine values
					angular.forEach(that.$pristine, function(value, key) {
						that[key] = angular.copy(value);
					});

				};

			};

			/**
			 * @class User
			 * @propertyOf UserProvider
			 * @description User Service
			 */
			var api = {

				/**
				 * @function
				 * @memberOf User
				 * @description
				 * <p>
				 *   Creates a UserInstance with given EventBus instance and properties.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance to use for communication
				 * @param {Object} properties Properties to set upon UserInstance creation
				 * @returns {UserInstance} created UserInstance
				 * @example
				 * angular.module('exampleApp', ['keta.services.User'])
				 *     .controller('ExampleController', function(User) {
				 *         var user = User.create(eventBus, {
				 *             userId: 'john.doe',
				 *             channel: 'channel',
				 *             givenName: 'John',
				 *             familyName: 'Doe',
				 *             email: 'john.doe@test.com',
				 *             address: {
				 *                 street: 'Main Street',
				 *                 number: '100 E',
				 *                 city: 'Phoenix',
				 *                 country: 'USA',
				 *                 zip: '85123'
				 *             }
				 *         });
				 *     });
				 */
				create: function(eventBus, properties) {
					return new UserInstance(eventBus, properties);
				},

				/**
				 * @function
				 * @memberOf User
				 * @description
				 * <p>
				 *   Returns the channel name for given channel id.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance to use for communication
				 * @param {String} channelId Channel id to retrieve.
				 * @returns {String} channel name
				 * @example
				 * angular.module('exampleApp', ['keta.services.User'])
				 *     .controller('ExampleController', function(User) {
				 *         User.getChannel(eventBus, 'channel-1')
				 *             .then(function(reply) {
				 *                 // reply is channel name
				 *             });
				 *     });
				 */
				getChannel: function(eventBus, channelId) {
					var deferred = $q.defer();

					sendMessage(eventBus, {
						action: 'getChannel',
						params: {
							channelId: channelId
						}
					}).then(function(reply) {
						deferred.resolve(reply);
					}, function(reply) {
						deferred.reject(reply);
					});

					return deferred.promise;
				},

				/**
				 * @function
				 * @memberOf User
				 * @description
				 * <p>
				 *   Returns the currently logged-in user.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance to use for communication
				 * @returns {UserInstance} current logged-in user
				 * @example
				 * angular.module('exampleApp', ['keta.services.User'])
				 *     .controller('ExampleController', function(User) {
				 *         User.getCurrentUser(eventBus)
				 *             .then(function(reply) {
				 *                 // reply is current UserInstance
				 *             });
				 *     });
				 */
				getCurrent: function(eventBus) {
					var deferred = $q.defer();

					sendMessage(eventBus, {
						action: 'getCurrentUser'
					}).then(function(reply) {
						deferred.resolve(new UserInstance(eventBus, reply.result));
					}, function(reply) {
						deferred.reject(reply);
					});

					return deferred.promise;
				}

			};

			return api;

		};

	});

// source: dist/utils/application.js
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

	.constant('ApplicationUtilsConstants', {

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
	.factory('ApplicationUtils', function ApplicationUtils(
		$log, $q,
		ApplicationSet, EventBusManager, CommonUtils,
		ApplicationUtilsConstants
	) {

		var deferred = {
			getAppList: null
		};

		return {

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
			},

			/**
			 * @name getAppName
			 * @memberOf ApplicationUtils
			 * @description
			 * <p>
			 *   uiLocale is the current (user set) UI language of the running app.
			 *   Can be either short ('de') or long ('en-US') format.
			 * </p>
			 * @param {object} app application instance
			 * @param {string} uiLocale current locale
			 * @returns {string} application localized application name
			 */

			getAppName: function getAppName(app, uiLocale) {
				return CommonUtils.doesPropertyExist(app, 'meta.i18n') ?
					CommonUtils.getLabelByLocale('name', app.meta.i18n, uiLocale) : null;
			},

			/**
			 * @name getAppIcon
			 * @function
			 * @memberOf ApplicationUtils
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

				var appIcon = null;

				language = angular.isDefined(language) ? language : 'en';

				var mediaSource = CommonUtils.doesPropertyExist(app, 'meta.i18n') &&
					angular.isDefined(app.meta.i18n[language]) &&
					angular.isDefined(app.meta.i18n[language].media) ?
						app.meta.i18n[language].media : null;

				if (mediaSource === null &&
					CommonUtils.doesPropertyExist(app, 'meta.i18n.en.media')) {
					mediaSource = app.meta.i18n.en.media;
				}

				if (angular.isDefined(app.entryUri)) {

					var link = document.createElement('a');
					link.href = app.entryUri;

					angular.forEach(mediaSource, function(media) {

						if (angular.isDefined(media.type) &&
							media.type === ApplicationUtilsConstants.ASSET_MEDIA_TYPE.APPICON &&
							angular.isDefined(media.src)) {

							appIcon =
								link.origin[link.origin.length - 1] !== '/' && media.src[0] !== '/' ?
								link.origin + '/' + media.src :
								link.origin + media.src;

						}

					});

				}

				return appIcon;

			},

			/**
			 * @name getAppAuthor
			 * @function
			 * @memberOf ApplicationUtils
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

				type = angular.isDefined(type) ? type : ApplicationUtilsConstants.AUTHOR_TYPE.SELLER;

				if (CommonUtils.doesPropertyExist(app, 'meta.authors')) {

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

// source: dist/utils/common.js
/**
 * @name keta.utils.Common
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.utils.Common
 * @description
 * <p>
 *   Common service utilities for cross-component usage.
 * </p>
 */

angular.module('keta.utils.Common', [])

	/**
	 * @class CommonUtils
	 * @propertyOf keta.utils.Common
	 * @description Common Utils Factory
	 */
	.factory('CommonUtils', function CommonUtils() {

		var factory = {};

		/**
		 * @name doesPropertyExist
		 * @function
		 * @memberOf CommonUtils
		 * @description This method checks, if a deep property does exist in the given object.
		 * @param {object} obj object to check property for
		 * @param {string} prop property given in dot notation
		 * @returns {boolean} true if property exists
		 */
		factory.doesPropertyExist = function doesPropertyExist(obj, prop) {
			var parts = prop.split('.');
			for (var i = 0, l = parts.length; i < l; i++) {
				var part = parts[i];
				if (angular.isObject(obj) && part in obj) {
					obj = obj[part];
				} else {
					return false;
				}
			}
			return true;
		};

		/**
		 * @name getLabelByLocale
		 * @function
		 * @memberOf CommonUtils
		 * @description
		 * <p>
		 *   Returns the translation for a given key inside of an object of labels which is grouped by locale keys.<br>
		 *   If the given locale is not found inside the labels object the function tries to fall back to the
		 *   english translation, otherwise the return value is null.
		 * </p>
		 * <p>
		 *   The key can be either in short ('en') or long ('en-US') format.<br>
		 *   Locales only match from specific > general > fallback<br>
		 *   i. e. 'de-AT' > 'de' > 'en'<br>
		 *   If a general local is not defined go straight to fallback locale.
		 * </p>
		 * @param {string} key translation key to search for
		 * @param {object} labels object with all translation keys grouped by locale keys
		 * @param {object} currentLocale the currently active locale inside of the application
		 * @returns {string|null} the translated label or null if no translation could be found
		 */
		factory.getLabelByLocale = function getLabelByLocale(key, labels, currentLocale) {

			var LOCALE_LENGTH = 2;
			var label = null;

			var shortLocale =
				angular.isString(currentLocale) &&
				currentLocale.length >= LOCALE_LENGTH ?
					currentLocale.substr(0, LOCALE_LENGTH) : '';

			if (angular.isObject(labels[currentLocale]) &&
				angular.isDefined(labels[currentLocale][key])) {
				label = labels[currentLocale][key];
			} else if (angular.isObject(labels[shortLocale]) &&
				angular.isDefined(labels[shortLocale][key])) {
				label = labels[shortLocale][key];
			} else if (angular.isObject(labels.en) &&
				angular.isDefined(labels.en[key])) {
				label = labels.en[key];
			}
			return label;
		};

		return factory;

	});

// source: dist/utils/country.js
/**
 * @name keta.utils.Country
 * @author Johannes Klein <johannes.klein@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.utils.Country
 * @description
 * <p>
 *   Country service utility for cross-component usage.
 * </p>
 */

angular.module('keta.utils.Country', [])

	// message keys with default values
	.constant('CountryUtilsMessageKeys', {
		'en': {
			'AD': 'Andorra',
			'AE': 'United Arab Emirates',
			'AF': 'Afghanistan',
			'AG': 'Antigua and Barbuda',
			'AI': 'Anguilla',
			'AL': 'Albania',
			'AM': 'Armenia',
			'AO': 'Angola',
			'AQ': 'Antarctica',
			'AR': 'Argentina',
			'AS': 'American Samoa',
			'AT': 'Austria',
			'AU': 'Australia',
			'AW': 'Aruba',
			'AX': 'Aland Islands',
			'AZ': 'Azerbaijan',
			'BA': 'Bosnia and Herzegovina',
			'BB': 'Barbados',
			'BD': 'Bangladesh',
			'BE': 'Belgium',
			'BF': 'Burkina Faso',
			'BG': 'Bulgaria',
			'BH': 'Bahrain',
			'BI': 'Burundi',
			'BJ': 'Benin',
			'BL': 'Saint Barthelemy',
			'BM': 'Bermuda',
			'BN': 'Brunei',
			'BO': 'Bolivia',
			'BQ': 'Bonaire, Saint Eustatius and Saba',
			'BR': 'Brazil',
			'BS': 'Bahamas',
			'BT': 'Bhutan',
			'BV': 'Bouvet Island',
			'BW': 'Botswana',
			'BY': 'Belarus',
			'BZ': 'Belize',
			'CA': 'Canada',
			'CC': 'Cocos Islands',
			'CD': 'Democratic Republic of the Congo',
			'CF': 'Central African Republic',
			'CG': 'Republic of the Congo',
			'CH': 'Switzerland',
			'CI': 'Ivory Coast',
			'CK': 'Cook Islands',
			'CL': 'Chile',
			'CM': 'Cameroon',
			'CN': 'China',
			'CO': 'Colombia',
			'CR': 'Costa Rica',
			'CU': 'Cuba',
			'CV': 'Cape Verde',
			'CW': 'Curacao',
			'CX': 'Christmas Island',
			'CY': 'Cyprus',
			'CZ': 'Czech Republic',
			'DE': 'Germany',
			'DJ': 'Djibouti',
			'DK': 'Denmark',
			'DM': 'Dominica',
			'DO': 'Dominican Republic',
			'DZ': 'Algeria',
			'EC': 'Ecuador',
			'EE': 'Estonia',
			'EG': 'Egypt',
			'EH': 'Western Sahara',
			'ER': 'Eritrea',
			'ES': 'Spain',
			'ET': 'Ethiopia',
			'FI': 'Finland',
			'FJ': 'Fiji',
			'FK': 'Falkland Islands',
			'FM': 'Micronesia',
			'FO': 'Faroe Islands',
			'FR': 'France',
			'GA': 'Gabon',
			'GB': 'United Kingdom',
			'GD': 'Grenada',
			'GE': 'Georgia',
			'GF': 'French Guiana',
			'GG': 'Guernsey',
			'GH': 'Ghana',
			'GI': 'Gibraltar',
			'GL': 'Greenland',
			'GM': 'Gambia',
			'GN': 'Guinea',
			'GP': 'Guadeloupe',
			'GQ': 'Equatorial Guinea',
			'GR': 'Greece',
			'GS': 'South Georgia and the South Sandwich Islands',
			'GT': 'Guatemala',
			'GU': 'Guam',
			'GW': 'Guinea-Bissau',
			'GY': 'Guyana',
			'HK': 'Hong Kong',
			'HM': 'Heard Island and McDonald Islands',
			'HN': 'Honduras',
			'HR': 'Croatia',
			'HT': 'Haiti',
			'HU': 'Hungary',
			'ID': 'Indonesia',
			'IE': 'Ireland',
			'IL': 'Israel',
			'IM': 'Isle of Man',
			'IN': 'India',
			'IO': 'British Indian Ocean Territory',
			'IQ': 'Iraq',
			'IR': 'Iran',
			'IS': 'Iceland',
			'IT': 'Italy',
			'JE': 'Jersey',
			'JM': 'Jamaica',
			'JO': 'Jordan',
			'JP': 'Japan',
			'KE': 'Kenya',
			'KG': 'Kyrgyzstan',
			'KH': 'Cambodia',
			'KI': 'Kiribati',
			'KM': 'Comoros',
			'KN': 'Saint Kitts and Nevis',
			'KP': 'North Korea',
			'KR': 'South Korea',
			'KW': 'Kuwait',
			'KY': 'Cayman Islands',
			'KZ': 'Kazakhstan',
			'LA': 'Laos',
			'LB': 'Lebanon',
			'LC': 'Saint Lucia',
			'LI': 'Liechtenstein',
			'LK': 'Sri Lanka',
			'LR': 'Liberia',
			'LS': 'Lesotho',
			'LT': 'Lithuania',
			'LU': 'Luxembourg',
			'LV': 'Latvia',
			'LY': 'Libya',
			'MA': 'Morocco',
			'MC': 'Monaco',
			'MD': 'Moldova',
			'ME': 'Montenegro',
			'MF': 'Saint Martin',
			'MG': 'Madagascar',
			'MH': 'Marshall Islands',
			'MK': 'Macedonia',
			'ML': 'Mali',
			'MM': 'Myanmar',
			'MN': 'Mongolia',
			'MO': 'Macao',
			'MP': 'Northern Mariana Islands',
			'MQ': 'Martinique',
			'MR': 'Mauritania',
			'MS': 'Montserrat',
			'MT': 'Malta',
			'MU': 'Mauritius',
			'MV': 'Maldives',
			'MW': 'Malawi',
			'MX': 'Mexico',
			'MY': 'Malaysia',
			'MZ': 'Mozambique',
			'NA': 'Namibia',
			'NC': 'New Caledonia',
			'NE': 'Niger',
			'NF': 'Norfolk Island',
			'NG': 'Nigeria',
			'NI': 'Nicaragua',
			'NL': 'Netherlands',
			'NO': 'Norway',
			'NP': 'Nepal',
			'NR': 'Nauru',
			'NU': 'Niue',
			'NZ': 'New Zealand',
			'OM': 'Oman',
			'PA': 'Panama',
			'PE': 'Peru',
			'PF': 'French Polynesia',
			'PG': 'Papua New Guinea',
			'PH': 'Philippines',
			'PK': 'Pakistan',
			'PL': 'Poland',
			'PM': 'Saint Pierre and Miquelon',
			'PN': 'Pitcairn',
			'PR': 'Puerto Rico',
			'PS': 'Palestinian Territory',
			'PT': 'Portugal',
			'PW': 'Palau',
			'PY': 'Paraguay',
			'QA': 'Qatar',
			'RE': 'Reunion',
			'RO': 'Romania',
			'RS': 'Serbia',
			'RU': 'Russia',
			'RW': 'Rwanda',
			'SA': 'Saudi Arabia',
			'SB': 'Solomon Islands',
			'SC': 'Seychelles',
			'SD': 'Sudan',
			'SE': 'Sweden',
			'SG': 'Singapore',
			'SH': 'Saint Helena',
			'SI': 'Slovenia',
			'SJ': 'Svalbard and Jan Mayen',
			'SK': 'Slovakia',
			'SL': 'Sierra Leone',
			'SM': 'San Marino',
			'SN': 'Senegal',
			'SO': 'Somalia',
			'SR': 'Suriname',
			'SS': 'South Sudan',
			'ST': 'Sao Tome and Principe',
			'SV': 'El Salvador',
			'SX': 'Sint Maarten',
			'SY': 'Syria',
			'SZ': 'Swaziland',
			'TC': 'Turks and Caicos Islands',
			'TD': 'Chad',
			'TF': 'French Southern Territories',
			'TG': 'Togo',
			'TH': 'Thailand',
			'TJ': 'Tajikistan',
			'TK': 'Tokelau',
			'TL': 'East Timor',
			'TM': 'Turkmenistan',
			'TN': 'Tunisia',
			'TO': 'Tonga',
			'TR': 'Turkey',
			'TT': 'Trinidad and Tobago',
			'TV': 'Tuvalu',
			'TW': 'Taiwan',
			'TZ': 'Tanzania',
			'UA': 'Ukraine',
			'UG': 'Uganda',
			'UM': 'United States Minor Outlying Islands',
			'US': 'United States',
			'UY': 'Uruguay',
			'UZ': 'Uzbekistan',
			'VA': 'Vatican',
			'VC': 'Saint Vincent and the Grenadines',
			'VE': 'Venezuela',
			'VG': 'British Virgin Islands',
			'VI': 'U.S. Virgin Islands',
			'VN': 'Vietnam',
			'VU': 'Vanuatu',
			'WF': 'Wallis and Futuna',
			'WS': 'Samoa',
			'YE': 'Yemen',
			'YT': 'Mayotte',
			'ZA': 'South Africa',
			'ZM': 'Zambia',
			'ZW': 'Zimbabwe'
		},
		'de': {
			'AD': 'Andorra',
			'AE': 'Vereinigte Arabische Emirate',
			'AF': 'Afghanistan',
			'AG': 'Antigua und Barbuda',
			'AI': 'Anguilla',
			'AL': 'Albanien',
			'AM': 'Armenien',
			'AO': 'Angola',
			'AQ': 'Antarktika (Sonderstatus durch Antarktis-Vertrag)',
			'AR': 'Argentinien',
			'AS': 'Amerikanisch-Samoa',
			'AT': 'Österreich',
			'AU': 'Australien',
			'AW': 'Aruba',
			'AX': 'Åland',
			'AZ': 'Aserbaidschan',
			'BA': 'Bosnien und Herzegowina',
			'BB': 'Barbados',
			'BD': 'Bangladesch',
			'BE': 'Belgien',
			'BF': 'Burkina Faso',
			'BG': 'Bulgarien',
			'BH': 'Bahrain',
			'BI': 'Burundi',
			'BJ': 'Benin',
			'BL': 'Saint-Barthélemy',
			'BM': 'Bermuda',
			'BN': 'Brunei Darussalam',
			'BO': 'Bolivien',
			'BQ': 'Bonaire, Sint Eustatius und Saba (Niederlande)',
			'BR': 'Brasilien',
			'BS': 'Bahamas',
			'BT': 'Bhutan',
			'BV': 'Bouvetinsel',
			'BW': 'Botswana',
			'BY': 'Belarus (Weißrussland)',
			'BZ': 'Belize',
			'CA': 'Kanada',
			'CC': 'Kokosinseln',
			'CD': 'Kongo, Demokratische Republik (ehem. Zaire)',
			'CF': 'Zentralafrikanische Republik',
			'CG': 'Republik Kongo',
			'CH': 'Schweiz (Confoederatio Helvetica)',
			'CI': 'Côte d’Ivoire (Elfenbeinküste)',
			'CK': 'Cookinseln',
			'CL': 'Chile',
			'CM': 'Kamerun',
			'CN': 'China, Volksrepublik',
			'CO': 'Kolumbien',
			'CR': 'Costa Rica',
			'CU': 'Kuba',
			'CV': 'Kap Verde',
			'CW': 'Curaçao',
			'CX': 'Weihnachtsinsel',
			'CY': 'Zypern',
			'CZ': 'Tschechische Republik',
			'DE': 'Deutschland',
			'DJ': 'Dschibuti',
			'DK': 'Dänemark',
			'DM': 'Dominica',
			'DO': 'Dominikanische Republik',
			'DZ': 'Algerien',
			'EC': 'Ecuador',
			'EE': 'Estland',
			'EG': 'Ägypten',
			'EH': 'Westsahara',
			'ER': 'Eritrea',
			'ES': 'Spanien',
			'ET': 'Äthiopien',
			'FI': 'Finnland',
			'FJ': 'Fidschi',
			'FK': 'Falklandinseln',
			'FM': 'Mikronesien',
			'FO': 'Färöer',
			'FR': 'Frankreich',
			'GA': 'Gabun',
			'GB': 'Vereinigtes Königreich Großbritannien und Nordirland',
			'GD': 'Grenada',
			'GE': 'Georgien',
			'GF': 'Französisch-Guayana',
			'GG': 'Guernsey (Kanalinsel)',
			'GH': 'Ghana',
			'GI': 'Gibraltar',
			'GL': 'Grönland',
			'GM': 'Gambia',
			'GN': 'Guinea',
			'GP': 'Guadeloupe',
			'GQ': 'Äquatorialguinea',
			'GR': 'Griechenland',
			'GS': 'Südgeorgien und die Südlichen Sandwichinseln',
			'GT': 'Guatemala',
			'GU': 'Guam',
			'GW': 'Guinea-Bissau',
			'GY': 'Guyana',
			'HK': 'Hongkong',
			'HM': 'Heard und McDonaldinseln',
			'HN': 'Honduras',
			'HR': 'Kroatien',
			'HT': 'Haiti',
			'HU': 'Ungarn',
			'ID': 'Indonesien',
			'IE': 'Irland',
			'IL': 'Israel',
			'IM': 'Insel Man',
			'IN': 'Indien',
			'IO': 'Britisches Territorium im Indischen Ozean',
			'IQ': 'Irak',
			'IR': 'Iran, Islamische Republik',
			'IS': 'Island',
			'IT': 'Italien',
			'JE': 'Jersey (Kanalinsel)',
			'JM': 'Jamaika',
			'JO': 'Jordanien',
			'JP': 'Japan',
			'KE': 'Kenia',
			'KG': 'Kirgisistan',
			'KH': 'Kambodscha',
			'KI': 'Kiribati',
			'KM': 'Komoren',
			'KN': 'St. Kitts und Nevis',
			'KP': 'Korea, Demokratische Volksrepublik (Nordkorea)',
			'KR': 'Korea, Republik (Südkorea)',
			'KW': 'Kuwait',
			'KY': 'Kaimaninseln',
			'KZ': 'Kasachstan',
			'LA': 'Laos, Demokratische Volksrepublik',
			'LB': 'Libanon',
			'LC': 'St. Lucia',
			'LI': 'Liechtenstein',
			'LK': 'Sri Lanka',
			'LR': 'Liberia',
			'LS': 'Lesotho',
			'LT': 'Litauen',
			'LU': 'Luxemburg',
			'LV': 'Lettland',
			'LY': 'Libyen',
			'MA': 'Marokko',
			'MC': 'Monaco',
			'MD': 'Moldawien (Republik Moldau)',
			'ME': 'Montenegro',
			'MF': 'Saint-Martin (franz. Teil)',
			'MG': 'Madagaskar',
			'MH': 'Marshallinseln',
			'MK': 'Mazedonien',
			'ML': 'Mali',
			'MM': 'Myanmar (Burma)',
			'MN': 'Mongolei',
			'MO': 'Macau',
			'MP': 'Nördliche Marianen',
			'MQ': 'Martinique',
			'MR': 'Mauretanien',
			'MS': 'Montserrat',
			'MT': 'Malta',
			'MU': 'Mauritius',
			'MV': 'Malediven',
			'MW': 'Malawi',
			'MX': 'Mexiko',
			'MY': 'Malaysia',
			'MZ': 'Mosambik',
			'NA': 'Namibia',
			'NC': 'Neukaledonien',
			'NE': 'Niger',
			'NF': 'Norfolkinsel',
			'NG': 'Nigeria',
			'NI': 'Nicaragua',
			'NL': 'Niederlande',
			'NO': 'Norwegen',
			'NP': 'Nepal',
			'NR': 'Nauru',
			'NU': 'Niue',
			'NZ': 'Neuseeland',
			'OM': 'Oman',
			'PA': 'Panama',
			'PE': 'Peru',
			'PF': 'Französisch-Polynesien',
			'PG': 'Papua-Neuguinea',
			'PH': 'Philippinen',
			'PK': 'Pakistan',
			'PL': 'Polen',
			'PM': 'Saint-Pierre und Miquelon',
			'PN': 'Pitcairninseln',
			'PR': 'Puerto Rico',
			'PS': 'Staat Palästina',
			'PT': 'Portugal',
			'PW': 'Palau',
			'PY': 'Paraguay',
			'QA': 'Katar',
			'RE': 'Réunion',
			'RO': 'Rumänien',
			'RS': 'Serbien',
			'RU': 'Russische Föderation',
			'RW': 'Ruanda',
			'SA': 'Saudi-Arabien',
			'SB': 'Salomonen',
			'SC': 'Seychellen',
			'SD': 'Sudan',
			'SE': 'Schweden',
			'SG': 'Singapur',
			'SH': 'St. Helena',
			'SI': 'Slowenien',
			'SJ': 'Svalbard und Jan Mayen',
			'SK': 'Slowakei',
			'SL': 'Sierra Leone',
			'SM': 'San Marino',
			'SN': 'Senegal',
			'SO': 'Somalia',
			'SR': 'Suriname',
			'SS': 'Südsudan',
			'ST': 'São Tomé und Príncipe',
			'SV': 'El Salvador',
			'SX': 'Sint Maarten (niederl. Teil)',
			'SY': 'Syrien, Arabische Republik',
			'SZ': 'Swasiland',
			'TC': 'Turks- und Caicosinseln',
			'TD': 'Tschad',
			'TF': 'Französische Süd- und Antarktisgebiete',
			'TG': 'Togo',
			'TH': 'Thailand',
			'TJ': 'Tadschikistan',
			'TK': 'Tokelau',
			'TL': 'Osttimor (Timor-Leste)',
			'TM': 'Turkmenistan',
			'TN': 'Tunesien',
			'TO': 'Tonga',
			'TR': 'Türkei',
			'TT': 'Trinidad und Tobago',
			'TV': 'Tuvalu',
			'TW': 'Republik China (Taiwan)',
			'TZ': 'Tansania, Vereinigte Republik',
			'UA': 'Ukraine',
			'UG': 'Uganda',
			'UM': 'United States Minor Outlying Islands',
			'US': 'Vereinigte Staaten von Amerika',
			'UY': 'Uruguay',
			'UZ': 'Usbekistan',
			'VA': 'Vatikanstadt',
			'VC': 'St. Vincent und die Grenadinen',
			'VE': 'Venezuela',
			'VG': 'Britische Jungferninseln',
			'VI': 'Amerikanische Jungferninseln',
			'VN': 'Vietnam',
			'VU': 'Vanuatu',
			'WF': 'Wallis und Futuna',
			'WS': 'Samoa',
			'YE': 'Jemen',
			'YT': 'Mayotte',
			'ZA': 'Südafrika',
			'ZM': 'Sambia',
			'ZW': 'Simbabwe'
		}
	})

	/**
	 * @class CountryUtils
	 * @propertyOf keta.utils.Country
	 * @description Country Utils Factory
	 */
	.factory('CountryUtils', function CountryUtils(CountryUtilsMessageKeys) {

		var factory = {};

		/**
		 * @name getCountryList
		 * @function
		 * @memberOf CountryUtils
		 * @description
		 * <p>
		 *     Returns the country list for a given locale in the form of
		 *     {key: 'DE', 'value': 'Germany'}.
		 * </p>
		 * <p>
		 *     Locales only match from specific > general > fallback
		 *     e.g. 'de-AT' > 'de' > 'en'.
		 * </p>
		 * <p>
		 *     Accessor provides the possibility to reformat the return value on per usage basis.
		 *     The accessor is optional.
		 * </p>
		 * @param {string} currentLocale can be either in short ('en') or long ('en-US') format.
		 * @param {function} accessor a function to format the output
		 * @returns {Array} all countries
		 * @example
		 * angular.module('exampleApp', ['keta.utils.Country'])
		 *     .controller('ExampleController', function($scope, CountryUtils) {
		 *
		 *         $scope.currentLocale = 'en';
		 *
		 *         // countries as array of objects {key: ..., value: ...}
		 *         $scope.countries = CountryUtils.getCountryList($scope.currentLocale);
		 *
		 *     });
		 * @example
		 * angular.module('exampleApp', ['keta.utils.Country'])
		 *     .controller('ExampleController', function($scope, CountryUtils) {
		 *
		 *         $scope.currentLocale = 'en';
		 *
		 *         // countries as array of objects {value: ..., name: ...}
		 *         $scope.countries =
		 *             CountryUtils.getCountryList($scope.currentLocale, function(countryName, countryCode) {
		 *                 return {value: countryCode, name: countryName};
		 *             });
		 *
		 *     });
		 */
		factory.getCountryList = function getCountryList(currentLocale, accessor) {
			var countries = [];

			var LOCALE_LENGTH = 2;

			var shortLocale =
				angular.isString(currentLocale) &&
				currentLocale.length >= LOCALE_LENGTH ?
					currentLocale.substr(0, LOCALE_LENGTH) : '';

			if (!angular.isObject(CountryUtilsMessageKeys[currentLocale])) {
				currentLocale = angular.isObject(CountryUtilsMessageKeys[shortLocale]) ? shortLocale : 'en';
			}

			angular.forEach(CountryUtilsMessageKeys[currentLocale], function(countryName, countryIsoCode) {
				countries.push(
					angular.isFunction(accessor) ?
						accessor(countryName, countryIsoCode) : {key: countryIsoCode, value: countryName});
			});

			return countries;
		};

		return factory;
	});
