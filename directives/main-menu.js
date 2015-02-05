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
 * @example
 * &lt;div data-main-menu data-configuration="menuConfiguration"&gt;&lt;/div&gt;
 * @example
 * angular.module('exampleApp', ['keta.directives.MainMenu'])
 *     .controller('ExampleController', function($scope) {
 *         
 *         // menu object to use as input for directive
 *         $scope.menuConfiguration = {
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
 *             compactMode: false
 *         };
 *         
 *     });
 */
angular.module('keta.directives.MainMenu', [])
	.directive('mainMenu', function MainMenuDirective($location) {
		return {
			restrict: 'EA',
			replace: true,
			scope: {
				configuration: '='
			},
			templateUrl: '/components/directives/main-menu.html',
			link: function(scope) {
				scope.compactMode = (angular.isDefined(scope.configuration.compactMode)) ?
					scope.configuration.compactMode : false;
	
				function checkPaths(currentMenuLevelParts, locationLevelParts, activeFlag) {
					for (var i = 1; i < currentMenuLevelParts.length; i++) {
						if (currentMenuLevelParts[i] !== locationLevelParts[i]) {
							activeFlag = false;
						}
					}
					return activeFlag;
				}
				
				scope.isActive = function(menuEntry) {
					var currentMenuLevelParts = menuEntry.link.split('/');
					var locationLevelParts = $location.path().split('/');
					var isActive = true;
	
					if (scope.compactMode === true) {
						return currentMenuLevelParts[1] === locationLevelParts[1];
					}
					
					// Menu-entries with sub-entries have another active-class
					// to visualize the breadcrumb-path (in normal menu mode, see function isActiveParent)
					if (angular.isArray(menuEntry.items) && (menuEntry.items.length > 0)) {
						return false;
					}
					
					isActive = checkPaths(currentMenuLevelParts, locationLevelParts, isActive);
					return isActive;
				};
				
				scope.isActiveParent = function(menuEntry) {
					var currentMenuLevelParts = menuEntry.link.split('/');
					var locationLevelParts = $location.path().split('/');
					var isActiveParent = false;
					
					if (angular.isArray(menuEntry.items) && (menuEntry.items.length > 0)) {
						isActiveParent = true;
						isActiveParent = checkPaths(currentMenuLevelParts, locationLevelParts, isActiveParent);
					}
					return isActiveParent;
				};
				
				scope.checkExpand = function(menuEntry, $event) {
					// trigger expand-functionality only when navigation is shown in tablet/desktop mode
					if (scope.compactMode === false) {
						if (angular.isArray(menuEntry.items) && (menuEntry.items.length > 0)) {
							// prevent route-redirect when clicking an expand-menu-entry
							$event.preventDefault();
							if (angular.isUndefined(menuEntry.expanded) || (menuEntry.expanded === false)) {
								menuEntry.expanded = true;
							} else {
								menuEntry.expanded = !menuEntry.expanded;
							}
						}
					// compact mode
					} else {
						if (angular.isArray(menuEntry.items) && (menuEntry.items.length > 0)) {
							// Redirect to first sub-entry because the parent-route should
							// not be accessible directly.
							$event.preventDefault();
							$location.path(menuEntry.items[0].link);
						}
					}
				};
				
			}
		};
	});

// prepopulate template cache
angular.module('keta.directives.MainMenu')
	.run(function($templateCache) {
		$templateCache.put('/components/directives/main-menu.html', '<ul data-ng-class="{' +
'	\'nav\': true,' +
'	\'nav-pills\': true,' +
'	\'nav-stacked\': true,' +
'	\'nav-extended\': !compactMode,' +
'	\'nav-compact\': compactMode,' +
'	\'keta-main-menu\': true' +
'}">' +
'	<li data-ng-repeat="entry in configuration.items"' +
'		data-ng-class="{' +
'			\'active\': isActive(entry),' +
'			\'active-parent\': isActiveParent(entry)' +
'		}">' +
'		<a data-ng-href="#{{ entry.link }}" data-ng-click="checkExpand(entry, $event)"' +
'		   title="{{ compactMode ? entry.name : \'\' }}">' +
'			<span class="glyphicon glyphicon-{{ entry.icon }}"></span>' +
'			<span class="list-item" data-ng-if="!compactMode">{{ entry.name }}</span>' +
'			<span class="expander glyphicon"' +
'				data-ng-if="entry.items && !compactMode"' +
'				data-ng-class="{ \'glyphicon-minus\': entry.expanded, \'glyphicon-plus\': !entry.expanded }">' +
'			</span>' +
'		</a>' +
'		<ul class="nav nav-pills nav-stacked expanded" data-ng-show="entry.expanded && !compactMode">' +
'			<li data-ng-repeat="entryLevel2 in entry.items"' +
'				data-ng-class="{' +
'					\'active\': isActive(entryLevel2),' +
'					\'active-parent\': isActiveParent(entryLevel2)' +
'				}">' +
'				<a data-ng-href="#{{ entryLevel2.link }}" data-ng-click="checkExpand(entryLevel2, $event)">' +
'					<span data-ng-if="!compactMode">{{ entryLevel2.name }}</span>' +
'					<span class="expander glyphicon"' +
'						data-ng-if="entryLevel2.items && !compactMode"' +
'						data-ng-class="{ \'glyphicon-minus\': entryLevel2.expanded, \'glyphicon-plus\': !entryLevel2.expanded }">' +
'					</span>' +
'				</a>' +
'				<ul class="nav nav-pills nav-stacked expanded" data-ng-show="entryLevel2.expanded && !compactMode">' +
'					<li data-ng-repeat="entryLevel3 in entryLevel2.items"' +
'						data-ng-class="{ \'active\': isActive(entryLevel3) }">' +
'						<a data-ng-href="#{{ entryLevel3.link }}">' +
'							<span data-ng-if="!compactMode">{{ entryLevel3.name }}</span>' +
'						</a>' +
'					</li>' +
'				</ul>' +
'			</li>' +
'		</ul>' +
'	</li>' +
'</ul>');
	});
