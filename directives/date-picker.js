'use strict';

/**
 * @name keta.directives.DatePicker
 * @author Marco Lehmann <marco.lehmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2016
 * @module keta.directives.DatePicker
 * @description
 * <p>
 *   A simple date picker component to select a single date.
 * </p>
 * @example
 * &lt;div data-keta-date-picker
 *   data-ng-model="model"
 *   data-css-classes="cssClasses"
 *   data-current-locale="currentLocale"
 *   data-display-mode="displayMode"
 *   data-display-value="displayValue"
 *   data-element-identifier="elementIdentifier"
 *   data-enable-display-mode-switch="enableDisplayModeSwitch"
 *   data-first-day-of-week="firstDayOfWeek"
 *   data-labels="labels"
 *   data-minimum="minimum"
 *   data-maximum="maximum"
 *   data-show-pager="showPager"
 *   data-show-jump-to-selection-button="showJumpToSelectionButton"
 *   data-show-jump-to-today-button="showJumpToTodayButton"
 *   data-show-select-button="showSelectButton"
 *   data-show-week-numbers="showWeekNumbers"
 *   data-years-after="yearsAfter"
 *   data-years-before="yearsBefore"&gt;&lt;/div&gt;
 * @example
 * angular.module('exampleApp', ['keta.directives.DatePicker'])
 *     .controller('ExampleController', function($scope, ketaDatePickerConstants, ketaDatePickerMessageKeys) {
 *
 *         // current value to use
 *         $scope.model = new Date(2016, 3, 20, 9, 0, 0, 0);
 *
 *         // css classes to use
 *         $scope.cssClasses = ketaDatePickerConstants.CSS_CLASSES;
 *
 *         // current locale to use
 *         $scope.currentLocale = 'de_DE';
 *
 *         // display mode to use (@see ketaDatePickerConstants.DISPLAY_MODE)
 *         $scope.displayMode = ketaDatePickerConstants.DISPLAY_MODE.DAY;
 *
 *         // display value to use
 *         $scope.displayValue = angular.copy($scope.model);
 *
 *         // element identifier
 *         $scope.elementIdentifier = 'myDatePicker';
 *
 *         // enable display mode switch
 *         $scope.enableDisplayModeSwitch = true;
 *
 *         // define first day of week
 *         $scope.firstDayOfWeek = ketaDatePickerConstants.DAY.SUNDAY;
 *
 *         // define labels to use
 *         $scope.labels = DatePickerMessageKeys;
 *
 *         // define an optional minimum boundary
 *         $scope.minimum = moment($scope.now).subtract(30, 'days').toDate();
 *
 *         // define an optional maximum boundary
 *         $scope.maximum = moment($scope.now).add(30, 'days').toDate();
 *
 *         // show pager above
 *         $scope.showPager = true;
 *
 *         // show jump to selection button under calendar sheet
 *         $scope.showJumpToSelectionButton = true;
 *
 *         // show jump to today button under calendar sheet
 *         $scope.showJumpToTodayButton = true;
 *
 *         // show select button under calendar sheet
 *         $scope.showSelectButton = true;
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

angular.module('keta.directives.DatePicker', [
	'moment'
])

	.constant('ketaDatePickerConstants', {
		CSS_CLASSES: {
			CURRENT_DATE: 'current-date',
			OUT_OF_BOUNDS: 'out-of-bounds',
			OUT_OF_BOUNDS_AFTER: 'out-of-bounds-after',
			OUT_OF_BOUNDS_BEFORE: 'out-of-bounds-before',
			OUT_OF_MONTH: 'out-of-month',
			SELECTED_DATE: 'selected-date-single'
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
		},
		EVENT: {
			SELECT: 'keta.directives.DatePicker.Event.Selected'
		}
	})

	// message keys with default values
	.constant('ketaDatePickerMessageKeys', {
		'en_GB': {
			'__keta.directives.DatePicker_select': 'Select',
			'__keta.directives.DatePicker_selection': 'Selection',
			'__keta.directives.DatePicker_today': 'Today',
			'__keta.directives.DatePicker_week': 'Week',
			'__keta.directives.DatePicker_weekday_sunday': 'Sunday',
			'__keta.directives.DatePicker_weekday_sunday_short': 'Sun',
			'__keta.directives.DatePicker_weekday_monday': 'Monday',
			'__keta.directives.DatePicker_weekday_monday_short': 'Mon',
			'__keta.directives.DatePicker_weekday_tuesday': 'Tuesday',
			'__keta.directives.DatePicker_weekday_tuesday_short': 'Tue',
			'__keta.directives.DatePicker_weekday_wednesday': 'Wednesday',
			'__keta.directives.DatePicker_weekday_wednesday_short': 'Wed',
			'__keta.directives.DatePicker_weekday_thursday': 'Thursday',
			'__keta.directives.DatePicker_weekday_thursday_short': 'Thu',
			'__keta.directives.DatePicker_weekday_friday': 'Friday',
			'__keta.directives.DatePicker_weekday_friday_short': 'Fri',
			'__keta.directives.DatePicker_weekday_saturday': 'Saturday',
			'__keta.directives.DatePicker_weekday_saturday_short': 'Sat',
			'__keta.directives.DatePicker_week_number': 'Week Number',
			'__keta.directives.DatePicker_week_number_short': 'Wn'
		},
		'de_DE': {
			'__keta.directives.DatePicker_select': 'Auswählen',
			'__keta.directives.DatePicker_selection': 'Auswahl',
			'__keta.directives.DatePicker_today': 'Heute',
			'__keta.directives.DatePicker_week': 'Woche',
			'__keta.directives.DatePicker_weekday_sunday': 'Sonntag',
			'__keta.directives.DatePicker_weekday_sunday_short': 'So',
			'__keta.directives.DatePicker_weekday_monday': 'Montag',
			'__keta.directives.DatePicker_weekday_monday_short': 'Mo',
			'__keta.directives.DatePicker_weekday_tuesday': 'Dienstag',
			'__keta.directives.DatePicker_weekday_tuesday_short': 'Di',
			'__keta.directives.DatePicker_weekday_wednesday': 'Mittwoch',
			'__keta.directives.DatePicker_weekday_wednesday_short': 'Mi',
			'__keta.directives.DatePicker_weekday_thursday': 'Donnerstag',
			'__keta.directives.DatePicker_weekday_thursday_short': 'Do',
			'__keta.directives.DatePicker_weekday_friday': 'Freitag',
			'__keta.directives.DatePicker_weekday_friday_short': 'Fr',
			'__keta.directives.DatePicker_weekday_saturday': 'Samstag',
			'__keta.directives.DatePicker_weekday_saturday_short': 'Sa',
			'__keta.directives.DatePicker_week_number': 'Kalenderwoche',
			'__keta.directives.DatePicker_week_number_short': 'KW'
		},
		'es_ES': {
			'__keta.directives.DatePicker_select': 'Seleccione',
			'__keta.directives.DatePicker_selection': 'Espécimen',
			'__keta.directives.DatePicker_today': 'Hoy',
			'__keta.directives.DatePicker_week': 'Semana',
			'__keta.directives.DatePicker_weekday_sunday': 'Domingo',
			'__keta.directives.DatePicker_weekday_sunday_short': 'Do',
			'__keta.directives.DatePicker_weekday_monday': 'Lunes',
			'__keta.directives.DatePicker_weekday_monday_short': 'Lu',
			'__keta.directives.DatePicker_weekday_tuesday': 'Martes',
			'__keta.directives.DatePicker_weekday_tuesday_short': 'Ma',
			'__keta.directives.DatePicker_weekday_wednesday': 'Miércoles',
			'__keta.directives.DatePicker_weekday_wednesday_short': 'Mi',
			'__keta.directives.DatePicker_weekday_thursday': 'Jueves',
			'__keta.directives.DatePicker_weekday_thursday_short': 'Ju',
			'__keta.directives.DatePicker_weekday_friday': 'Viernes',
			'__keta.directives.DatePicker_weekday_friday_short': 'Vi',
			'__keta.directives.DatePicker_weekday_saturday': 'Sábado',
			'__keta.directives.DatePicker_weekday_saturday_short': 'Sá',
			'__keta.directives.DatePicker_week_number': 'Número de semana',
			'__keta.directives.DatePicker_week_number_short': 'CS'
		},
		'fr_FR': {
			'__keta.directives.DatePicker_select': 'Choisir',
			'__keta.directives.DatePicker_selection': 'Sélection',
			'__keta.directives.DatePicker_today': 'Aujourd’hui',
			'__keta.directives.DatePicker_week': 'Semaine',
			'__keta.directives.DatePicker_weekday_sunday': 'Dimanche',
			'__keta.directives.DatePicker_weekday_sunday_short': 'Dim',
			'__keta.directives.DatePicker_weekday_monday': 'Lundi',
			'__keta.directives.DatePicker_weekday_monday_short': 'Lun',
			'__keta.directives.DatePicker_weekday_tuesday': 'Mardi',
			'__keta.directives.DatePicker_weekday_tuesday_short': 'Mar',
			'__keta.directives.DatePicker_weekday_wednesday': 'Mercredi',
			'__keta.directives.DatePicker_weekday_wednesday_short': 'Mer',
			'__keta.directives.DatePicker_weekday_thursday': 'Jeudi',
			'__keta.directives.DatePicker_weekday_thursday_short': 'Jeu',
			'__keta.directives.DatePicker_weekday_friday': 'Vendredi',
			'__keta.directives.DatePicker_weekday_friday_short': 'Ven',
			'__keta.directives.DatePicker_weekday_saturday': 'Samedi',
			'__keta.directives.DatePicker_weekday_saturday_short': 'Sam',
			'__keta.directives.DatePicker_week_number': 'Numéro de la semaine',
			'__keta.directives.DatePicker_week_number_short': 'Sem.'
		},
		'nl_NL': {
			'__keta.directives.DatePicker_select': 'Kiezen',
			'__keta.directives.DatePicker_selection': 'Selectie',
			'__keta.directives.DatePicker_today': 'Vandaag',
			'__keta.directives.DatePicker_week': 'Week',
			'__keta.directives.DatePicker_weekday_sunday': 'Zondag',
			'__keta.directives.DatePicker_weekday_sunday_short': 'Zo',
			'__keta.directives.DatePicker_weekday_monday': 'Maandag',
			'__keta.directives.DatePicker_weekday_monday_short': 'Ma',
			'__keta.directives.DatePicker_weekday_tuesday': 'Dinsdag',
			'__keta.directives.DatePicker_weekday_tuesday_short': 'Di',
			'__keta.directives.DatePicker_weekday_wednesday': 'Woensdag',
			'__keta.directives.DatePicker_weekday_wednesday_short': 'Wo',
			'__keta.directives.DatePicker_weekday_thursday': 'Donderdag',
			'__keta.directives.DatePicker_weekday_thursday_short': 'Do',
			'__keta.directives.DatePicker_weekday_friday': 'Vrijdag',
			'__keta.directives.DatePicker_weekday_friday_short': 'Vr',
			'__keta.directives.DatePicker_weekday_saturday': 'Zaterdag',
			'__keta.directives.DatePicker_weekday_saturday_short': 'Za',
			'__keta.directives.DatePicker_week_number': 'Weeknummer',
			'__keta.directives.DatePicker_week_number_short': 'Wn'
		},
		'it_IT': {
			'__keta.directives.DatePicker_select': 'Scegliere',
			'__keta.directives.DatePicker_selection': 'Selezione',
			'__keta.directives.DatePicker_today': 'Oggi',
			'__keta.directives.DatePicker_week': 'Settimana',
			'__keta.directives.DatePicker_weekday_sunday': 'Domenica',
			'__keta.directives.DatePicker_weekday_sunday_short': 'Dom.',
			'__keta.directives.DatePicker_weekday_monday': 'Lunedì',
			'__keta.directives.DatePicker_weekday_monday_short': 'Lun.',
			'__keta.directives.DatePicker_weekday_tuesday': 'Martedì',
			'__keta.directives.DatePicker_weekday_tuesday_short': 'Mar.',
			'__keta.directives.DatePicker_weekday_wednesday': 'Mercoledì',
			'__keta.directives.DatePicker_weekday_wednesday_short': 'Mer.',
			'__keta.directives.DatePicker_weekday_thursday': 'Giovedì',
			'__keta.directives.DatePicker_weekday_thursday_short': 'Gio.',
			'__keta.directives.DatePicker_weekday_friday': 'Venerdì',
			'__keta.directives.DatePicker_weekday_friday_short': 'Ven.',
			'__keta.directives.DatePicker_weekday_saturday': 'Sabato',
			'__keta.directives.DatePicker_weekday_saturday_short': 'Sab.',
			'__keta.directives.DatePicker_week_number': 'Numero della settimana',
			'__keta.directives.DatePicker_week_number_short': 'Set.'
		},
		'sv_SE': {
			'__keta.directives.DatePicker_select': 'Välj',
			'__keta.directives.DatePicker_selection': 'Val',
			'__keta.directives.DatePicker_today': 'I dag',
			'__keta.directives.DatePicker_week': 'Vecka',
			'__keta.directives.DatePicker_weekday_sunday': 'Söndag',
			'__keta.directives.DatePicker_weekday_sunday_short': 'Sö',
			'__keta.directives.DatePicker_weekday_monday': 'Måndag',
			'__keta.directives.DatePicker_weekday_monday_short': 'Må',
			'__keta.directives.DatePicker_weekday_tuesday': 'Tisdag',
			'__keta.directives.DatePicker_weekday_tuesday_short': 'Ti',
			'__keta.directives.DatePicker_weekday_wednesday': 'Onsdag',
			'__keta.directives.DatePicker_weekday_wednesday_short': 'On',
			'__keta.directives.DatePicker_weekday_thursday': 'Torsdag',
			'__keta.directives.DatePicker_weekday_thursday_short': 'To',
			'__keta.directives.DatePicker_weekday_friday': 'Fredag',
			'__keta.directives.DatePicker_weekday_friday_short': 'Fr',
			'__keta.directives.DatePicker_weekday_saturday': 'Lördag',
			'__keta.directives.DatePicker_weekday_saturday_short': 'Lö',
			'__keta.directives.DatePicker_week_number': 'Vecka',
			'__keta.directives.DatePicker_week_number_short': 'V'
		}
	})

	.directive('ketaDatePicker', function DatePickerDirective(
		$filter,
		ketaDatePickerConstants, ketaDatePickerMessageKeys, moment
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

				// display mode (@see ketaDatePickerConstants.DISPLAY)
				displayMode: '=?',

				// display value (date)
				displayValue: '=?',

				// element identifier
				elementIdentifier: '=?',

				// enable display mode switch
				enableDisplayModeSwitch: '=?',

				// first day of week (0...Sun, 1...Mon, 2...Tue, 3...Wed, 4...Thu, 5...Fri, 6...Sat)
				firstDayOfWeek: '=?',

				// object of labels to use in template
				labels: '=?',

				// maximum date selectable (date is included)
				maximum: '=?',

				// minimum date selectable (date is included)
				minimum: '=?',

				// model value (date)
				model: '=ngModel',

				// show pager above
				showPager: '=?',

				// show jump to selection button
				showJumpToSelectionButton: '=?',

				// show jump to today button
				showJumpToTodayButton: '=?',

				// show select button
				showSelectButton: '=?',

				// show week numbers
				showWeekNumbers: '=?',

				// number of years to show before current in display mode year
				// must be a multiple of 3 added by 1 (e.g. 1, 4, 7, 11, ...)
				yearsAfter: '=?',

				// number of years to show after current in display mode year
				// must be a multiple of 3 added by 1 (e.g. 1, 4, 7, 11, ...)
				yearsBefore: '=?'

			},
			templateUrl: '/components/directives/date-picker.html',
			link: function(scope) {


				// CONSTANTS
				// ---------

				scope.DISPLAY_MODE_DAY = ketaDatePickerConstants.DISPLAY_MODE.DAY;
				scope.DISPLAY_MODE_MONTH = ketaDatePickerConstants.DISPLAY_MODE.MONTH;
				scope.DISPLAY_MODE_YEAR = ketaDatePickerConstants.DISPLAY_MODE.YEAR;

				var DAYS_PER_WEEK = 7;
				var ISO_DATE_LENGTH_DAY = 10;
				var ISO_DATE_LENGTH_MONTH = 7;
				var ISO_DATE_LENGTH_YEAR = 4;
				var ISO_PADDING = 2;
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

				scope.model =
					angular.isDate(scope.model) ?
						new Date(scope.model.setHours(0, 0, 0, 0)) : today;
				scope.cssClasses =
					angular.isObject(scope.cssClasses) ?
						angular.extend(ketaDatePickerConstants.CSS_CLASSES, scope.cssClasses) :
						ketaDatePickerConstants.CSS_CLASSES;
				scope.currentLocale = angular.isString(scope.currentLocale) ? scope.currentLocale : 'en_GB';
				scope.displayMode = scope.displayMode || scope.DISPLAY_MODE_DAY;
				scope.displayValue =
					angular.isDate(scope.displayValue) ?
						new Date(scope.displayValue.setHours(0, 0, 0, 0)) : angular.copy(scope.model);
				scope.elementIdentifier =
					angular.isDefined(scope.elementIdentifier) ?
						scope.elementIdentifier : null;
				scope.enableDisplayModeSwitch =
					angular.isDefined(scope.enableDisplayModeSwitch) ?
						scope.enableDisplayModeSwitch : true;
				scope.firstDayOfWeek = scope.firstDayOfWeek || ketaDatePickerConstants.DAY.SUNDAY;

				// object of labels
				scope.MESSAGE_KEY_PREFIX = '__keta.directives.DatePicker';
				scope.labels =
					angular.isObject(scope.labels) ?
						angular.extend(ketaDatePickerMessageKeys, scope.labels) : ketaDatePickerMessageKeys;
				scope.currentLabels =
					angular.isDefined(ketaDatePickerMessageKeys[scope.currentLocale.substr(0, LOCALE_SHORT_LENGTH)]) ?
						ketaDatePickerMessageKeys[scope.currentLocale.substr(0, LOCALE_SHORT_LENGTH)] :
						ketaDatePickerMessageKeys.en_GB;

				scope.maximum =
					angular.isDate(scope.maximum) ?
						new Date(scope.maximum.setHours(0, 0, 0, 0)) : null;
				scope.minimum =
					angular.isDate(scope.minimum) ?
						new Date(scope.minimum.setHours(0, 0, 0, 0)) : null;
				scope.showPager =
					angular.isDefined(scope.showPager) ?
						scope.showPager : true;
				scope.showJumpToSelectionButton =
					angular.isDefined(scope.showJumpToSelectionButton) ?
						scope.showJumpToSelectionButton : false;
				scope.showJumpToTodayButton =
					angular.isDefined(scope.showJumpToTodayButton) ?
						scope.showJumpToTodayButton : false;
				scope.showSelectButton =
					angular.isDefined(scope.showSelectButton) ?
						scope.showSelectButton : false;
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
						moment(scope.displayValue)
							.month(0).date(1).hour(0).minute(0).second(0).millisecond(0)
							.toDate();

					var currentYear = parseInt($filter('date')(now, 'yyyy'), 10);
					var yearStart = currentYear - scope.yearsBefore;
					var yearEnd = currentYear + scope.yearsAfter;

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
				 * @param {date} date date to extract iso format from
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
				 * @param {date} date date to get classes for
				 * @returns {boolean} true if out of bounds
				 */
				scope.isOutOfBounds = function isOutOfBounds(date) {
					var outOfBounds = false;

					var isoDateLength = ISO_DATE_LENGTH_DAY;
					if (scope.displayMode === scope.DISPLAY_MODE_MONTH) {
						isoDateLength = ISO_DATE_LENGTH_MONTH;
					}
					if (scope.displayMode === scope.DISPLAY_MODE_YEAR) {
						isoDateLength = ISO_DATE_LENGTH_YEAR;
					}

					var dateISO = getLocaleISO(date, isoDateLength);

					if (scope.minimum !== null &&
						dateISO < getLocaleISO(scope.minimum, isoDateLength)) {
						outOfBounds = true;
					}

					if (scope.maximum !== null &&
						dateISO > getLocaleISO(scope.maximum, isoDateLength)) {
						outOfBounds = true;
					}

					return outOfBounds;
				};

				/**
				 * get date classes
				 * @param {date} date date to get classes for
				 * @returns {string} classes as space-separated strings
				 */
				scope.getDateClasses = function getDateClasses(date) {
					var classes = [];

					var td = new Date(new Date().setHours(0, 0, 0, 0));
					var current = scope.displayValue;

					var isoDateLength = ISO_DATE_LENGTH_DAY;
					if (scope.displayMode === scope.DISPLAY_MODE_MONTH) {
						isoDateLength = ISO_DATE_LENGTH_MONTH;
					}
					if (scope.displayMode === scope.DISPLAY_MODE_YEAR) {
						isoDateLength = ISO_DATE_LENGTH_YEAR;
					}

					var selectedDateISO = getLocaleISO(scope.model, isoDateLength);
					var dateISO = getLocaleISO(date, isoDateLength);
					var todayISO = getLocaleISO(td, isoDateLength);

					if (scope.displayMode === scope.DISPLAY_MODE_DAY &&
						date.getMonth() !== current.getMonth()) {
						classes.push(scope.cssClasses.OUT_OF_MONTH);
					}

					if (scope.isOutOfBounds(date)) {
						classes.push(scope.cssClasses.OUT_OF_BOUNDS);
						if (scope.minimum !== null && dateISO < getLocaleISO(scope.minimum, isoDateLength)) {
							classes.push(scope.cssClasses.OUT_OF_BOUNDS_BEFORE);
						}
						if (scope.maximum !== null && dateISO > getLocaleISO(scope.maximum, isoDateLength)) {
							classes.push(scope.cssClasses.OUT_OF_BOUNDS_AFTER);
						}
					}

					if (dateISO === todayISO) {
						classes.push(scope.cssClasses.CURRENT_DATE);
					}

					if (selectedDateISO !== null && dateISO === selectedDateISO) {
						classes.push(scope.cssClasses.SELECTED_DATE);
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
						angular.isDefined(ketaDatePickerMessageKeys[scope.currentLocale.substr(0, LOCALE_SHORT_LENGTH)])
							? ketaDatePickerMessageKeys[scope.currentLocale.substr(0, LOCALE_SHORT_LENGTH)] :
							ketaDatePickerMessageKeys.en_GB;

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

				/**
				 * submit
				 * @returns {void} nothing
				 */
				scope.submit = function submit() {
					scope.$emit(
						ketaDatePickerConstants.EVENT.SELECT,
						{
							id: scope.elementIdentifier,
							model: scope.model
						}
					);
				};

				/**
				 * select date as from or to or disable selection
				 * @param {date} date date selected
				 * @returns {void} nothing
				 */
				scope.select = function select(date) {
					if (!scope.isOutOfBounds(date)) {
						scope.model = date;
						scope.submit();
					}
				};

				/**
				 * jump to the view with the current selection in it
				 * @returns {void} nothing
				 */
				scope.goToSelection = function goToSelection() {
					scope.displayValue = angular.copy(scope.model);
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
				 * @param {date} date date to show on calender
				 * @param {string} displayMode which display mode should be shown after click
				 * @return {void} nothing
				 */
				scope.setView = function setView(date, displayMode) {
					if (!scope.isOutOfBounds(date)) {
						scope.displayValue = angular.copy(date);
						scope.displayMode = displayMode;
					}
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
angular.module('keta.directives.DatePicker')
	.run(function($templateCache) {
		$templateCache.put('/components/directives/date-picker.html', '<div class="keta-date-picker">' +
'' +
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
'				<a class="week-number">{{ week[0] | date:\'w\' }}</a>' +
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
'					data-ng-click="setView(month, DISPLAY_MODE_DAY)"' +
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
'					data-ng-click="setView(year, DISPLAY_MODE_MONTH)"' +
'					data-ng-class="getDateClasses(year)">{{ year | date:\'yyyy\' }}</a>' +
'			</td>' +
'		</tr>' +
'	</table>' +
'' +
'	<ul class="pager pager-quick-links"' +
'		data-ng-if="showJumpToSelectionButton || showJumpToTodayButton || showSelectButton">' +
'		<li class="text-center">' +
'			<a href="" data-ng-if="showJumpToTodayButton"' +
'				data-ng-click="goToToday()">{{ currentLabels[MESSAGE_KEY_PREFIX + \'_today\'] }}</a>' +
'			<a href="" data-ng-if="showJumpToSelectionButton"' +
'				data-ng-click="goToSelection()">{{ currentLabels[MESSAGE_KEY_PREFIX + \'_selection\'] }}</a>' +
'			<a href="" data-ng-if="showSelectButton"' +
'				data-ng-click="submit()">{{ currentLabels[MESSAGE_KEY_PREFIX + \'_select\'] }}</a>' +
'		</li>' +
'	</ul>' +
'' +
'</div>' +
'');
	});
