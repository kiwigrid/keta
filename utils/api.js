'use strict';

/**
 * @name keta.utils.Api
 * @author Vincent Romanus <vincent.romanus@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2015
 * @module keta.utils.Api
 * @description
 * <p>
 *    Utility service to convert search string and query language to filter params that can be used
 *    with other keta services.
 * </p>
 */


angular.module('keta.utils.Api', [])

	.constant('ketaApiUtilsConstants', {

		OPERATORS: {
			OR: '$or',
			AND: '$and',
			LIKE: '$like'
		},
		REGEX: {
			QUERY_DIVIDER: new RegExp('(".*?"|[^" ]+)+(?= *| *$)', 'g'),
			KEY_DIVIDER: new RegExp('(".*?"|[^"\:]+)+(?= *| *$)', 'g'),
			QUOTES: new RegExp('"', 'g')
		},
		CHARS: {
			QUERY_DIVIDER: ':',
			LIKE_EXTENDER: '*'
		},
		NUMBERS: {
			MAX_COMPONENTS_LENGTH: 2
		}

	})

	/**
	 * @class ApiUtils
	 * @propertyOf keta.utils.Api
	 * @description Api Utils Factory
	 */
	.factory('ketaApiUtils', function ApiUtils(ketaApiUtilsConstants) {

		var factory = {};

		// HELPER
		// -----

		/**
		 * @description
		 * Helper to check if objects has no properties.
		 * @param {Object} obj to check.
		 * @returns {Boolean} if object has no properties.
		 */
		var isBlankObject = function isBlankObject(obj) {
			var propertyCount = 0;

			angular.forEach(obj, function() {
				propertyCount++;
			});

			return propertyCount === 0;
		};

		/**
		 * @description
		 * Cleanup inserted query.
		 * @param {String} query string.
		 * @returns {String} clean uped query
		 */
		var cleanUpQuery = function cleanUpQuery(query) {

			// prevent double QUERY_DIVIDER_CHAR
			var cleanedUpQuery = query.replace(
					ketaApiUtilsConstants.CHARS.QUERY_DIVIDER + ketaApiUtilsConstants.CHARS.QUERY_DIVIDER,
					ketaApiUtilsConstants.CHARS.QUERY_DIVIDER + '"' + ketaApiUtilsConstants.CHARS.QUERY_DIVIDER
				) + '"';

			return cleanedUpQuery;

		};

		/**
		 * @description
		 * Separate query in to search key und search value.
		 * @param {String} query query string.
		 * @returns {Object} search key as key and search value as value.
		 */
		var getQueryComponents = function getQueryComponents(query) {

			query = cleanUpQuery(query);

			var components = query.match(ketaApiUtilsConstants.REGEX.KEY_DIVIDER);

			var	key = components[0].replace(ketaApiUtilsConstants.REGEX.QUOTES, '');
			var	value = angular.isDefined(components[1]) ?
				components[1].replace(ketaApiUtilsConstants.REGEX.QUOTES, '') : null;

			if (components.length > ketaApiUtilsConstants.NUMBERS.MAX_COMPONENTS_LENGTH) {

				var extendedValues =
					components.slice(ketaApiUtilsConstants.NUMBERS.MAX_COMPONENTS_LENGTH, components.length);
				angular.forEach(extendedValues, function(extendedValue) {
					value += ketaApiUtilsConstants.CHARS.QUERY_DIVIDER +
						extendedValue.replace(ketaApiUtilsConstants.REGEX.QUOTES, '');
				});

			}

			return {key: key, value: value};

		};

		/**
		 * @description
		 * Transform search string into $like search param.
		 * @param {String} searchString search string.
		 * @returns {Object} $like search param.
		 */
		var getLikeSearchParam = function getLikeSearchString(searchString) {
			var likeSearchParam = [];

			likeSearchParam[ketaApiUtilsConstants.OPERATORS.LIKE] =
				ketaApiUtilsConstants.CHARS.LIKE_EXTENDER +
				searchString +
				ketaApiUtilsConstants.CHARS.LIKE_EXTENDER;

			return angular.extend({}, likeSearchParam);

		};

		/**
		 * @description
		 * Helper for getFilterParams to connect filterString to all inserted criteria.
		 * @param {String} filterString Search string.
		 * @param {Object} criteriaMapping Criteria to search in.
		 * @returns {Array} Params with criteria as key and filterString as value.
		 */
		var getCriteriaParams = function getCriteriaParams(filterString, criteriaMapping) {

			var filters = [];

			angular.forEach(criteriaMapping, function(criterion, key) {

				// delete double keys
				angular.forEach(criteriaMapping, function(comparisonCriterion, comparisonKey) {

					if (criterion === comparisonCriterion && key !== comparisonKey) {
						delete criteriaMapping[comparisonKey];
					}

				});

				var container = [];

				container[criterion] = getLikeSearchParam(filterString);
				container = angular.extend({}, container);

				filters.push(container);

			});

			return filters;
		};

		/**
		 * @description
		 * Merging params to send it to Eventbusmanager
		 * @param {Object} acrossParams params that search over all criterias from criteriaMapping.
		 * @param {Object} transformedParams params that you get from inserted query.
		 * @returns {Object} Merged params.
		 */
		var mergeParams = function mergeParams(acrossParams, transformedParams) {

			var params = {};

			if (!isBlankObject(acrossParams) &&
				!isBlankObject(transformedParams)) {

				params[ketaApiUtilsConstants.OPERATORS.AND] = [
					angular.extend({}, acrossParams),
					angular.extend({}, transformedParams)
				];

			} else if (!isBlankObject(acrossParams)) {

				params = angular.extend({}, acrossParams);

			} else if (!isBlankObject(transformedParams)) {

				params = angular.extend({}, transformedParams);

			}

			return params;

		};

		// LOGIC
		// -----

		/**
		 * @name getFilterParams
		 * @function
		 * @description
		 * Set filter params to all criteria or define them by query language.
		 * If inserted string is "owner:test_user", only items with owner test_user will be returned
		 * and if you insert "test_user", items with test_user in this criterion will be returned.
		 * @param {String} filterString Search string or query language string.
		 * @param {Object} criteriaMapping criteria to search in or convert key to criteria.
		 * @returns {Object} Params to filter EventBusManager request.
		 * @example
		 * angular.module('exampleApp',
		 *     [
		 *         'keta.utils.Api',
		 *         'keta.services.EventBusManager',
		 *         'keta.services.DeviceSet'
		 *     ])
		 *     .controller('ExampleController', function(
		 *         ketaApiUtils, ketaEventBusManager, ketaDeviceSet,
		 *     ) {
		 *
		 *         // search scope model for an input to get the search string
		 *         $scope.searchString = '';
		 *
		 *         // set search criteria
		 *         var searchCriteria = {
		 *             name: 'tagValues.IdName.value',
		 *             owner: 'owner'
		 *          };
		 *
		 *          // get filter params
		 *          var filter = ketaApiUtils.getFilterParams($scope.searchString, searchCriteria);
		 *
		 *         // get reply by filter
		 *        ketaDeviceSet.create(ketaEventBusManager.get('kiwibus'))
		 *          .filter(filter)
		 *          .project({
		 *              tagValues: {
		 *                  IdName: 1
		 *              },
		 *              owner: 1
		 *          })
		 *          .query()
		 *          .then(function(reply) {
		 *              // ...
		 *          });
		 *     });
		 */
		factory.getFilterParams = function getFilterParams(filterString, criteriaMapping) {

			var params = {};

			if (angular.isString(filterString) &&
				angular.isObject(criteriaMapping) &&
				filterString !== null) {

				var transformedFilter = [];

				var transformedParams = {};
				var acrossParams = {};

				var queries = filterString.match(ketaApiUtilsConstants.REGEX.QUERY_DIVIDER);

				angular.forEach(queries, function(query) {

					var FilterContainer = [];

					var queryComponents = getQueryComponents(query);

					if (queryComponents.value !== null) {

						if (angular.isDefined(criteriaMapping[queryComponents.key])) {
							queryComponents.key = criteriaMapping[queryComponents.key];
						}

						FilterContainer[queryComponents.key] = getLikeSearchParam(queryComponents.value);
						FilterContainer = angular.extend({}, FilterContainer);

						transformedFilter.push(FilterContainer);

					} else if (!isBlankObject(acrossParams)) {

						acrossParams[ketaApiUtilsConstants.OPERATORS.OR] =
							acrossParams[ketaApiUtilsConstants.OPERATORS.OR]
								.concat(getCriteriaParams(queryComponents.key, criteriaMapping));

					} else {

						acrossParams[ketaApiUtilsConstants.OPERATORS.OR] =
							getCriteriaParams(queryComponents.key, criteriaMapping);

					}

				});

				if (transformedFilter.length > 1) {
					transformedParams[ketaApiUtilsConstants.OPERATORS.AND] = transformedFilter;
				} else {
					transformedParams = angular.extend({}, transformedFilter[0]);
				}

				params = mergeParams(acrossParams, transformedParams);

			}

			return params;
		};

		return factory;

	});
