![keta](keta.png "keta")

#### Frontend Components for Kiwigrid Platform based AngularJS Apps

Copyright Kiwigrid GmbH 2014-2016

---

Official page: [http://kiwigrid.github.io/keta/](http://kiwigrid.github.io/keta/)

# Changelog

## Version 0.4.19

_Released: 2016-02-17_

* Added dutch and italian translations for `AppBar` and `ExtendedTable`
* Made unit tests Angular 1.4.x compatible

## Version 0.4.18

_Released: 2016-01-27_

* Fix for `ExtendedTable` to prevent reset of `visibleColumns` when a search filter was added and removed afterwards
* Added french translations for `AppBar` and `ExtendedTable`

## Version 0.4.17

_Released: 2016-01-21_

* Fix for `Sidebar` to close even if current entry is clicked
* Fix for `ExtendedTable` messed up header labels if filter was used
* Added `search-input-width-classes` and `selector-width-classes` parameters for `ExtendedTable` to make displayed widths of these components configurable

## Version 0.4.16

_Released: 2016-01-19_

* Added workaround for IE not having "origin" property on anchors
* Added workaround for double-existing tag value entries in `mergeDevice` responses
* Added `row-class-callback` parameter for `ExtendedTable` to enable styling of whole rows

## Version 0.4.15

_Released: 2016-01-05_

* Added selection support to `ExtendedTable` directive for `view` mode too

## Version 0.4.14

_Released: 2015-12-01_

* Bugfix for `AccessToken.get` with `decoded` parameter set to `true`

## Version 0.4.13

_Released: 2015-11-30_

* Added impersonation bar to `AppBar` directive
* Added selection support to `ExtendedTable` directive
* Added CSS support for both components

## Version 0.4.12

_Released: 2015-11-05_

* Several CSS bugfixes (e.g. iOS 9 overlay closing)
* Changed markup for search input field
* Renamed `.tags` into `.labels` and changed underlaying markup
* Added CSS support for application list and tabs

## Version 0.4.11

_Released: 2015-10-13_

* Changed a specific app id used to retrieve link to user profile
* Added `sortableColumns` configuration property to `ExtendedTable` directive

## Version 0.4.10

_Released: 2015-10-06_

* Fix for table headers in `ExtendedTable` directive

## Version 0.4.9

_Released: 2015-10-05_

* Fix for view driven search in `ExtendedTable` directive

## Version 0.4.8.2

_Released: 2015-09-30_

* Fix for `User` service: corrected check for successful `$delete` call 

## Version 0.4.8.1

_Released: 2015-09-24_

* Hotfix for `ApiUtils` service: incorrect syntax for LIKE search 

## Version 0.4.8

_Released: 2015-09-24_

* Bugfixes for `AppBar` directive: 
	- set default with correct channel param for OAuth redirect
* Added `keta.utils.Api` module with `ApiUtils` service 

## Version 0.4.7

_Released: 2015-08-25_

* Added optional `display` callback to `ExtendedTable.actionList` items (can be used to conditionally display action list items)
* Changed `label` to `getLabel` as callback in `ExtendedTable.actionList` items to support external i18n

## Version 0.4.6

_Released: 2015-08-20_

* Bugfix for `User.$update`: initial properties object is recognized as change
* Harmonized parameter for `ApplicationUtils.getAppName` method

## Version 0.4.5

_Released: 2015-08-17_

* Bugfix for `ExtendedTable` directive: non-heterogeneous rows don’t break table anymore
* Added `ApplicationUtils.getAppIcon` to retrieve app icon for specified language
* Added `ApplicationUtils.getAppAuthor` to retrieve app author
* Updated css parts

## Version 0.4.4

_Released: 2015-07-30_

* Bugfix for `unit` filter to respond to `locale` changes when used in templates
* Added `keta.utils.Country`: `getCountryList` returns localized list of countries

## Version 0.4.3

_Released: 2015-07-23_

* Changed App ID for Cloud Desktop

## Version 0.4.2

_Released: 2015-07-22_

* Added support for new `meta.json` format to `AppBar` directive
* Several features and bugfixes for CSS parts

## Version 0.4.1

_Released: 2015-07-17_

* Bugfix for `AppBar` directive: Overwriting the logout link is now possible
* Added `tableClassCallback` to `ExtendedTable` directive to modify table classes

## Version 0.4.0

_Released: 2015-07-10_

### General changes

* New utility service `ApplicationUtils`
* New $log decorator with different logging levels (description see module `Logger`)
* Removed module `keta.shared`, constant `ketaSharedConfig` and factory `ketaSharedFactory`. 
* Constants have been moved into the modules they belong to (and new constant names were defined), `ketaSharedFactory` has been renamed into `CommonUtils`

### Changes in `appBar` directive

* Parameter `links` is not necessary anymore because all links are automatically filled by the directive itself with default values
* If the `links` property is provided every key that is given in this object overrides the default values
* Parameter `labels` is not necessary anymore because all links are automatically filled by the directive itself with default values
* Labels can be overwritten, it is also possible to add new locales (see module `appBar` for examples)
* New parameter `rootApp` as an object which is set by the directive itself and can afterwards be used to set the logo link in the transcluded html markup for example

### Changes in `extendedTable` directive

* Parameter `labels` is not necessary anymore because all links are automatically filled by the directive itself with default values
* Labels can be overwritten, it is also possible to add new locales (see module `extendedTable` for examples)

---

## Version 0.3.25

_Released: 2015-07-10_

* Pager gets displayed only if there are at least two pages

## Version 0.3.24

_Released: 2015-07-07_

* New pager style for Extended Table, Added columnClassCallback to actions row

## Version 0.3.23

_Released: 2015-06-08_

* Some smaller CSS fixes and changes

## Version 0.3.22

_Released: 2015-06-01_

* Made main menu link configuration more flexible

## Version 0.3.21

_Released: 2015-05-29_

* Optimized main menu icon configuration

## Version 0.3.20

_Released: 2015-05-27_

* Fixed App Bar current locale usage
* Added App Bar app title link configuration option
* Added App Bar element, size and state constants to ketaShared

## Version 0.3.19

_Released: 2015-05-26_

* Fixed App Bar current locale configuration

## Version 0.3.18

_Released: 2015-05-26_

* Fixed App Bar affix behavior
* Fixed Extended Table row filter

## Version 0.3.17

_Released: 2015-05-21_

* Changed syntax for display modes in App Bar Directive

## Version 0.3.16

_Released: 2015-05-21_

* Fixed some issues with App Bar Directive

## Version 0.3.15

_Released: 2015-05-20_

* Added $reset method to device and user instance
* Added documentation for app bar directive

## Version 0.3.14

_Released: 2015-05-20_

* New App Bar Directive, World Bar Directive was removed
* Extended AccessToken service with encode and decode methods
* CSS Updates

## Version 0.3.13

_Released: 2015-04-24_

* Bugfix for change detection in user wrapper

## Version 0.3.12

_Released: 2015-04-23_

* Bugfix for automatically registered device set listener

## Version 0.3.11

_Released: 2015-04-21_

* Updated World Bar directive to be compatible with new API
* Bugfix for Unit filter with input: 0 and separate: true
* Removed getDeviceClasses method in Device wrapper

## Version 0.3.10

_Released: 2015-04-14_

* More configuration possibilities for unit filter
* Bugfix for unit filter rounding numbers which change SI prefix

## Version 0.3.9

_Released: 2015-04-09_

* Bugfix for change detection in user update method

## Version 0.3.8

_Released: 2015-04-09_

* Added wrapper for applications
* Added wrapper for users
* Several bug fixes
* Clean up

## Version 0.3.7

_Released: 2015-03-31_

* Added Bower support

## Version 0.3.6

_Released: 2015-03-26_

* Update of css parts

## Version 0.3.5

_Released: 2015-03-25_

* Bugfix for toggle sidebar out of other directives

## Version 0.3.4

_Released: 2015-03-20_

* Moved `Device.getDeviceClasses` method
* Improved test code coverage

## Version 0.3.3

_Released: 2015-03-18_

* Added `Device.getDeviceClasses` method
* Updated CSS parts

## Version 0.3.2

_Released: 2015-02-13_

* Bugfix for ExtendedTable not updating itself upon updates from outside

## Version 0.3.1

_Released: 2015-02-09_

* Bugfix for response timeout fired although request was successful

## Version 0.3.0

_Released: 2015-02-09_

* Complete refactoring to improve usability of library for applications
* Introduction of chained queries
* Multiple EventBus instances are possible now
* Logging is implemented as `$log` decorator
* Registration of DeviceSetListener is disabled by default, but can be activated with a one-liner
* A couple of directives (e.g. `main-menu`, `world-bar`) are included

---

## Version 0.2.14

_Released: 2014-12-16_

* Bugfix-Release for first version of library
