'use strict';

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
 *
 * Number: {{ (1234.56 | unit:{unit: 'W', precision: 1, isBytes: false, separate:true}).numberFormatted }}
 * Unit: {{ (1234.56 | unit:{unit: 'W', precision: 1, isBytes: false, separate:true}).unit }}
 * @example
 * angular.module('exampleApp', ['keta.filters.Unit'])
 *     .controller('ExampleController', function($scope) {
 *
 *         // use unit filter to return formatted number value
 *         // $scope.value equals string '1.2 kW'
 *         $scope.value = $filter('unit')(1234.56, {
 *             unit: 'W',
 *             precision: 1,
 *             isBytes: false
 *         });
 *
 *         // use unit filter to return object for number formatting
 *         // $scope.valueSeparated equals object {numberFormatted: '1.2', numberRaw: 1.2, unit: 'kW'}
 *         $scope.valueSeparated = $filter('unit')(1234.56, {
 *             unit: 'W',
 *             precision: 1,
 *             isBytes: false,
 *             separate: true
 *         });
 *
 *     });
 */

angular.module('keta.filters.Unit', [])
	.filter('unit', function($filter, ketaSharedConfig) {
		return function(input, configuration) {

			if (!angular.isNumber(input)) {
				return input;
			}

			// TODO: precision for ranges (with defaults)

			var precision = 0,
				precisionRanges = [],
				unit = '',
				isBytes = false,
				separate = false,
				separated = {
					numberFormatted: null,
					numberRaw: null,
					unit: null
				};

			if (angular.isDefined(configuration)) {

				// general precision (defaults to 0)
				precision =
					angular.isNumber(configuration.precision) ?
						configuration.precision : precision;

				// precision ranges (defaults to [])
				precisionRanges =
					angular.isArray(configuration.precisionRanges) ?
						configuration.precisionRanges : precisionRanges;

				// unit to use (defaults to '')
				unit =
					angular.isDefined(configuration.unit) ?
						configuration.unit : unit;

				// flag if value reprensents bytes (defaults to false)
				isBytes =
					angular.isDefined(configuration.isBytes) ?
						configuration.isBytes : isBytes;

				// flag if result should be returned separate (defaults to false)
				separate =
					angular.isDefined(configuration.separate) ?
						configuration.separate : separate;

			}

			// reset precision if precision range matches
			angular.forEach(precisionRanges, function(range) {
				var matching = true;
				if (angular.isDefined(range.min) && input < range.min) {
					matching = false;
				}
				if (angular.isDefined(range.max) && input >= range.max) {
					matching = false;
				}
				if (!angular.isDefined(range.min) && !angular.isDefined(range.max)) {
					matching = false;
				}
				if (matching && angular.isNumber(range.precision)) {
					precision = range.precision;
				}
			});

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

				var siInput = input / Math.pow(isBytes ? oneKiloByte : oneKilo, i) * multiplicator;
				var siInputFixed = Number(siInput.toFixed(precision));
				if (siInputFixed >= oneKilo) {
					i++;
					siInputFixed /= oneKilo;
				}

				separated.numberFormatted = $filter('number')(siInputFixed);
				separated.numberRaw = siInputFixed;
				separated.unit = sizes[i] + unit;

				input =
					separated.numberFormatted +
						(sizes[i] !== '' ? ' ' + sizes[i] : '');

			} else {
				input = $filter('number')(input, precision);
			}
			if (!isBytes && unit !== '') {
				input += input.indexOf(' ') === -1 ? ' ' + unit : unit;
			}

			if (separate) {
				return separated;
			}
			return input;
		};
	});
