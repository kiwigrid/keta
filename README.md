![keta](keta.png "keta")

#### Frontend Components for Kiwigrid Platform based AngularJS Apps

Copyright Kiwigrid GmbH 2014-2015

---

Official page: [http://kiwigrid.github.io/keta/](http://kiwigrid.github.io/keta/)

## Changelog

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

### Version 0.3.6

_Released: 2015-03-26_

* Update of css parts

### Version 0.3.5

_Released: 2015-03-25_

* Bugfix for toggle sidebar out of other directives

### Version 0.3.4

_Released: 2015-03-20_

* Moved `Device.getDeviceClasses` method
* Improved test code coverage

### Version 0.3.3

_Released: 2015-03-18_

* Added `Device.getDeviceClasses` method
* Updated CSS parts

### Version 0.3.2

_Released: 2015-02-13_

* Bugfix for ExtendedTable not updating itself upon updates from outside

### Version 0.3.1

_Released: 2015-02-09_

* Bugfix for response timeout fired although request was successful

### Version 0.3.0

_Released: 2015-02-09_

* Complete refactoring to improve usability of library for applications
* Introduction of chained queries
* Multiple EventBus instances are possible now
* Logging is implemented as `$log` decorator
* Registration of DeviceSetListener is disabled by default, but can be activated with a one-liner
* A couple of directives (e.g. `main-menu`, `world-bar`) are included

### Version 0.2.14

_Released: 2014-12-16_

* Bugfix-Release for first version of library
