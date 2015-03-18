'use strict';

/**
 * @name keta.shared
 * @author Jan Uhlmann <jan.uhlmann@kiwigrid.com>
 * @copyright Kiwigrid GmbH 2014-2015
 * @module keta.shared
 * @description Constants for cross-component relations (e.g. events, translation file namings, ...)
 */

angular.module('keta.shared', [])

	.constant('ketaSharedConfig', {
		EVENTS: {
			TOGGLE_SIDEBAR_LEFT: 'TOGGLE_SIDEBAR_LEFT',
			TOGGLE_SIDEBAR_RIGHT: 'TOGGLE_SIDEBAR_RIGHT'
		},
		STATE: {
			OK: 'OK',
			ERROR: 'ERROR',
			FATAL: 'FATAL'
		},
		UNITS: {
			WATTS: 'W',
			WATTHOURS: 'Wh',
			PERCENT: '%',
			EURO: '€',
			DOLLAR: '$',
			POUND: '£',
			KILOMETER: 'km'
		},
		DEVICE_CLASSES: {
			ENERGY_MANAGER: 'com.kiwigrid.devices.em.EnergyManager',
			LOCATION: 'com.kiwigrid.devices.location.Location',
			PV_PLANT: 'com.kiwigrid.devices.pvplant.PVPlant'
		},
		SIDEBAR: {
			POSITION_LEFT: 'left',
			POSITION_RIGHT: 'right',
			CSS_OFFCANVAS: 'offcanvas',
			CSS_BRAND_BAR: 'brand-bar',
			TOGGLE_AREA_OFFSET: 5,
			TRANSCLUDE_OFFSET: 15
		},
		WORLD_BAR: {
			CSS_CONTEXT_SWITCHER: 'context-switcher',
			ENTRY_CONTEXT_SWITCHER: 'contextSwitcher',
			ENTRY_CONTEXT_SWITCHER_WORLDS: 'worlds',
			ENTRY_CONTEXT_SWITCHER_MANAGERS: 'managers',
			ENTRY_CONTEXT_SWITCHER_APPS: 'apps',
			ENTRY_USER_MENU: 'userMenu',
			ENTRY_LANGUAGE_MENU: 'languageMenu'
		},
		EXTENDED_TABLE: {
			COMPONENTS: {
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
			}
		},
		DEVICE_ICON_MAP: {
			'com.kiwigrid.devices.batteryconverter.BatteryConverter': 'kiwigrid-device-icon-battery-converter',
			'com.kiwigrid.devices.plug.Plug': 'kiwigrid-device-icon-plug',
			'com.kiwigrid.devices.powermeter.PowerMeter': 'kiwigrid-device-icon-plug',
			'com.kiwigrid.devices.windturbine.WindTurbine': 'kiwigrid-device-icon-wind-turbine',
			'com.kiwigrid.devices.sensor.TemperatureSensor': 'kiwigrid-device-icon-temperature-sensor',
			'com.kiwigrid.devices.inverter.Inverter': 'kiwigrid-device-icon-inverter',
			'com.kiwigrid.devices.heatpump.HeatPump': 'kiwigrid-device-icon-smart-heat-pump',
			'com.kiwigrid.devices.microchp.MicroChpSystem': 'kiwigrid-device-icon-micro-combined-heat-pump',
			'com.kiwigrid.devices.ripplecontrolreceiver.RippleControlReceiver':
				'kiwigrid-device-icon-ripple-control-receiver',
			'com.kiwigrid.devices.smartheatpumps.SmartHeatPumps': 'kiwigrid-device-icon-smart-heat-pump',
			'com.kiwigrid.devices.pvplant.PVPlant': 'kiwigrid-device-icon-pv-plant'
		}
	})
	
	/**
	 * @class ketaSharedFactory
	 * @propertyOf keta.shared
	 * @description Shared utility methods
	 */
	.factory('ketaSharedFactory', function ketaSharedFactory() {
		
		var factory = {};
		
		/**
		 * @name doesPropertyExist
		 * @function
		 * @memberOf ketaSharedFactory
		 * @description This method checks, if a deep property does exist in the given object.
		 * @param {object} obj object to check property for
		 * @param {string} prop property given in dot notation
		 * @returns {boolean}
		 */
		factory.doesPropertyExist = function(obj, prop) {
			var parts = prop.split('.');
			for (var i = 0, l = parts.length; i < l; i++) {
				var part = parts[i];
				if (obj !== null && typeof obj === 'object' && part in obj) {
					obj = obj[part];
				} else {
					return false;
				}
			}
			return true;
		};
		
		return factory;
		
	});
