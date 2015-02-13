'use strict';

/**
 * keta 0.3.2
 */

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
 *     data-label-add-column="labelAddColumn"
 *     data-disabledComponents="disabledComponents"
 *     data-switchable-columns="switchableColumns"
 *     data-visible-columns="visibleColumns"
 *     data-header-label-callback="headerLabelCallback"
 *     data-operations-mode="operationsMode"
 *     data-row-sort-enabled="rowSortEnabled"
 *     data-row-sort-criteria="rowSortCriteria"
 *     data-row-sort-order-ascending="rowSortOrderAscending"
 *     data-action-list="actionList"
 *     data-cell-renderer="cellRenderer"
 *     data-column-class-callback="columnClassCallback"
 *     data-pager="pager"
 *     data-search="search"&gt;&lt;/div&gt;
 * @example
 * angular.module('exampleApp', ['keta.directives.ExtendedTable'])
 *     .controller('ExampleController', function($scope, ketaSharedConfig) {
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
 *         // object of labels
 *         $scope.labels = {
 *             ADD_COLUMN: 'add col:'
 *         };
 *         
 *         // array of disabled components (empty by default)
 *         $scope.disabledComponents = [
 *             // the table itself
 *             ketaSharedConfig.EXTENDED_TABLE.COMPONENTS.TABLE,
 *             // an input field to search throughout the full dataset
 *             ketaSharedConfig.EXTENDED_TABLE.COMPONENTS.FILTER,
 *             // a selector to add columns to table
 *             ketaSharedConfig.EXTENDED_TABLE.COMPONENTS.SELECTOR,
 *             // a pager to navigate through paged data
 *             ketaSharedConfig.EXTENDED_TABLE.COMPONENTS.PAGER
 *         ];
 *         
 *         // array of switchable columns (empty by default)
 *         // together with selector component the given columns can be remove from
 *         // table and added to table afterwards
 *         $scope.switchableColumns = ['deviceClass'];
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
 *         $scope.operationsMode = ketaSharedConfig.EXTENDED_TABLE.OPERATIONS_MODE.VIEW;
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
 *         // array of actions to render for each row
 *         // getLink method will be used to construct a link with the help of the row object,
 *         // label is used as value for title-tag,
 *         // icon is used as icon-class for visualizing the action
 *         $scope.actionList = [{
 *             getLink: function(row) {
 *                 return 'edit/' + row.guid;
 *             },
 *             label: 'Edit',
 *             icon: 'glyphicon glyphicon-pencil'
 *         }, {
 *             getLink: function(row) {
 *                 return 'remove/' + row.guid;
 *             },
 *             label: 'Remove',
 *             icon: 'glyphicon glyphicon-remove'
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
 *                 if (row.state === ketaSharedConfig.STATE.OK && !isHeader) {
 *                     columnClass+= ' state-success';
 *                 }
 *                 if (row.state === ketaSharedConfig.STATE.ERROR && !isHeader) {
 *                     columnClass+= ' state-warning';
 *                 }
 *                 if (row.state === ketaSharedConfig.STATE.FATAL && !isHeader) {
 *                     columnClass+= ' state-danger';
 *                 }
 *             }
 *             return columnClass;
 *         };
 *         
 *         // object for pager configuration (total, limit, offset)
 *         // with this configuration object you are able to manage paging
 *         // total is the total number of rows in the dataset
 *         // limit is the number of rows shown per page
 *         // offset is the index in the dataset to start from
 *         var pager = {};
 *         pager[ketaSharedConfig.EXTENDED_TABLE.PAGER.TOTAL] = $scope.allRows.length;
 *         pager[ketaSharedConfig.EXTENDED_TABLE.PAGER.LIMIT] = 5;
 *         pager[ketaSharedConfig.EXTENDED_TABLE.PAGER.OFFSET] = 0;
 *         $scope.pager = pager;
 *         
 *         // search term to filter the table
 *         // as two-way-binded property this variable contains the search string
 *         // typed by the user in the frontend and can therefor be used for querying
 *         // the backend, if watched here additionally
 *         $scope.search = null;
 *         
 *     });
 * 
 */
angular.module('keta.directives.ExtendedTable',
	[
		'ngSanitize',
		'keta.shared',
		'keta.filters.OrderObjectBy',
		'keta.filters.Slice'
	])
	
	.directive('extendedTable', function ExtendedTableDirective($compile, $filter, ketaSharedConfig) {
		return {
			restrict: 'EA',
			replace: true,
			scope: {
				
				// data as array of objects, keys from first element are taken as headers
				rows: '=',
				
				// label prefixed to selector-component
				labels: '=?',
				
				// array of disabled components (empty by default)
				disabledComponents: '=?',
				
				// array of switchable columns (empty by default)
				switchableColumns: '=?',
				
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
				
				// object for pager configuration (total, limit, offset)
				pager: '=?',
				
				// search term to filter the table
				search: '=?'
				
			},
			templateUrl: '/components/directives/extended-table.html',
			link: function(scope) {
				
				// object of labels
				var defaultLabels = {
					ADD_COLUMN: 'Add column'
				};
				scope.labels = angular.extend(defaultLabels, scope.labels);
				
				// headers to save
				scope.headers =
					(angular.isDefined(scope.rows) && angular.isDefined(scope.rows[0])) ?
						scope.rows[0] : {};
						
				// disabledComponents
				scope.disabledComponents = scope.disabledComponents || [
					scope.COMPONENTS_FILTER,
					scope.COMPONENTS_SELECTOR,
					scope.COMPONENTS_PAGER
				];
				
				// switchableColumns
				scope.switchableColumns = scope.switchableColumns || [];
				
				// visibleColumns
				scope.visibleColumns =
					scope.visibleColumns ||
					((angular.isDefined(scope.rows) && angular.isDefined(scope.rows[0])) ?
						Object.keys(scope.rows[0]) : []);
				
				// headerLabelCallback
				scope.headerLabelCallback = scope.headerLabelCallback || function(column) {
					return column;
				};
				
				// operationsMode
				scope.operationsMode = scope.operationsMode || scope.OPERATIONS_MODE_VIEW;
				
				// rowSortEnabled
				scope.rowSortEnabled =
					(angular.isDefined(scope.rowSortEnabled)) ?
						scope.rowSortEnabled : false;
				
				// rowSortCriteria
				scope.rowSortCriteria =
					scope.rowSortCriteria ||
					((angular.isDefined(scope.rows) && angular.isDefined(scope.rows[0])) ?
						Object.keys(scope.rows[0])[0] : null);
				
				// rowSortOrderAscending
				scope.rowSortOrderAscending =
					(angular.isDefined(scope.rowSortOrderAscending)) ?
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
				
				// pager
				var defaultPager = {};
				defaultPager[scope.PAGER_TOTAL] = angular.isArray(scope.rows) ? scope.rows.length : 0;
				defaultPager[scope.PAGER_LIMIT] = angular.isArray(scope.rows) ? scope.rows.length : 0;
				defaultPager[scope.PAGER_OFFSET] = 0;
				scope.pager = scope.pager || defaultPager;
				
				// search
				scope.search = scope.search || null;
				
			},
			controller: function($scope) {
				
				// CONSTANTS ---
				
				$scope.COMPONENTS_FILTER = ketaSharedConfig.EXTENDED_TABLE.COMPONENTS.FILTER;
				$scope.COMPONENTS_SELECTOR = ketaSharedConfig.EXTENDED_TABLE.COMPONENTS.SELECTOR;
				$scope.COMPONENTS_TABLE = ketaSharedConfig.EXTENDED_TABLE.COMPONENTS.TABLE;
				$scope.COMPONENTS_PAGER = ketaSharedConfig.EXTENDED_TABLE.COMPONENTS.PAGER;
				
				$scope.OPERATIONS_MODE_DATA = ketaSharedConfig.EXTENDED_TABLE.OPERATIONS_MODE.DATA;
				$scope.OPERATIONS_MODE_VIEW = ketaSharedConfig.EXTENDED_TABLE.OPERATIONS_MODE.VIEW;
				
				$scope.PAGER_TOTAL = ketaSharedConfig.EXTENDED_TABLE.PAGER.TOTAL;
				$scope.PAGER_LIMIT = ketaSharedConfig.EXTENDED_TABLE.PAGER.LIMIT;
				$scope.PAGER_OFFSET = ketaSharedConfig.EXTENDED_TABLE.PAGER.OFFSET;
				
				// HELPER ---
				
				var inArray = function(array, key) {
					var found = false;
					angular.forEach(array, function(item) {
						if (item === key) {
							found = true;
						}
					});
					return found;
				};
				
				$scope.isDisabled = function(key) {
					return inArray($scope.disabledComponents, key);
				};
				
				$scope.isSwitchable = function(key) {
					return inArray($scope.switchableColumns, key);
				};
				
				$scope.isSortCriteria = function(key) {
					var criteria =
						(angular.isDefined($scope.rowSortCriteria)) ?
							$scope.rowSortCriteria : null;
					if (criteria !== null && (criteria[0] === '+' || criteria[0] === '-')) {
						criteria = criteria.substr(1);
					}
					return (key === criteria);
				};
				$scope.pages = [];
				$scope.currentPage = 0;
				
				var resetPager = function() {
					if (angular.isDefined($scope.pager) && ($scope.pager !== null)) {
						
						// update pager
						if ($scope.operationsMode === $scope.OPERATIONS_MODE_VIEW) {
							var rows = $scope.rows || [];
							var rowsLength = $filter('filter')(rows, $scope.search).length;
							$scope.pager[$scope.PAGER_TOTAL] = rowsLength;
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
						
					}
				};
				
				$scope.$watch('pager', function(newValue, oldValue) {
					if (newValue !== null && newValue !== oldValue) {
						resetPager();
					}
				}, true);
				
				$scope.$watch('search', function(newValue, oldValue) {
					if (newValue !== null && newValue !== oldValue) {
						resetPager();
					}
				});
				
				resetPager();
				
				// ACTIONS ---
				
				$scope.sortBy = function(column) {
					if ($scope.rowSortEnabled && $scope.headerLabelCallback(column) !== null) {
						if ($scope.rowSortCriteria === column) {
							$scope.rowSortOrderAscending = !$scope.rowSortOrderAscending;
						} else {
							$scope.rowSortCriteria = column;
						}
					}
				};
				
				$scope.selectedColumn = null;
				
				var resetSelectedColumn = function() {
					var possibleColumns = $filter('filter')($scope.switchableColumns, $scope.filterColumns);
					if (!inArray(possibleColumns, $scope.selectedColumn)) {
						$scope.selectedColumn = (angular.isDefined(possibleColumns[0])) ? possibleColumns[0] : null;
					}
				};
				
				$scope.$watch('switchableColumns.length', function(newValue, oldValue) {
					if (newValue !== null && newValue !== oldValue) {
						resetSelectedColumn();
					}
				});
				
				$scope.filterColumns = function(column) {
					return !inArray($scope.visibleColumns, column);
				};
				
				$scope.addColumn = function(column) {
					$scope.visibleColumns.push(column);
					resetSelectedColumn();
				};
				
				$scope.removeColumn = function(column) {
					var columns = [];
					angular.forEach($scope.visibleColumns, function(col) {
						if (col !== column) {
							columns.push(col);
						}
					});
					$scope.visibleColumns = columns;
					resetSelectedColumn();
				};
				
				$scope.goToPage = function(page) {
					$scope.pager[$scope.PAGER_OFFSET] = $scope.pager[$scope.PAGER_LIMIT] * (page - 1);
					resetPager();
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
'	<div class="row" data-ng-show="!isDisabled(COMPONENTS_FILTER) || isDisabled(COMPONENTS_SELECTOR)">' +
'		<div class="col-xs-12 col-sm-6">' +
'		' +
'			<!-- FILTER -->' +
'			<div data-ng-show="!isDisabled(COMPONENTS_FILTER)">' +
'				<div class="form-group form-inline">' +
'					<div class="input-group col-xs-12 col-sm-8 col-md-6">' +
'						<input type="text" class="form-control" placeholder="Search" data-ng-model="search">' +
'						<div class="input-group-addon"><span class="glyphicon glyphicon-search"></span></div>' +
'					</div>' +
'				</div>' +
'			</div>' +
'			' +
'		</div>' +
'		<div class="col-xs-12 col-sm-6 pull-right">' +
'			' +
'			<!-- SELECTOR -->' +
'			<div data-ng-show="!isDisabled(COMPONENTS_SELECTOR)">' +
'				<div class="form-group form-inline pull-right" data-ng-show="selectedColumn !== null">' +
'					<label for="columnSelector">{{ labels.ADD_COLUMN }}</label>' +
'					<select id="columnSelector" class="form-control"' +
'						data-ng-model="selectedColumn"' +
'						data-ng-options="' +
'							column as headerLabelCallback(column) for column in switchableColumns |' +
'							filter:filterColumns">' +
'					</select>' +
'					<button type="button" class="btn btn-primary" data-ng-click="addColumn(selectedColumn)">' +
'						<i class="glyphicon glyphicon-plus"></i>' +
'					</button>' +
'				</div>' +
'				<div class="form-group form-inline pull-right">' +
'					<span class="form-group-label">&nbsp;</span>' +
'				</div>' +
'			</div>' +
'			' +
'		</div>' +
'	</div>' +
'	' +
'	<!-- TABLE -->' +
'	<div class="row" data-ng-show="!isDisabled(COMPONENTS_TABLE)">' +
'		<div class="col-xs-12">' +
'			<table class="table table-striped form-group">' +
'				<thead>' +
'					<tr>' +
'						<th class="{{columnClassCallback(headers, column, true)}}"' +
'							data-ng-repeat="column in headers | orderObjectBy:visibleColumns:true"' +
'							data-ng-if="rowSortEnabled">' +
'							<a class="header" data-ng-click="sortBy(column)">{{headerLabelCallback(column)}}</a>' +
'							<a data-ng-if="isSortCriteria(column) && rowSortOrderAscending">' +
'								<span class="glyphicon glyphicon-chevron-up"></span>' +
'							</a>' +
'							<a data-ng-if="isSortCriteria(column) && !rowSortOrderAscending">' +
'								<span class="glyphicon glyphicon-chevron-down"></span>' +
'							</a>' +
'							<span data-ng-if="!isSortCriteria(column) && headerLabelCallback(column) !== null"' +
'								class="glyphicon glyphicon-resize-vertical"></span>' +
'							<a class="operation" data-ng-if="isSwitchable(column)" data-ng-click="removeColumn(column)">' +
'								<span class="glyphicon glyphicon-minus"></span>' +
'							</a>' +
'						</th>' +
'						<th class="{{columnClassCallback(headers, column, true)}}"' +
'							data-ng-repeat="column in headers | orderObjectBy:visibleColumns:true"' +
'							data-ng-if="!rowSortEnabled">' +
'							{{headerLabelCallback(column)}}' +
'							<a class="operation" data-ng-if="isSwitchable(column)" data-ng-click="removeColumn(column)">' +
'								<span class="glyphicon glyphicon-minus"></span>' +
'							</a>' +
'						</th>' +
'						<th data-ng-if="actionList.length">' +
'							{{headerLabelCallback(\'actions\')}}' +
'						</th>' +
'					</tr>' +
'				</thead>' +
'				<tbody>' +
'					<!-- operationsMode: data -->' +
'					<tr data-ng-if="operationsMode === OPERATIONS_MODE_DATA"' +
'						data-ng-repeat="row in rows">' +
'						<td data-ng-repeat="column in row |	orderObjectBy:visibleColumns:true"' +
'							class="{{columnClassCallback(row, column, false)}}">' +
'							<span data-ng-bind-html="cellRenderer(row, column)"></span>' +
'						</td>' +
'						<td data-ng-if="row && actionList.length">' +
'							<ul class="list-inline list-inline-icons">' +
'								<li data-ng-repeat="item in actionList">' +
'									<a data-ng-href="{{item.getLink(row)}}"	title="{{item.label}}">' +
'										<span class="{{item.icon}}"></span>' +
'									</a>' +
'								</li>' +
'							</ul>' +
'						</td>' +
'					</tr>' +
'					<!-- operationsMode: view -->' +
'					<tr data-ng-if="operationsMode === OPERATIONS_MODE_VIEW"' +
'						data-ng-repeat="' +
'							row in rows |' +
'							filter:search |' +
'							orderBy:rowSortCriteria:!rowSortOrderAscending |' +
'							slice:pager[PAGER_OFFSET]:pager[PAGER_LIMIT]">' +
'						<td data-ng-repeat="column in row |	orderObjectBy:visibleColumns:true"' +
'							class="{{columnClassCallback(row, column, false)}}">' +
'							<span data-ng-bind-html="cellRenderer(row, column)"></span>' +
'						</td>' +
'						<td data-ng-if="row && actionList.length">' +
'							<ul class="list-inline list-inline-icons">' +
'								<li data-ng-repeat="item in actionList">' +
'									<a data-ng-href="{{item.getLink(row)}}"	title="{{item.label}}">' +
'										<span class="{{item.icon}}"></span>' +
'									</a>' +
'								</li>' +
'							</ul>' +
'						</td>' +
'					</tr>' +
'				</tbody>' +
'			</table>' +
'		</div>' +
'	</div>' +
'	' +
'	<!-- PAGER -->' +
'	<div class="row" data-ng-show="!isDisabled(COMPONENTS_PAGER) && pager !== null">' +
'		<div class="col-xs-12 col-sm-6">' +
'			<div class="btn-group form-group" role="group">' +
'				<button type="button"' +
'					data-ng-repeat="page in pages"' +
'					data-ng-click="goToPage(page)"' +
'					data-ng-class="{' +
'						\'btn\': true,' +
'						\'btn-default\': true,' +
'						\'btn-primary\': page === currentPage' +
'					}">{{page}}</button>' +
'			</div>' +
'		</div>' +
'	</div>' +
'	' +
'</div>');
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

// source: dist/directives/world-bar.js
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
 *     .controller('ExampleController', function($scope) {
 *         
 *         // return object values in given order (all other values are dismissed)
 *         $scope.orderedProps = $filter('orderObjectBy')($scope.row, ['col1', 'col2']);
 *         
 *         // return object keys in given order (all other keys are dismissed)
 *         $scope.orderedProps = $filter('orderObjectBy')($scope.row, ['col1', 'col2'], true);
 *         
 *     });
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
					sorted.push((returnKey) ? field : input[field]);
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
 *     .controller('ExampleController', function($scope) {
 *         
 *         // extract 5 elements starting at offset 0
 *         $scope.pagedRows = $filter('slice')($scope.rows, 0, 5);
 *         
 *     });
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
 * @example
 * {{ 1234.56 | unit:{unit: 'W', precision: 1, isBytes: false} }}
 * @example
 * angular.module('exampleApp', ['keta.filters.Unit'])
 *     .controller('ExampleController', function($scope) {
 *         
 *         $scope.value = $filter('unit')(1234.56, {unit: 'W', precision: 1, isBytes: false});
 *         
 *     });
 */
angular.module('keta.filters.Unit', [])
	.filter('unit', function($filter, ketaSharedConfig) {
		return function(input, configuration) {
			
			var precision = 0,
				unit = '',
				isBytes = false;
			
			if (angular.isDefined(configuration)) {
				precision = angular.isNumber(configuration.precision) ? configuration.precision : precision;
				unit = angular.isDefined(configuration.unit) ? configuration.unit : unit;
				isBytes = angular.isDefined(configuration.isBytes) ? configuration.isBytes : isBytes;
			}
			
			if (input === 0) {
				precision = 0;
			}
			
			var sizes = (isBytes) ? ['Bytes', 'KB', 'MB', 'GB', 'TB'] : ['', 'k', 'M', 'G', 'T'];
			
			if (unit === ketaSharedConfig.UNITS.EURO ||
				unit === ketaSharedConfig.UNITS.KILOMETER ||
				unit === ketaSharedConfig.UNITS.DOLLAR ||
				unit === ketaSharedConfig.UNITS.POUND) {
				return $filter('number')(input, precision) + ' ' + unit;
			}
			
			if (angular.isNumber(input)) {
				var multiplicator = (input < 0) ? -1 : 1;
				var oneKiloByte = 1024;
				var oneKilo = 1000;
				var parseBase = 10;
				input = input * multiplicator;
				if (input >= 1) {
					var i = parseInt(
						Math.floor(Math.log(input) / Math.log((isBytes) ? oneKiloByte : oneKilo)),
						parseBase
					);
					input = $filter('number')(
						(input / Math.pow((isBytes) ? oneKiloByte : oneKilo, i)) * multiplicator,
						precision
					);
					input += ' ' + sizes[i];
				} else {
					input = $filter('number')(input, precision) + ' ' + sizes[0];
				}
				if (!isBytes) {
					input += unit;
				}
			}
			
			return input.trim();
		};
	});

// source: dist/services/access-token.js
/**
 * @name keta.services.AccessToken
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014
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
			 * @memberOf ketaAccessToken
			 * @description Refresh access token by requesting backend.
			 * @returns {promise}
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
				return $http({
					method: 'GET',
					url: '/refreshAccessToken'
				});
			}
		
		};
		
		return api;
		
	});

// source: dist/services/app-context.js
/**
 * @name keta.services.AppContext
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014
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
		var appContext = (angular.isDefined(window.appContext)) ? window.appContext : {};
		
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
		 * @returns {*}
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

// source: dist/services/device-event.js
/**
 * @name keta.services.DeviceEvent
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014
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
				 * @return {string} type
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
				 * @return {DeviceInstance} device
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
				 * @returns {DeviceEventInstance}
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
 * @copyright Kiwigrid GmbH 2014
 * @module keta.services.DeviceSet
 * @description DeviceSet Provider
 */
angular.module('keta.services.DeviceSet',
	[
		'keta.services.Device',
		'keta.services.DeviceEvent',
		'keta.services.EventBusDispatcher',
		'keta.services.EventBusManager',
		'keta.services.Logger'
	])
	
	/**
	 * @class DeviceSetProvider
	 * @propertyOf keta.services.DeviceSet
	 * @description DeviceSet Provider
	 */
	.provider('DeviceSet', function DeviceSetProvider() {
		
		this.$get = function DeviceSetService(
			$q, $rootScope, $log,
			Device, DeviceEvent, EventBusDispatcher, EventBusManager) {
			
			/**
			 * @class DeviceSetInstance
			 * @propertyOf DeviceSetProvider
			 * @description DeviceSet Instance
			 */
			var DeviceSetInstance = function(givenEventBus) {
				
				// keep reference
				var that = this;
				
				// save EventBus instance
				var eventBus = givenEventBus;
				
				// internal params object
				var params = {};
				
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
				 * @returns {DeviceSetInstance}
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
				 * @returns {DeviceSetInstance}
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
				 * @returns {DeviceSetInstance}
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
				 * @returns {DeviceSetInstance}
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
						if (angular.isDefined(pagination.offset)) {
							params.offset = pagination.offset;
						}
						if (angular.isDefined(pagination.limit)) {
							params.limit = pagination.limit;
						}
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
				 * @returns {promise}
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
					
					// generate UUID
					var liveHandlerUUID = 'CLIENT_' + EventBusDispatcher.generateUUID();
					
					// register handler under created UUID
					EventBusDispatcher.registerHandler(eventBus, liveHandlerUUID, function(event) {
						
						// process event using sync
						api.sync(set, DeviceEvent.create(event.type, event.value));
						
						// log if in debug mode
						if (EventBusManager.inDebugMode()) {
							$log.event([event], $log.ADVANCED_FORMATTER);
						}
						
					});
					
					// register device set listener
					EventBusDispatcher.send(eventBus, 'devices', {
						action: 'registerDeviceSetListener',
						body: {
							deviceFilter: params.filter,
							deviceProjection: params.projection,
							replyAddress: liveHandlerUUID
						}
					}, function(reply) {
						// log if in debug mode
						if (EventBusManager.inDebugMode()) {
							$log.request([{
								action: 'registerDeviceSetListener',
								body: {
									deviceFilter: params.filter,
									deviceProjection: params.projection,
									replyAddress: liveHandlerUUID
								}
							}, reply], $log.ADVANCED_FORMATTER);
						}
					});
					
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
				 * @returns {promise}
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
					
					EventBusDispatcher.send(eventBus, 'devices', {
						action: 'getDevices',
						params: params
					}, function(reply) {
						if (reply) {
							// inject used params
							reply.params = params;
							
							if (reply.code === 200) {
								
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
									$log.request([{
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
			var api = {
				
				/**
				 * @function
				 * @memberOf DeviceSet
				 * @description
				 * <p>
				 *   Creates a DeviceSetInstance with given EventBus instance.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance to use for communication
				 * @returns {DeviceSetInstance}
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
					angular.forEach(set.result.items, function(item, key) {
						if (item.guid === device.guid) {
							index = key;
						}
					});
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
					return (angular.isDefined(set.result.items)) ? set.result.items.length : 0;
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
				 * @returns {DeviceInstance}
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
					return (angular.isDefined(set.result.items[index])) ? set.result.items[index] : null;
				},
				
				/**
				 * @function
				 * @memberOf DeviceSet
				 * @description
				 * <p>
				 *   Returns all devices in given DeviceSet.
				 * </p>
				 * @param {DeviceSetInstance} set DeviceSetInstance to search in
				 * @returns {Array}
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
					return (angular.isDefined(set.result.items)) ? set.result.items : [];
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
				sync: function(set, event) {
					
					var modified = false;
					
					if (event.getType() === DeviceEvent.CREATED) {
						set.result.items.push(event.getDevice());
						modified = true;
					} else if (event.getType() === DeviceEvent.DELETED) {
						set.result.items.splice(api.indexOf(set, event.getDevice()), 1);
						modified = true;
					} else if (event.getType() === DeviceEvent.UPDATED) {
						var index = api.indexOf(set, event.getDevice());
						if (index !== -1) {
							angular.extend(api.get(set, index), event.getDevice());
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
 * @copyright Kiwigrid GmbH 2014
 * @module keta.services.Device
 * @description Device Provider
 */
angular.module('keta.services.Device',
	[
		'keta.services.EventBusDispatcher',
		'keta.services.EventBusManager',
		'keta.services.Logger'
	])
	
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
					
					EventBusDispatcher.send(eventBus, 'devices', message, function(reply) {
						
						// log if in debug mode
						if (EventBusManager.inDebugMode()) {
							$log.request([message, reply], $log.ADVANCED_FORMATTER);
						}
						
						if (reply.code === 200) {
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
				 * @name update
				 * @function
				 * @memberOf DeviceInstance
				 * @description
				 * <p>
				 *   Updates a remote DeviceInstance from local one the method is called on.
				 * </p>
				 * <p>
				 *   Only value changes in <code>tagValues</code> property will be recognized as changes.
				 * </p>
				 * @return {promise} promise
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
				 *         device.update()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 *     });
				 */
				that.update = function() {
					
					// collect changes in tagValues property
					var changes = {
						tagValues: {}
					};
					
					angular.forEach(that.tagValues, function(tagValue, tagName) {
						if (!angular.equals(that.tagValues[tagName].value, that.$pristine.tagValues[tagName].value)) {
							changes.tagValues[tagName] = {};
							changes.tagValues[tagName].value = tagValue.value;
							changes.tagValues[tagName].oca = tagValue.oca;
						}
					});
					
					if (Object.keys(changes.tagValues).length) {
						var deferred = $q.defer();
						
						sendMessage({
							action: 'updateDevice',
							params: {
								deviceId: that.guid
							},
							body: changes
						}).then(function(reply) {
							
							// update $pristine copies after success
							angular.forEach(that.$pristine, function(value, key) {
								that.$pristine[key] = angular.copy(that[key]);
							});
							
							deferred.resolve(reply);
						}, function(reply) {
							deferred.reject(reply);
						});
						
						return deferred.promise;
					} else {
						return returnRejectedPromise('No changes found');
					}
				};
				
				/**
				 * @name delete
				 * @function
				 * @memberOf DeviceInstance
				 * @description
				 * <p>
				 *   Deletes a remote DeviceInstance from local one the method is called on.
				 * </p>
				 * @return {promise} promise
				 * @example
				 * angular.module('exampleApp', ['keta.services.Device'])
				 *     .controller('ExampleController', function(Device) {
				 *         var device = Device.create({
				 *             guid: 'guid'
				 *         });
				 *         device.delete()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 *     });
				 */
				that.delete = function() {
					return sendMessage({
						action: 'deleteDevice',
						params: {
							deviceId: that.guid
						}
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
				 * @returns {DeviceInstance}
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
 * @copyright Kiwigrid GmbH 2014
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
					if (timeout !== null) {
						$timeout.cancel(timeout);
					}
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
						} else {
							if (angular.isFunction(replyHandler)) {
								replyHandler(reply);
							}
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
							return b = Math.random() * HEX_RANGE,
								(a === 'y' ? (b & BIT_SHIFT | BIT_HALF) : (b | 0)).toString(HEX_RANGE);
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
 * @copyright Kiwigrid GmbH 2014
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
		 * @returns {EventBusManagerProvider}
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
		 * @returns {EventBusManagerProvider}
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
		 * @returns {EventBusManagerProvider}
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
			return (angular.isDefined(eventBuses[eventBusId])) ? eventBuses[eventBusId] : null;
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
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(EventBusManagerProvider) {
		 *         if (EventBusManagerProvider.inDebugMode()) {
		 *             // do something useful
		 *         }
		 *     });
		 */
		this.inDebugMode = function() {
			return (debug === true);
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
 * @copyright Kiwigrid GmbH 2014
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
				autoConnect: false,
				autoUnregister: true,
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
		 * @returns {EventBus}
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
		 *             autoConnect: false,
		 *             autoUnregister: true,
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
 * @copyright Kiwigrid GmbH 2014
 * @module keta.services.Logger
 * @description Logger Decorator
 */
angular.module('keta.services.Logger', [])
	
	/**
	 * @class LoggerConfig
	 * @propertyOf keta.services.Logger
	 * @description Logger Config
	 */
	.config(function LoggerConfig($provide) {
		
		/**
		 * @class LoggerDecorator
		 * @propertyOf LoggerConfig
		 * @description Logger Decorator
		 */
		$provide.decorator('$log', function LoggerDecorator($delegate) {
			
			/**
			 * @name ADVANCED_FORMATTER
			 * @function
			 * @memberOf LoggerDecorator
			 * @description
			 * <p>
			 *   Formats a message in an advanced, colored manner.
			 * </p>
			 * @param {Array} messages Messages as array
			 * @returns {string}
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
					output+= JSON.stringify(message, null, '\t') + '\n';
				});
				
				console.log(
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
					console.log(messages);
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
 * @copyright Kiwigrid GmbH 2014
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
				 * @returns {TagSetInstance}
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
				 * @returns {TagSetInstance}
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
				 * @returns {TagSetInstance}
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
 * @copyright Kiwigrid GmbH 2014
 * @module keta.services.Tag
 * @description Tag Provider
 */
angular.module('keta.services.Tag', [])
	
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
			 */
			var TagInstance = function(properties) {
				
				// guid of device tag belongs to
				var guid = (angular.isDefined(properties.guid)) ? properties.guid : null;
				
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
				var name = (angular.isDefined(properties.name)) ? properties.name : null;
				
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
					(angular.isDefined(properties.sampleRate) && (properties.sampleRate >= 5)) ?
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
				 * @returns {TagInstance}
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

// source: dist/shared.js
/**
 * @name keta.shared
 * @author Jan Uhlmann <jan.uhlmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.shared
 * @description Constants for cross-component relations (e.g. events, translation file namings, ...)
 */

angular.module('keta.shared', [])

	.constant('ketaSharedConfig', {
		EVENTS: {
			TOGGLE_SIDEBAR_LEFT: 'TOGGLE_SIDEBAR_LEFT',
			TOGGLE_SIDEBAR_RIGHT: 'TOGGLE_SIDEBAR_RIGHT'
		},
		STATE: {
			OK: 'OK',
			ERROR: 'ERROR',
			FATAL: 'FATAL'
		},
		UNITS: {
			WATTS: 'W',
			WATTHOURS: 'Wh',
			PERCENT: '%',
			EURO: '€',
			DOLLAR: '$',
			POUND: '£',
			KILOMETER: 'km'
		},
		SIDEBAR: {
			POSITION_LEFT: 'left',
			POSITION_RIGHT: 'right',
			CSS_OFFCANVAS: 'offcanvas',
			CSS_BRAND_BAR: 'brand-bar',
			TOGGLE_AREA_OFFSET: 5,
			TRANSCLUDE_OFFSET: 15
		},
		WORLD_BAR: {
			CSS_CONTEXT_SWITCHER: 'context-switcher',
			ENTRY_CONTEXT_SWITCHER: 'contextSwitcher',
			ENTRY_CONTEXT_SWITCHER_WORLDS: 'worlds',
			ENTRY_CONTEXT_SWITCHER_MANAGERS: 'managers',
			ENTRY_CONTEXT_SWITCHER_APPS: 'apps',
			ENTRY_USER_MENU: 'userMenu',
			ENTRY_LANGUAGE_MENU: 'languageMenu'
		},
		EXTENDED_TABLE: {
			COMPONENTS: {
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
			}
		}
	})
	
	/**
	 * @class ketaSharedFactory
	 * @propertyOf keta.shared
	 * @description Shared utility methods
	 */
	.factory('ketaSharedFactory', function ketaSharedFactory() {
		
		var factory = {};
		
		/**
		 * @name doesPropertyExist
		 * @function
		 * @memberOf ketaSharedFactory
		 * @description This method checks, if a deep property does exist in the given object.
		 * @param {object} obj object to check property for
		 * @param {string} prop property given in dot notation
		 * @returns {boolean}
		 */
		factory.doesPropertyExist = function(obj, prop) {
			var parts = prop.split('.');
			for (var i = 0, l = parts.length; i < l; i++) {
				var part = parts[i];
				if (obj !== null && typeof obj === 'object' && part in obj) {
					obj = obj[part];
				} else {
					return false;
				}
			}
			return true;
		};
		
		return factory;
		
	});
