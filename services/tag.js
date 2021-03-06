'use strict';

/**
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.services.Tag
 * @description Tag Provider
 */

angular.module('keta.services.Tag', [])

	.constant('ketaTagConstants', {
		// TODO: include full tag unit list
		UNIT: {
			WATTS: 'W',
			WATTHOURS: 'Wh',
			PERCENT: '%',
			EURO: '€',
			DOLLAR: '$',
			POUND: '£',
			KILOMETER: 'km'
		}
	})

	/**
	 * @class ketaTagProvider
	 * @propertyOf keta.services.Tag
	 * @description Tag Provider
	 */
	.provider('ketaTag', function TagProvider() {

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
				 * @description
				 * <p>
				 *   Returns <code>guid</code> property of Tag.
				 * </p>
				 * @returns {string} guid
				 * @example
				 * angular.module('exampleApp', ['keta.services.Tag'])
				 *     .controller('ExampleController', function(ketaTag) {
				 *         var tag = ketaTag.create({
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
				 * @description
				 * <p>
				 *   Returns <code>name</code> property of Tag.
				 * </p>
				 * @returns {string} name
				 * @example
				 * angular.module('exampleApp', ['keta.services.Tag'])
				 *     .controller('ExampleController', function(ketaTag) {
				 *         var tag = ketaTag.create({
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

				var MINIMUM_SAMPLE_RATE = 5;

				// sample rate
				var sampleRate =
					angular.isDefined(properties.sampleRate) && properties.sampleRate >= MINIMUM_SAMPLE_RATE ?
						properties.sampleRate : null;

				/**
				 * @name getSampleRate
				 * @function
				 * @description
				 * <p>
				 *   Returns <code>sampleRate</code> property of Tag.
				 * </p>
				 * @returns {number} sampleRate
				 * @example
				 * angular.module('exampleApp', ['keta.services.Tag'])
				 *     .controller('ExampleController', function(ketaTag) {
				 *         var tag = ketaTag.create({
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
				 * @name create
				 * @function
				 * @description
				 * <p>
				 *   Creates a TagInstance.
				 * </p>
				 * @param {Object} properties Properties to inject into TagInstance
				 * @returns {TagInstance} TagInstance created
				 * @example
				 * angular.module('exampleApp', ['keta.services.Tag'])
				 *     .controller('ExampleController', function(ketaTag) {
				 *         var tag = ketaTag.create({
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
