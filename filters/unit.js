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
 * <p>
 *   The filter takes a couple of parameters to configure it. <code>unit</code> defines the unit
 *   as string to append to formatted value (e.g. <code>'W'</code>, defaults to empty string).
 *   <code>precision</code> defines the number of digits to appear after the decimal point as integer
 *   (e.g. <code>2</code>, defaults to <code>0</code>). <code>precisionRanges</code> defines used
 *   precision in a more flexible way by defining an array of precisions with <code>min</code> (included)
 *   and/or <code>max</code> (excluded) value. <code>isBytes</code> is a boolean flag to
 *   specify if the given number is bytes and therefor 1024-based (defaults to <code>false</code>).
 *   <code>separate</code> is a boolean flag (defaults to <code>false</code>) which defines whether
 *   to return a single string or an object with separated values <code>numberFormatted</code> (String),
 *   <code>numberRaw</code> (Number) and <code>unit</code> (String).
 * </p>
 * <p>
 *   If <code>precisionRanges</code> is set to:
 * </p>
 * <pre>[
 *     {max: 1000, precision: 0},
 *     {min: 1000, precision: 1}
 * ]</pre>
 * <p>
 *   numeric values which are less than 1000 are formatted with a precision of 0, as numeric values
 *   equal or greater than 1000 are formatted with a precision of 1.
 * </p>
 * <p>
 *   If <code>separate</code> is set to <code>true</code> the filter returns an object in the
 *   following manner if for instance German is the current locale:
 * </p>
 * <pre>{
 *     numberFormatted: '1,546',
 *     numberRaw: 1.546,
 *     unit: 'kW'
 * }</pre>
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
 *         // as numberFormatted is locale-aware, numberRaw remains a real number to calculate with
 *         // e.g. for German numberFormatted would be formatted to '1,2' and numberRaw would still be 1.2
 *         $scope.valueSeparated = $filter('unit')(1234.56, {
 *             unit: 'W',
 *             precision: 1,
 *             isBytes: false,
 *             separate: true
 *         });
 *
 *         // use unit filter with precision ranges
 *         // for the example below all values which are less than 1000 are formatted with a precision of 0
 *         // and all values equal or greater than 1000 are formatted with a precision of 1
 *         $scope.valueRanges = $filter('unit')(1234.56, {
 *             unit: 'W',
 *             precision: 1,
 *             precisionRanges: [
 *                 {max: 1000, precision: 0},
 *                 {min: 1000, precision: 1}
 *             ],
 *             isBytes: false
 *         });
 *
 *     });
 */

angular.module('keta.filters.Unit',
	[
		'keta.services.Tag'
	])
	.filter('unit', function($filter, TagConstants) {
		return function(input, configuration) {

			if (!angular.isNumber(input)) {
				return input;
			}

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

			if (unit === TagConstants.UNIT.EURO ||
				unit === TagConstants.UNIT.KILOMETER ||
				unit === TagConstants.UNIT.DOLLAR ||
				unit === TagConstants.UNIT.POUND) {
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

				separated.numberFormatted = $filter('number')(input, precision);
				separated.numberRaw = input;
				separated.unit = unit;

				input = separated.numberFormatted;

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
