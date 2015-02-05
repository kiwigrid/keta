'use strict';

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
angular.module('keta.directives.Sidebar',
	[
		'keta.shared'
	])
	
	.directive('sidebar', function SidebarDirective($document, ketaSharedConfig) {
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
						ketaSharedConfig.SIDEBAR.POSITION_LEFT;
				
				// flag for showing toggle area in sidebar
				scope.showToggleArea = angular.isDefined(scope.configuration.label);
				scope.toggleAreaTop = 0;
				scope.transcludeTop = 0;
				
				// get body element to toggle css classes
				var bodyElem = angular.element(document).find('body');

				// toggle css class on body element
				scope.toggleSideBar = function() {
					bodyElem.toggleClass(ketaSharedConfig.SIDEBAR.CSS_OFFCANVAS + '-' + scope.configuration.position);
				};

				// close open sidebars if location change starts
				scope.$on('$locationChangeStart', function() {
					bodyElem.removeClass(ketaSharedConfig.SIDEBAR.CSS_OFFCANVAS + '-' + scope.configuration.position);
				});
				
				// if sidebars are toggled from outside toggle css class on body element
				var toggleBodyClass = function(position) {
					if (scope.configuration.position === position) {
						bodyElem.toggleClass(ketaSharedConfig.SIDEBAR.CSS_OFFCANVAS + '-' + scope.configuration.position);
					}
				};
				
				// sidebar left
				scope.$on(ketaSharedConfig.EVENTS.TOGGLE_SIDEBAR_LEFT, function() {
					toggleBodyClass(ketaSharedConfig.SIDEBAR.POSITION_LEFT);
				});
				
				// sidebar right
				scope.$on(ketaSharedConfig.EVENTS.TOGGLE_SIDEBAR_RIGHT, function() {
					toggleBodyClass(ketaSharedConfig.SIDEBAR.POSITION_RIGHT);
				});

				// position toggle area according to height of brand bar
				if (scope.showToggleArea) {

					// determine brand bar height
					var brandBarElem = bodyElem[0].getElementsByClassName(ketaSharedConfig.SIDEBAR.CSS_BRAND_BAR);
					var brandBarHeight = angular.isDefined(brandBarElem[0]) ? brandBarElem[0].clientHeight : 0;
					
					scope.toggleAreaTop = brandBarHeight + ketaSharedConfig.SIDEBAR.TOGGLE_AREA_OFFSET;
					scope.transcludeTop = ketaSharedConfig.SIDEBAR.TRANSCLUDE_OFFSET;
					
				}
				
				// close on click outside
				$document.bind('click', function(event) {
					if (bodyElem.hasClass(ketaSharedConfig.SIDEBAR.CSS_OFFCANVAS + '-' + scope.configuration.position)) {
						var sideBarHtml = element.html(),
							targetElementHtml = angular.element(event.target).html();
						if (sideBarHtml.indexOf(targetElementHtml) !== -1) {
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
