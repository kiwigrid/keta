'use strict';

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
 * &lt;div data-keta-main-menu data-configuration="menuConfiguration" data-title-callback="getAppTitle"&gt;&lt;/div&gt;
 * @example
 * angular.module('exampleApp', ['keta.directives.MainMenu', 'keta.directives.Sidebar'])
 *     .controller('ExampleController', function($scope, ketaSidebarConfig) {
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
 *             toggleBroadcast: ketaSidebarConfig.EVENT.TOGGLE_SIDEBAR_LEFT
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
	.directive('ketaMainMenu', function MainMenuDirective($location, $rootScope) {
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

					var menuLink = menuEntry.link;

					// strip '#' at beginning if present
					if (angular.isString(menuLink) &&
						menuLink.substr(0, 1) === '#') {
						menuLink = angular.copy(menuLink.substr(1, menuLink.length - 1));
					}

					// close sidebar when route links of current route and menu entry are equal
					if ($location.url() === menuLink &&
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
'	<div data-ng-if="titleCallback()" class="sidebar-title">' +
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
'			<ul class="nav nav-pills nav-stacked expanded nav-sub-level" data-ng-if="entry.expanded">' +
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
'					<ul class="nav nav-pills nav-stacked expanded nav-sub-level" data-ng-if="entryLevel2.expanded">' +
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
