![keta](keta.png "keta")

#### Frontend Components for Kiwigrid Platform based AngularJS Apps

Copyright Kiwigrid GmbH 2014-2017

---

## Official page

See [http://kiwigrid.github.io/keta/](http://kiwigrid.github.io/keta/)

## Changelog

See [changelog](CHANGELOG.md)

---

## Moment.js dependency

`DatePicker` and `TimeRangeSelector` components depend on [Moment.js](http://momentjs.com/) as an AngularJS constant.

Add Moment.js source file to your `index.html`:

```html
<script src="libs/moment/min/moment.min.js"></script>
```

Add a constant wrapper to your `app.js`:

```javascript
angular.module('moment', []).constant('moment', moment);
```
