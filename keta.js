'use strict';

// root module
angular.module('keta', [
	'keta.directives.ExtendedTable',
	'keta.directives.MainMenu',
	'keta.directives.Sidebar',
	'keta.directives.WorldBar',
	'keta.filters.OrderObjectBy',
	'keta.filters.Slice',
	'keta.filters.Unit',
	'keta.services.AccessToken',
	'keta.services.AppContext',
	'keta.services.ApplicationSet',
	'keta.services.Application',
	'keta.services.DeviceEvent',
	'keta.services.DeviceSet',
	'keta.services.Device',
	'keta.services.EventBusDispatcher',
	'keta.services.EventBusManager',
	'keta.services.EventBus',
	'keta.services.Logger',
	'keta.services.TagSet',
	'keta.services.Tag',
	'keta.services.UserSet',
	'keta.services.User',
	'keta.shared'
]);

/**
 * keta 0.3.8
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
 *     data-group-by-property="groupByProperty"
 *     data-order-by-property="orderByProperty"
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
 *     data-search="search"
 *     data-search-results="searchResults"&gt;&lt;/div&gt;
 * @example
 * angular.module('exampleApp', ['keta.directives.ExtendedTable'])
 *     .controller('ExampleController', function($scope, ketaSharedConfig) {
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
 *         // together with selector component the given columns can be removed from
 *         // table and added to table afterwards
 *         // to support grouping in select field an array of objects is required (match is compared by id property)
 *         $scope.switchableColumns = [{
 *             id: 'deviceClass'
 *         }];
 *
 *         // property to group selector by
 *         $scope.groupByProperty = 'column.deviceName';
 *
 *         // property to order selector by
 *         $scope.orderByProperty = 'tagName';
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
 *         // array of search results e.g. for usage in headlines
 *         // defaults to $scope.rows, typically not set directly by controller
 *         //$scope.searchResults = $scope.rows;
 *
 *     });
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

				// property to group selector by
				groupByProperty: '=?',

				// property to order selector by
				orderByProperty: '=?',

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
				search: '=?',

				// array of search results
				searchResults: '=?'

			},
			templateUrl: '/components/directives/extended-table.html',
			link: function(scope) {

				// rows
				scope.rows =
					angular.isDefined(scope.rows) && angular.isArray(scope.rows) ?
						scope.rows : [];

				// object of labels
				var defaultLabels = {
					SEARCH: 'Search',
					ADD_COLUMN: 'Add column',
					REMOVE_COLUMN: 'Remove column',
					SORT: 'Sort',
					NO_ENTRIES: 'No entries'
				};
				scope.labels = angular.extend(defaultLabels, scope.labels);

				// headers to save
				scope.headers =
					angular.isDefined(scope.rows) && angular.isDefined(scope.rows[0]) ?
						scope.rows[0] : {};

				// disabledComponents
				scope.disabledComponents = scope.disabledComponents || [
					scope.COMPONENTS_FILTER,
					scope.COMPONENTS_SELECTOR,
					scope.COMPONENTS_PAGER
				];

				// switchableColumns
				scope.switchableColumns = scope.switchableColumns || [];
				scope.resetSelectedColumn();

				// groupByProperty
				scope.groupByProperty = scope.groupByProperty || null;

				// orderByProperty
				scope.orderByProperty = scope.orderByProperty || '';

				// visibleColumns
				scope.visibleColumns =
					scope.visibleColumns ||
					(angular.isDefined(scope.rows) && angular.isDefined(scope.rows[0]) ?
						Object.keys(scope.rows[0]) : []);

				// headerLabelCallback
				scope.headerLabelCallback = scope.headerLabelCallback || function(column) {
					return column;
				};

				// operationsMode
				scope.operationsMode = scope.operationsMode || scope.OPERATIONS_MODE_VIEW;

				// rowSortEnabled
				scope.rowSortEnabled =
					angular.isDefined(scope.rowSortEnabled) ?
						scope.rowSortEnabled : false;

				// rowSortCriteria
				scope.rowSortCriteria =
					scope.rowSortCriteria ||
					(angular.isDefined(scope.rows) && angular.isDefined(scope.rows[0]) ?
						Object.keys(scope.rows[0])[0] : null);

				// rowSortOrderAscending
				scope.rowSortOrderAscending =
					angular.isDefined(scope.rowSortOrderAscending) ?
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
				defaultPager[scope.PAGER_TOTAL] = scope.rows.length;
				defaultPager[scope.PAGER_LIMIT] = scope.rows.length;
				defaultPager[scope.PAGER_OFFSET] = 0;
				scope.pager = angular.extend(defaultPager, scope.pager);
				scope.resetPager();

				// search
				scope.search = scope.search || null;

				// array of search results
				scope.searchResults = scope.searchResults || scope.rows;

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

				// VARIABLES ---

				$scope.pages = [];
				$scope.currentPage = 0;
				$scope.selectedColumn = null;

				// HELPER ---

				// update properties without using defaults
				var update = function() {

					if (angular.isDefined($scope.rows) && angular.isDefined($scope.rows[0])) {

						// headers to save
						if (angular.equals($scope.headers, {})) {
							$scope.headers = $scope.rows[0];
						}

						// visibleColumns
						if (angular.equals($scope.visibleColumns, [])) {
							$scope.visibleColumns = Object.keys($scope.rows[0]);
						}

						// rowSortCriteria
						if ($scope.rowSortCriteria === null) {
							$scope.rowSortCriteria = Object.keys($scope.rows[0])[0];
						}

					} else {
						$scope.headers = {};
						$scope.visibleColumns = [];
						$scope.rowSortCriteria = null;
					}

				};

				// check if element exists in array
				var inArray = function(array, element) {
					var found = false;
					angular.forEach(array, function(item) {
						if (item === element) {
							found = true;
						}
					});
					return found;
				};

				// reset pager object regarding filtered rows
				$scope.resetPager = function() {

					// update pager
					if ($scope.operationsMode === $scope.OPERATIONS_MODE_VIEW) {
						var rowsLength = $filter('filter')($scope.rows, $scope.search).length;
						$scope.pager[$scope.PAGER_TOTAL] = rowsLength;
						if ($scope.pager[$scope.PAGER_LIMIT] === 0) {
							$scope.pager[$scope.PAGER_LIMIT] = rowsLength;
						}
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

				};

				// reset selected column
				$scope.resetSelectedColumn = function() {
					var possibleColumns = $filter('filter')($scope.switchableColumns, function(column) {
						return !inArray($scope.visibleColumns, column.id);
					});
					var stillPossible = false;
					angular.forEach(possibleColumns, function(column) {
						if (column.id === $scope.selectedColumn) {
							stillPossible = true;
						}
					});
					if (!stillPossible) {
						possibleColumns = $filter('orderBy')(possibleColumns, $scope.orderByProperty);
						$scope.selectedColumn = angular.isDefined(possibleColumns[0]) ? possibleColumns[0].id : null;
					}
				};

				// INIT ---

				// $scope.resetPager();
				// $scope.resetSelectedColumn();

				// WATCHER ---

				$scope.$watch('rows', function(newValue, oldValue) {
					if (newValue !== null && newValue !== oldValue) {
						update();
						$scope.resetPager();
					}
				}, true);

				$scope.$watch('rows.length', function(newValue, oldValue) {
					if (newValue !== null && newValue !== oldValue) {
						$scope.resetPager();
					}
				});

				$scope.$watch('pager', function(newValue, oldValue) {
					if (newValue !== null && newValue !== oldValue) {
						$scope.resetPager();
					}
				}, true);

				$scope.$watch('search', function(newValue, oldValue) {
					if (newValue !== null && newValue !== oldValue) {
						$scope.resetPager();
						$scope.searchResults = $filter('filter')($scope.rows, $scope.searchIn);
					}
				});

				$scope.$watch('switchableColumns', function(newValue, oldValue) {
					if (newValue !== null && newValue !== oldValue) {
						$scope.resetSelectedColumn();
					}
				}, true);

				// ACTIONS ---

				$scope.isDisabled = function(key) {
					return inArray($scope.disabledComponents, key);
				};

				$scope.isSwitchable = function(key) {
					var switchable = false;
					angular.forEach($scope.switchableColumns, function(column) {
						if (column.id === key) {
							switchable = true;
						}
					});
					return switchable;
				};

				$scope.isSortCriteria = function(key) {
					return $scope.rowSortCriteria !== null ? key === $scope.rowSortCriteria : false;
				};

				$scope.sortBy = function(column) {
					if ($scope.rowSortEnabled &&
						$scope.headerLabelCallback(column) !== null &&
						$scope.headerLabelCallback(column) !== '') {
						if ($scope.rowSortCriteria === column) {
							$scope.rowSortOrderAscending = !$scope.rowSortOrderAscending;
						} else {
							$scope.rowSortCriteria = column;
						}
					}
				};

				$scope.searchIn = function(row) {
					if (!angular.isDefined($scope.search) || $scope.search === null || $scope.search === '') {
						return true;
					}
					var match = false;
					angular.forEach($scope.visibleColumns, function(column) {
						if (angular.isDefined(row[column]) && row[column] !== null) {

							if (angular.isObject(row[column]) && !angular.isArray(row[column])) {
								var deepMatch = false;
								angular.forEach(row[column], function(prop) {
									if (String(prop).toLowerCase().indexOf($scope.search.toLowerCase()) !== -1) {
										deepMatch = true;
									}
								});
								if (deepMatch === true) {
									match = true;
								}
							} else if (String(row[column]).toLowerCase().indexOf($scope.search.toLowerCase()) !== -1) {
								match = true;
							}

						}
					});
					return match;
				};

				$scope.filterColumns = function(column) {
					return !inArray($scope.visibleColumns, column.id);
				};

				$scope.addColumn = function(column) {
					$scope.visibleColumns.push(column);
					$scope.resetSelectedColumn();
				};

				$scope.removeColumn = function(column) {
					var columns = [];
					angular.forEach($scope.visibleColumns, function(col) {
						if (col !== column) {
							columns.push(col);
						}
					});
					$scope.visibleColumns = columns;
					$scope.resetSelectedColumn();
				};

				$scope.goToPage = function(page) {
					$scope.pager[$scope.PAGER_OFFSET] = $scope.pager[$scope.PAGER_LIMIT] * (page - 1);
					$scope.resetPager();
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
'	<div class="row" data-ng-show="!isDisabled(COMPONENTS_FILTER) || !isDisabled(COMPONENTS_SELECTOR)">' +
'		<div class="col-xs-12 col-sm-6">' +
'' +
'			<!-- FILTER -->' +
'			<div data-ng-show="!isDisabled(COMPONENTS_FILTER)">' +
'				<div class="form-group form-inline">' +
'					<div class="input-group col-xs-12 col-sm-8 col-md-6">' +
'						<input type="text" class="form-control" placeholder="{{ labels.SEARCH }}" data-ng-model="search">' +
'						<div class="input-group-addon"><span class="glyphicon glyphicon-search"></span></div>' +
'					</div>' +
'				</div>' +
'			</div>' +
'' +
'		</div>' +
'		<div class="col-xs-12 col-sm-6 col-md-6 col-lg-5 pull-right">' +
'' +
'			<!-- SELECTOR -->' +
'			<div data-ng-show="!isDisabled(COMPONENTS_SELECTOR)">' +
'				<div class="form-group pull-right" data-ng-show="selectedColumn !== null">' +
'					<div class="form-group">' +
'						<div class="button-form">' +
'							<label for="columnSelector">{{ labels.ADD_COLUMN }}</label>' +
'							<div class="input-group">' +
'								<select id="columnSelector"' +
'									class="add-select form-control"' +
'									data-ng-if="groupByProperty !== null"' +
'									data-ng-model="$parent.selectedColumn"' +
'									data-ng-options="' +
'										column.id as headerLabelCallback(column.id)' +
'											group by {{groupByProperty}} for column in switchableColumns |' +
'										filter:filterColumns |' +
'										orderBy:orderByProperty">' +
'								</select>' +
'								<select id="columnSelector"' +
'									class="add-select form-control"' +
'									data-ng-if="groupByProperty === null"' +
'									data-ng-model="$parent.selectedColumn"' +
'									data-ng-options="' +
'										column.id as headerLabelCallback(column.id) for column in switchableColumns |' +
'										filter:filterColumns |' +
'										orderBy:orderByProperty">' +
'								</select>' +
'								<div class="stepper-buttons input-group-btn">' +
'									<button type="button" class="btn btn-primary" data-ng-click="addColumn(selectedColumn)">' +
'										<i class="glyphicon glyphicon-plus"></i>' +
'									</button>' +
'								</div>' +
'							</div>' +
'						</div>' +
'					</div>' +
'				</div>' +
'			</div>' +
'' +
'		</div>' +
'	</div>' +
'' +
'	<!-- TABLE -->' +
'	<div class="row" data-ng-show="!isDisabled(COMPONENTS_TABLE)">' +
'		<div class="col-xs-12">' +
'			<div class="table-responsive table-data">' +
'				<table class="table table-striped form-group">' +
'					<thead>' +
'						<tr>' +
'							<th class="{{columnClassCallback(headers, column, true)}} sortable"' +
'								data-ng-repeat="column in headers | orderObjectBy:visibleColumns:true"' +
'								data-ng-if="rowSortEnabled"' +
'								data-ng-class="{sort: isSortCriteria(column)}">' +
'								<a class="header" title="{{ labels.SORT }}"' +
'								   data-ng-click="sortBy(column)">{{headerLabelCallback(column)}}</a>' +
'								<a class="sort" title="{{ labels.SORT }}"' +
'								   data-ng-if="isSortCriteria(column) && rowSortOrderAscending"' +
'								   data-ng-click="sortBy(column)"><span' +
'									class="glyphicon glyphicon-sort-by-alphabet"></span></a>' +
'								<a class="sort" title="{{ labels.SORT }}"' +
'								   data-ng-if="isSortCriteria(column) && !rowSortOrderAscending"' +
'								   data-ng-click="sortBy(column)"><span' +
'									class="glyphicon glyphicon-sort-by-alphabet-alt"></span></a>' +
'								<a class="unsort" title="{{ labels.SORT }}"' +
'									data-ng-if="!isSortCriteria(column) && headerLabelCallback(column) !== null"' +
'									data-ng-click="sortBy(column)"><span' +
'									class="glyphicon glyphicon-sort"></span></a>' +
'								<a class="operation" title="{{ labels.REMOVE_COLUMN }}"' +
'								   data-ng-if="isSwitchable(column)"' +
'								   data-ng-click="removeColumn(column)"><span' +
'									class="glyphicon glyphicon-minus-sign"></span></a>' +
'							</th>' +
'							<th class="{{columnClassCallback(headers, column, true)}}"' +
'								data-ng-repeat="column in headers | orderObjectBy:visibleColumns:true"' +
'								data-ng-if="!rowSortEnabled">' +
'								{{headerLabelCallback(column)}}' +
'								<a class="operation" data-ng-if="isSwitchable(column)" data-ng-click="removeColumn(column)"><span' +
'									class="glyphicon glyphicon-minus-sign"></span></a>' +
'							</th>' +
'							<th data-ng-if="actionList.length">' +
'								{{headerLabelCallback(\'actions\')}}' +
'							</th>' +
'						</tr>' +
'					</thead>' +
'					<tbody>' +
'						<!-- operationsMode: data -->' +
'						<tr data-ng-if="operationsMode === OPERATIONS_MODE_DATA"' +
'							data-ng-repeat="row in rows">' +
'							<td data-ng-repeat="column in row | orderObjectBy:visibleColumns:true"' +
'								class="{{columnClassCallback(row, column, false)}}">' +
'								<span data-ng-bind-html="cellRenderer(row, column)"></span>' +
'							</td>' +
'							<td data-ng-if="row && actionList.length">' +
'								<div class="btn-group" role="group">' +
'									<a data-ng-repeat="item in actionList"' +
'										class="btn-link"' +
'										data-ng-href="{{item.getLink(row)}}"' +
'										title="{{item.label}}">' +
'										<span class="{{item.icon}}" aria-hidden="true"></span>' +
'									</a>' +
'								</div>' +
'							</td>' +
'						</tr>' +
'						<!-- operationsMode: view -->' +
'						<tr data-ng-if="operationsMode === OPERATIONS_MODE_VIEW"' +
'							data-ng-repeat="' +
'								row in rows |' +
'								filter:searchIn |' +
'								orderBy:rowSortCriteria:!rowSortOrderAscending |' +
'								slice:pager[PAGER_OFFSET]:pager[PAGER_LIMIT]">' +
'							<td data-ng-repeat="column in row | orderObjectBy:visibleColumns:true"' +
'								class="{{columnClassCallback(row, column, false)}}">' +
'								<span data-ng-bind-html="cellRenderer(row, column)"></span>' +
'							</td>' +
'							<td data-ng-if="row && actionList.length">' +
'								<div class="btn-group" role="group">' +
'									<a data-ng-repeat="item in actionList"' +
'										class="btn-link"' +
'										data-ng-href="{{item.getLink(row)}}"' +
'										title="{{item.label}}">' +
'										<span class="{{item.icon}}" aria-hidden="true"></span>' +
'									</a>' +
'								</div>' +
'							</td>' +
'						</tr>' +
'						<tr data-ng-if="' +
'							operationsMode === OPERATIONS_MODE_VIEW &&' +
'							(rows |' +
'								filter:searchIn |' +
'								orderBy:rowSortCriteria:!rowSortOrderAscending |' +
'								slice:pager[PAGER_OFFSET]:pager[PAGER_LIMIT]).length === 0">' +
'							<td colspan="{{(rows[0] | orderObjectBy:visibleColumns:true).length + 1}}">' +
'								{{ labels.NO_ENTRIES }}' +
'							</td>' +
'						</tr>' +
'					</tbody>' +
'				</table>' +
'			</div>' +
'		</div>' +
'	</div>' +
'' +
'	<!-- PAGER -->' +
'	<div class="row" data-ng-show="!isDisabled(COMPONENTS_PAGER) && pager !== null">' +
'		<div class="col-xs-12 col-sm-6">' +
'			<div class="btn-group form-group" role="group" data-ng-if="pages.length > 1">' +
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
'' +
'</div>' +
'');
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
 * <p>
 *   The optional property toggleBroadcast is used to execute events from the $rootScope. For example
 *   if the menu is inside an opened sidebar the event is used to close
 *   the sidebar (if the current path-route is the same as in the clicked link).
 * </p>
 * @example
 * &lt;div data-main-menu data-configuration="menuConfiguration"&gt;&lt;/div&gt;
 * @example
 * angular.module('exampleApp', ['keta.directives.MainMenu', 'keta.shared'])
 *     .controller('ExampleController', function($scope, ketaSharedConfig) {
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
 *             toggleBroadcast: ketaSharedConfig.EVENTS.TOGGLE_SIDEBAR_LEFT
 *         };
 *
 *     });
 */

angular.module('keta.directives.MainMenu', [])
	.directive('mainMenu', function MainMenuDirective($location, $rootScope) {
		return {
			restrict: 'EA',
			replace: true,
			scope: {
				configuration: '='
			},
			templateUrl: '/components/directives/main-menu.html',
			link: function(scope) {

				scope.compactMode = angular.isDefined(scope.configuration.compactMode) ?
					scope.configuration.compactMode : false;

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

					if (scope.compactMode === true) {
						return currentMenuLevelParts[1] === locationLevelParts[1];
					}

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
					// close sidebar when route-links (of current route and menu-entry) are equal
					if ($location.path() === menuEntry.link &&
						angular.isDefined(scope.configuration.toggleBroadcast)) {
						$event.stopPropagation();
						$rootScope.$broadcast(scope.configuration.toggleBroadcast);
					}
					// trigger expand-functionality only when navigation is shown in tablet/desktop mode
					if (scope.compactMode === false) {
						if (angular.isArray(menuEntry.items) && menuEntry.items.length > 0) {
							// prevent route-redirect when clicking an expand-menu-entry
							$event.preventDefault();
							if (angular.isUndefined(menuEntry.expanded) || menuEntry.expanded === false) {
								menuEntry.expanded = true;
							} else {
								menuEntry.expanded = !menuEntry.expanded;
							}
						}
					// compact mode
					} else if (angular.isArray(menuEntry.items) && menuEntry.items.length > 0) {
						// Redirect to first sub-entry because the parent-route should
						// not be accessible directly.
						$event.preventDefault();
						$location.path(menuEntry.items[0].link);
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
						bodyElem.toggleClass(
							ketaSharedConfig.SIDEBAR.CSS_OFFCANVAS + '-' + scope.configuration.position
						);
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
					if (bodyElem.hasClass(
							ketaSharedConfig.SIDEBAR.CSS_OFFCANVAS + '-' + scope.configuration.position
						)) {
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
							deviceClasses: [ketaSharedConfig.DEVICE_CLASSES.ENERGY_MANAGER]
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
 *     .controller('ExampleController', function($scope) {
 *
 *         // return object values in given order (all other values are dismissed)
 *         $scope.orderedProps = $filter('orderObjectBy')($scope.row, ['col1', 'col2']);
 *
 *         // return object keys in given order (all other keys are dismissed)
 *         $scope.orderedProps = $filter('orderObjectBy')($scope.row, ['col1', 'col2'], true);
 *
 *     });
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
					sorted.push(returnKey ? field : input[field]);
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
 *     .controller('ExampleController', function($scope) {
 *
 *         // extract 5 elements starting at offset 0
 *         $scope.pagedRows = $filter('slice')($scope.rows, 0, 5);
 *
 *     });
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
 *     .controller('ExampleController', function($scope) {
 *
 *         $scope.value = $filter('unit')(1234.56, {unit: 'W', precision: 1, isBytes: false});
 *
 *     });
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

			var sizes = isBytes ? ['Bytes', 'KB', 'MB', 'GB', 'TB'] : ['', 'k', 'M', 'G', 'T'];

			if (unit === ketaSharedConfig.UNITS.EURO ||
				unit === ketaSharedConfig.UNITS.KILOMETER ||
				unit === ketaSharedConfig.UNITS.DOLLAR ||
				unit === ketaSharedConfig.UNITS.POUND) {
				return $filter('number')(input, precision) + ' ' + unit;
			}

			if (angular.isNumber(input)) {
				var multiplicator = input < 0 ? -1 : 1;
				var oneKiloByte = 1024;
				var oneKilo = 1000;
				var parseBase = 10;
				input *= multiplicator;
				if (input >= 1) {
					var i = parseInt(
						Math.floor(Math.log(input) / Math.log(isBytes ? oneKiloByte : oneKilo)),
						parseBase
					);
					input = $filter('number')(
						input / Math.pow(isBytes ? oneKiloByte : oneKilo, i) * multiplicator,
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
 * @copyright Kiwigrid GmbH 2014-2015
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
			 * @returns {void} returns nothing
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
			 * @returns {promise} Promise which is resolved when query is returned
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
				var refreshUrl = AppContext.get('oauth.refreshTokenPath') || '/refreshAccessToken';
				return $http({
					method: 'GET',
					url: refreshUrl
				});
			}

		};

		return api;

	});

// source: dist/services/app-context.js
/**
 * @name keta.services.AppContext
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
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
		var appContext = angular.isDefined(window.appContext) ? window.appContext : {};

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
		 * @returns {*} Object extracted from AppContext
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

// source: dist/services/application-set.js
/**
 * @name keta.services.ApplicationSet
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.ApplicationSet
 * @description ApplicationSet Provider
 */

angular.module('keta.services.ApplicationSet',
	[
		'keta.services.Application'
	])

	/**
	 * @class ApplicationSetProvider
	 * @propertyOf keta.services.ApplicationSet
	 * @description ApplicationSet Provider
	 */
	.provider('ApplicationSet', function ApplicationSetProvider() {

		var DEFAULT_OFFSET = 0;
		var DEFAULT_LIMIT = 50;

		this.$get = function ApplicationSetService(
			$q, $rootScope, $log,
			Application, EventBusDispatcher, EventBusManager) {

			/**
			 * @class ApplicationSetInstance
			 * @propertyOf ApplicationSetProvider
			 * @description ApplicationSet Instance
			 * @param {EventBus} givenEventBus eventBus to use for ApplicationSetInstance
			 */
			var ApplicationSetInstance = function(givenEventBus) {

				// keep reference
				var that = this;

				// save EventBus instance
				var eventBus = givenEventBus;

				// internal params object
				var params = {};

				/**
				 * @name filter
				 * @function
				 * @memberOf ApplicationSetInstance
				 * @description
				 * <p>
				 *   Adds a filter before ApplicationSet query is sent to EventBus.
				 * </p>
				 * @param {Object} filter filter to use
				 * @returns {ApplicationSetInstance} ApplicationSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.ApplicationSet'])
				 *     .controller('ExampleController', function(ApplicationSet) {
				 *         ApplicationSet.create(eventBus)
				 *             .filter({
				 *                 userId: 'login'
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
				 * @memberOf ApplicationSetInstance
				 * @description
				 * <p>
				 *   Adds a projection before ApplicationSet query is sent to EventBus.
				 * </p>
				 * @param {Object} projection projection to use
				 * @returns {ApplicationSetInstance} ApplicationSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.ApplicationSet'])
				 *     .controller('ExampleController', function(ApplicationSet) {
				 *         ApplicationSet.create(eventBus)
				 *             .filter({
				 *                 userId: 'login'
				 *             })
				 *             .project({
				 *                 appId: 1
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
				 * @memberOf ApplicationSetInstance
				 * @description
				 * <p>
				 *   Adds a sorting before ApplicationSet query is sent to EventBus.
				 * </p>
				 * @param {Object} sorting sorting to use
				 * @returns {ApplicationSetInstance} ApplicationSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.ApplicationSet'])
				 *     .controller('ExampleController', function(ApplicationSet) {
				 *         ApplicationSet.create(eventBus)
				 *             .filter({
				 *                 userId: 'login'
				 *             })
				 *             .sort({
				 *                 'appId': 1
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
				 * @memberOf ApplicationSetInstance
				 * @description
				 * <p>
				 *   Adds a pagination before ApplicationSet query is sent to EventBus.
				 * </p>
				 * @param {Object} pagination pagination to use
				 * @returns {ApplicationSetInstance} ApplicationSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.ApplicationSet'])
				 *     .controller('ExampleController', function(ApplicationSet) {
				 *         ApplicationSet.create(eventBus)
				 *             .filter({
				 *                 userId: 'login'
				 *             })
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
						params.offset = angular.isDefined(pagination.offset) ? pagination.offset : DEFAULT_OFFSET;
						params.limit = angular.isDefined(pagination.limit) ? pagination.limit : DEFAULT_LIMIT;
					} else {
						params.offset = DEFAULT_OFFSET;
						params.limit = DEFAULT_LIMIT;
					}
					return that;
				};

				/**
				 * @name query
				 * @function
				 * @memberOf ApplicationSetInstance
				 * @description
				 * <p>
				 *   Finally executes ApplicationSet query by sending it to the associated EventBus instance.
				 * </p>
				 * @returns {promise} Promise which is resolved when query is returned
				 * @example
				 * angular.module('exampleApp', ['keta.services.ApplicationSet'])
				 *     .controller('ExampleController', function(ApplicationSet) {
				 *         ApplicationSet.create(eventBus)
				 *             .filter({
				 *                 userId: 'login'
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
				that.query = function() {
					var deferred = $q.defer();

					EventBusDispatcher.send(eventBus, 'appservice', {
						action: 'getAppsInfo',
						params: params
					}, function(reply) {
						if (reply) {
							// inject used params
							reply.params = params;

							if (reply.code === EventBusDispatcher.RESPONSE_CODE_OK) {

								// create ApplicationInstances
								if (angular.isDefined(reply.result) &&
									angular.isDefined(reply.result.items)) {
									angular.forEach(reply.result.items, function(item, index) {
										reply.result.items[index] = Application.create(eventBus, item);
									});
								}

								// log if in debug mode
								if (EventBusManager.inDebugMode()) {
									$log.request([{
										action: 'getUserApplications',
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
			 * @class ApplicationSet
			 * @propertyOf ApplicationSetProvider
			 * @description ApplicationSet Service
			 */
			var api = {

				/**
				 * @function
				 * @memberOf ApplicationSet
				 * @description
				 * <p>
				 *   Creates an ApplicationSetInstance with given EventBus instance.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance to use for communication
				 * @returns {ApplicationSetInstance} ApplicationSetInstance created
				 * @example
				 * angular.module('exampleApp', ['keta.services.ApplicationSet'])
				 *     .controller('ExampleController', function(ApplicationSet) {
				 *         var applicationSet = ApplicationSet.create(eventBus);
				 *     });
				 */
				create: function(eventBus) {
					return new ApplicationSetInstance(eventBus);
				},

				/**
				 * @function
				 * @memberOf ApplicationSet
				 * @description
				 * <p>
				 *   Returns index of given Application in ApplicationSet by comparing app IDs.
				 * </p>
				 * @param {ApplicationSetInstance} set ApplicationSetInstance to search in
				 * @param {ApplicationInstance} application ApplicationInstance to search for
				 * @returns {number} index
				 * @example
				 * angular.module('exampleApp', ['keta.services.ApplicationSet'])
				 *     .controller('ExampleController', function(ApplicationSet) {
				 *         ApplicationSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 // index equals 0 after the call
				 *                 var index = ApplicationSet.indexOf(reply, reply.result.items[0]);
				 *             });
				 *     });
				 */
				indexOf: function(set, application) {
					var index = -1;
					if (angular.isDefined(set.result) &&
						angular.isDefined(set.result.items)) {
						angular.forEach(set.result.items, function(item, key) {
							if (item.appId === application.appId) {
								index = key;
							}
						});
					}
					return index;
				},

				/**
				 * @function
				 * @memberOf ApplicationSet
				 * @description
				 * <p>
				 *   Returns number of applications in given ApplicationSet.
				 * </p>
				 * @param {ApplicationSetInstance} set ApplicationSetInstance to search in
				 * @returns {number} number of applications
				 * @example
				 * angular.module('exampleApp', ['keta.services.ApplicationSet'])
				 *     .controller('ExampleController', function(ApplicationSet) {
				 *         ApplicationSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 // length equals number of applications in ApplicationSet
				 *                 var length = ApplicationSet.length(reply);
				 *             });
				 *     });
				 */
				length: function(set) {
					var length =
						angular.isDefined(set.result) &&
						angular.isDefined(set.result.items) &&
						angular.isArray(set.result.items) ? set.result.items.length : 0;
					return length;
				},

				/**
				 * @function
				 * @memberOf ApplicationSet
				 * @description
				 * <p>
				 *   Returns application in given ApplicationSet by specified index.
				 * </p>
				 * @param {ApplicationSetInstance} set ApplicationSetInstance to search in
				 * @param {number} index Index of application to return
				 * @returns {ApplicationInstance} ApplicationInstance retrieved from set
				 * @example
				 * angular.module('exampleApp', ['keta.services.ApplicationSet'])
				 *     .controller('ExampleController', function(ApplicationSet) {
				 *         ApplicationSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 // application equals first item after the call
				 *                 var application = ApplicationSet.get(reply, 0);
				 *             });
				 *     });
				 */
				get: function(set, index) {
					var application =
						angular.isDefined(set.result) &&
						angular.isDefined(set.result.items) &&
						angular.isDefined(set.result.items[index]) ? set.result.items[index] : null;
					return application;
				},

				/**
				 * @function
				 * @memberOf ApplicationSet
				 * @description
				 * <p>
				 *   Returns all applications in given ApplicationSet.
				 * </p>
				 * @param {ApplicationSetInstance} set ApplicationSetInstance to search in
				 * @returns {Array} All ApplicationInstances retrieved from set
				 * @example
				 * angular.module('exampleApp', ['keta.services.ApplicationSet'])
				 *     .controller('ExampleController', function(ApplicationSet) {
				 *         ApplicationSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 var applications = ApplicationSet.getAll(reply);
				 *             });
				 *     });
				 */
				getAll: function(set) {
					var applications =
						angular.isDefined(set.result) &&
						angular.isDefined(set.result.items) ? set.result.items : [];
					return applications;
				}

			};

			return api;

		};

	});

// source: dist/services/application.js
/**
 * @name keta.services.Application
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.Application
 * @description Application Provider
 */

angular.module('keta.services.Application',
	[
		'keta.services.EventBusDispatcher',
		'keta.services.EventBusManager',
		'keta.services.Logger'
	])

	/**
	 * @class ApplicationProvider
	 * @propertyOf keta.services.Application
	 * @description Application Provider
	 */
	.provider('Application', function ApplicationProvider() {

		this.$get = function ApplicationService() {

			/**
			 * @class ApplicationInstance
			 * @propertyOf Application
			 * @description Application Instance
			 * @param {EventBus} givenEventBus eventBus to use for ApplicationInstance
			 * @param {Object} properties Properties to inject into ApplicationInstance
			 */
			var ApplicationInstance = function(givenEventBus, properties) {

				// keep reference
				var that = this;

				// save EventBus instance
				// var eventBus = givenEventBus;

				// populate properties
				angular.forEach(properties, function(value, key) {
					that[key] = value;

					// save copy under $pristine
					if (!angular.isDefined(that.$pristine)) {
						that.$pristine = {};
					}

					that.$pristine[key] = angular.copy(value);
				});

			};

			/**
			 * @class Application
			 * @propertyOf ApplicationProvider
			 * @description Application Service
			 */
			var api = {

				/**
				 * @function
				 * @memberOf Application
				 * @description
				 * <p>
				 *   Creates an ApplicationInstance with given EventBus instance and properties.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance to use for communication
				 * @param {Object} properties Properties to set upon UserInstance creation
				 * @returns {ApplicationInstance} ApplicationInstance created
				 * @example
				 * angular.module('exampleApp', ['keta.services.Application'])
				 *     .controller('ExampleController', function(Application) {
				 *         var application = Application.create(eventBus, {
				 *             appId: 'company.app',
				 *             entryUri: 'https://...',
				 *             redirectUri: 'https://...',
				 *             iconUri: 'https://...',
				 *             names: {
				 *                 en: 'Company App',
				 *                 de: 'Firmenanwendung'
				 *             }
				 *         });
				 *     });
				 */
				create: function(eventBus, properties) {
					return new ApplicationInstance(eventBus, properties);
				}

			};

			return api;

		};

	});

// source: dist/services/device-event.js
/**
 * @name keta.services.DeviceEvent
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
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
			 * @param {string} givenType DeviceEvent type
			 * @param {DeviceInstance} givenDevice DeviceInstance to be affected by event
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
				 * @returns {string} type
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
				 * @returns {DeviceInstance} device
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
				 * @returns {DeviceEventInstance} DeviceEventInstance created
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
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.DeviceSet
 * @description DeviceSet Provider
 */

angular.module('keta.services.DeviceSet',
	[
		'keta.services.Device',
		'keta.services.DeviceEvent'
	])

	/**
	 * @class DeviceSetProvider
	 * @propertyOf keta.services.DeviceSet
	 * @description DeviceSet Provider
	 */
	.provider('DeviceSet', function DeviceSetProvider() {

		var DEFAULT_OFFSET = 0;
		var DEFAULT_LIMIT = 50;

		this.$get = function DeviceSetService(
			$q, $rootScope, $log,
			Device, DeviceEvent, EventBusDispatcher, EventBusManager) {

			// api reference
			var api;

			/**
			 * @class DeviceSetInstance
			 * @propertyOf DeviceSetProvider
			 * @description DeviceSet Instance
			 * @param {EventBus} givenEventBus eventBus to use for DeviceSetInstance
			 */
			var DeviceSetInstance = function(givenEventBus) {

				// keep reference
				var that = this;

				// save EventBus instance
				var eventBus = givenEventBus;

				// internal params object
				var params = {};

				// automatically register device set listener
				var registerListener = false;

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
				 * @returns {DeviceSetInstance} DeviceSetInstance to chain
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
				 * @returns {DeviceSetInstance} DeviceSetInstance to chain
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
				 * @returns {DeviceSetInstance} DeviceSetInstance to chain
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
				 * @returns {DeviceSetInstance} DeviceSetInstance to chain
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
						params.offset = angular.isDefined(pagination.offset) ? pagination.offset : DEFAULT_OFFSET;
						params.limit = angular.isDefined(pagination.limit) ? pagination.limit : DEFAULT_LIMIT;
					} else {
						params.offset = DEFAULT_OFFSET;
						params.limit = DEFAULT_LIMIT;
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
				 * @returns {promise} DeviceSetInstance to chain
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
					registerListener = true;
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
				 * @returns {promise} Promise which is resolved when query is returned
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

					// register device set listener if configured
					if (registerListener) {

						// generate UUID
						var liveHandlerUUID = 'CLIENT_' + EventBusDispatcher.generateUUID();

						// register handler under created UUID
						EventBusDispatcher.registerHandler(eventBus, liveHandlerUUID, function(event) {

							// process event using sync
							api.sync(set, DeviceEvent.create(event.type, event.value), eventBus);

							// log if in debug mode
							if (EventBusManager.inDebugMode()) {
								$log.event([event], $log.ADVANCED_FORMATTER);
							}

						});

						// register device set listener
						EventBusDispatcher.send(eventBus, 'deviceservice', {
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

					}

					EventBusDispatcher.send(eventBus, 'deviceservice', {
						action: 'getDevices',
						params: params
					}, function(reply) {
						if (reply) {
							// inject used params
							reply.params = params;

							if (reply.code === EventBusDispatcher.RESPONSE_CODE_OK) {

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
			api = {

				/**
				 * @function
				 * @memberOf DeviceSet
				 * @description
				 * <p>
				 *   Creates a DeviceSetInstance with given EventBus instance.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance to use for communication
				 * @returns {DeviceSetInstance} DeviceSetInstance created
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
					if (angular.isDefined(set.result) &&
						angular.isDefined(set.result.items)) {
						angular.forEach(set.result.items, function(item, key) {
							if (item.guid === device.guid) {
								index = key;
							}
						});
					}
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
					var length =
						angular.isDefined(set.result) &&
						angular.isDefined(set.result.items) &&
						angular.isArray(set.result.items) ? set.result.items.length : 0;
					return length;
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
				 * @returns {DeviceInstance} DeviceInstance retrieved from set
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
					var device =
						angular.isDefined(set.result) &&
						angular.isDefined(set.result.items) &&
						angular.isDefined(set.result.items[index]) ? set.result.items[index] : null;
					return device;
				},

				/**
				 * @function
				 * @memberOf DeviceSet
				 * @description
				 * <p>
				 *   Returns all devices in given DeviceSet.
				 * </p>
				 * @param {DeviceSetInstance} set DeviceSetInstance to search in
				 * @returns {Array} All DeviceInstances retrieved from set
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
					var devices =
						angular.isDefined(set.result) &&
						angular.isDefined(set.result.items) ? set.result.items : [];
					return devices;
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
				 * @param {EventBus} eventBus EventBus instance to use for communication
				 * @returns {void} returns nothing
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
				sync: function(set, event, eventBus) {

					var modified = false;
					var device = Device.create(eventBus, event.getDevice());

					if (event.getType() === DeviceEvent.CREATED) {
						set.result.items.push(device);
						modified = true;
					} else if (event.getType() === DeviceEvent.DELETED) {
						set.result.items.splice(api.indexOf(set, device), 1);
						modified = true;
					} else if (event.getType() === DeviceEvent.UPDATED) {
						var index = api.indexOf(set, device);
						if (index !== -1) {
							angular.extend(api.get(set, index), device);
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
 * @copyright Kiwigrid GmbH 2014-2015
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

			// find device class recursively
			var findDeviceClass = function(deviceModel, deviceClassesArray) {
				if (angular.isDefined(deviceModel) && angular.isDefined(deviceModel.deviceClass)) {
					var parts = deviceModel.deviceClass.split('~');
					deviceClassesArray.push({
						deviceClass: parts[0],
						version: parts[1]
					});
					if (angular.isDefined(deviceModel.superclasses) &&
						angular.isArray(deviceModel.superclasses) &&
						deviceModel.superclasses.length > 0) {
						angular.forEach(deviceModel.superclasses, function(superclass) {
							findDeviceClass(superclass, deviceClassesArray);
						});
					}
				}
				return deviceClassesArray;
			};

			/**
			 * @class DeviceInstance
			 * @propertyOf Device
			 * @description Device Instance
			 * @param {EventBus} givenEventBus eventBus to use for DeviceInstance
			 * @param {Object} properties Properties to inject into DeviceInstance
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

					EventBusDispatcher.send(eventBus, 'deviceservice', message, function(reply) {

						// log if in debug mode
						if (EventBusManager.inDebugMode()) {
							$log.request([message, reply], $log.ADVANCED_FORMATTER);
						}

						if (reply.code === EventBusDispatcher.RESPONSE_CODE_OK) {
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
				 * @name $update
				 * @function
				 * @memberOf DeviceInstance
				 * @description
				 * <p>
				 *   Updates a remote DeviceInstance from local one the method is called on.
				 * </p>
				 * <p>
				 *   Only value changes in <code>tagValues</code> property will be recognized as changes.
				 * </p>
				 * @returns {promise} promise
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
				 *         device.$update()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 *     });
				 */
				that.$update = function() {

					// collect changes in tagValues property
					var changes = {
						tagValues: {}
					};

					angular.forEach(that.tagValues, function(tagValue, tagName) {
						if (!angular.isDefined(that.$pristine.tagValues[tagName]) ||
							!angular.equals(that.tagValues[tagName].value, that.$pristine.tagValues[tagName].value)) {
							changes.tagValues[tagName] = {};
							changes.tagValues[tagName].value = tagValue.value;
							changes.tagValues[tagName].oca = tagValue.oca;
						}
					});

					if (Object.keys(changes.tagValues).length) {
						var deferred = $q.defer();

						sendMessage({
							action: 'mergeDevice',
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
					}
					return returnRejectedPromise('No changes found');
				};

				/**
				 * @name $delete
				 * @function
				 * @memberOf DeviceInstance
				 * @description
				 * <p>
				 *   Deletes a remote DeviceInstance from local one the method is called on.
				 * </p>
				 * @returns {promise} promise
				 * @example
				 * angular.module('exampleApp', ['keta.services.Device'])
				 *     .controller('ExampleController', function(Device) {
				 *         var device = Device.create({
				 *             guid: 'guid'
				 *         });
				 *         device.$delete()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 *     });
				 */
				that.$delete = function() {
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
				 * @returns {DeviceInstance} DeviceInstance created
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
				},

				/**
				 * @function
				 * @memberOf Device
				 * @description
				 * <p>
				 *   Returns a device-classes array of objects containing the <code>deviceClass</code> and
				 *   <code>version</code> as separate keys.
				 *   The first entry is the most specific class followed by its superclasses (if there are any).
				 *   The highest array-index represents the most general device-class for this device.
				 * </p>
				 * <p>
				 *   The returned array can be used to map the device-class to a device-icon.<br>
				 *   A default-mapping is provided by <code>ketaSharedConfig.DEVICE_ICON_MAP</code>.
				 *   So every application can use another mapping if the default-one is not suitable.
				 * </p>
				 * @param {DeviceInstance} device Device to get device classes from
				 * @returns {Array} deviceClasses
				 * @example
				 * angular.module('exampleApp', ['keta.services.Device'])
				 *     .controller('ExampleController', function(Device) {
				 *         var device = Device.create({
				 *             guid: 'guid',
				 *             deviceModel: {
				 *                 deviceClass: 'specificDeviceClass~1.1.0.3',
				 *                 superclasses: [{
				 *                     deviceClass: 'generalDeviceClass~1.1.0.3',
				 *                     superclasses: []
				 *                 }]
				 *             }
				 *         });
				 *         var deviceClassesArray = Device.getDeviceClasses(device);
				 *     });
				 */
				getDeviceClasses: function(device) {
					var deviceClasses = [];
					if (angular.isDefined(device.deviceModel)) {
						deviceClasses = findDeviceClass(device.deviceModel, deviceClasses);
					}
					return deviceClasses;
				}

			};

			return api;

		};

	});

// source: dist/services/event-bus-dispatcher.js
/**
 * @name keta.services.EventBusDispatcher
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
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
			 * @returns {void} returns nothing
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
					$timeout.cancel(timeout);
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
				 * @returns {void} returns nothing
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
						} else if (angular.isFunction(replyHandler)) {
							replyHandler(reply);
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
				 * @returns {void} returns nothing
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
				 * @returns {void} returns nothing
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
				 * @returns {void} returns nothing
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
				 * @returns {void} returns nothing
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
							b = Math.random() * HEX_RANGE;
							return (a === 'y' ? b & BIT_SHIFT | BIT_HALF : b | 0).toString(HEX_RANGE);
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
 * @copyright Kiwigrid GmbH 2014-2015
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
		 * @returns {EventBusManagerProvider} EventBusManagerProvider to chain
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
		 * @returns {EventBusManagerProvider} EventBusManagerProvider to chain
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
		 * @returns {EventBusManagerProvider} EventBusManagerProvider to chain
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
			return angular.isDefined(eventBuses[eventBusId]) ? eventBuses[eventBusId] : null;
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
		 * @returns {void} returns nothing
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
		 * @returns {void} returns nothing
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
		 * @returns {Boolean} true if debug mode is enabled
		 * @example
		 * angular.module('exampleApp', ['keta.services.EventBusManager'])
		 *     .config(function(EventBusManagerProvider) {
		 *         if (EventBusManagerProvider.inDebugMode()) {
		 *             // do something useful
		 *         }
		 *     });
		 */
		this.inDebugMode = function() {
			return debug === true;
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
 * @copyright Kiwigrid GmbH 2014-2015
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
		 * @param {Object} givenConfig Config to use for EventBus
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
		 * @returns {EventBus} EventBus created
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
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.Logger
 * @description Logger Decorator
 */

/*eslint no-console:0*/

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
		 * @param {Object} $delegate delegated implementation
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
			 * @returns {void} returns nothing
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
					output += JSON.stringify(message, null, '\t') + '\n';
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
			 * @returns {void} returns nothing
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
			 * @returns {void} returns nothing
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
 * @copyright Kiwigrid GmbH 2014-2015
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
				 * @param {TagInstance} tag Tag to add
				 * @returns {TagSetInstance} TagSetInstance with added TagInstance
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
				 * @param {TagInstance} tag Tag to remove
				 * @returns {TagSetInstance} TagSetInstance with removed TagInstance
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
				 * @returns {TagSetInstance} TagSetInstance created
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
 * @copyright Kiwigrid GmbH 2014-2015
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
			 * @param {Object} properties Properties to inject into TagInstance
			 */
			var TagInstance = function(properties) {

				// guid of device tag belongs to
				var guid = angular.isDefined(properties.guid) ? properties.guid : null;

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
				var name = angular.isDefined(properties.name) ? properties.name : null;

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
					angular.isDefined(properties.sampleRate) && properties.sampleRate >= 5 ?
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
				 * @param {Object} properties Properties to inject into TagInstance
				 * @returns {TagInstance} TagInstance created
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

// source: dist/services/user-set.js
/**
 * @name keta.services.UserSet
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.UserSet
 * @description UserSet Provider
 */

angular.module('keta.services.UserSet',
	[
		'keta.services.User'
	])

	/**
	 * @class UserSetProvider
	 * @propertyOf keta.services.UserSet
	 * @description UserSet Provider
	 */
	.provider('UserSet', function UserSetProvider() {

		var DEFAULT_OFFSET = 0;
		var DEFAULT_LIMIT = 50;

		this.$get = function UserSetService(
			$q, $rootScope, $log,
			User, EventBusDispatcher, EventBusManager) {

			/**
			 * @class UserSetInstance
			 * @propertyOf UserSetProvider
			 * @description UserSet Instance
			 * @param {EventBus} givenEventBus eventBus to use for UserSetInstance
			 */
			var UserSetInstance = function(givenEventBus) {

				// keep reference
				var that = this;

				// save EventBus instance
				var eventBus = givenEventBus;

				// internal params object
				var params = {};

				/**
				 * @name filter
				 * @function
				 * @memberOf UserSetInstance
				 * @description
				 * <p>
				 *   Adds a filter before UserSet query is sent to EventBus.
				 * </p>
				 * @param {Object} filter filter to use
				 * @returns {UserSetInstance} UserSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.UserSet'])
				 *     .controller('ExampleController', function(UserSet) {
				 *         UserSet.create(eventBus)
				 *             .filter({
				 *                 userId: 'login'
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
				 * @memberOf UserSetInstance
				 * @description
				 * <p>
				 *   Adds a projection before UserSet query is sent to EventBus.
				 * </p>
				 * @param {Object} projection projection to use
				 * @returns {UserSetInstance} UserSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.UserSet'])
				 *     .controller('ExampleController', function(UserSet) {
				 *         UserSet.create(eventBus)
				 *             .project({
				 *                 userId: 1
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
				 * @memberOf UserSetInstance
				 * @description
				 * <p>
				 *   Adds a sorting before UserSet query is sent to EventBus.
				 * </p>
				 * @param {Object} sorting sorting to use
				 * @returns {UserSetInstance} UserSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.UserSet'])
				 *     .controller('ExampleController', function(UserSet) {
				 *         UserSet.create(eventBus)
				 *             .sort({
				 *                 'userId': 1
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
				 * @memberOf UserSetInstance
				 * @description
				 * <p>
				 *   Adds a pagination before UserSet query is sent to EventBus.
				 * </p>
				 * @param {Object} pagination pagination to use
				 * @returns {UserSetInstance} UserSetInstance to chain
				 * @example
				 * angular.module('exampleApp', ['keta.services.UserSet'])
				 *     .controller('ExampleController', function(UserSet) {
				 *         UserSet.create(eventBus)
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
						params.offset = angular.isDefined(pagination.offset) ? pagination.offset : DEFAULT_OFFSET;
						params.limit = angular.isDefined(pagination.limit) ? pagination.limit : DEFAULT_LIMIT;
					} else {
						params.offset = DEFAULT_OFFSET;
						params.limit = DEFAULT_LIMIT;
					}
					return that;
				};

				/**
				 * @name query
				 * @function
				 * @memberOf UserSetInstance
				 * @description
				 * <p>
				 *   Finally executes UserSet query by sending it to the associated EventBus instance.
				 * </p>
				 * @returns {promise} Promise which is resolved when query is returned
				 * @example
				 * angular.module('exampleApp', ['keta.services.UserSet'])
				 *     .controller('ExampleController', function(UserSet) {
				 *         UserSet.create(eventBus)
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

					EventBusDispatcher.send(eventBus, 'userservice', {
						action: 'getUsers',
						params: params
					}, function(reply) {
						if (reply) {
							// inject used params
							reply.params = params;

							if (reply.code === EventBusDispatcher.RESPONSE_CODE_OK) {

								// create UserInstances
								if (angular.isDefined(reply.result) &&
									angular.isDefined(reply.result.items)) {
									angular.forEach(reply.result.items, function(item, index) {
										reply.result.items[index] = User.create(eventBus, item);
									});
								}

								// log if in debug mode
								if (EventBusManager.inDebugMode()) {
									$log.request([{
										action: 'getUsers',
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
			 * @class UserSet
			 * @propertyOf UserSetProvider
			 * @description UserSet Service
			 */
			var api = {

				/**
				 * @function
				 * @memberOf UserSet
				 * @description
				 * <p>
				 *   Creates a UserSetInstance with given EventBus instance.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance to use for communication
				 * @returns {UserSetInstance} UserSetInstance created
				 * @example
				 * angular.module('exampleApp', ['keta.services.UserSet'])
				 *     .controller('ExampleController', function(UserSet) {
				 *         var userSet = UserSet.create(eventBus);
				 *     });
				 */
				create: function(eventBus) {
					return new UserSetInstance(eventBus);
				},

				/**
				 * @function
				 * @memberOf UserSet
				 * @description
				 * <p>
				 *   Returns index of given User in UserSet by comparing user IDs.
				 * </p>
				 * @param {UserSetInstance} set UserSetInstance to search in
				 * @param {UserInstance} user UserInstance to search for
				 * @returns {number} index
				 * @example
				 * angular.module('exampleApp', ['keta.services.UserSet'])
				 *     .controller('ExampleController', function(UserSet) {
				 *         UserSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 // index equals 0 after the call
				 *                 var index = UserSet.indexOf(reply, reply.result.items[0]);
				 *             });
				 *     });
				 */
				indexOf: function(set, user) {
					var index = -1;
					if (angular.isDefined(set.result) &&
						angular.isDefined(set.result.items)) {
						angular.forEach(set.result.items, function(item, key) {
							if (item.userId === user.userId) {
								index = key;
							}
						});
					}
					return index;
				},

				/**
				 * @function
				 * @memberOf UserSet
				 * @description
				 * <p>
				 *   Returns number of users in given UserSet.
				 * </p>
				 * @param {UserSetInstance} set UserSetInstance to search in
				 * @returns {number} number of users
				 * @example
				 * angular.module('exampleApp', ['keta.services.UserSet'])
				 *     .controller('ExampleController', function(UserSet) {
				 *         UserSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 // length equals number of users in UserSet
				 *                 var length = UserSet.length(reply);
				 *             });
				 *     });
				 */
				length: function(set) {
					var length =
						angular.isDefined(set.result) &&
						angular.isDefined(set.result.items) &&
						angular.isArray(set.result.items) ? set.result.items.length : 0;
					return length;
				},

				/**
				 * @function
				 * @memberOf UserSet
				 * @description
				 * <p>
				 *   Returns user in given UserSet by specified index.
				 * </p>
				 * @param {UserSetInstance} set UserSetInstance to search in
				 * @param {number} index Index of user to return
				 * @returns {UserInstance} UserInstance retrieved from set
				 * @example
				 * angular.module('exampleApp', ['keta.services.UserSet'])
				 *     .controller('ExampleController', function(UserSet) {
				 *         UserSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 // user equals first item after the call
				 *                 var user = UserSet.get(reply, 0);
				 *             });
				 *     });
				 */
				get: function(set, index) {
					var user =
						angular.isDefined(set.result) &&
						angular.isDefined(set.result.items) &&
						angular.isDefined(set.result.items[index]) ? set.result.items[index] : null;
					return user;
				},

				/**
				 * @function
				 * @memberOf UserSet
				 * @description
				 * <p>
				 *   Returns all users in given UserSet.
				 * </p>
				 * @param {UserSetInstance} set UserSetInstance to search in
				 * @returns {Array} All UserInstances retrieved from set
				 * @example
				 * angular.module('exampleApp', ['keta.services.UserSet'])
				 *     .controller('ExampleController', function(UserSet) {
				 *         UserSet.create(eventBus).query()
				 *             .then(function(reply) {
				 *                 var users = UserSet.getAll(reply);
				 *             });
				 *     });
				 */
				getAll: function(set) {
					var users =
						angular.isDefined(set.result) &&
						angular.isDefined(set.result.items) ? set.result.items : [];
					return users;
				}

			};

			return api;

		};

	});

// source: dist/services/user.js
/**
 * @name keta.services.User
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.User
 * @description User Provider
 */

angular.module('keta.services.User',
	[
		'keta.services.EventBusDispatcher',
		'keta.services.EventBusManager',
		'keta.services.Logger'
	])

	/**
	 * @class UserProvider
	 * @propertyOf keta.services.User
	 * @description User Provider
	 */
	.provider('User', function UserProvider() {

		this.$get = function UserService($q, $log, EventBusDispatcher, EventBusManager) {

			// send message and return promise
			var sendMessage = function(eventBus, message) {
				var deferred = $q.defer();

				EventBusDispatcher.send(eventBus, 'userservice', message, function(reply) {

					// log if in debug mode
					if (EventBusManager.inDebugMode()) {
						$log.request([message, reply], $log.ADVANCED_FORMATTER);
					}

					if (reply.code === EventBusDispatcher.RESPONSE_CODE_OK) {
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
			 * @class UserInstance
			 * @propertyOf User
			 * @description User Instance
			 * @param {EventBus} givenEventBus eventBus to use for UserInstance
			 * @param {Object} properties Properties to inject into UserInstance
			 */
			var UserInstance = function(givenEventBus, properties) {

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

				// find changes in depth
				var findDeepChanges = function(obj1, obj2) {
					var changes = {};
					angular.forEach(obj1, function(value, key) {
						if (angular.isObject(value) && !angular.isArray(value)) {
							if (!angular.isDefined(obj2[key])) {
								obj2[key] = {};
							}
							var deepChanges = findDeepChanges(obj1[key], obj2[key]);
							if (!angular.equals(deepChanges, {})) {
								changes[key] = {};
								angular.extend(changes[key], deepChanges);
							}
						} else if (!angular.equals(obj1[key], obj2[key])) {
							changes[key] = value;
						}
					});
					return changes;
				};

				/**
				 * @name $create
				 * @function
				 * @memberOf UserInstance
				 * @description
				 * <p>
				 *   Creates a remote UserInstance from local one the method is called on.
				 * </p>
				 * @returns {promise} promise
				 * @example
				 * angular.module('exampleApp', ['keta.services.User'])
				 *     .controller('ExampleController', function(User) {
				 *
				 *         var user = User.create({
				 *             userId: 'userId'
				 *         });
				 *
				 *         user.$create()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 *
				 *     });
				 */
				that.$create = function() {

					var cleanedUser = {};
					for (var el in that) {
						if (that.hasOwnProperty(el) && !angular.isFunction(that[el]) && el !== '$pristine') {
							cleanedUser[el] = angular.copy(that[el]);
						}
					}

					return sendMessage(eventBus, {
						action: 'createUser',
						params: {
							userId: cleanedUser.userId
						},
						body: cleanedUser
					});

				};

				/**
				 * @name $update
				 * @function
				 * @memberOf UserInstance
				 * @description
				 * <p>
				 *   Updates a remote UserInstance from local one the method is called on.
				 * </p>
				 * @returns {promise} promise
				 * @example
				 * angular.module('exampleApp', ['keta.services.User'])
				 *     .controller('ExampleController', function(User) {
				 *
				 *         var user = User.create({
				 *             userId: 'john.doe',
				 *             channel: 'channel',
				 *             givenName: 'John',
				 *             familyName: 'Doe',
				 *             email: 'john.doe@test.com',
				 *             address: {
				 *                 street: 'Main Street',
				 *                 number: '100 E',
				 *                 city: 'Phoenix',
				 *                 country: 'USA',
				 *                 zip: '85123'
				 *             },
				 *             properties: {
				 *                 position: 'left'
				 *             }
				 *         });
				 *
				 *         user.email = 'john.doe@kiwigrid.com';
				 *         delete user.properties.position;
				 *
				 *         user.$update()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 *
				 *     });
				 */
				that.$update = function() {

					// create cleaned copies
					var cleanedUser = angular.copy(that);
					var cleanedUserOriginal = angular.copy(that.$pristine);
					delete cleanedUser.$pristine;
					delete cleanedUser.$create;
					delete cleanedUser.$update;
					delete cleanedUser.$delete;

					// collect changes
					// changes on second level are not merged and therefor objects have to be transmitted in full
					// except "properties", which are merged on second level too
					var changes = {};

					angular.forEach(cleanedUser, function(value, key) {
						var objChanges = {};
						if (key === 'properties') {
							if (!angular.isDefined(cleanedUserOriginal[key])) {
								cleanedUserOriginal[key] = {};
							}
							objChanges = findDeepChanges(cleanedUser[key], cleanedUserOriginal[key]);
							if (!angular.equals(objChanges, {})) {
								angular.forEach(objChanges, function(propValue, propKey) {
									if (!angular.isDefined(changes.properties)) {
										changes.properties = {};
									}
									changes.properties[propKey] = cleanedUser.properties[propKey];
								});
							}
						} else {
							if (!angular.isDefined(cleanedUserOriginal[key])) {
								cleanedUserOriginal[key] = {};
							}
							if (angular.isObject(value) && !angular.isArray(value)) {
								objChanges = findDeepChanges(cleanedUser[key], cleanedUserOriginal[key]);
								if (!angular.equals(objChanges, {})) {
									changes[key] = value;
								}
							} else if (cleanedUser[key] !== cleanedUserOriginal[key]) {
								changes[key] = value;
							}
						}
					});

					if (Object.keys(changes).length) {
						var deferred = $q.defer();

						sendMessage(eventBus, {
							action: 'mergeUser',
							params: {
								userId: that.userId
							},
							body: changes
						}).then(function(reply) {

							// reset $pristine copies after success
							that.$pristine = {};
							angular.forEach(that, function(value, key) {
								if (!angular.isFunction(that[key])) {
									that.$pristine[key] = angular.copy(that[key]);
								}
							});

							deferred.resolve(reply);
						}, function(reply) {
							deferred.reject(reply);
						});

						return deferred.promise;
					}

					return returnRejectedPromise('No changes found');
				};

				/**
				 * @name $delete
				 * @function
				 * @memberOf UserInstance
				 * @description
				 * <p>
				 *   Deletes a remote UserInstance from local one the method is called on.
				 * </p>
				 * @returns {promise} promise
				 * @example
				 * angular.module('exampleApp', ['keta.services.User'])
				 *     .controller('ExampleController', function(User) {
				 *
				 *         var user = User.create({
				 *             userId: 'userId'
				 *         });
				 *
				 *         user.$delete()
				 *             .then(function(reply) {
				 *                 // success handler
				 *                 // ...
				 *             }, function(reply) {
				 *                 // error handler
				 *                 // ...
				 *             });
				 *
				 *     });
				 */
				that.$delete = function() {
					return sendMessage(eventBus, {
						action: 'deleteUser',
						params: {
							userId: that.userId
						}
					});
				};

			};

			/**
			 * @class User
			 * @propertyOf UserProvider
			 * @description User Service
			 */
			var api = {

				/**
				 * @function
				 * @memberOf User
				 * @description
				 * <p>
				 *   Creates a UserInstance with given EventBus instance and properties.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance to use for communication
				 * @param {Object} properties Properties to set upon UserInstance creation
				 * @returns {UserInstance} created UserInstance
				 * @example
				 * angular.module('exampleApp', ['keta.services.User'])
				 *     .controller('ExampleController', function(User) {
				 *         var user = User.create(eventBus, {
				 *             userId: 'john.doe',
				 *             channel: 'channel',
				 *             givenName: 'John',
				 *             familyName: 'Doe',
				 *             email: 'john.doe@test.com',
				 *             address: {
				 *                 street: 'Main Street',
				 *                 number: '100 E',
				 *                 city: 'Phoenix',
				 *                 country: 'USA',
				 *                 zip: '85123'
				 *             }
				 *         });
				 *     });
				 */
				create: function(eventBus, properties) {
					return new UserInstance(eventBus, properties);
				},

				/**
				 * @function
				 * @memberOf User
				 * @description
				 * <p>
				 *   Returns the channel name for given channel id.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance to use for communication
				 * @param {String} channelId Channel id to retrieve.
				 * @returns {String} channel name
				 * @example
				 * angular.module('exampleApp', ['keta.services.User'])
				 *     .controller('ExampleController', function(User) {
				 *         User.getChannel(eventBus, 'channel-1')
				 *             .then(function(reply) {
				 *                 // reply is channel name
				 *             });
				 *     });
				 */
				getChannel: function(eventBus, channelId) {
					var deferred = $q.defer();

					sendMessage(eventBus, {
						action: 'getChannel',
						params: {
							channelId: channelId
						}
					}).then(function(reply) {
						deferred.resolve(reply);
					}, function(reply) {
						deferred.reject(reply);
					});

					return deferred.promise;
				},

				/**
				 * @function
				 * @memberOf User
				 * @description
				 * <p>
				 *   Returns the currently logged-in user.
				 * </p>
				 * @param {EventBus} eventBus EventBus instance to use for communication
				 * @returns {UserInstance} current logged-in user
				 * @example
				 * angular.module('exampleApp', ['keta.services.User'])
				 *     .controller('ExampleController', function(User) {
				 *         User.getCurrentUser(eventBus)
				 *             .then(function(reply) {
				 *                 // reply is current UserInstance
				 *             });
				 *     });
				 */
				getCurrent: function(eventBus) {
					var deferred = $q.defer();

					sendMessage(eventBus, {
						action: 'getCurrentUser'
					}).then(function(reply) {
						deferred.resolve(new UserInstance(eventBus, reply.result));
					}, function(reply) {
						deferred.reject(reply);
					});

					return deferred.promise;
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
		DEVICE_CLASSES: {
			ENERGY_MANAGER: 'com.kiwigrid.devices.em.EnergyManager',
			LOCATION: 'com.kiwigrid.devices.location.Location',
			PV_PLANT: 'com.kiwigrid.devices.pvplant.PVPlant'
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
		},
		DEVICE_ICON_MAP: {
			'com.kiwigrid.devices.batteryconverter.BatteryConverter': 'kiwigrid-device-icon-battery-converter',
			'com.kiwigrid.devices.plug.Plug': 'kiwigrid-device-icon-plug',
			'com.kiwigrid.devices.powermeter.PowerMeter': 'kiwigrid-device-icon-plug',
			'com.kiwigrid.devices.windturbine.WindTurbine': 'kiwigrid-device-icon-wind-turbine',
			'com.kiwigrid.devices.sensor.TemperatureSensor': 'kiwigrid-device-icon-temperature-sensor',
			'com.kiwigrid.devices.inverter.Inverter': 'kiwigrid-device-icon-inverter',
			'com.kiwigrid.devices.heatpump.HeatPump': 'kiwigrid-device-icon-smart-heat-pump',
			'com.kiwigrid.devices.microchp.MicroChpSystem': 'kiwigrid-device-icon-micro-combined-heat-pump',
			'com.kiwigrid.devices.ripplecontrolreceiver.RippleControlReceiver':
				'kiwigrid-device-icon-ripple-control-receiver',
			'com.kiwigrid.devices.smartheatpumps.SmartHeatPumps': 'kiwigrid-device-icon-smart-heat-pump',
			'com.kiwigrid.devices.pvplant.PVPlant': 'kiwigrid-device-icon-pv-plant'
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
		 * @returns {boolean} true if property exists
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
