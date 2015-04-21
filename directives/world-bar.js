'use strict';

/**
 * @name keta.directives.WorldBar
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.directives.WorldBar
 * @description
 * <p>
 *   Horizontal navigation bar called Worldbar with multiple menus (Context Switcher, User Menu, Energy Manager Menu,
 *   Language Menu and Notification Center toggle button).
 * </p>
 * @example
 * &lt;div data-world-bar
 *     data-event-bus-id="eventBusId"
 *     data-locales="locales"
 *     data-current-locale="currentLocale"
 *     data-labels="labels"
 *     data-links="links"
 *     data-worlds="worlds"&gt;&lt;/div&gt;
 * @example
 * angular.module('exampleApp', ['keta.directives.WorldBar'])
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
 *     });
 */

angular.module('keta.directives.WorldBar',
	[
		'keta.shared',
		'keta.services.EventBusDispatcher',
		'keta.services.EventBusManager',
		'keta.services.ApplicationSet',
		'keta.services.DeviceSet',
		'keta.services.UserSet'
	])

	.directive('worldBar', function WorldBarDirective(
		$rootScope, $document,
		EventBusDispatcher, EventBusManager,
		Application, ApplicationSet, Device, DeviceSet, User, UserSet,
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
				worlds: '=?'

			},
			templateUrl: '/components/directives/world-bar.html',
			link: function(scope, element) {

				// CONFIG ---

				// set defaults
				scope.eventBusId = scope.eventBusId || 'kiwibus';

				scope.eventBus = EventBusManager.get(scope.eventBusId);

				scope.locales = scope.locales || [{
					name: 'English',
					nameShort: 'EN',
					code: 'en'
				}];

				scope.currentLocale = scope.currentLocale || 'en';

				var defaultLabels = {
					ALL_APPS: 'All Apps',
					ENERGY_MANAGER: 'Energy-Manager',
					ALL_ENERGY_MANAGERS: 'All Energy-Managers',
					USER_PROFILE: 'User Profile',
					USER_LOGOUT: 'Logout'
				};
				scope.labels = angular.isDefined(scope.labels) ?
					angular.extend(defaultLabels, scope.labels) : defaultLabels;

				var defaultLinks = {
					ALL_APPS: null,
					ALL_ENERGY_MANAGERS: null,
					USER_PROFILE: null,
					USER_LOGOUT: null
				};
				scope.links = angular.isDefined(scope.links) ?
					angular.extend(defaultLinks, scope.links) : defaultLinks;

				scope.worlds = scope.worlds || [];

				// type constants used in ng-repeats orderBy filter
				scope.TYPES = {
					APPS: 'APPS',
					ENERGY_MANAGER: 'ENERGY_MANAGER'
				};

				// limit constants used in ng-repeats limit filter
				scope.LIMITS = {
					APPS: 3,
					ENERGY_MANAGER: 3
				};

				// order predicates and reverse flags
				var PREDICATES = {
					APPS: {
						field: 'name',
						reverse: false
					},
					ENERGY_MANAGER: {
						field: 'name',
						reverse: false
					}
				};

				// internal menu state management
				scope.menus = {
					contextSwitcher: {activeEntry: null, isOpen: false},
					userMenu: {activeEntry: null, isOpen: false},
					energyManagerMenu: {activeEntry: null, isOpen: false},
					settingsMenu: {activeEntry: null, isOpen: false},
					languageMenu: {activeEntry: null, isOpen: false}
				};

				// DATA ---

				// list of apps to display in context switcher
				// format: {name: 'My Monitor',	link: 'https://mymonitor.mycompany.com'}
				scope.apps = [];

				// query applications
				if (scope.eventBus !== null) {

					ApplicationSet.create(scope.eventBus)
						.query()
						.then(function(reply) {
							if (angular.isDefined(reply.result) &&
								angular.isDefined(reply.result.items)) {

								angular.forEach(reply.result.items, function(app) {

									// inject name
									app.name = angular.isDefined(app.names[scope.currentLocale]) ?
										app.names[scope.currentLocale] : null;

									// reset entryUri to null if empty
									if (angular.isDefined(app.entryUri) && app.entryUri === '') {
										app.entryUri = null;
									}

									scope.apps.push(app);

								});

							}
						});

				}

				// current user
				scope.user = {};

				// query current user
				if (scope.eventBus !== null) {

					User.getCurrent(scope.eventBus)
						.then(function(reply) {
							scope.user = reply;
						});

				}

				// list of energy managers in manager list
				// format: {name: 'ERC02-000001051', link: 'http://192.168.125.81'}
				scope.energyManagers = [];

				// query energy managers
				if (scope.eventBus !== null) {

					DeviceSet.create(scope.eventBus)
						.filter({
							'deviceModel.deviceClass': {
								'$in': [ketaSharedConfig.DEVICE_CLASSES.ENERGY_MANAGER]
							}
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

				// statically set first world and first language as active
				var initActiveEntries = function() {

					// worlds
					if (angular.isDefined(scope.worlds[0])) {
						scope.menus.contextSwitcher.activeEntry = scope.worlds[0];
					}

					// current locale
					angular.forEach(scope.locales, function(locale) {
						if (angular.isDefined(locale.code) && locale.code === scope.currentLocale) {
							scope.menus.languageMenu.activeEntry = locale;
						}
					});

				};

				initActiveEntries();

				// toggle sidebar if button is clicked
				scope.toggleSidebar = function($event, position) {
					$event.stopPropagation();
					if (position === ketaSharedConfig.SIDEBAR.POSITION_LEFT) {
						$rootScope.$broadcast(ketaSharedConfig.EVENTS.TOGGLE_SIDEBAR_LEFT);
					} else if (position === ketaSharedConfig.SIDEBAR.POSITION_RIGHT) {
						$rootScope.$broadcast(ketaSharedConfig.EVENTS.TOGGLE_SIDEBAR_RIGHT);
					}
				};

				// check if a given menu is currently open
				scope.isOpen = function(menuName) {
					return angular.isDefined(scope.menus[menuName]) ? scope.menus[menuName].isOpen : null;
				};

				// check if a given entry is active to set corresponding css class
				scope.isActive = function(menuName, entry) {
					return angular.isDefined(scope.menus[menuName]) && scope.menus[menuName].activeEntry === entry;
				};

				scope.setLocale = function(locale) {
					scope.currentLocale = locale.code;
					scope.menus.languageMenu.activeEntry = locale;
					scope.closeAllMenus();
				};

				// close all menus by switching boolean flag isOpen
				scope.closeAllMenus = function closeAllMenus() {
					scope.menus.contextSwitcher.isOpen = false;
					scope.menus.userMenu.isOpen = false;
					scope.menus.energyManagerMenu.isOpen = false;
					scope.menus.settingsMenu.isOpen = false;
					scope.menus.languageMenu.isOpen = false;
				};

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

				// close menus when location change starts
				scope.$on('$locationChangeStart', function() {
					scope.closeAllMenus();
				});

				// close menus when user clicks anywhere outside
				$document.bind('click', function(event) {
					var worldBarHtml = element.html(),
						targetElementHtml = angular.element(event.target).html();
					if (worldBarHtml.indexOf(targetElementHtml) !== -1) {
						return;
					}
					scope.closeAllMenus();
					scope.$digest();
				});

			}
		};

	});

// prepopulate template cache
angular.module('keta.directives.WorldBar')
	.run(function($templateCache) {
		$templateCache.put('/components/directives/world-bar.html', '<div class="container-fluid keta-world-bar">' +
'	<ul class="nav navbar-nav">' +
'		<li class="menu-navbar">' +
'			<a href="" data-ng-click="toggleSidebar($event, \'left\')">' +
'				<span class="glyphicon glyphicon-align-justify"></span>' +
'			</a>' +
'		</li>' +
'		<li class="dropdown context-switcher" data-ng-class="{ open: isOpen(\'contextSwitcher\') }">' +
'			<a href="" data-ng-click="toggleOpenState(\'contextSwitcher\')">' +
'				{{ menus.contextSwitcher.activeEntry.name }}' +
'				<span class="caret"></span>' +
'			</a>' +
'			<ul class="dropdown-menu">' +
'				<li data-ng-repeat="entry in worlds"' +
'					data-ng-class="{ active: isActive(\'contextSwitcher\', entry) }">' +
'					<a data-ng-href="{{ entry.link }}" data-ng-click="closeAllMenus()">{{ entry.name }}</a>' +
'				</li>' +
'				<li class="divider"	data-ng-if="apps.length > 0"></li>' +
'				<li data-ng-if="apps.length"' +
'					data-ng-repeat="' +
'						entry in apps |' +
'						filter:{entryUri: \'!null\'} |' +
'						orderBy:order(TYPES.APPS):reverse(TYPES.APPS) |' +
'						limitTo:LIMITS.APPS"' +
'					data-ng-class="{ active: isActive(\'contextSwitcher\', entry) }">' +
'					<a data-ng-href="{{ entry.entryUri }}" data-ng-click="closeAllMenus()">' +
'						{{ entry.names[currentLocale] }}' +
'					</a>' +
'				</li>' +
'				<li data-ng-if="apps.length > LIMITS.APPS && links.ALL_APPS !== null && labels.ALL_APPS !== null">' +
'					<a data-ng-href="{{ links.ALL_APPS }}" data-ng-click="closeAllMenus()">' +
'						{{ labels.ALL_APPS }} ({{apps.length}})' +
'					</a>' +
'				</li>' +
'			</ul>' +
'		</li>' +
'	</ul>' +
'	<ul class="nav navbar-nav navbar-right">' +
'		<!-- large version (> 767px) -->' +
'		<li class="dropdown hidden-xs user-menu" data-ng-class="{ open: isOpen(\'userMenu\') }">' +
'			<a href="" data-ng-click="toggleOpenState(\'userMenu\')">' +
'				<span class="glyphicon glyphicon-user"></span>' +
'				<span class="hidden-xs hidden-sm hidden-md">' +
'					{{ user.givenName }} {{ user.familyName }}' +
'				</span>' +
'				<span class="caret"></span>' +
'			</a>' +
'			<ul class="dropdown-menu dropdown-menu-right">' +
'				<li data-ng-if="links.USER_PROFILE !== null && labels.USER_PROFILE !== null">' +
'					<a data-ng-href="{{ links.USER_PROFILE }}" data-ng-click="closeAllMenus()">' +
'						{{ labels.USER_PROFILE }}' +
'					</a>' +
'				</li>' +
'				<li data-ng-if="links.USER_LOGOUT !== null && labels.USER_LOGOUT !== null">' +
'					<a data-ng-href="{{ links.USER_LOGOUT }}" data-ng-click="closeAllMenus()">' +
'						{{ labels.USER_LOGOUT }}' +
'					</a>' +
'				</li>' +
'			</ul>' +
'		</li>' +
'		<li class="dropdown hidden-xs energy-manager-menu" data-ng-class="{ open: isOpen(\'energyManagerMenu\') }"' +
'			data-ng-if="energyManagers.length">' +
'			<a href="" data-ng-click="toggleOpenState(\'energyManagerMenu\')">' +
'				<span class="glyphicon glyphicon-tasks"></span>' +
'				<span class="hidden-xs hidden-sm hidden-md">{{ labels.ENERGY_MANAGER }}</span>' +
'				<span>({{energyManagers.length}})</span>' +
'				<span class="caret"></span>' +
'			</a>' +
'			<ul class="dropdown-menu dropdown-menu-right">' +
'				<li data-ng-repeat="' +
'					entry in energyManagers |' +
'					orderBy:order(TYPES.ENERGY_MANAGER):reverse(TYPES.ENERGY_MANAGER) |' +
'					limitTo:LIMITS.ENERGY_MANAGER">' +
'					<a data-ng-href="{{ entry.link }}" data-ng-click="closeAllMenus()">' +
'						{{ entry.name }}' +
'					</a>' +
'				</li>' +
'				<li data-ng-if="energyManagers.length > LIMITS.ENERGY_MANAGER &&' +
'					links.ALL_ENERGY_MANAGERS !== null &&' +
'					labels.ALL_ENERGY_MANAGERS !== null">' +
'					<a data-ng-href="{{ links.ALL_ENERGY_MANAGERS }}" data-ng-click="closeAllMenus()">' +
'						{{ labels.ALL_ENERGY_MANAGERS }} ({{energyManagers.length}})' +
'					</a>' +
'				</li>' +
'			</ul>' +
'		</li>' +
'		<li class="dropdown hidden-xs language-menu"' +
'			data-ng-class="{open: isOpen(\'languageMenu\')}"' +
'			data-ng-if="locales.length">' +
'			<a href="" data-ng-click="toggleOpenState(\'languageMenu\')">' +
'				<span class="glyphicon glyphicon-flag" title="{{ menus.languageMenu.activeEntry.name }}"></span>' +
'				<span class="hidden-sm hidden-md hidden-xs">{{ menus.languageMenu.activeEntry.nameShort }}</span>' +
'				<span class="caret"></span>' +
'			</a>' +
'			<ul class="dropdown-menu dropdown-menu-right">' +
'				<li data-ng-repeat="entry in locales"' +
'					data-ng-class="{ active: isActive(\'languageMenu\', entry) }">' +
'					<a href="" data-ng-click="setLocale(entry)">{{ entry.name }}</a>' +
'				</li>' +
'			</ul>' +
'		</li>' +
'		<!-- collapsed version (< 768px) -->' +
'		<li class="dropdown visible-xs settings-menu" data-ng-class="{ open: isOpen(\'settingsMenu\') }">' +
'			<a href="" data-ng-click="toggleOpenState(\'settingsMenu\')">' +
'				<span class="glyphicon glyphicon-th-large"></span>' +
'				<span class="caret"></span>' +
'			</a>' +
'			<ul class="dropdown-menu dropdown-menu-right">' +
'				<li>' +
'					<a data-ng-href="{{ links.USER_PROFILE }}" data-ng-click="closeAllMenus()">' +
'						{{ labels.USER_PROFILE }}' +
'					</a>' +
'				</li>' +
'				<li>' +
'					<a data-ng-href="{{ links.USER_LOGOUT }}" data-ng-click="closeAllMenus()">' +
'						{{ labels.USER_LOGOUT }}' +
'					</a>' +
'				</li>' +
'				<li class="divider" data-ng-if="energyManagers.length"></li>' +
'				<li data-ng-repeat="' +
'					entry in energyManagers |' +
'					orderBy:order(TYPES.ENERGY_MANAGER):reverse(TYPES.ENERGY_MANAGER) |' +
'					limitTo:LIMITS.ENERGY_MANAGER">' +
'					<a data-ng-href="{{ entry.link }}" data-ng-click="closeAllMenus()">' +
'						{{ entry.name }}' +
'					</a>' +
'				</li>' +
'				<li data-ng-if="energyManagers.length > LIMITS.ENERGY_MANAGER">' +
'					<a data-ng-href="{{ links.ALL_ENERGY_MANAGERS }}" data-ng-click="closeAllMenus()">' +
'						{{ labels.ALL_ENERGY_MANAGERS }} ({{energyManagers.length}})' +
'					</a>' +
'				</li>' +
'				<li class="divider" data-ng-if="locales"></li>' +
'				<li data-ng-repeat="entry in locales"' +
'					data-ng-class="{ active: isActive(\'languageMenu\', entry) }">' +
'					<a href="" data-ng-click="setLocale(entry)">{{ entry.name }}</a>' +
'				</li>' +
'			</ul>' +
'		</li>' +
'		<li>' +
'			<a href="" data-ng-click="toggleSidebar($event, \'right\')" class="toggleRightSidebarButton">' +
'				<span class="glyphicon glyphicon-bell" title="Notifications"></span>' +
'				<span class="hidden-sm hidden-md hidden-xs"></span>' +
'			</a>' +
'		</li>' +
'	</ul>' +
'</div>' +
'');
	});
