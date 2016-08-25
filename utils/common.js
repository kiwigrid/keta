'use strict';

/**
 * @name keta.utils.Common
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.utils.Common
 * @description
 * <p>
 *   Common service utilities for cross-component usage.
 * </p>
 */

angular.module('keta.utils.Common', [])

	/**
	 * @class CommonUtils
	 * @propertyOf keta.utils.Common
	 * @description Common Utils Factory
	 */
	.factory('CommonUtils', function CommonUtils() {

		var factory = {};

		/**
		 * @name doesPropertyExist
		 * @function
		 * @description This method checks, if a deep property does exist in the given object.
		 * @param {object} obj object to check property for
		 * @param {string} prop property given in dot notation
		 * @returns {boolean} true if property exists
		 */
		factory.doesPropertyExist = function doesPropertyExist(obj, prop) {
			var parts = prop.split('.');
			for (var i = 0, l = parts.length; i < l; i++) {
				var part = parts[i];
				if (angular.isObject(obj) && part in obj) {
					obj = obj[part];
				} else {
					return false;
				}
			}
			return true;
		};

		/**
		 * @name getLabelByLocale
		 * @function
		 * @description
		 * <p>
		 *   Returns the translation for a given key inside of an object of labels which is grouped by locale keys.<br>
		 *   If the given locale is not found inside the labels object the function tries to fall back to the
		 *   english translation, otherwise the return value is null.
		 * </p>
		 * <p>
		 *   The key can be either in short ('en') or long ('en-US') format.<br>
		 *   Locales only match from specific > general > fallback<br>
		 *   i. e. 'de_AT' > 'de' > 'en'<br>
		 *   If a general locale is not defined go straight to fallback locale.
		 * </p>
		 * @param {string} key translation key to search for
		 * @param {object} labels object with all translation keys grouped by locale keys
		 * @param {object} currentLocale the currently active locale inside of the application
		 * @returns {string|null} the translated label or null if no translation could be found
		 */
		factory.getLabelByLocale = function getLabelByLocale(key, labels, currentLocale) {

			var LOCALE_LENGTH = 2;
			var FALLBACK_LOCALE = 'en';
			var label = null;

			var shortLocale =
				angular.isString(currentLocale) &&
				currentLocale.length >= LOCALE_LENGTH ?
					currentLocale.substr(0, LOCALE_LENGTH) : '';

			if (angular.isObject(labels[currentLocale]) &&
				angular.isDefined(labels[currentLocale][key])) {
				label = labels[currentLocale][key];
			} else if (angular.isObject(labels[shortLocale]) &&
				angular.isDefined(labels[shortLocale][key])) {
				label = labels[shortLocale][key];
			} else if (angular.isObject(labels[FALLBACK_LOCALE]) &&
				angular.isDefined(labels[FALLBACK_LOCALE][key])) {
				label = labels[FALLBACK_LOCALE][key];
			}
			return label;
		};

		/**
		 * @name addUrlParameter
		 * @function
		 * @description
		 * <p>
		 *   Add or modify a parameter in given URL. It maintains the correct order or URL parts.
		 * </p>
		 * @param {string} uri uri to modify
		 * @param {string} param parameter to modify
		 * @param {string} value value to set parameter to
		 * @returns {string} modified url
		 */
		factory.addUrlParameter = function addUrlParameter(uri, param, value) {

			// instantly return invalid input
			if (!angular.isString(uri)) {
				return uri;
			}

			// using a positive lookahead (?=\=) to find the
			// given parameter, preceded by a ? or &, and followed
			// by a = with a value after than (using a non-greedy selector)
			// and then followed by a & or the end of the string
			var val = new RegExp('(\\?|\\&)' + param + '=.*?(?=(&|$))');
			var parts = uri.toString().split('#');
			var url = parts[0];
			var hash = parts[1] || false;
			var queryString = /\?.+$/;
			var newURL = url;

			// check if the parameter exists
			if (val.test(url)) {
				// if it does, replace it, using the captured group
				// to determine & or ? at the beginning
				newURL = url.replace(val, '$1' + param + '=' + value);
			} else {
				// otherwise, if there is a query string at all
				// add the param to the end of it or
				// if there's no query string, add one
				newURL = url + (queryString.test(url) ? '&' : '?') + param + '=' + value;
			}

			if (hash) {
				newURL += '#' + hash;
			}

			return newURL;
		};

		return factory;

	});
