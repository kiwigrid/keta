'use strict';

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
		ROOT_APP_ID: 'kiwigrid.desktop'
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

				// default container height
				var scrollContainerHeight = DEFAULT_CONTAINER_HEIGHT;
				var container = element;

				var navbarFirst = container.children()[0];
				var navbarFirstHeight = 0;

				var navbarSecond = container.children()[1];
				var navbarSecondHeight = 0;
				var navbarSecondMarginBottom = 0;

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


				/**
				 * Set Container height for scrolling affix
				 * @returns {void}
				 */
				var setContainerHeight = function setContainerHeight() {
					navbarFirstHeight = navbarFirst.offsetHeight;
					navbarSecondHeight = navbarSecond.offsetHeight;
					navbarSecondMarginBottom = parseInt(
						$window.getComputedStyle(navbarSecond, null).getPropertyValue('margin-bottom'),
						DECIMAL_RADIX
					);
					// container height for fixed navigation
					scrollContainerHeight = navbarFirstHeight + navbarSecondHeight + navbarSecondMarginBottom;
				};

				scope.displayModes = mergeObjects(scope.displayModes, defaultDisplayModes);

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
											app.appId === AppBarConstants.ROOT_APP_ID &&
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
										scope.links.ALL_APPS : link.origin + link.search + '#/applications';

									scope.links.USER_PROFILE = angular.isString(scope.links.USER_PROFILE) ?
										scope.links.USER_PROFILE : link.origin + link.search + '#/user';

									if (!angular.isString(scope.links.ALL_ENERGY_MANAGERS)) {
										scope.links.ALL_ENERGY_MANAGERS = link.origin + link.search
											+ '#/devices?deviceClass=com.kiwigrid.devices.em.EnergyManager';
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

				scope.$watch('navbarFirst.offsetHeight', function(newValue, oldValue) {
					if (newValue !== oldValue) {
						setContainerHeight();
					}
				});

				scope.$watch('navbarSecond.offsetHeight', function(newValue, oldValue) {
					if (newValue !== oldValue) {
						setContainerHeight();
					}
				});


				// INIT
				// ----

				setContainerHeight();
				updateMenus();

			}
		};

	});

// prepopulate template cache
angular.module('keta.directives.AppBar')
	.run(function($templateCache) {
		$templateCache.put('/components/directives/app-bar.html', '<div class="navigation-container">' +
'	<nav class="navbar navbar-level-1 brand-bar" role="navigation">' +
'		<div class="container-fluid">' +
'			<div data-ng-transclude></div>' +
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
'						<li data-ng-if="links.USER_PROFILE">' +
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
