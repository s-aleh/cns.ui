# cns-ui
AngularJS UI

## Installation
Installation is easy as cns-ui has minimal dependencies - only the AngularJS is required.

```javascript
<script type="text/javascript" src="cns.ui.js"></script>
```

```javascript
angular.module('myModule', ['cns.ui']);
```

##Pagination

```html
<cns-scroll-pagination total-pages="146" ng-model="currentPage"></cns-scroll-pagination>
```

##Runner

```html
<cns-runner total-pages="146" ng-model="currentPage"></cns-runner>
```

##Grow

```html
<cns-grow total-pages="146" ng-model="currentPage"></cns-grown>
```

##Scrolling
```html
<div cns-scroll top left>...</div>
```

##Datepicker
```html
<cns-datepicker ng-model="02/23/2012" start-year="1970" end-year="2050"></cns-datepicker>
```

##Calendar
```html
<cns-calendar ng-model="date" dates="dates" start-year="1970" end-year="2050""></cns-calendar>
```

##Mousewheel
```html
<div cns-mousewheel dx="dx" dy="dy"></div>
```
