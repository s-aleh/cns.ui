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
