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
