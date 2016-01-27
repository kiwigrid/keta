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
		 *   i. e. 'de-AT' > 'de' > 'en'<br>
		 *   If a general local is not defined go straight to fallback locale.
		 * </p>
		 * @param {string} key translation key to search for
		 * @param {object} labels object with all translation keys grouped by locale keys
		 * @param {object} currentLocale the currently active locale inside of the application
		 * @returns {string|null} the translated label or null if no translation could be found
		 */
		factory.getLabelByLocale = function getLabelByLocale(key, labels, currentLocale) {

			var LOCALE_LENGTH = 2;
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
			} else if (angular.isObject(labels.en) &&
				angular.isDefined(labels.en[key])) {
				label = labels.en[key];
			}
			return label;
		};

		return factory;

	});
