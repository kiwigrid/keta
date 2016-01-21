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
 *     data-current-locale="currentLocale"
 *     data-label-add-column="labelAddColumn"
 *     data-disabled-components="disabledComponents"
 *     data-switchable-columns="switchableColumns"
 *     data-group-by-property="groupByProperty"
 *     data-order-by-property="orderByProperty"
 *     data-visible-columns="visibleColumns"
 *     data-header-label-callback="headerLabelCallback"
 *     data-operations-mode="operationsMode"
 *     data-row-sort-enabled="rowSortEnabled"
 *     data-row-sort-criteria="rowSortCriteria"
 *     data-row-sort-order-ascending="rowSortOrderAscending"
 *     data-unsortable-columns="unsortableColumns"
 *     data-action-list="actionList"
 *     data-cell-renderer="cellRenderer"
 *     data-column-class-callback="columnClassCallback"
 *     data-table-class-callback="tableClassCallback"
 *     data-row-class-callback="rowClassCallback"
 *     data-search-input-width-classes="searchInputWidthClasses"
 *     data-selector-width-classes="selectorWidthClasses"
 *     data-pager="pager"
 *     data-search="search"
 *     data-search-wait-ms="waitTime"
 *     data-search-results="searchResults"&gt;&lt;/div&gt;
 * @example
 * angular.module('exampleApp', ['keta.directives.ExtendedTable', 'keta.services.Device'])
 *     .controller('ExampleController', function(
 *         $scope,
 *         ExtendedTableConstants, ExtendedTableMessageKeys, DeviceConstants) {
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
 *         // override default-labels if necessary
 *         // get default labels
 *         $scope.labels = ExtendedTableMessageKeys;
 *
 *         // use case 1: overwrite specific key
 *         $scope.labels.de['__keta.directives.ExtendedTable_search'] = 'Finde';
 *
 *         // use case 2: add locale
 *         $scope.labels.fr = {
 *             '__keta.directives.ExtendedTable_search': 'Recherche',
 *             '__keta.directives.ExtendedTable_add_column': 'Ajouter colonne',
 *             '__keta.directives.ExtendedTable_remove_column': 'Retirer la colonne',
 *             '__keta.directives.ExtendedTable_sort': 'Sorte',
 *             '__keta.directives.ExtendedTable_no_entries': 'Pas d’entrées'
 *         };
 *
 *         // array of disabled components (default: everything except the table itself is disabled)
 *         $scope.disabledComponents = [
 *             // the table itself
 *             ExtendedTableConstants.COMPONENT.TABLE,
 *             // an input field to search throughout the full dataset
 *             ExtendedTableConstants.COMPONENT.FILTER,
 *             // a selector to add columns to table
 *             ExtendedTableConstants.COMPONENT.SELECTOR,
 *             // a pager to navigate through paged data
 *             ExtendedTableConstants.COMPONENT.PAGER
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
 *         $scope.operationsMode = ExtendedTableConstants.OPERATIONS_MODE.VIEW;
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
 *         // array of columns (empty by default) that should not be sorted
 *         $scope.unsortableColumns = ['idName'];
 *
 *         // Array of actions to render for each row.
 *         // getLink method will be used to construct a link with the help of the row object,
 *         // getLabel is used as callback to retrieve value for title-tag,
 *         // icon is used as icon-class for visualizing the action.
 *         // runAction is a callback-function that will be executed when the user clicks on
 *         // the corresponding button. To use this functionality it is necessary to provide the type-parameter
 *         // with the value 'action'.
 *         // type can have the values 'link' (a normal link with href-attribute will be rendered) or
 *         // 'action' (a link with ng-click attribute to execute a callback will be rendered).
 *         // For simplicity the type-property can be left out. In this case the directive renders
 *         // a normal link-tag (same as type 'link').
 *         // display is an optional callback to return condition for displaying action item based on given row
 *         $scope.actionList = [{
 *             getLink: function(row) {
 *                 return 'edit/' + row.guid;
 *             },
 *             getLabel: function() {
 *                 return 'Edit';
 *             },
 *             icon: 'glyphicon glyphicon-pencil',
 *             type: ExtendedTableConstants.ACTION_LIST_TYPE.LINK
 *         }, {
 *             runAction: function(row) {
 *                 console.log('action called with ', row);
 *             },
 *             getLabel: function() {
 *                 return 'Remove';
 *             },
 *             icon: 'glyphicon glyphicon-remove'
 *             type: ExtendedTableConstants.ACTION_LIST_TYPE.ACTION,
 *             display: function(row) {
 *                 return row.type !== 'EnergyManager';
 *             }
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
 *                 if (row.state === DeviceConstants.STATE.OK && !isHeader) {
 *                     columnClass+= ' state-success';
 *                 }
 *                 if (row.state === DeviceConstants.STATE.ERROR && !isHeader) {
 *                     columnClass+= ' state-warning';
 *                 }
 *                 if (row.state === DeviceConstants.STATE.FATAL && !isHeader) {
 *                     columnClass+= ' state-danger';
 *                 }
 *             }
 *             return columnClass;
 *         };
 *
 *         // callback method to return class attribute for each row
 *         $scope.rowClassCallback = function(row, isHeader) {
 *             var rowClass = 'row-is-selected';
 *             if (isHeader) {
 *                 rowClass += ' header-row';
 *             } else if (angular.isDefined(row.connected) && row.connected === true) {
 *                 rowClass += ' connected';
 *             }
 *             return rowClass;
 *         };
 *
 *         // callback method to return class array for table
 *         $scope.tableClassCallback = function() {
 *             return ['table-striped'];
 *         };
 *
 *         // bootstrap width classes to define the size of the search input
 *         $scope.searchInputWidthClasses = 'col-xs-12 col-sm-6';
 *
 *         // bootstrap width classes to define the size of the selector dropdown
 *         $scope.selectorWidthClasses = 'col-xs-12 col-sm-6 col-md-6 col-lg-6';
 *
 *         // object for pager configuration (total, limit, offset)
 *         // with this configuration object you are able to manage paging
 *         // total is the total number of rows in the dataset
 *         // limit is the number of rows shown per page
 *         // offset is the index in the dataset to start from
 *         var pager = {};
 *         pager[ExtendedTableConstants.PAGER.TOTAL] = $scope.allRows.length;
 *         pager[ExtendedTableConstants.PAGER.LIMIT] = 5;
 *         pager[ExtendedTableConstants.PAGER.OFFSET] = 0;
 *         $scope.pager = pager;
 *
 *         // search term to filter the table
 *         // as two-way-binded property this variable contains the search string
 *         // typed by the user in the frontend and can therefor be used for querying
 *         // the backend, if watched here additionally
 *         $scope.search = null;
 *
 *         // Minimal wait time in milliseconds after last character typed before search kicks-in.
 *         // updates on blur are instant
 *         // default is 0
 *         $scope.waitTime = 500;
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
		'keta.filters.OrderObjectBy',
		'keta.filters.Slice',
		'keta.filters.Unit',
		'keta.utils.Common'
	])

	.constant('ExtendedTableConstants', {
		COMPONENT: {
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
		},
		ACTION_LIST_TYPE: {
			LINK: 'link',
			ACTION: 'action'
		}
	})

	// message keys with default values
	.constant('ExtendedTableMessageKeys', {
		'en': {
			'__keta.directives.ExtendedTable_search': 'Search',
			'__keta.directives.ExtendedTable_add_column': 'Add column',
			'__keta.directives.ExtendedTable_remove_column': 'Remove column',
			'__keta.directives.ExtendedTable_sort': 'Sort',
			'__keta.directives.ExtendedTable_no_entries': 'No entries',
			'__keta.directives.ExtendedTable_of': 'of'
		},
		'de': {
			'__keta.directives.ExtendedTable_search': 'Suche',
			'__keta.directives.ExtendedTable_add_column': 'Spalte hinzufügen',
			'__keta.directives.ExtendedTable_remove_column': 'Spalte entfernen',
			'__keta.directives.ExtendedTable_sort': 'Sortieren',
			'__keta.directives.ExtendedTable_no_entries': 'Keine Einträge',
			'__keta.directives.ExtendedTable_of': 'von'
		}
	})

	.directive('extendedTable', function ExtendedTableDirective(
		$compile, $filter,
		ExtendedTableConstants, ExtendedTableMessageKeys, CommonUtils) {
		return {
			restrict: 'EA',
			replace: true,
			scope: {

				// data as array of objects, keys from first element are taken as headers
				rows: '=',

				// current locale
				currentLocale: '=?',

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

				// array of columns that can be sorted (empty by default)
				unsortableColumns: '=?',

				// array of actions to render for each row
				actionList: '=?',

				// callback method to render each cell individually
				cellRenderer: '=?',

				// callback method to return class attribute for each column
				columnClassCallback: '=?',

				// callback method to return class attribute for each row
				rowClassCallback: '=?',

				// callback method to return class array for table
				tableClassCallback: '=?',

				// bootstrap width classes to define the size of the search input
				searchInputWidthClasses: '=?',

				// bootstrap width classes to define the size of the selector dropdown
				selectorWidthClasses: '=?',

				// object for pager configuration (total, limit, offset)
				pager: '=?',

				// search term to filter the table
				search: '=?',

				// Minimal wait time after last character typed before search kicks-in.
				searchWaitMs: '=?',

				// array of search results
				searchResults: '=?',

				// array of selected rows results
				selectionResults: '=?',

				// boolean flag to enable or disable row selection
				selectionEnabled: '=?'

			},
			templateUrl: '/components/directives/extended-table.html',
			link: function(scope) {

				// rows
				scope.rows =
					angular.isDefined(scope.rows) && angular.isArray(scope.rows) ? scope.rows : [];

				scope.currentLocale = scope.currentLocale || 'en';

				// object of labels
				scope.MESSAGE_KEY_PREFIX = '__keta.directives.ExtendedTable';
				scope.labels = angular.extend(ExtendedTableMessageKeys, scope.labels);

				scope.getLabel = function getLabel(key) {
					return CommonUtils.getLabelByLocale(key, scope.labels, scope.currentLocale);
				};

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

				// sortableColumns
				scope.unsortableColumns =
					scope.unsortableColumns || [];

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

				// rowClassCallback
				scope.rowClassCallback = scope.rowClassCallback || function() {
					// parameters: row, isHeader
					return '';
				};

				// tableClassCallback
				scope.tableClassCallback = scope.tableClassCallback || function() {
					return ['table-striped'];
				};

				// bootstrap width classes for search input
				scope.searchInputWidthClasses = scope.searchInputWidthClasses || 'col-xs-12 col-sm-4';

				// bootstrap width classes for selector dropdown
				scope.selectorWidthClasses = scope.selectorWidthClasses || 'col-xs-12 col-sm-8 col-md-8 col-lg-8';

				// pager
				var defaultPager = {};
				defaultPager[scope.PAGER_TOTAL] = scope.rows.length;
				defaultPager[scope.PAGER_LIMIT] = scope.rows.length;
				defaultPager[scope.PAGER_OFFSET] = 0;
				scope.pager = angular.extend(defaultPager, scope.pager);
				scope.resetPager();

				// search
				scope.search = scope.search || null;

				// default wait-time for search
				scope.searchWaitMs = angular.isNumber(scope.searchWaitMs) ? scope.searchWaitMs : 0;

				// array of search results
				scope.searchResults = scope.searchResults || scope.rows;

				// selection enabled
				scope.selectionEnabled = scope.selectionEnabled || false;

				// array of selection results
				scope.selectionResults = scope.selectionResults || [];

			},
			controller: function($scope) {

				// CONSTANTS ---

				var KEYCODE_ENTER = 13;

				$scope.COMPONENTS_FILTER = ExtendedTableConstants.COMPONENT.FILTER;
				$scope.COMPONENTS_SELECTOR = ExtendedTableConstants.COMPONENT.SELECTOR;
				$scope.COMPONENTS_TABLE = ExtendedTableConstants.COMPONENT.TABLE;
				$scope.COMPONENTS_PAGER = ExtendedTableConstants.COMPONENT.PAGER;

				$scope.OPERATIONS_MODE_DATA = ExtendedTableConstants.OPERATIONS_MODE.DATA;
				$scope.OPERATIONS_MODE_VIEW = ExtendedTableConstants.OPERATIONS_MODE.VIEW;

				$scope.PAGER_TOTAL = ExtendedTableConstants.PAGER.TOTAL;
				$scope.PAGER_LIMIT = ExtendedTableConstants.PAGER.LIMIT;
				$scope.PAGER_OFFSET = ExtendedTableConstants.PAGER.OFFSET;

				$scope.ACTION_LIST_TYPE_LINK = ExtendedTableConstants.ACTION_LIST_TYPE.LINK;
				$scope.ACTION_LIST_TYPE_ACTION = ExtendedTableConstants.ACTION_LIST_TYPE.ACTION;

				// VARIABLES ---

				$scope.pages = [];
				$scope.currentPage = 0;
				$scope.selectedColumn = null;

				// HELPER ---

				/**
				 * Checkout all keys and fill empty keys with null
				 * @param {Array} objects array with objects to fill
				 * @returns {Object} filled object
				 */
				var fillAllKeys = function(objects) {
					var keys = [];

					// get all keys
					angular.forEach(objects, function(obj) {
						angular.forEach(obj, function(value, key) {

							if (angular.isDefined(obj) && keys.indexOf(key) === -1) {
								keys.push(key);
							}

						});
					});

					// fill empty keys
					angular.forEach(objects, function(obj) {
						angular.forEach(keys, function(key) {
							if (angular.isDefined(obj)) {
								obj[key] = angular.isDefined(obj[key]) ? obj[key] : null;
							}
						});
					});

					return objects;
				};

				// update properties without using defaults
				var update = function() {

					if (angular.isDefined($scope.rows) && angular.isDefined($scope.rows[0])) {

						// fill all keys
						$scope.rows = fillAllKeys($scope.rows);

						// headers to save
						$scope.headers = $scope.rows[0];

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

				var resetSelection = function() {
					$scope.selectionResults = [];
				};

				// fill all keys initial
				$scope.rows = fillAllKeys($scope.rows);

				// reset pager object regarding filtered rows
				$scope.resetPager = function() {
					var rowsLength = $scope.rows.length;

					if ($scope.search !== null) {
						$scope.searchResults = $filter('filter')($scope.rows, $scope.searchIn);
						rowsLength = $scope.searchResults.length;
					}

					// update pager
					if ($scope.operationsMode === $scope.OPERATIONS_MODE_VIEW) {
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

				// check if action list item should be shown
				$scope.showActionListItem = function(item, row) {
					var show = true;
					if (angular.isFunction(item.display)) {
						show = item.display(row);
					}
					return show;
				};

				// WATCHER ---

				$scope.$watch('rows', function(newValue, oldValue) {
					if (newValue !== null && newValue !== oldValue) {
						update();
						$scope.resetPager();
						resetSelection();
					}
				}, true);

				$scope.$watch('pager', function(newValue, oldValue) {
					if (newValue !== null && newValue !== oldValue) {
						$scope.resetPager();
						resetSelection();
					}
				}, true);

				$scope.$watch('search', function(newValue, oldValue) {
					if (newValue !== null && newValue !== oldValue) {
						$scope.resetPager();
						resetSelection();
					}
				});

				$scope.$watch('switchableColumns', function(newValue, oldValue) {
					if (newValue !== null && newValue !== oldValue) {
						$scope.resetSelectedColumn();
					}
				}, true);

				// ACTIONS ---

				$scope.getTableClasses = function() {
					var configuredClasses = $scope.tableClassCallback();
					configuredClasses.push('table');
					configuredClasses.push('form-group');
					return configuredClasses.join(' ');
				};

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

				$scope.isSortable = function(column) {
					return $scope.unsortableColumns.indexOf(column) === -1;
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

					return $scope.visibleColumns.some(function(column) {
						if (angular.isDefined(row[column]) && row[column] !== null) {

							if (angular.isObject(row[column]) && !angular.isArray(row[column])) {

								var deepMatch = false;

								angular.forEach(row[column], function(prop) {
									if (String(prop).toLowerCase().indexOf($scope.search.toLowerCase()) !== -1) {
										deepMatch = true;
									}
								});

								return deepMatch;

							} else if (String(row[column]).toLowerCase().indexOf($scope.search.toLowerCase()) !== -1) {
								return true;
							}
						}
					});
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

				/**
				 * adds / removes clicked row to/from selectionResults array
				 * @param {object} row to add/remove to/from selection
				 * @returns {boolean} if selection is enabled
				 */
				$scope.selectRow = function(row) {

					if (!$scope.selectionEnabled) {
						return false;
					}

					var isSelected = false;

					for (var i = 0; i < $scope.selectionResults.length; i++) {
						if (angular.equals(row, $scope.selectionResults[i])) {
							isSelected = true;
							$scope.selectionResults.splice(i, 1);
							break;
						}
					}

					if (!isSelected) {
						$scope.selectionResults.push(row);
					}
				};

				/**
				 * checks if row is selected
				 * @param {object} row to check
				 * @returns {boolean} is selected or not
				 */
				$scope.isSelected = function(row) {

					if (!$scope.selectionEnabled) {
						return false;
					}

					var isSelected = false;

					for (var i = 0; i < $scope.selectionResults.length; i++) {
						if (angular.equals(row, $scope.selectionResults[i])) {
							isSelected = true;
							break;
						}
					}

					return isSelected;
				};

				/**
				 * @description Jumps to the given page and updates the view accordingly.
				 * @param {number} page The number of the page to go to.
				 * @returns {void} nothing
				 */
				$scope.goToPage = function(page) {
					if (page > 0 && page <= $scope.pages.length) {
						$scope.pager[$scope.PAGER_OFFSET] = $scope.pager[$scope.PAGER_LIMIT] * (page - 1);
						$scope.resetPager();
					}
				};

				/**
				 * @description Resets the pager input (page number) to a valid numeric value if the user
				 * has accidently entered something else and jumps to the page afterwards.
				 * @param {*} currentPage The current input by the user.
				 * @returns {void} nothing
				 */
				var resetPagerInputIfNecessary = function resetPagerInputIfNecessary(currentPage) {
					var parsingRadix = 10;
					var pageAsNumber = parseInt(currentPage, parsingRadix);
					var newPage = pageAsNumber;
					if (!angular.isNumber(pageAsNumber) || isNaN(pageAsNumber) || pageAsNumber <= 0) {
						newPage = 1;
					} else if (pageAsNumber > $scope.pages.length) {
						newPage = $scope.pages.length;
					}
					$scope.goToPage(newPage);
				};

				/**
				 * @description
				 * <p>
				 *   Checks the input (on specific events) that the user makes for the pager's current page
				 *   and resets the input to a valid number if something else (e.g. characters) were entered.
				 * </p>
				 * @param {*} currentPage The current input by the user.
				 * @param {object} $event The jQlite event that is connected with the user interaction.
				 * @returns {void} nothing
				 */
				$scope.checkPagerInput = function checkPagerInput(currentPage, $event) {
					switch ($event.type) {
						case 'keypress':
							if ($event.keyCode === KEYCODE_ENTER) {
								resetPagerInputIfNecessary(currentPage);
							}
							break;
						case 'blur':
							resetPagerInputIfNecessary(currentPage);
							break;
						default:
							break;
					}
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
'' +
'		<div data-ng-class="::searchInputWidthClasses">' +
'' +
'			<!-- FILTER -->' +
'			<div data-ng-show="!isDisabled(COMPONENTS_FILTER)">' +
'				<div class="form-group form-inline">' +
'					<div class="input-group col-xs-12">' +
'						<input type="search" class="form-control"' +
'							placeholder="{{ getLabel(MESSAGE_KEY_PREFIX + \'_search\') }}"' +
'							data-ng-model="search"' +
'							data-ng-model-options="{ updateOn: \'default blur\', debounce: {\'default\': searchWaitMs, \'blur\': 0} }"' +
'						>' +
'						<span class="input-group-btn">' +
'							<button class="btn btn-default btn-addon" type="button">' +
'								<i class="glyphicon glyphicon-search"></i>' +
'							</button>' +
'						</span>' +
'					</div>' +
'				</div>' +
'			</div>' +
'' +
'		</div>' +
'' +
'		<div data-ng-class="::selectorWidthClasses">' +
'' +
'			<!-- SELECTOR -->' +
'			<div data-ng-show="!isDisabled(COMPONENTS_SELECTOR) && selectedColumn !== null" class="form-horizontal">' +
'				<div class="form-group">' +
'					<label for="columnSelector"' +
'						class="col-xs-12 col-sm-5 col-lg-6 control-label">{{ getLabel(MESSAGE_KEY_PREFIX + \'_add_column\') }}</label>' +
'					<div class="col-xs-12 col-sm-7 col-lg-6 input-group">' +
'						<select id="columnSelector"' +
'							class="form-control"' +
'							data-ng-if="groupByProperty !== null"' +
'							data-ng-model="$parent.selectedColumn"' +
'							data-ng-options="' +
'								column.id as headerLabelCallback(column.id)' +
'									group by {{groupByProperty}} for column in switchableColumns |' +
'								filter:filterColumns |' +
'								orderBy:orderByProperty">' +
'						</select>' +
'						<select id="columnSelector"' +
'							class="form-control"' +
'							data-ng-if="groupByProperty === null"' +
'							data-ng-model="$parent.selectedColumn"' +
'							data-ng-options="' +
'								column.id as headerLabelCallback(column.id) for column in switchableColumns |' +
'								filter:filterColumns |' +
'								orderBy:orderByProperty">' +
'						</select>' +
'						<span class="input-group-btn">' +
'							<button type="button" class="btn btn-primary"' +
'								data-ng-click="addColumn(selectedColumn)">' +
'								<i class="glyphicon glyphicon-plus"></i>' +
'							</button>' +
'						</span>' +
'					</div>' +
'				</div>' +
'			</div>' +
'' +
'		</div>' +
'' +
'	</div>' +
'' +
'	<!-- TABLE -->' +
'	<div class="row" data-ng-show="!isDisabled(COMPONENTS_TABLE)">' +
'		<div class="col-xs-12">' +
'			<div class="table-responsive table-data">' +
'				<table data-ng-class="getTableClasses()">' +
'					<thead>' +
'						<tr class="{{rowClassCallback(null, true)}}">' +
'							<th class="{{columnClassCallback(headers, column, true)}}"' +
'								data-ng-repeat="column in headers | orderObjectBy:visibleColumns:true"' +
'								data-ng-if="rowSortEnabled"' +
'								data-ng-class="{' +
'									sort: isSortCriteria(column),' +
'									sortable: isSortable(column)}">' +
'								<span data-ng-if="' +
'									!isSortable(column) &&' +
'									headerLabelCallback(column)">{{headerLabelCallback(column)}}</span>' +
'								<a class="header" title="{{ getLabel(MESSAGE_KEY_PREFIX + \'_sort\') }}"' +
'									data-ng-if="' +
'										isSortable(column) &&' +
'										headerLabelCallback(column)"' +
'									data-ng-click="sortBy(column)">{{headerLabelCallback(column)}}</a>' +
'								<a class="sort" title="{{ getLabel(MESSAGE_KEY_PREFIX + \'_sort\') }}"' +
'									data-ng-if="' +
'										isSortCriteria(column) &&' +
'										rowSortOrderAscending &&' +
'										isSortable(column) &&' +
'										headerLabelCallback(column)"' +
'									data-ng-click="sortBy(column)"><span' +
'									class="glyphicon glyphicon-sort-by-alphabet"></span></a>' +
'								<a class="sort" title="{{ getLabel(MESSAGE_KEY_PREFIX + \'_sort\') }}"' +
'								   data-ng-if="' +
'									   isSortCriteria(column) &&' +
'									   !rowSortOrderAscending &&' +
'									   isSortable(column) &&' +
'									   headerLabelCallback(column)"' +
'								   data-ng-click="sortBy(column)"><span' +
'									class="glyphicon glyphicon-sort-by-alphabet-alt"></span></a>' +
'								<a class="unsort" title="{{ getLabel(MESSAGE_KEY_PREFIX + \'_sort\') }}"' +
'									data-ng-if="' +
'										!isSortCriteria(column) &&' +
'										isSortable(column) &&' +
'										headerLabelCallback(column)"' +
'									data-ng-click="sortBy(column)"><span' +
'									class="glyphicon glyphicon-sort"></span></a>' +
'								<a class="operation" title="{{ getLabel(MESSAGE_KEY_PREFIX + \'_remove_column\') }}"' +
'									data-ng-if="' +
'										isSwitchable(column) &&' +
'										headerLabelCallback(column)"' +
'									data-ng-click="removeColumn(column)"><span' +
'									class="glyphicon glyphicon-minus-sign"></span></a>' +
'							</th>' +
'							<th class="{{columnClassCallback(headers, column, true)}}"' +
'								data-ng-repeat="column in headers | orderObjectBy:visibleColumns:true"' +
'								data-ng-if="!rowSortEnabled">' +
'								{{headerLabelCallback(column)}}' +
'								<a class="operation" data-ng-if="isSwitchable(column)"' +
'									data-ng-click="removeColumn(column)">' +
'									<span class="glyphicon glyphicon-minus-sign"></span>' +
'								</a>' +
'							</th>' +
'							<th data-ng-if="actionList.length">' +
'								{{headerLabelCallback(\'actions\')}}' +
'							</th>' +
'						</tr>' +
'					</thead>' +
'					<tbody>' +
'						<!-- operationsMode: data -->' +
'						<tr data-ng-if="operationsMode === OPERATIONS_MODE_DATA"' +
'							data-ng-repeat="row in rows" data-ng-click="selectRow(row)"' +
'							data-ng-class="{\'active\' : isSelected(row)}"' +
'							class="{{rowClassCallback(row, false)}}">' +
'							<td data-ng-repeat="column in row | orderObjectBy:visibleColumns:true"' +
'								class="{{columnClassCallback(row, column, false)}}">' +
'								<span data-ng-bind-html="cellRenderer(row, column)"></span>' +
'							</td>' +
'							<td data-ng-if="row && actionList.length">' +
'								<div class="btn-group" role="group">' +
'									<span data-ng-repeat="item in actionList"' +
'										data-ng-if="showActionListItem(item, row)">' +
'										<a class="btn btn-link"' +
'											data-ng-href="{{item.getLink(row)}}"' +
'											data-ng-if="!item.type || item.type === ACTION_LIST_TYPE_LINK"' +
'											title="{{item.getLabel()}}"><span' +
'											class="{{item.icon}}" aria-hidden="true"></span></a>' +
'										<a class="btn btn-link" href=""' +
'											data-ng-click="item.runAction(row)"' +
'											data-ng-if="item.type === ACTION_LIST_TYPE_ACTION"' +
'											title="{{item.getLabel()}}"><span' +
'											class="{{item.icon}}" aria-hidden="true"></span></a>' +
'									</span>' +
'								</div>' +
'							</td>' +
'						</tr>' +
'						<!-- operationsMode: view -->' +
'						<tr data-ng-if="operationsMode === OPERATIONS_MODE_VIEW"' +
'							data-ng-repeat="' +
'								row in rows |' +
'								filter:searchIn |' +
'								orderBy:rowSortCriteria:!rowSortOrderAscending |' +
'								slice:pager[PAGER_OFFSET]:pager[PAGER_LIMIT]"' +
'							data-ng-class="{\'active\' : isSelected(row)}"' +
'							data-ng-click="selectRow(row)"' +
'							class="{{rowClassCallback(row, false)}}">' +
'							<td data-ng-repeat="column in row | orderObjectBy:visibleColumns:true"' +
'								class="{{columnClassCallback(row, column, false)}}">' +
'								<span data-ng-bind-html="cellRenderer(row, column)"></span>' +
'							</td>' +
'							<td data-ng-if="row && actionList.length">' +
'								<div class="btn-group" role="group">' +
'									<span data-ng-repeat="item in actionList"' +
'										data-ng-if="showActionListItem(item, row)">' +
'										<a class="btn btn-link"' +
'											data-ng-href="{{item.getLink(row)}}"' +
'											data-ng-if="!item.type || item.type === ACTION_LIST_TYPE_LINK"' +
'											title="{{item.getLabel()}}"><span' +
'											class="{{item.icon}}" aria-hidden="true"></span></a>' +
'										<a class="btn btn-link" href=""' +
'											data-ng-click="item.runAction(row)"' +
'											data-ng-if="item.type === ACTION_LIST_TYPE_ACTION"' +
'											title="{{item.getLabel()}}"><span' +
'											class="{{item.icon}}" aria-hidden="true"></span></a>' +
'									</span>' +
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
'								{{ getLabel(MESSAGE_KEY_PREFIX + \'_no_entries\') }}' +
'							</td>' +
'						</tr>' +
'					</tbody>' +
'				</table>' +
'			</div>' +
'		</div>' +
'	</div>' +
'' +
'	<!-- PAGER -->' +
'	<div class="row" data-ng-show="!isDisabled(COMPONENTS_PAGER) && pager !== null && pages.length > 1">' +
'		<div class="col-xs-12">' +
'			<div class="pager max-width">' +
'				<div class="input-group">' +
'					<div class="pager-buttons input-group-btn">' +
'						<button type="button" class="btn btn-default" data-ng-click="goToPage(currentPage - 1)">' +
'							<i class="glyphicon glyphicon-chevron-left"></i>' +
'						</button>' +
'					</div>' +
'					<input type="text" class="form-control pager-input"' +
'						data-ng-model="currentPage"' +
'						data-ng-keypress="checkPagerInput(currentPage, $event)"' +
'						data-ng-blur="checkPagerInput(currentPage, $event)">' +
'					<span class="input-group-addon">' +
'						{{ getLabel(MESSAGE_KEY_PREFIX + \'_of\') }} {{pages.length}}' +
'					</span>' +
'					<div class="pager-buttons input-group-btn">' +
'						<button type="button" class="btn btn-default" data-ng-click="goToPage(currentPage + 1)">' +
'							<i class="glyphicon glyphicon-chevron-right"></i>' +
'						</button>' +
'					</div>' +
'				</div>' +
'			</div>' +
'		</div>' +
'	</div>' +
'' +
'</div>' +
'');
	});
