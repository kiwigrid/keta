'use strict';

/**
 * @name keta.directives.WorldBar
 * @author Jan Uhlmann <jan.uhlmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.directives.WorldBar
 * @description
 * <p>
 *   Horizontal bar with multiple menus (world switcher, user navigation, language switcher,
 *   notification toggle-button).<br>
 *   All menus (except world switcher) can be hidden by boolean attributes.
 * </p>
 * @example
 * &lt;div data-world-bar data-configuration="worldBarConfig"
 *   data-switch-lang-callback="languageSwitched(lang)"&gt;&lt;/div&gt;
 * @example
 * angular.module('exampleApp', ['keta.directives.WorldBar'])
 *     .controller('ExampleController', function($scope) {
 * 
 *         // world bar configuration object
 *         $scope.worldBarConfig = {
 *             contextSwitcher: {
 *                 worlds: {
 *                     items: [{
 *                         name: 'Desktop',
 *                         link: 'https://cloud.mycompany.com'
 *                     }, {
 *                         name: 'Market',
 *                         link: 'https://market.mycompany.com'
 *                     }, {
 *                         name: 'Service',
 *                         link: 'https://service.mycompany.com'
 *                     }]
 *                 },
 *                 apps: {
 *                     labels: {
 *                         allApps: 'Alle Apps'
 *                     },
 *                     hidden: false,
 *                     items: [{
 *                         name: 'Smart Power Control',
 *                         link: 'https://smartpowercontrol.mycompany.com'
 *                     }, {
 *                         name: 'Tag-App',
 *                         link: 'https://tagapp.mycompany.com'
 *                     }, {
 *                         name: 'My Monitor',
 *                         link: 'https://mymonitor.mycompany.com'
 *                     }, {
 *                         name: 'Anoter App',
 *                         link: 'https://anotherapp.mycompany.com'
 *                     }]
 *                 }
 *             },
 *             userMenu: {
 *                 labels: {
 *                     userProfile: 'Benutzerkonto',
 *                     logout: 'Logout'
 *                 },
 *                 profile: {
 *                     login: 'max.mustermann',
 *                     firstName: 'Max',
 *                     lastName: 'Mustermann'
 *                 },
 *                 additionalItems: [{
 *                     name: 'Share on Facebook',
 *                     link: 'https://www.facebook.com'
 *                 }]
 *             },
 *             energyManagerMenu: {
 *                 labels: {
 *                     allEnergyManagers: 'Alle Energy-Manager'
 *                 },
 *                 items: [{
 *                     name: 'ERC02-000001051',
 *                     link: 'http://192.168.125.81'
 *                 }]
 *             },
 *             languageMenu: {
 *                 items: [{
 *                     name: 'Deutsch',
 *                     nameShort: 'DE',
 *                     code: 'de'
 *                 }, {
 *                     name: 'English',
 *                     nameShort: 'EN',
 *                     code: 'en-UK'
 *                 }]
 *             }
 *         };
 *
 *         $rootScope.languageSwitched = function(lang) {
 *             // execute switch to given language (app-specific task)
 *             $rootScope.currentLang = lang;
 *         };
 *     });
 */
angular.module('keta.directives.WorldBar',
	[
		'keta.shared'
	])
	
	.directive('worldBar', function WorldBarDirective(ketaSharedConfig, $rootScope, $document, ketaSharedFactory) {
		return {
			restrict: 'EA',
			replace: true,
			scope: {
				configuration: '=?',
				switchLangCallback: '&'
			},
			templateUrl: '/components/directives/world-bar.html',
			link: function(scope, element) {

				scope.switchLanguage = function(entry) {
					scope.switchLangCallback({lang: entry.code});
					scope.languageMenu.activeEntry = entry;
					closeAllMenus();
				};
				
				// TODO: instead of configuring full content, configure eventBusId to use to gather data
				
				scope.configuration = scope.configuration || {};
				
				scope.allAppsLabel =
					ketaSharedFactory.doesPropertyExist(scope.configuration, 'contextSwitcher.apps.labels.allApps') ?
						scope.configuration.contextSwitcher.apps.labels.allApps : 'All Apps';

				scope.allEnergyManagersLabel =
					ketaSharedFactory.doesPropertyExist(scope.configuration, 'energyManagerMenu.labels.allEnergyManagers') ?
						scope.configuration.energyManagerMenu.labels.allEnergyManagers : 'All Energy-Managers';

				scope.userProfileLabel =
					ketaSharedFactory.doesPropertyExist(scope.configuration, 'userMenu.labels.userProfile') ?
						scope.configuration.userMenu.labels.userProfile : 'User Profile';

				scope.logoutUserLabel =
					ketaSharedFactory.doesPropertyExist(scope.configuration, 'userMenu.labels.logout') ?
						scope.configuration.userMenu.labels.logout : 'Logout';
				
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

				scope.order = function(type) {
					var field = (angular.isDefined(PREDICATES[type])) ? PREDICATES[type].field : 'name';
					return function(item) {
						return (angular.isDefined(item[field])) ? item[field] : '';
					};
				};

				scope.reverse = function(type) {
					return (angular.isDefined(PREDICATES[type]) && angular.isDefined(PREDICATES[type].reverse)) ?
						PREDICATES[type].reverse : false;
				};

				var menuReferenceObject = {
					activeEntry: null,
					isOpen: false
				};

				function useFirstEntryAsActive(menuName, subKey) {
					// use first entry as active entry for demonstration
					// TODO: replace by real logic to determine active entry
					if (angular.isDefined(scope.configuration) &&
						angular.isDefined(scope.configuration[menuName])) {
						if (angular.isDefined(scope.configuration[menuName].items) &&
							angular.isDefined(scope.configuration[menuName].items[0])) {
							scope[menuName].activeEntry = scope.configuration[menuName].items[0];
						} else if (angular.isDefined(scope.configuration[menuName][subKey]) &&
							angular.isDefined(scope.configuration[menuName][subKey].items) &&
							angular.isDefined(scope.configuration[menuName][subKey].items[0])) {
							scope[menuName].activeEntry = scope.configuration[menuName][subKey].items[0];
						}
					}
				}

				function initMenus() {
					scope.contextSwitcher = angular.copy(menuReferenceObject);
					useFirstEntryAsActive(
						ketaSharedConfig.WORLD_BAR.ENTRY_CONTEXT_SWITCHER,
						ketaSharedConfig.WORLD_BAR.ENTRY_CONTEXT_SWITCHER_WORLDS
					);
					scope.userMenu = angular.copy(menuReferenceObject);
					scope.energyManagerMenu = angular.copy(menuReferenceObject);
					scope.settingsMenu = angular.copy(menuReferenceObject);
					scope.languageMenu = angular.copy(menuReferenceObject);
					useFirstEntryAsActive(ketaSharedConfig.WORLD_BAR.ENTRY_LANGUAGE_MENU);
				}

				initMenus();

				scope.toggleSidebar = function($event, position) {
					$event.stopPropagation();
					if (position === ketaSharedConfig.SIDEBAR.POSITION_LEFT) {
						$rootScope.$broadcast(ketaSharedConfig.EVENTS.TOGGLE_SIDEBAR_LEFT);
					} else if (position === ketaSharedConfig.SIDEBAR.POSITION_RIGHT) {
						$rootScope.$broadcast(ketaSharedConfig.EVENTS.TOGGLE_SIDEBAR_RIGHT);
					}
				};

				scope.additionalUserItemsConfigured = function() {
					return (angular.isDefined(scope.configuration) &&
						angular.isDefined(scope.configuration.userMenu) &&
						angular.isDefined(scope.configuration.userMenu.additionalItems) &&
						scope.configuration.userMenu.additionalItems.length > 0);
				};

				scope.isOpen = function(menuName) {
					return (angular.isDefined(scope[menuName])) ? scope[menuName].isOpen : null;
				};

				scope.isActive = function(menuName, entry) {
					return (angular.isDefined(scope[menuName]) && (scope[menuName].activeEntry === entry));
				};

				function closeAllMenus() {
					scope.contextSwitcher.isOpen = false;
					scope.userMenu.isOpen = false;
					scope.energyManagerMenu.isOpen = false;
					scope.settingsMenu.isOpen = false;
					scope.languageMenu.isOpen = false;
				}

				scope.toggleOpenState = function(menuName) {
					if (angular.isDefined(scope[menuName])) {
						var currentState = angular.copy(scope[menuName].isOpen);
						closeAllMenus();
						if (currentState === scope[menuName].isOpen) {
							scope[menuName].isOpen = !scope[menuName].isOpen;
						}
					}
				};

				scope.$on('$locationChangeStart', function() {
					closeAllMenus();
				});

				// close menus when user clicks anywhere outside
				$document.bind('click', function(event) {
					var worldBarHtml = element.html(),
						targetElementHtml = angular.element(event.target).html();
					if (worldBarHtml.indexOf(targetElementHtml) !== -1) {
						return;
					}
					closeAllMenus();
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
'				{{ contextSwitcher.activeEntry.name }}' +
'				<span class="caret"></span>' +
'			</a>' +
'			<ul class="dropdown-menu">' +
'				<li data-ng-repeat="entry in configuration.contextSwitcher.worlds.items"' +
'					data-ng-class="{ active: isActive(\'contextSwitcher\', entry) }">' +
'					<a data-ng-href="{{ entry.link }}">{{ entry.name }}</a>' +
'				</li>' +
'				<li class="divider"	data-ng-if="' +
'					configuration.contextSwitcher.apps.items.length > 0 &&' +
'					!configuration.contextSwitcher.apps.hidden"></li>' +
'				<li data-ng-if="!configuration.contextSwitcher.apps.hidden"' +
'					data-ng-repeat="' +
'						entry in configuration.contextSwitcher.apps.items |' +
'						orderBy:order(TYPES.APPS):reverse(TYPES.APPS) |' +
'						limitTo:LIMITS.APPS"' +
'					data-ng-class="{ active: isActive(\'contextSwitcher\', entry) }">' +
'					<a data-ng-href="{{ entry.link }}">{{ entry.name }}</a>' +
'				</li>' +
'				<li data-ng-if="' +
'					configuration.contextSwitcher.apps.items.length > LIMITS.APPS &&' +
'					!configuration.contextSwitcher.apps.hidden">' +
'					<a data-ng-href="#/applications">{{ allAppsLabel }}</a>' +
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
'					{{ configuration.userMenu.profile.firstName }} {{ configuration.userMenu.profile.lastName }}' +
'				</span>' +
'				<span class="caret"></span>' +
'			</a>' +
'			<ul class="dropdown-menu dropdown-menu-right">' +
'				<li>' +
'					<a data-ng-href="/users/profile/{{configuration.userMenu.profile.login}}">{{ userProfileLabel }}</a>' +
'				</li>' +
'				<li>' +
'					<a data-ng-href="/users/logout">{{ logoutUserLabel }}</a>' +
'				</li>' +
'				<li class="divider" data-ng-if="additionalUserItemsConfigured()"></li>' +
'				<li data-ng-repeat="entry in configuration.userMenu.additionalItems"' +
'					data-ng-class="{ active: isActive(\'userMenu\', entry) }">' +
'					<a data-ng-href="{{ entry.link }}">{{ entry.name }}</a>' +
'				</li>' +
'			</ul>' +
'		</li>' +
'		<li class="dropdown hidden-xs energy-manager-menu" data-ng-class="{ open: isOpen(\'energyManagerMenu\') }"' +
'			data-ng-if="configuration.energyManagerMenu.items.length">' +
'			<a href="" data-ng-click="toggleOpenState(\'energyManagerMenu\')">' +
'				<span class="glyphicon glyphicon-tasks"></span>' +
'				<span class="hidden-xs hidden-sm hidden-md">' +
'					Energy-Manager' +
'				</span>' +
'				<span class="caret"></span>' +
'				<span class="badge" data-ng-if="configuration.energyManagerMenu.items.length > 0">' +
'					{{configuration.energyManagerMenu.items.length}}' +
'				</span>' +
'			</a>' +
'			<ul class="dropdown-menu dropdown-menu-right">' +
'				<li data-ng-repeat="' +
'					entry in configuration.energyManagerMenu.items |' +
'					orderBy:order(TYPES.ENERGY_MANAGER):reverse(TYPES.ENERGY_MANAGER) |' +
'					limitTo:LIMITS.ENERGY_MANAGER">' +
'					<a data-ng-href="{{ entry.link }}">{{ entry.name }}</a>' +
'				</li>' +
'				<li>' +
'					<a data-ng-href="#/devices?class=com.kiwigrid.device.EnergyManager">{{ allEnergyManagersLabel }}</a>' +
'				</li>' +
'			</ul>' +
'		</li>' +
'		<li class="dropdown hidden-xs language-menu" data-ng-class="{ open: isOpen(\'languageMenu\') }"' +
'			data-ng-if="configuration.languageMenu.items.length">' +
'			<a href="" data-ng-click="toggleOpenState(\'languageMenu\')">' +
'				<span class="glyphicon glyphicon-flag" title="{{ languageMenu.activeEntry.name }}"></span>' +
'				<span class="hidden-sm hidden-md hidden-xs">{{ languageMenu.activeEntry.nameShort }}</span>' +
'				<span class="caret"></span>' +
'			</a>' +
'			<ul class="dropdown-menu dropdown-menu-right">' +
'				<li data-ng-repeat="entry in configuration.languageMenu.items"' +
'					data-ng-class="{ active: isActive(\'languageMenu\', entry) }">' +
'					<a href="" data-ng-click="switchLanguage(entry)">{{ entry.name }}</a>' +
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
'					<a data-ng-href="/users/profile/{{configuration.userMenu.profile.login}}">{{ userProfileLabel }}</a>' +
'				</li>' +
'				<li>' +
'					<a data-ng-href="/users/logout">{{ logoutUserLabel }}</a>' +
'				</li>' +
'				<li data-ng-repeat="entry in configuration.userMenu.additionalItems"' +
'					data-ng-class="{ active: isActive(\'userMenu\', entry) }">' +
'					<a data-ng-href="{{ entry.link }}">{{ entry.name }}</a>' +
'				</li>' +
'				<li class="divider" data-ng-if="configuration.energyManagerMenu.items.length"></li>' +
'				<li data-ng-repeat="' +
'					entry in configuration.energyManagerMenu.items |' +
'					orderBy:order(TYPES.ENERGY_MANAGER):reverse(TYPES.ENERGY_MANAGER) |' +
'					limitTo:LIMITS.ENERGY_MANAGER">' +
'					<a data-ng-href="{{ entry.link }}">{{ entry.name }}</a>' +
'				</li>' +
'				<li>' +
'					<a data-ng-href="#/devices?class=com.kiwigrid.device.EnergyManager">{{ allEnergyManagersLabel }}</a>' +
'				</li>' +
'				<li class="divider" data-ng-if="configuration.languageMenu.items.length"></li>' +
'				<li data-ng-repeat="entry in configuration.languageMenu.items"' +
'					data-ng-class="{ active: isActive(\'languageMenu\', entry) }">' +
'					<a href="" data-ng-click="switchLanguage(entry)">{{ entry.name }}</a>' +
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
'</div>');
	});
