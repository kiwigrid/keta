'use strict';

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
				
				var update = function() {
					
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
					
				};
				
				update();
				
				scope.$watchCollection('rows', function(newValue, oldValue) {
					if (newValue !== null && newValue !== oldValue) {
						update();
					}
				});
				
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
