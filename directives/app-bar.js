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
 *     data-display-modes="displayModes"&gt;&lt;/div&gt;
 * @example
 * angular.module('exampleApp', ['keta.directives.AppBar'])
 *     .controller('ExampleController', function($scope) {
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
 *         // object of labels to use in template
 *         $scope.labels = {
 *             APP_TITLE: 'Application',
 *             ALL_APPS: 'All Apps',
 *             ENERGY_MANAGER: 'Energy-Manager',
 *             ALL_ENERGY_MANAGERS: 'All Energy-Managers',
 *             USER_PROFILE: 'User Profile',
 *             USER_LOGOUT: 'Logout'
 *         };
 *
 *         // object of link to use in template
 *         $scope.links = {
 *             ALL_APPS: '/#/applications/',
 *             ALL_ENERGY_MANAGERS: '/#/devices?deviceClass=com.kiwigrid.devices.EnergyManager',
 *             APP_ROOT: '/#/landing-page',
 *             USER_PROFILE: '/#/users/profile',
 *             USER_LOGOUT: '/#/users/logout'
 *         };
 *
 *         // array of worlds to display in world switcher
 *         $scope.worlds = [{
 *             name: 'Desktop',
 *             link: 'https://cloud.mycompany.com'
 *         }, {
 *             name: 'Market',
 *             link: 'https://market.mycompany.com'
 *         }, {
 *             name: 'Service',
 *             link: 'https://service.mycompany.com'
 *         }];
 *
 *         // object to configure display modes at size xxs, xs, sm, md, and lg
 *         $scope.displayModes: {
 *             worldSwitcher: {
 *                 xxs: 'hidden',
 *                 xs: 'hidden',
 *                 sm: 'hidden',
 *                 md: 'hidden',
 *                 lg: 'hidden'
 *             },
 *             notificationBarToggle: {
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
 *             }
 *         };
 *     });
 */

angular.module('keta.directives.AppBar',
	[
		'keta.shared',
		'keta.services.EventBusManager',
		'keta.services.DeviceSet',
		'keta.services.User'
	])

	.directive('appBar', function AppBarDirective(
		$rootScope, $window, $document, $timeout,
		EventBusManager, DeviceSet, User,
		ketaSharedConfig) {
		return {
			restrict: 'EA',
			replace: true,
			scope: {

				// id of eventBus instance to use to retrieve data
				eventBusId: '=?',

				// array of locales to use for language menu
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
				displayModes: '=?'

			},
			transclude: true,
			templateUrl: '/components/directives/app-bar.html',
			link: function(scope, element) {

				// get menu data
				scope.user = {};
				scope.menus = {};
				scope.worlds = scope.worlds || [];
				scope.locales = scope.locales || [];
				scope.energyManagers = [];

				// event bus
				scope.eventBusId = scope.eventBusId || 'kiwibus';
				var eventBus = EventBusManager.get(scope.eventBusId);

				var STATES = ketaSharedConfig.APP_BAR.STATES;
				var SIZES = ketaSharedConfig.APP_BAR.SIZES;

				var DEFAULT_CONTAINER_HEIGHT = 120;

				scope.MENU_ELEMENTS = ketaSharedConfig.APP_BAR.ELEMENTS;

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

				var isMenuVisible = function(menuElement) {
					var isVisible = false;
					angular.forEach(SIZES, function(size) {
						if (defaultDisplayModes[menuElement][size] !== STATES.HIDDEN) {
							isVisible = true;
						}
					});
					return isVisible;
				};

				var mergeObjects = function(customObject, defaultObject) {
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

				// triggers after rendering
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

				var defaultLabels = {
					ALL_APPS: 'All Apps',
					ALL_ENERGY_MANAGERS: 'All Energy-Managers',
					APP_TITLE: 'Application',
					ENERGY_MANAGER: 'Energy-Manager',
					NOTIFICATIONS: 'Notifications',
					USER_PROFILE: 'User Profile',
					USER_LOGOUT: 'Logout'
				};

				scope.labels = angular.isDefined(scope.labels) ?
					mergeObjects(scope.labels, defaultLabels) : defaultLabels;

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


				// get display mode classes
				scope.getClasses = function(menuName, elementType) {
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

				var getDevices = function() {

					// query energy managers
					// format: {name: 'ERC02-000001051', link: 'http://192.168.125.81'}
					if (eventBus !== null &&
						angular.isDefined(scope.user.userId) &&
						isMenuVisible(scope.MENU_ELEMENTS.ENERGY_MANAGER_MENU)) {

						DeviceSet.create(eventBus)
							.filter({
								'deviceModel.deviceClass': {
									'$in': [ketaSharedConfig.DEVICE_CLASSES.ENERGY_MANAGER]
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

				var getActiveLangEntry = function getActiveLangEntry() {
					var activeLangEntry = scope.locales[0] || {};
					angular.forEach(scope.locales, function(value) {
						if (value.code === scope.currentLocale) {
							activeLangEntry = value;
						}
					});
					return activeLangEntry;
				};

				var updateMenus = function() {
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

				// order elements by predicate
				scope.order = function(type) {
					var field = angular.isDefined(PREDICATES[type]) ? PREDICATES[type].field : 'name';
					return function(item) {
						return angular.isDefined(item[field]) ? item[field] : '';
					};
				};

				// order elements by sort order
				scope.reverse = function(type) {
					return angular.isDefined(PREDICATES[type]) && angular.isDefined(PREDICATES[type].reverse) ?
						PREDICATES[type].reverse : false;
				};

				scope.scrollOverNavbarFirst = false;
				angular.element($window).bind('scroll', function() {

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

				// toggle state of menu
				scope.toggleOpenState = function(menuName) {
					if (angular.isDefined(scope.menus[menuName])) {
						var currentState = angular.copy(scope.menus[menuName].isOpen);
						scope.closeAllMenus();
						if (currentState === scope.menus[menuName].isOpen) {
							scope.menus[menuName].isOpen = !scope.menus[menuName].isOpen;
						}
					}
				};

				// close all menus by switching boolean flag isOpen
				scope.closeAllMenus = function() {
					scope.menus[scope.MENU_ELEMENTS.WORLD_SWITCHER].isOpen = false;
					scope.menus[scope.MENU_ELEMENTS.USER_MENU].isOpen = false;
					scope.menus[scope.MENU_ELEMENTS.ENERGY_MANAGER_MENU].isOpen = false;
					scope.menus[scope.MENU_ELEMENTS.COMPACT_MENU].isOpen = false;
					scope.menus[scope.MENU_ELEMENTS.LANGUAGE_MENU].isOpen = false;
				};

				scope.setLocale = function(locale) {
					scope.currentLocale = locale.code;
					scope.menus[scope.MENU_ELEMENTS.LANGUAGE_MENU].activeEntry = locale;
					scope.closeAllMenus();
				};

				// close menus when location change starts
				scope.$on('$locationChangeStart', function() {
					scope.closeAllMenus();
				});

				// check if a given entry is active to set corresponding css class
				scope.isActive = function(menuName, entry) {
					return angular.isDefined(scope.menus[menuName]) && scope.menus[menuName].activeEntry === entry;
				};

				// toggle sidebar if button is clicked
				scope.toggleSidebar = function($event, position) {
					$event.stopPropagation();
					scope.closeAllMenus();
					if (position === ketaSharedConfig.SIDEBAR.POSITION_LEFT) {
						$rootScope.$broadcast(ketaSharedConfig.EVENTS.TOGGLE_SIDEBAR_LEFT);
					} else if (position === ketaSharedConfig.SIDEBAR.POSITION_RIGHT) {
						$rootScope.$broadcast(ketaSharedConfig.EVENTS.TOGGLE_SIDEBAR_RIGHT);
					}
				};

				// close menus when user clicks anywhere outside
				$document.bind('click', function(event) {
					var appBarHtml = element.html(),
						targetElementHtml = angular.element(event.target).html();
					if (appBarHtml.indexOf(targetElementHtml) !== -1) {
						return;
					}
					scope.closeAllMenus();
					scope.$digest();
				});

				// watch kiwibus data
				scope.$watch('energyManagers', function(newValue, oldValue) {
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
'			     data-ng-show="worlds.length > 0"' +
'			     data-ng-class="getClasses(MENU_ELEMENTS.WORLD_SWITCHER)">' +
'				<a href="" class="dropdown-toggle" data-ng-click="toggleOpenState(MENU_ELEMENTS.WORLD_SWITCHER)">' +
'					<span class="glyphicon glyphicon-th"></span>' +
'				</a>' +
'				<ul class="dropdown-menu">' +
'					<li data-ng-repeat="world in worlds">' +
'						<a href="{{ world.link }}">{{ world.name }}</a>' +
'					</li>' +
'				</ul>' +
'			</div>' +
'		</div>' +
'	</nav>' +
'' +
'	<nav class="navbar navbar-default navbar-level-2" data-ng-class="{\'navbar-fixed-top\': scrollOverNavbarFirst}" role="navigation">' +
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
'					   data-ng-href="{{ links.APP_ROOT }}">{{ labels.APP_TITLE }}</a>' +
'					<span data-ng-if="links.APP_ROOT === null" class="application-title">{{ labels.APP_TITLE }}</span>' +
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
'								{{ labels.USER_PROFILE }}' +
'							</a>' +
'						</li>' +
'						<li>' +
'							<a data-ng-href="{{ links.USER_LOGOUT }}" data-ng-click="closeAllMenus()">' +
'								{{ labels.USER_LOGOUT }}' +
'							</a>' +
'						</li>' +
'					</ul>' +
'				</li>' +
'' +
'				<li class="dropdown"' +
'				    data-ng-show="energyManagers.length > 0"' +
'				    data-ng-class="getClasses(MENU_ELEMENTS.ENERGY_MANAGER_MENU)">' +
'					<a href="" class="dropdown-toggle" data-ng-click="toggleOpenState(MENU_ELEMENTS.ENERGY_MANAGER_MENU)">' +
'						<span class="glyphicon glyphicon-tasks" title="Energy-Manager"></span>' +
'						<span class="navbar-label" data-ng-class="getClasses(MENU_ELEMENTS.ENERGY_MANAGER_MENU, \'label\')">{{ labels.ENERGY_MANAGER }}</span>' +
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
'								{{ labels.ALL_ENERGY_MANAGERS }} ({{ energyManagers.length }})' +
'							</a>' +
'						</li>' +
'					</ul>' +
'				</li>' +
'' +
'				<li class="dropdown"' +
'				    data-ng-show="locales.length > 0"' +
'				    data-ng-class="getClasses(MENU_ELEMENTS.LANGUAGE_MENU)">' +
'					<a href="" class="dropdown-toggle" data-ng-click="toggleOpenState(MENU_ELEMENTS.LANGUAGE_MENU)">' +
'						<span class="glyphicon glyphicon-flag" title="{{ menus.languageMenu.activeEntry.nameShort }}"></span>' +
'						<span class="navbar-label" data-ng-class="getClasses(MENU_ELEMENTS.LANGUAGE_MENU, \'label\')">{{ menus.languageMenu.activeEntry.nameShort }}</span>' +
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
'								{{ labels.USER_PROFILE }}' +
'							</a>' +
'						</li>' +
'						<li>' +
'							<a data-ng-href="{{ links.USER_LOGOUT }}" data-ng-click="closeAllMenus()">' +
'								{{ labels.USER_LOGOUT }}' +
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
'								{{ labels.ALL_ENERGY_MANAGERS }} ({{ energyManagers.length }})' +
'							</a>' +
'						</li>' +
'						<li class="divider" data-ng-if="locales"></li>' +
'						<li data-ng-repeat="entry in locales"' +
'						    data-ng-class="{ active: isActive(MENU_ELEMENTS.LANGUAGE_MENU, entry) }">' +
'							<a href="" data-ng-click="setLocale(entry)">{{ entry.name }}</a>' +
'						</li>' +
'					</ul>' +
'				</li>' +
'' +
'				<li data-ng-class="getClasses(MENU_ELEMENTS.NOTIFICATION_BAR_TOGGLE)">' +
'					<a href="" id="toggleSidebarButton" data-ng-click="toggleSidebar($event, \'right\')">' +
'						<span class="glyphicon glyphicon-bell" title="{{ labels.NOTIFICATIONS }}"></span>' +
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
