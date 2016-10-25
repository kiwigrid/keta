'use strict';

/**
 * @name keta.directives.TimeRangeSelector
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2016
 * @module keta.directives.TimeRangeSelector
 * @description
 * <p>
 *   A simple time range selector component to select a time range.
 * </p>
 * @example
 * &lt;div data-keta-time-range-selector
 *   data-ng-model="model"
 *   data-css-classes="cssClasses"
 *   data-current-locale="currentLocale"
 *   data-display-mode="displayMode"
 *   data-display-value="displayValue"
 *   data-enable-display-mode-switch="enableDisplayModeSwitch"
 *   data-enable-week-selection="enableWeekSelection"
 *   data-first-day-of-week="firstDayOfWeek"
 *   data-labels="labels"
 *   data-maximum="maximum"
 *   data-max-range-length="maxRangeLength"
 *   data-minimum="minimum"
 *   data-min-range-length="minRangeLength"
 *   data-show-pager="showPager"
 *   data-show-selection-button="showSelectionButton"
 *   data-show-today-button="showTodayButton"
 *   data-show-week-numbers="showWeekNumbers"
 *   data-years-after="yearsAfter"
 *   data-years-before="yearsBefore"&gt;&lt;/div&gt;
 * @example
 * angular.module('exampleApp', ['keta.directives.TimeRangeSelector'])
 *     .controller('ExampleController', function(
 *     $scope, ketaTimeRangeSelectorConstants, ketaTimeRangeSelectorMessageKeys
 *     ) {
 *
 *         // current range to use
 *         $scope.model = new Date(2016, 3, 20, 9, 0, 0, 0);
 *
 *         // css classes to use
 *         $scope.cssClasses = ketaTimeRangeSelectorConstants.CSS_CLASSES;
 *
 *         // current locale to use
 *         $scope.currentLocale = 'de_DE';
 *
 *         // display mode to use (@see ketaTimeRangeSelectorConstants.DISPLAY_MODE)
 *         $scope.displayMode = ketaTimeRangeSelectorConstants.DISPLAY_MODE.DAY;
 *
 *         // display value to use
 *         $scope.displayValue = angular.copy($scope.model);
 *
 *         // enable display mode switch
 *         $scope.enableDisplayModeSwitch = true;
 *
 *         // enable week selection
 *         $scope.enableWeekSelection = false;
 *
 *         // define first day of week
 *         $scope.firstDayOfWeek = ketaTimeRangeSelectorConstants.DAY.SUNDAY;
 *
 *         // define labels to use
 *         $scope.labels = TimeRangeSelectorMessageKeys;
 *
 *         // define an optional maximum boundary
 *         $scope.maximum = moment($scope.now).add(30, 'days').toDate();
 *
 *         // define an optional maximum range length in days or 0 to disable it
 *         $scope.maxRangeLength = 3;
 *
 *         // define an optional minimum boundary
 *         $scope.minimum = moment($scope.now).subtract(30, 'days').toDate();
 *
 *         // define an optional minimum range length in days or 0 to disable it
 *         $scope.minRangeLength = 3;
 *
 *         // show display mode switcher
 *         $scope.showDisplayModeSwitcher = true;
 *
 *         // show pager above
 *         $scope.showPager = true;
 *
 *         // show selection button under calendar sheet
 *         $scope.showSelectionButton = true;
 *
 *         // show today button under calendar sheet
 *         $scope.showTodayButton = true;
 *
 *         // show week number row
 *         $scope.showWeekNumbers = true;
 *
 *         // define number of years to show after current in year list
 *         $scope.yearsAfter = 4;
 *
 *         // define number of years to show before current in year list
 *         $scope.yearsBefore = 4;
 *
 *     });
 */

angular.module('keta.directives.TimeRangeSelector', [
	'moment'
])

	.constant('ketaTimeRangeSelectorConstants', {
		CSS_CLASSES: {
			CURRENT_DATE: 'current-date',
			OUT_OF_BOUNDS: 'out-of-bounds',
			OUT_OF_BOUNDS_AFTER: 'out-of-bounds-after',
			OUT_OF_BOUNDS_BEFORE: 'out-of-bounds-before',
			OUT_OF_MONTH: 'out-of-month',
			SELECTED_DATE: 'selected-date',
			SELECTED_DATE_FROM: 'selected-date-from',
			SELECTED_DATE_TO: 'selected-date-to'
		},
		DAY: {
			SUNDAY: 0,
			MONDAY: 1,
			TUESDAY: 2,
			WEDNESDAY: 3,
			THURSDAY: 4,
			FRIDAY: 5,
			SATURDAY: 6
		},
		DISPLAY_MODE: {
			DAY: 'day',
			MONTH: 'month',
			YEAR: 'year'
		}
	})

	// message keys with default values
	.constant('ketaTimeRangeSelectorMessageKeys', {
		'en_GB': {
			'__keta.directives.TimeRangeSelector_display_mode_days': 'Days',
			'__keta.directives.TimeRangeSelector_display_mode_months': 'Months',
			'__keta.directives.TimeRangeSelector_display_mode_years': 'Years',
			'__keta.directives.TimeRangeSelector_selection': 'Selection',
			'__keta.directives.TimeRangeSelector_today': 'Today',
			'__keta.directives.TimeRangeSelector_week': 'Week',
			'__keta.directives.TimeRangeSelector_weekday_sunday': 'Sunday',
			'__keta.directives.TimeRangeSelector_weekday_sunday_short': 'Sun',
			'__keta.directives.TimeRangeSelector_weekday_monday': 'Monday',
			'__keta.directives.TimeRangeSelector_weekday_monday_short': 'Mon',
			'__keta.directives.TimeRangeSelector_weekday_tuesday': 'Tuesday',
			'__keta.directives.TimeRangeSelector_weekday_tuesday_short': 'Tue',
			'__keta.directives.TimeRangeSelector_weekday_wednesday': 'Wednesday',
			'__keta.directives.TimeRangeSelector_weekday_wednesday_short': 'Wed',
			'__keta.directives.TimeRangeSelector_weekday_thursday': 'Thursday',
			'__keta.directives.TimeRangeSelector_weekday_thursday_short': 'Thu',
			'__keta.directives.TimeRangeSelector_weekday_friday': 'Friday',
			'__keta.directives.TimeRangeSelector_weekday_friday_short': 'Fri',
			'__keta.directives.TimeRangeSelector_weekday_saturday': 'Saturday',
			'__keta.directives.TimeRangeSelector_weekday_saturday_short': 'Sat',
			'__keta.directives.TimeRangeSelector_week_number': 'Week Number',
			'__keta.directives.TimeRangeSelector_week_number_short': 'Wn'
		},
		'de_DE': {
			'__keta.directives.TimeRangeSelector_display_mode_days': 'Tage',
			'__keta.directives.TimeRangeSelector_display_mode_months': 'Monate',
			'__keta.directives.TimeRangeSelector_display_mode_years': 'Jahre',
			'__keta.directives.TimeRangeSelector_selection': 'Auswahl',
			'__keta.directives.TimeRangeSelector_today': 'Heute',
			'__keta.directives.TimeRangeSelector_week': 'Woche',
			'__keta.directives.TimeRangeSelector_weekday_sunday': 'Sonntag',
			'__keta.directives.TimeRangeSelector_weekday_sunday_short': 'So',
			'__keta.directives.TimeRangeSelector_weekday_monday': 'Montag',
			'__keta.directives.TimeRangeSelector_weekday_monday_short': 'Mo',
			'__keta.directives.TimeRangeSelector_weekday_tuesday': 'Dienstag',
			'__keta.directives.TimeRangeSelector_weekday_tuesday_short': 'Di',
			'__keta.directives.TimeRangeSelector_weekday_wednesday': 'Mittwoch',
			'__keta.directives.TimeRangeSelector_weekday_wednesday_short': 'Mi',
			'__keta.directives.TimeRangeSelector_weekday_thursday': 'Donnerstag',
			'__keta.directives.TimeRangeSelector_weekday_thursday_short': 'Do',
			'__keta.directives.TimeRangeSelector_weekday_friday': 'Freitag',
			'__keta.directives.TimeRangeSelector_weekday_friday_short': 'Fr',
			'__keta.directives.TimeRangeSelector_weekday_saturday': 'Samstag',
			'__keta.directives.TimeRangeSelector_weekday_saturday_short': 'Sa',
			'__keta.directives.TimeRangeSelector_week_number': 'Kalenderwoche',
			'__keta.directives.TimeRangeSelector_week_number_short': 'KW'
		},
		'fr_FR': {
			'__keta.directives.TimeRangeSelector_display_mode_days': 'Journées',
			'__keta.directives.TimeRangeSelector_display_mode_months': 'Mois',
			'__keta.directives.TimeRangeSelector_display_mode_years': 'Années',
			'__keta.directives.TimeRangeSelector_selection': 'Sélection',
			'__keta.directives.TimeRangeSelector_today': 'Aujourd’hui',
			'__keta.directives.TimeRangeSelector_week': 'Semaine',
			'__keta.directives.TimeRangeSelector_weekday_sunday': 'Dimanche',
			'__keta.directives.TimeRangeSelector_weekday_sunday_short': 'Dim',
			'__keta.directives.TimeRangeSelector_weekday_monday': 'Lundi',
			'__keta.directives.TimeRangeSelector_weekday_monday_short': 'Lun',
			'__keta.directives.TimeRangeSelector_weekday_tuesday': 'Mardi',
			'__keta.directives.TimeRangeSelector_weekday_tuesday_short': 'Mar',
			'__keta.directives.TimeRangeSelector_weekday_wednesday': 'Mercredi',
			'__keta.directives.TimeRangeSelector_weekday_wednesday_short': 'Mer',
			'__keta.directives.TimeRangeSelector_weekday_thursday': 'Jeudi',
			'__keta.directives.TimeRangeSelector_weekday_thursday_short': 'Jeu',
			'__keta.directives.TimeRangeSelector_weekday_friday': 'Vendredi',
			'__keta.directives.TimeRangeSelector_weekday_friday_short': 'Ven',
			'__keta.directives.TimeRangeSelector_weekday_saturday': 'Samedi',
			'__keta.directives.TimeRangeSelector_weekday_saturday_short': 'Sam',
			'__keta.directives.TimeRangeSelector_week_number': 'Numéro de la semaine',
			'__keta.directives.TimeRangeSelector_week_number_short': 'Sem.'
		},
		'nl_NL': {
			'__keta.directives.TimeRangeSelector_display_mode_days': 'Dagen',
			'__keta.directives.TimeRangeSelector_display_mode_months': 'Maanden',
			'__keta.directives.TimeRangeSelector_display_mode_years': 'Jaren',
			'__keta.directives.TimeRangeSelector_selection': 'Selectie',
			'__keta.directives.TimeRangeSelector_today': 'Vandaag',
			'__keta.directives.TimeRangeSelector_week': 'Week',
			'__keta.directives.TimeRangeSelector_weekday_sunday': 'Zondag',
			'__keta.directives.TimeRangeSelector_weekday_sunday_short': 'Zo',
			'__keta.directives.TimeRangeSelector_weekday_monday': 'Maandag',
			'__keta.directives.TimeRangeSelector_weekday_monday_short': 'Ma',
			'__keta.directives.TimeRangeSelector_weekday_tuesday': 'Dinsdag',
			'__keta.directives.TimeRangeSelector_weekday_tuesday_short': 'Di',
			'__keta.directives.TimeRangeSelector_weekday_wednesday': 'Woensdag',
			'__keta.directives.TimeRangeSelector_weekday_wednesday_short': 'Wo',
			'__keta.directives.TimeRangeSelector_weekday_thursday': 'Donderdag',
			'__keta.directives.TimeRangeSelector_weekday_thursday_short': 'Do',
			'__keta.directives.TimeRangeSelector_weekday_friday': 'Vrijdag',
			'__keta.directives.TimeRangeSelector_weekday_friday_short': 'Vr',
			'__keta.directives.TimeRangeSelector_weekday_saturday': 'Zaterdag',
			'__keta.directives.TimeRangeSelector_weekday_saturday_short': 'Za',
			'__keta.directives.TimeRangeSelector_week_number': 'Weeknummer',
			'__keta.directives.TimeRangeSelector_week_number_short': 'Wn'
		},
		'it_IT': {
			'__keta.directives.TimeRangeSelector_display_mode_days': 'Giorni',
			'__keta.directives.TimeRangeSelector_display_mode_months': 'Mesi',
			'__keta.directives.TimeRangeSelector_display_mode_years': 'Anni',
			'__keta.directives.TimeRangeSelector_selection': 'Selezione',
			'__keta.directives.TimeRangeSelector_today': 'Oggi',
			'__keta.directives.TimeRangeSelector_week': 'Settimana',
			'__keta.directives.TimeRangeSelector_weekday_sunday': 'Domenica',
			'__keta.directives.TimeRangeSelector_weekday_sunday_short': 'Dom.',
			'__keta.directives.TimeRangeSelector_weekday_monday': 'Lunedì',
			'__keta.directives.TimeRangeSelector_weekday_monday_short': 'Lun.',
			'__keta.directives.TimeRangeSelector_weekday_tuesday': 'Martedì',
			'__keta.directives.TimeRangeSelector_weekday_tuesday_short': 'Mar.',
			'__keta.directives.TimeRangeSelector_weekday_wednesday': 'Mercoledì',
			'__keta.directives.TimeRangeSelector_weekday_wednesday_short': 'Mer.',
			'__keta.directives.TimeRangeSelector_weekday_thursday': 'Giovedì',
			'__keta.directives.TimeRangeSelector_weekday_thursday_short': 'Gio.',
			'__keta.directives.TimeRangeSelector_weekday_friday': 'Venerdì',
			'__keta.directives.TimeRangeSelector_weekday_friday_short': 'Ven.',
			'__keta.directives.TimeRangeSelector_weekday_saturday': 'Sabato',
			'__keta.directives.TimeRangeSelector_weekday_saturday_short': 'Sab.',
			'__keta.directives.TimeRangeSelector_week_number': 'Numero della settimana',
			'__keta.directives.TimeRangeSelector_week_number_short': 'Set.'
		}
	})

	.directive('ketaTimeRangeSelector', function TimeRangeSelectorDirective(
		$filter,
		ketaTimeRangeSelectorConstants, ketaTimeRangeSelectorMessageKeys, moment
	) {
		return {
			restrict: 'EA',
			replace: true,
			require: 'ngModel',
			scope: {

				// css classes to use
				cssClasses: '=?',

				// current locale
				currentLocale: '=?',

				// display mode (@see ketaTimeRangeSelectorConstants.DISPLAY)
				displayMode: '=?',

				// display value (date)
				displayValue: '=?',

				// enable display mode switch
				enableDisplayModeSwitch: '=?',

				// enable week selection
				enableWeekSelection: '=?',

				// first day of week (0...Sun, 1...Mon, 2...Tue, 3...Wed, 4...Thu, 5...Fri, 6...Sat)
				firstDayOfWeek: '=?',

				// object of labels to use in template
				labels: '=?',

				// maximum date selectable (date is included)
				maximum: '=?',

				// maximum range length in days or 0 to disable it
				maxRangeLength: '=?',

				// minimum date selectable (date is included)
				minimum: '=?',

				// minimum range length in days or 0 to disable it
				minRangeLength: '=?',

				// model value (range)
				model: '=ngModel',

				// show display mode switcher
				showDisplayModeSwitcher: '=?',

				// show pager above
				showPager: '=?',

				// show selection button
				showSelectionButton: '=?',

				// show today button
				showTodayButton: '=?',

				// show week numbers
				showWeekNumbers: '=?',

				// number of years to show before current in display mode year
				// must be a multiple of 3 added by 1 (e.g. 1, 4, 7, 11, ...)
				yearsAfter: '=?',

				// number of years to show after current in display mode year
				// must be a multiple of 3 added by 1 (e.g. 1, 4, 7, 11, ...)
				yearsBefore: '=?'

			},
			templateUrl: '/components/directives/time-range-selector.html',
			link: function(scope) {


				// CONSTANTS
				// ---------

				scope.DISPLAY_MODE_DAY = ketaTimeRangeSelectorConstants.DISPLAY_MODE.DAY;
				scope.DISPLAY_MODE_MONTH = ketaTimeRangeSelectorConstants.DISPLAY_MODE.MONTH;
				scope.DISPLAY_MODE_YEAR = ketaTimeRangeSelectorConstants.DISPLAY_MODE.YEAR;

				var DAYS_PER_WEEK = 7;
				var ISO_DATE_LENGTH_DAY = 10;
				var ISO_DATE_LENGTH_MONTH = 7;
				var ISO_DATE_LENGTH_YEAR = 4;
				var ISO_PADDING = 2;
				var LAST_SELECTED_FROM = 'from';
				var LAST_SELECTED_TO = 'to';
				var LOCALE_SHORT_LENGTH = 5;
				var MONTHS_PER_ROW = 3;
				var MONTHS_PER_YEAR = 12;
				var YEARS_AFTER = 4;
				var YEARS_BEFORE = 7;
				var YEARS_PER_ROW = 3;


				// CONFIGURATION
				// -------------

				var today = new Date();
				today.setHours(0, 0, 0, 0);

				var defaultModel = {
					from: null,
					to: null
				};

				scope.model =
					angular.isDefined(scope.model.from) && angular.isDate(scope.model.from) &&
					angular.isDefined(scope.model.to) && angular.isDate(scope.model.to)	?
						scope.model : defaultModel;

				if (scope.model.from !== null) {
					scope.model.from.setHours(0, 0, 0, 0);
				}
				if (scope.model.to !== null) {
					scope.model.to.setHours(0, 0, 0, 0);
				}

				scope.cssClasses =
					angular.isObject(scope.cssClasses) ?
						angular.extend(ketaTimeRangeSelectorConstants.CSS_CLASSES, scope.cssClasses) :
						ketaTimeRangeSelectorConstants.CSS_CLASSES;
				scope.currentLocale = angular.isString(scope.currentLocale) ? scope.currentLocale : 'en_GB';
				scope.displayMode = scope.displayMode || scope.DISPLAY_MODE_DAY;
				scope.displayValue =
					angular.isDate(scope.displayValue) ?
						new Date(scope.displayValue.setHours(0, 0, 0, 0)) : angular.copy(scope.model.from);
				if (scope.displayValue === null) {
					scope.displayValue = today;
				}
				scope.enableDisplayModeSwitch =
					angular.isDefined(scope.enableDisplayModeSwitch) ?
						scope.enableDisplayModeSwitch : false;
				scope.enableWeekSelection =
					angular.isDefined(scope.enableWeekSelection) ?
						scope.enableWeekSelection : false;
				scope.firstDayOfWeek = scope.firstDayOfWeek || ketaTimeRangeSelectorConstants.DAY.SUNDAY;

				// object of labels
				scope.MESSAGE_KEY_PREFIX = '__keta.directives.TimeRangeSelector';
				scope.labels =
					angular.isObject(scope.labels) ?
						angular.extend(ketaTimeRangeSelectorMessageKeys, scope.labels) :
						ketaTimeRangeSelectorMessageKeys;
				scope.currentLabels =
					angular.isDefined(
						ketaTimeRangeSelectorMessageKeys[scope.currentLocale.substr(0, LOCALE_SHORT_LENGTH)]
					) ?
						ketaTimeRangeSelectorMessageKeys[scope.currentLocale.substr(0, LOCALE_SHORT_LENGTH)] :
						ketaTimeRangeSelectorMessageKeys.en_GB;

				scope.maximum =
					angular.isDate(scope.maximum) ?
						new Date(scope.maximum.setHours(0, 0, 0, 0)) : null;
				scope.maxRangeLength =
					angular.isNumber(scope.maxRangeLength) ?
						Math.max(0, Math.round(scope.maxRangeLength)) : 0;
				scope.minimum =
					angular.isDate(scope.minimum) ?
						new Date(scope.minimum.setHours(0, 0, 0, 0)) : null;
				scope.minRangeLength =
					angular.isNumber(scope.minRangeLength) ?
						Math.max(0, Math.round(scope.minRangeLength)) : 0;
				scope.showDisplayModeSwitcher =
					angular.isDefined(scope.showDisplayModeSwitcher) ?
						scope.showDisplayModeSwitcher : true;
				scope.showPager =
					angular.isDefined(scope.showPager) ?
						scope.showPager : true;
				scope.showSelectionButton =
					angular.isDefined(scope.showSelectionButton) ?
						scope.showSelectionButton : false;
				scope.showTodayButton =
					angular.isDefined(scope.showTodayButton) ?
						scope.showTodayButton : false;
				scope.showWeekNumbers =
					angular.isDefined(scope.showWeekNumbers) ?
						scope.showWeekNumbers : true;
				scope.yearsBefore = scope.yearsBefore || YEARS_BEFORE;
				scope.yearsAfter = scope.yearsAfter || YEARS_AFTER;


				// DATA
				// ----

				scope.weekDays = [];
				scope.days = [];

				scope.months = [];
				scope.years = [];


				// HELPER
				// ------

				/**
				 * get week days for currently set first day of week
				 * @returns {void} nothing
				 */
				var getWeekDays = function getWeekDays() {

					var weekDays = [];

					var weekDayLabels = [
						scope.currentLabels[scope.MESSAGE_KEY_PREFIX + '_weekday_sunday_short'],
						scope.currentLabels[scope.MESSAGE_KEY_PREFIX + '_weekday_monday_short'],
						scope.currentLabels[scope.MESSAGE_KEY_PREFIX + '_weekday_tuesday_short'],
						scope.currentLabels[scope.MESSAGE_KEY_PREFIX + '_weekday_wednesday_short'],
						scope.currentLabels[scope.MESSAGE_KEY_PREFIX + '_weekday_thursday_short'],
						scope.currentLabels[scope.MESSAGE_KEY_PREFIX + '_weekday_friday_short'],
						scope.currentLabels[scope.MESSAGE_KEY_PREFIX + '_weekday_saturday_short']
					];

					var start = scope.firstDayOfWeek;
					while (weekDays.length < DAYS_PER_WEEK) {
						weekDays.push(weekDayLabels[start]);
						start++;
						start %= DAYS_PER_WEEK;
					}

					scope.weekDays = weekDays;

				};

				/**
				 * get days for month in timeRange.view
				 * @returns {void} nothing
				 */
				var getDays = function getDays() {

					// get first of current and next month
					var firstOfCurrentMonth =
						moment(scope.displayValue.getTime()).startOf('month')
							.hours(0).minutes(0).seconds(0).milliseconds(0);
					var firstOfCurrentMonthWeekDay = firstOfCurrentMonth.day();

					var lastOfCurrentMonth = moment(firstOfCurrentMonth).add(1, 'months').subtract(1, 'days');
					var lastOfCurrentMonthWeekDay = lastOfCurrentMonth.day();

					var days = [];
					var i = 0;

					// PREPEND DAYS ===

					// days to prepend to first of week
					if (firstOfCurrentMonthWeekDay < scope.firstDayOfWeek) {
						firstOfCurrentMonthWeekDay += DAYS_PER_WEEK;
					}
					var daysToPrepend = firstOfCurrentMonthWeekDay - scope.firstDayOfWeek;

					// prepend days
					for (i = daysToPrepend; i > 0; i--) {
						var prependedDay = moment(firstOfCurrentMonth).subtract(i, 'days');
						days.push(prependedDay.toDate());
					}

					// MONTH DAYS ===

					var monthDays = moment(lastOfCurrentMonth).date();
					for (i = 0; i < monthDays; i++) {
						var monthDay = moment(firstOfCurrentMonth).add(i, 'days');
						days.push(monthDay.toDate());
					}

					// APPEND DAYS ===

					// days to append to last of week
					if (lastOfCurrentMonthWeekDay < scope.firstDayOfWeek) {
						lastOfCurrentMonthWeekDay += DAYS_PER_WEEK;
					}
					var daysToAppend = DAYS_PER_WEEK - (lastOfCurrentMonthWeekDay - scope.firstDayOfWeek) - 1;

					// append days
					for (i = 1; i <= daysToAppend; i++) {
						var appendedDay = moment(lastOfCurrentMonth).add(i, 'days');
						days.push(appendedDay.toDate());
					}

					// CHUNK DAYS ===

					// chunk days in weeks
					var chunks = [];
					var chunk = [];

					angular.forEach(days, function(day, index) {
						chunk.push(day);

						// add week
						if ((index + 1) % DAYS_PER_WEEK === 0) {
							chunks.push(chunk);
							chunk = [];
						}
					});

					scope.days = chunks;

				};

				/**
				 * get months
				 * @returns {void} nothing
				 */
				var getMonths = function getMonths() {

					var months = [];
					var monthsChunked = [];

					var now =
						moment(scope.displayValue)
							.date(1).hour(0).minute(0).second(0).millisecond(0)
							.toDate();

					for (var i = 0; i < MONTHS_PER_YEAR; i++) {
						now.setMonth(i);
						months.push(angular.copy(now));
					}

					// chunk months in blocks of four
					var chunk = [];
					angular.forEach(months, function(month, index) {
						chunk.push(month);

						// add row
						if ((index + 1) % MONTHS_PER_ROW === 0) {
							monthsChunked.push(chunk);
							chunk = [];
						}
					});

					scope.months = monthsChunked;

				};

				/**
				 * get years around year in timeRange.view
				 * @returns {void} nothing
				 */
				var getYears = function getYears() {

					var years = [];
					var yearsChunked = [];

					var now =
						moment(new Date())
							.month(0).date(1).hour(0).minute(0).second(0).millisecond(0)
							.toDate();

					var currentYear = parseInt($filter('date')(now, 'yyyy'), 10);
					var yearStart = currentYear - scope.yearsBefore;
					var yearEnd = currentYear + scope.yearsAfter;

					var viewYear = parseInt($filter('date')(scope.displayValue, 'yyyy'), 10);
					var range = scope.yearsBefore + scope.yearsAfter + 1;

					// shift to the past until view year is within range
					if (viewYear < yearStart) {
						while (viewYear < yearStart) {
							yearStart -= range;
							yearEnd -= range;
						}
					}

					// shift to the future until view year is within range
					if (viewYear > yearEnd) {
						while (viewYear > yearEnd) {
							yearStart += range;
							yearEnd += range;
						}
					}

					for (var i = yearStart; i <= yearEnd; i++) {
						now.setFullYear(i);
						years.push(angular.copy(now));
					}

					// chunk years in blocks of four
					var chunk = [];
					angular.forEach(years, function(year, index) {
						chunk.push(year);

						// add row
						if ((index + 1) % YEARS_PER_ROW === 0) {
							yearsChunked.push(chunk);
							chunk = [];
						}
					});

					scope.years = yearsChunked;

				};

				/**
				 * get locale iso date for given date and length
				 * @param {Date} date date to extract iso format from
				 * @param {number} length length of iso date
				 * @returns {string} iso date
				 */
				var getLocaleISO = function getLocaleISO(date, length) {
					var iso =
						date.getFullYear() + '-' +
						('00' + (date.getMonth() + 1)).slice(-ISO_PADDING) + '-' +
						('00' + date.getDate()).slice(-ISO_PADDING);
					return iso.substr(0, length);
				};

				/**
				 * checks if given date is out of bounds
				 * @param {Date} date date to get classes for
				 * @returns {boolean} true if out of bounds
				 */
				scope.isOutOfBounds = function isOutOfBounds(date) {
					var outOfBounds = false;
					var dateISO = getLocaleISO(date, ISO_DATE_LENGTH_DAY);

					if (scope.minimum !== null &&
						dateISO < getLocaleISO(scope.minimum, ISO_DATE_LENGTH_DAY)) {
						outOfBounds = true;
					}

					if (scope.maximum !== null &&
						dateISO > getLocaleISO(scope.maximum, ISO_DATE_LENGTH_DAY)) {
						outOfBounds = true;
					}

					return outOfBounds;
				};

				/**
				 * get date classes
				 * @param {Date} date date to get classes for
				 * @returns {string} classes as space-separated strings
				 */
				scope.getDateClasses = function getDateClasses(date) {
					var classes = [];

					var td = new Date(new Date().setHours(0, 0, 0, 0));
					var current = scope.displayValue;

					var isoDateLength = ISO_DATE_LENGTH_DAY;
					var outOfBoundDates = [
						getLocaleISO(date, ISO_DATE_LENGTH_DAY),
						getLocaleISO(date, ISO_DATE_LENGTH_DAY)
					];
					if (scope.displayMode === scope.DISPLAY_MODE_MONTH) {
						isoDateLength = ISO_DATE_LENGTH_MONTH;
						outOfBoundDates = [
							getLocaleISO(moment(date).clone().startOf('month').toDate(), ISO_DATE_LENGTH_DAY),
							getLocaleISO(moment(date).clone().endOf('month').toDate(), ISO_DATE_LENGTH_DAY)
						];
					}
					if (scope.displayMode === scope.DISPLAY_MODE_YEAR) {
						isoDateLength = ISO_DATE_LENGTH_YEAR;
						outOfBoundDates = [
							getLocaleISO(moment(date).clone().startOf('year').toDate(), ISO_DATE_LENGTH_DAY),
							getLocaleISO(moment(date).clone().endOf('year').toDate(), ISO_DATE_LENGTH_DAY)
						];
					}

					var selectedDateFromISO = scope.model.from !== null ?
						getLocaleISO(scope.model.from, isoDateLength) : null;
					var selectedDateToISO = scope.model.to !== null ?
						getLocaleISO(scope.model.to, isoDateLength) : null;
					var dateISO = getLocaleISO(date, isoDateLength);
					var todayISO = getLocaleISO(td, isoDateLength);

					if (scope.displayMode === scope.DISPLAY_MODE_DAY &&
						date.getMonth() !== current.getMonth()) {
						classes.push(scope.cssClasses.OUT_OF_MONTH);
					}

					if (scope.minimum !== null) {
						var minimumISO = getLocaleISO(scope.minimum, ISO_DATE_LENGTH_DAY);
						if (outOfBoundDates[0] < minimumISO && outOfBoundDates[1] < minimumISO) {
							classes.push(scope.cssClasses.OUT_OF_BOUNDS);
							classes.push(scope.cssClasses.OUT_OF_BOUNDS_BEFORE);
						}
					}

					if (scope.maximum !== null) {
						var maximumISO = getLocaleISO(scope.maximum, ISO_DATE_LENGTH_DAY);
						if (outOfBoundDates[0] > maximumISO && outOfBoundDates[1] > maximumISO) {
							classes.push(scope.cssClasses.OUT_OF_BOUNDS);
							classes.push(scope.cssClasses.OUT_OF_BOUNDS_AFTER);
						}
					}

					if (dateISO === todayISO) {
						classes.push(scope.cssClasses.CURRENT_DATE);
					}

					if (selectedDateFromISO !== null && selectedDateToISO !== null &&
						dateISO >= selectedDateFromISO && dateISO <= selectedDateToISO) {
						classes.push(scope.cssClasses.SELECTED_DATE);
					}
					if (selectedDateFromISO !== null && dateISO === selectedDateFromISO) {
						classes.push(scope.cssClasses.SELECTED_DATE_FROM);
					}
					if (selectedDateToISO !== null && dateISO === selectedDateToISO) {
						classes.push(scope.cssClasses.SELECTED_DATE_TO);
					}

					return classes.join(' ');
				};

				/**
				 * get year range around timeRange.view
				 * @returns {string} year range
				 */
				scope.getYearRange = function getYearRange() {
					var year = parseInt($filter('date')(scope.displayValue, 'yyyy'), 10);
					var yearStart = year - scope.yearsBefore;
					var yearEnd = year + scope.yearsAfter;
					return yearStart + ' – ' + yearEnd;
				};


				// INIT
				// ----

				/**
				 * update component data
				 * @returns {void} nothing
				 */
				var update = function update() {

					// update current labels
					scope.currentLabels =
						angular.isDefined(
							ketaTimeRangeSelectorMessageKeys[scope.currentLocale.substr(0, LOCALE_SHORT_LENGTH)]
						) ?
							ketaTimeRangeSelectorMessageKeys[scope.currentLocale.substr(0, LOCALE_SHORT_LENGTH)] :
							ketaTimeRangeSelectorMessageKeys.en_GB;

					// init week days
					getWeekDays();

					// init calendar sheet data
					if (scope.displayMode === scope.DISPLAY_MODE_MONTH) {
						getMonths();
					} else if (scope.displayMode === scope.DISPLAY_MODE_YEAR) {
						getYears();
					} else {
						getDays();
					}

				};

				update();


				// ACTIONS
				// -------

				/**
				 * move to direction based on current display
				 * @param {number} direction move offset
				 * @returns {void} nothing
				 */
				var move = function move(direction) {

					if (scope.displayMode === scope.DISPLAY_MODE_MONTH) {
						scope.displayValue = moment(scope.displayValue).add(direction, 'years').toDate();
					} else if (scope.displayMode === scope.DISPLAY_MODE_YEAR) {
						scope.displayValue = moment(scope.displayValue).add(
							direction * (scope.yearsBefore + scope.yearsAfter + 1),
							'years'
						).toDate();
					} else {
						scope.displayValue = moment(scope.displayValue).add(direction, 'months').toDate();
					}

					update();

				};

				/**
				 * move to previous based on current display
				 * @returns {void} nothing
				 */
				scope.prev = function prev() {
					move(-1);
				};

				/**
				 * move to next based on current display
				 * @returns {void} nothing
				 */
				scope.next = function next() {
					move(1);
				};

				// save last selected range boundary ('from' | 'to')
				var lastSelected = LAST_SELECTED_FROM;

				/**
				 * get display mode dependent date
				 * @param {Date} date date to convert to a display mode dependent value
				 * @param {string} mode display mode
				 * @param {boolean} from from or to value
				 * @returns {Date} converted date
				 */
				var getDisplayModeDate = function getDisplayModeDate(date, mode, from) {
					var displayModeDate = null;

					if (mode === ketaTimeRangeSelectorConstants.DISPLAY_MODE.MONTH) {
						displayModeDate = from ?
							date : moment(date).endOf('month').hour(0).minute(0).second(0).millisecond(0).toDate();
					} else if (mode === ketaTimeRangeSelectorConstants.DISPLAY_MODE.YEAR) {
						displayModeDate = from ?
							date : moment(date).endOf('year').hour(0).minute(0).second(0).millisecond(0).toDate();
					} else {
						displayModeDate = angular.copy(date);
					}

					return displayModeDate;
				};

				/**
				 * apply range length constraint (if enabled)
				 * @param {Date} from from date
				 * @param {Date} to to date
				 * @param {number} min minimum range length in days or null
				 * @param {number} max maximum range length in days or null
				 * @returns {{from: *, to: *}} range
				 */
				var applyRangeLength = function applyRangeLength(from, to, min, max) {
					var range = {
						from: from,
						to: to
					};

					// get duration in days
					var days = moment(to).diff(moment(from), 'days');

					// selection is longer than the valid max value (!== 0)
					if (max !== 0 && days >= max) {
						if (lastSelected === LAST_SELECTED_FROM) {
							range.to = moment(from).add(max - 1, 'days').toDate();
						} else {
							range.from = moment(to).subtract(max - 1, 'days').toDate();
						}
					}

					// selection is shorter than the valid min value (!== 0)
					if (min !== 0 && days <= min) {
						if (lastSelected === LAST_SELECTED_FROM) {
							range.to = moment(from).add(min - 1, 'days').toDate();
						} else {
							range.from = moment(to).subtract(min - 1, 'days').toDate();
						}
					}

					return range;
				};

				/**
				 * apply boundaries constraint (if enabled)
				 * @param {Date} from from date
				 * @param {Date} to to date
				 * @param {number} min minimum as timestamp or null
				 * @param {number} max maximum as timestamp or null
				 * @returns {{from: *, to: *}} range
				 */
				var applyBoundaries = function applyBoundaries(from, to, min, max) {
					var range = {
						from: from,
						to: to
					};

					if (min !== null && range.from < min) {
						range.from = min;
					}

					if (max !== null && range.to > max) {
						range.to = max;
					}

					return range;
				};

				/**
				 * select given date
				 * @param {Date} date date selected
				 * @returns {void} nothing
				 */
				scope.select = function select(date) {

					// keep date within boundaries
					if (scope.minimum !== null && date.getTime() < scope.minimum) {
						date = new Date(scope.minimum);
					}
					if (scope.maximum !== null && date.getTime() > scope.maximum) {
						date = new Date(scope.maximum);
					}

					if (scope.model.from === null && scope.model.to === null) {

						// if we have no range at all, set from and to to date
						scope.model.from = getDisplayModeDate(date, scope.displayMode, true);
						scope.model.to = getDisplayModeDate(date, scope.displayMode, false);
						lastSelected = LAST_SELECTED_FROM;

					} else if (angular.equals(scope.model.from, date)) {

						// if we got a click on current from, set to to date
						scope.model.to = getDisplayModeDate(scope.model.from, scope.displayMode, false);
						lastSelected = LAST_SELECTED_TO;

					} else if (angular.equals(scope.model.to, date)) {

						// if we got a click on current to, set from to date
						scope.model.from = getDisplayModeDate(scope.model.to, scope.displayMode, true);
						lastSelected = LAST_SELECTED_FROM;

					} else if (date.getTime() < scope.model.from.getTime()) {

						// if we got a click before from, set from to date
						scope.model.from = getDisplayModeDate(date, scope.displayMode, true);
						lastSelected = LAST_SELECTED_FROM;

					} else if (date.getTime() > scope.model.to.getTime()) {

						// if we got a click after to, set to to date
						scope.model.to = getDisplayModeDate(date, scope.displayMode, false);
						lastSelected = LAST_SELECTED_TO;

					} else if (lastSelected === LAST_SELECTED_FROM) {

						// if we got a click in between and last selected is from, set to to date
						// shorten range from from to date
						scope.model.to = getDisplayModeDate(date, scope.displayMode, false);
						lastSelected = LAST_SELECTED_TO;

					} else {

						// if we got a click in between and last selected is to, set from to date
						// shorten range from date to to
						scope.model.from = getDisplayModeDate(date, scope.displayMode, true);
						lastSelected = LAST_SELECTED_FROM;

					}

					// apply minRangeLength and maxRangeLength
					scope.model = applyRangeLength(
						scope.model.from, scope.model.to,
						scope.minRangeLength, scope.maxRangeLength
					);

					// apply minimum and maximum
					scope.model = applyBoundaries(
						scope.model.from, scope.model.to,
						scope.minimum, scope.maximum
					);

					// update display value
					scope.displayValue =
						lastSelected === LAST_SELECTED_FROM ?
							angular.copy(scope.model.from) : angular.copy(scope.model.to);

				};

				/**
				 * select week for given date
				 * @param {Date} date date selected
				 * @returns {void} nothing
				 */
				scope.selectWeek = function selectWeek(date) {

					var firstOfWeek = moment(date).hour(0).minute(0).second(0).millisecond(0).toDate();
					var lastOfWeek =
						moment(firstOfWeek).add(DAYS_PER_WEEK - 1, 'days')
							.hour(0).minute(0).second(0).millisecond(0).toDate();

					if (!scope.isOutOfBounds(firstOfWeek) &&
						!scope.isOutOfBounds(lastOfWeek) &&
						(scope.minRangeLength === 0 || scope.minRangeLength <= DAYS_PER_WEEK) &&
						(scope.maxRangeLength === 0 || scope.maxRangeLength >= DAYS_PER_WEEK) &&
						scope.enableWeekSelection) {
						scope.model.from = getDisplayModeDate(firstOfWeek, scope.displayMode, true);
						scope.model.to = getDisplayModeDate(lastOfWeek, scope.displayMode, false);
					}

				};

				/**
				 * jump to the view with the current selection in it
				 * @returns {void} nothing
				 */
				scope.goToSelection = function goToSelection() {
					if (scope.model.from !== null) {
						scope.displayValue = lastSelected === LAST_SELECTED_FROM ?
							angular.copy(scope.model.from) : angular.copy(scope.model.to);
					}
				};

				/**
				 * jump to the view with the current day in it
				 * @returns {void} nothing
				 */
				scope.goToToday = function goToToday() {
					var td = new Date();
					td.setHours(0, 0, 0, 0);
					scope.displayValue = td;
				};

				/**
				 * set display mode
				 * @param {string} mode new display mode
				 * @returns {void} nothing
				 */
				scope.setDisplayMode = function setDisplayMode(mode) {
					scope.displayMode = mode;
					update();
				};

				/**
				 * set view and display after click on month or year
				 * @param {Date} date date to show on calender
				 * @param {string} displayMode which display mode should be shown after click
				 * @return {void} nothing
				 */
				scope.setView = function setView(date, displayMode) {
					scope.displayValue = angular.copy(date);
					scope.displayMode = displayMode;
				};


				// WATCHER
				// -------

				// watcher for current locale
				scope.$watch('currentLocale', function(newValue, oldValue) {
					if (newValue !== oldValue && angular.isString(newValue)) {
						update();
					}
				});

				// watcher for display mode
				scope.$watch('displayMode', function(newValue, oldValue) {
					if (newValue !== oldValue) {
						update();
					}
				});

				// watcher for display value
				scope.$watch('displayValue', function(newValue, oldValue) {
					if (newValue !== oldValue && angular.isDate(newValue)) {
						update();
					}
				});

				// watcher for first day of week
				scope.$watch('firstDayOfWeek', function(newValue, oldValue) {
					if (newValue !== oldValue) {
						update();
					}
				});

				// watcher for max range length
				scope.$watch('maxRangeLength', function(newValue, oldValue) {
					if (newValue !== oldValue) {
						scope.model = applyRangeLength(
							scope.model.from, scope.model.to,
							scope.minRangeLength, newValue
						);
					}
				});

				// watcher for min range length
				scope.$watch('minRangeLength', function(newValue, oldValue) {
					if (newValue !== oldValue) {
						scope.model = applyRangeLength(
							scope.model.from, scope.model.to,
							newValue, scope.maxRangeLength
						);
					}
				});

				// watcher for maximum
				scope.$watch('maximum', function(newValue, oldValue) {
					if (newValue !== oldValue) {
						scope.model = applyBoundaries(
							scope.model.from, scope.model.to,
							scope.mininum, newValue
						);
					}
				});

				// watcher for mininum
				scope.$watch('minimum', function(newValue, oldValue) {
					if (newValue !== oldValue) {
						scope.model = applyBoundaries(
							scope.model.from, scope.model.to,
							newValue, scope.maximum
						);
					}
				});

				// watcher for years after
				scope.$watch('yearsAfter', function(newValue, oldValue) {
					if (newValue !== oldValue) {
						update();
					}
				});

				// watcher for years before
				scope.$watch('yearsBefore', function(newValue, oldValue) {
					if (newValue !== oldValue) {
						update();
					}
				});

			}
		};
	});

// prepopulate template cache
angular.module('keta.directives.TimeRangeSelector')
	.run(function($templateCache) {
		$templateCache.put('/components/directives/time-range-selector.html', '<div class="keta-time-range-selector">' +
'' +
'	<!-- view mode -->' +
'	<p class="text-center display-mode-switcher" data-ng-if="showDisplayModeSwitcher">' +
'		<strong data-ng-if="displayMode === DISPLAY_MODE_DAY">{{ currentLabels[MESSAGE_KEY_PREFIX + \'_display_mode_days\'] }}</strong>' +
'		<a href="" data-ng-if="displayMode !== DISPLAY_MODE_DAY"' +
'			data-ng-click="setView(displayValue, DISPLAY_MODE_DAY)">{{ currentLabels[MESSAGE_KEY_PREFIX + \'_display_mode_days\'] }}</a> |' +
'		<strong data-ng-if="displayMode === DISPLAY_MODE_MONTH">{{ currentLabels[MESSAGE_KEY_PREFIX + \'_display_mode_months\'] }}</strong>' +
'		<a href="" data-ng-if="displayMode !== DISPLAY_MODE_MONTH"' +
'			data-ng-click="setView(displayValue, DISPLAY_MODE_MONTH)">{{ currentLabels[MESSAGE_KEY_PREFIX + \'_display_mode_months\'] }}</a> |' +
'		<strong data-ng-if="displayMode === DISPLAY_MODE_YEAR">{{ currentLabels[MESSAGE_KEY_PREFIX + \'_display_mode_years\'] }}</strong>' +
'		<a href="" data-ng-if="displayMode !== DISPLAY_MODE_YEAR"' +
'			data-ng-click="setView(displayValue, DISPLAY_MODE_YEAR)">{{ currentLabels[MESSAGE_KEY_PREFIX + \'_display_mode_years\'] }}</a>' +
'	</p>' +
'' +
'	<!-- pager -->' +
'	<ul class="pager pager-navigation" data-ng-if="showPager">' +
'		<li class="previous">' +
'			<a href="" data-ng-click="prev()"><span aria-hidden="true">&larr;</span></a>' +
'		</li>' +
'		<li class="text-center" data-ng-if="displayMode === DISPLAY_MODE_DAY">' +
'			<a href=""' +
'				data-ng-if="enableDisplayModeSwitch"' +
'				data-ng-click="setDisplayMode(DISPLAY_MODE_MONTH)">{{ displayValue | date:\'MMMM yyyy\' }}</a>' +
'			<a data-ng-if="!enableDisplayModeSwitch">{{ displayValue | date:\'MMMM yyyy\' }}</a>' +
'		</li>' +
'		<li class="text-center" data-ng-if="displayMode === DISPLAY_MODE_MONTH">' +
'			<a href=""' +
'				data-ng-if="enableDisplayModeSwitch"' +
'				data-ng-click="setDisplayMode(DISPLAY_MODE_YEAR)">{{ displayValue | date:\'yyyy\' }}</a>' +
'			<a data-ng-if="!enableDisplayModeSwitch">{{ displayValue | date:\'yyyy\' }}</a>' +
'		</li>' +
'		<li class="text-center" data-ng-if="displayMode === DISPLAY_MODE_YEAR">' +
'			<div class="pager-link">{{ getYearRange() }}</div>' +
'		</li>' +
'		<li class="next">' +
'			<a href="" data-ng-click="next()"><span aria-hidden="true">&rarr;</span></a>' +
'		</li>' +
'	</ul>' +
'' +
'	<!-- days -->' +
'	<table class="calendar calendar-day" data-ng-if="displayMode === DISPLAY_MODE_DAY">' +
'		<tr>' +
'			<td data-ng-if="showWeekNumbers">' +
'				<a class="weekday">{{ currentLabels[MESSAGE_KEY_PREFIX + \'_week_number_short\'] }}</a>' +
'			</td>' +
'			<td data-ng-repeat="day in weekDays">' +
'				<a class="weekday">{{ day }}</a>' +
'			</td>' +
'		</tr>' +
'		<tr data-ng-repeat="week in days">' +
'			<td data-ng-if="showWeekNumbers">' +
'				<a class="week-number" data-ng-click="selectWeek(week[0])">{{ week[0] | date:\'w\' }}</a>' +
'			</td>' +
'			<td data-ng-repeat="day in week">' +
'				<a href=""' +
'					data-ng-click="select(day)"' +
'					data-ng-class="getDateClasses(day)">{{ day | date:\'d\' }}</a>' +
'			</td>' +
'		</tr>' +
'	</table>' +
'' +
'	<!-- months -->' +
'	<table class="calendar calendar-month" data-ng-if="displayMode === DISPLAY_MODE_MONTH">' +
'		<tr data-ng-repeat="row in months">' +
'			<td data-ng-repeat="month in row">' +
'				<a href=""' +
'					data-ng-click="select(month)"' +
'					data-ng-class="getDateClasses(month)">{{ month | date:\'MMM\' }}</a>' +
'			</td>' +
'		</tr>' +
'	</table>' +
'' +
'	<!-- years -->' +
'	<table class="calendar calendar-year" data-ng-if="displayMode === DISPLAY_MODE_YEAR">' +
'		<tr data-ng-repeat="row in years">' +
'			<td data-ng-repeat="year in row">' +
'				<a href=""' +
'					data-ng-click="select(year)"' +
'					data-ng-class="getDateClasses(year)">{{ year | date:\'yyyy\' }}</a>' +
'			</td>' +
'		</tr>' +
'	</table>' +
'' +
'	<!-- quick links -->' +
'	<ul class="pager pager-quick-links" data-ng-if="showSelectionButton || showTodayButton">' +
'		<li class="text-center">' +
'			<a href="" data-ng-if="showTodayButton"' +
'				data-ng-click="goToToday()">{{ currentLabels[MESSAGE_KEY_PREFIX + \'_today\'] }}</a>' +
'			<a href="" data-ng-if="showSelectionButton"' +
'				data-ng-click="goToSelection()">{{ currentLabels[MESSAGE_KEY_PREFIX + \'_selection\'] }}</a>' +
'		</li>' +
'	</ul>' +
'' +
'</div>' +
'');
	});
