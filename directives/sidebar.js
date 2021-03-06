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
 * &lt;div data-keta-sidebar data-configuration="{position: 'left', label: 'Fold'}"&gt;&lt;/div&gt;
 */

angular.module('keta.directives.Sidebar', [])

	.constant('ketaSidebarConstants', {
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

	.directive('ketaSidebar', function SidebarDirective($document, ketaSidebarConstants) {
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
						ketaSidebarConstants.POSITION.LEFT;

				// flag for showing toggle area in sidebar
				scope.showToggleArea = angular.isDefined(scope.configuration.label);
				scope.toggleAreaTop = 0;
				scope.transcludeTop = 0;

				// get body element to toggle css classes
				var bodyElem = angular.element(document).find('body');

				// toggle css class on body element
				scope.toggleSideBar = function() {
					bodyElem.toggleClass(ketaSidebarConstants.CSS.OFFCANVAS + '-' + scope.configuration.position);
				};

				// close open sidebars if location change starts
				scope.$on('$locationChangeStart', function() {
					bodyElem.removeClass(ketaSidebarConstants.CSS.OFFCANVAS + '-' + scope.configuration.position);
				});

				// if sidebars are toggled from outside toggle css class on body element
				var toggleBodyClass = function(position) {
					if (scope.configuration.position === position) {
						bodyElem.toggleClass(
							ketaSidebarConstants.CSS.OFFCANVAS + '-' + scope.configuration.position
						);
					}
				};

				// sidebar left
				scope.$on(ketaSidebarConstants.EVENT.TOGGLE_SIDEBAR_LEFT, function() {
					toggleBodyClass(ketaSidebarConstants.POSITION.LEFT);
				});

				// sidebar right
				scope.$on(ketaSidebarConstants.EVENT.TOGGLE_SIDEBAR_RIGHT, function() {
					toggleBodyClass(ketaSidebarConstants.POSITION.RIGHT);
				});

				// position toggle area according to height of brand bar
				if (scope.showToggleArea) {

					// determine brand bar height
					var brandBarElem = bodyElem[0].getElementsByClassName(ketaSidebarConstants.CSS.BRAND_BAR);
					var brandBarHeight = angular.isDefined(brandBarElem[0]) ? brandBarElem[0].clientHeight : 0;

					scope.toggleAreaTop = brandBarHeight + ketaSidebarConstants.OFFSET.TOGGLE_AREA;
					scope.transcludeTop = ketaSidebarConstants.OFFSET.TRANSCLUDE;

				}

				// close on click outside
				$document.bind('click', function(event) {
					if (bodyElem.hasClass(
						ketaSidebarConstants.CSS.OFFCANVAS + '-' + scope.configuration.position
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
