'use strict';

angular.module('cns.ui', ['cns.ui.templates', 'cns.ui.pagination', 'cns.ui.runner', 'cns.ui.grow']);

angular.module('cns.ui.templates', ['../src/templates/directives/grow.html', '../src/templates/directives/pagination.html', '../src/templates/directives/runner.html']);



angular.module('cns.ui.grow', [])
    .directive('cnsGrow', ['$timeout', '$document', function($timeout, $document) {
        return {
            link: function(scope, element, attributes) {
                var divMain = angular.element(element[0].querySelector('.cns-runner-main')),
                    divLeft = angular.element(element[0].querySelector('.cns-runner-left')),
                    divRight = angular.element(element[0].querySelector('.cns-runner-right')),
                    divBar = angular.element(element[0].querySelector('.cns-runner-bar')),
                    leftButton = angular.element(element[0].querySelector('#cns-gbl')),
                    rightButton = angular.element(element[0].querySelector('#cns-gbr')),
                    containerButton = angular.element(element[0].querySelector('.cns-grow-button-container'));
                var leftPoints = '0,' + containerButton[0].clientHeight / 2 + ' ' +
                    (containerButton[0].clientHeight - 2) + ',0 ' +
                    (containerButton[0].clientWidth - 2) + ',' + containerButton[0].clientHeight;
                var rigthPoints = '2,0 ' +
                    (containerButton[0].clientHeight - 2) +',' + containerButton[0].clientHeight / 2 + ' ' +
                    '2,' + containerButton[0].clientHeight;
                //leftButton.attr('points', leftPoints);
                //rightButton.attr('points', rigthPoints);
                var mainWidth = 0,
                    leftWidth = 0,
                    rightWidth = 0,
                    barWidth = 0;
                $timeout(function() {
                    scope.w = divLeft[0].clientWidth;
                    scope.h = divLeft[0].clientHeight;
                    mainWidth = divMain[0].clientWidth;
                    leftWidth = divLeft[0].clientWidth;
                    rightWidth = divRight[0].clientWidth;
                    barWidth = (mainWidth - leftWidth - rightWidth) / scope.totalPages;
                    divBar.css({left: leftWidth + 'px', width: Math.round(barWidth) + 'px'});
                }, 0);
                var startX = 0, x = 0;
                divBar.on('mousedown', function(event) {
                    event.preventDefault();
                    startX = event.screenX - x;
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                });
                function mousemove(event) {
                    if((event.screenX - startX) >= leftWidth && (event.screenX - startX) < mainWidth - rightWidth - barWidth) {
                        x = event.screenX - startX;
                        scope.$apply( function() {
                            scope.ngModel = Math.round(x / barWidth);
                        });
                    }
                }
                function mouseup() {
                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);
                }
                scope.$watch("ngModel", function() {
                    divBar.css({width: Math.round(scope.ngModel * barWidth) + 'px'});
                });
                scope.setCurPage = function(event, page) {
                    event.preventDefault();
                    switch(page) {
                        case 'prev':
                            scope.ngModel = (scope.ngModel > 1) ? scope.ngModel - 1 : scope.ngModel;
                            break;
                        case 'next':
                            scope.ngModel = (scope.ngModel < scope.totalPages) ? scope.ngModel + 1 : scope.ngModel;
                            break;
                    }
                };
            },
            restrict: 'E',
            scope: {
                ngModel: '=',
                totalPages: '@'
            },
            templateUrl: '../src/templates/directives/grow.html'
        };
    }]);


angular.module('cns.ui.pagination', [])
    .directive('cnsScrollPagination', ['$timeout', '$document', function($timeout, $document){
        return {
            link: function(scope, element, attributes, controllers) {
                scope.pages = new Array(Number(scope.totalPages));
                scope.revers = angular.isUndefined(attributes.revers) ? false : true;
                var divPages = angular.element(element[0].querySelector('.cns-scroll-pagination-pages')),
                    divScroll = angular.element(element[0].querySelector('.cns-scroll-pagination')),
                    divScrollBar = angular.element(element[0].querySelector('.cns-scroll-pagination-bar')),
                    divScrollButton = angular.element(element[0].querySelector('.cns-scroll-pagination-button')),
                    slider = angular.element(element[0].querySelector('#cns-ps')),
                    containerSlider = angular.element(element[0].querySelector('#cns-psc'));
                var points = containerSlider[0].clientHeight / 2 + ',0 '+
                    '0,' + containerSlider[0].clientHeight + ' ' +
                    containerSlider[0].clientWidth + ',' + containerSlider[0].clientHeight;
                    slider.attr('points', points);
                var paginationWidth = 0,
                    scrollWidth = 0,
                    scale = 0,
                    scrollBarWidth = 0;
                $timeout(function() {
                    paginationWidth = divPages[0].scrollWidth;
                    scrollWidth = divScroll[0].scrollWidth;
                    scale = paginationWidth / scrollWidth;
                    scrollBarWidth = scrollWidth / scale;
                    divScrollBar.css({width: Math.round(scrollBarWidth) + 'px'});
                    divScrollButton.css({width: Math.round(scrollBarWidth) + 'px'});
                }, 0);
                var startX = 0, x = 0;
                divScrollButton.on('mousedown', function(event) {
                    event.preventDefault();
                    startX = event.screenX - x;
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                });
                function mousemove(event) {
                    if((event.screenX - startX) >= 0 && (event.screenX - startX) < scrollWidth - scrollBarWidth) {
                        x = event.screenX - startX;
                        divScrollBar.css({left: x + 'px'});
                        divScrollButton.css({left: x + 'px'});
                        var left = Math.ceil( paginationWidth / x * scale);
                        divPages[0].scrollLeft = Math.ceil(x * scale);
                    }
                }
                function mouseup() {
                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);
                }
                scope.setCurPage = function(page) {
                    scope.ngModel = page;
                };
            },
            scope: {
                ngModel: '=',
                totalPages: '@'
            },
            templateUrl: '../src/templates/directives/pagination.html'
        }
    }]);



angular.module('cns.ui.runner', [])
    .directive('cnsRunner', ['$timeout', '$document', function($timeout, $document) {
        return {
            link: function(scope, element, attributes) {
                var divMain = angular.element(element[0].querySelector('.cns-runner-main')),
                    divLeft = angular.element(element[0].querySelector('.cns-runner-left')),
                    divRight = angular.element(element[0].querySelector('.cns-runner-right')),
                    divBar = angular.element(element[0].querySelector('.cns-runner-bar')),
                    leftButton = angular.element(element[0].querySelector('#cns-rbl')),
                    rightButton = angular.element(element[0].querySelector('#cns-rbr')),
                    containerButton = angular.element(element[0].querySelector('.cns-runner-button-container'));
                var leftPoints = '0,' + containerButton[0].clientHeight / 2 + ' ' +
                        (containerButton[0].clientHeight - 2) + ',0 ' +
                        (containerButton[0].clientWidth - 2) + ',' + containerButton[0].clientHeight;
                var rigthPoints = '2,0 ' +
                        (containerButton[0].clientHeight - 2) +',' + containerButton[0].clientHeight / 2 + ' ' +
                        '2,' + containerButton[0].clientHeight;
                //leftButton.attr('points', leftPoints);
                //rightButton.attr('points', rigthPoints);
                var mainWidth = 0,
                    leftWidth = 0,
                    rightWidth = 0,
                    barWidth = 0;
                $timeout(function() {
                    scope.w = divLeft[0].clientWidth;
                    scope.h = divLeft[0].clientHeight;
                    mainWidth = divMain[0].clientWidth;
                    leftWidth = divLeft[0].clientWidth;
                    rightWidth = divRight[0].clientWidth;
                    barWidth = (mainWidth - leftWidth - rightWidth) / scope.totalPages;
                    divBar.css({left: leftWidth + 'px', width: Math.round(barWidth) + 'px'});
                }, 0);
                var startX = 0, x = 0;
                divBar.on('mousedown', function(event) {
                    event.preventDefault();
                    startX = event.screenX - x;
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                });
                function mousemove(event) {
                    if((event.screenX - startX) >= leftWidth && (event.screenX - startX) < mainWidth - rightWidth - barWidth) {
                        x = event.screenX - startX;
                        divBar.css({left: x + 'px'});
                        scope.$apply( function() {
                            scope.ngModel = Math.round(x / barWidth);
                        });
                    }
                }
                function mouseup() {
                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);
                }
                scope.$watch("ngModel", function() {
                    divBar.css({left: Math.round(leftWidth + (scope.ngModel - 1) * barWidth) + 'px'});
                });
                scope.setCurPage = function(event, page) {
                    event.preventDefault();
                    switch(page) {
                        case 'prev':
                            scope.ngModel = (scope.ngModel > 1) ? scope.ngModel - 1 : scope.ngModel;
                            break;
                        case 'next':
                            scope.ngModel = (scope.ngModel < scope.totalPages) ? scope.ngModel + 1 : scope.ngModel;
                            break;
                    }
                };
            },
            restrict: 'E',
            scope: {
                ngModel: '=',
                totalPages: '@'
            },
            templateUrl: '../src/templates/directives/runner.html'
        };
    }]);

angular.module("../src/templates/directives/grow.html", []).run(["$templateCache", function($templateCache) {
$templateCache.put("../src/templates/directives/grow.html",
	"<div class=\"cns-runner-main\">" +
	"    <div class=\"cns-runner-left\" ng-click=\"setCurPage($event, 'prev')\">" +
	"        <svg height=\"15\" width=\"15\" class=\"cns-grow-button-container\">" +
	"            <polygon points=\"0,7.5 13,0 13,15\" id=\"cns-gbl\" class=\"cns-grow-button\" />" +
	"        </svg>" +
	"    </div>" +
	"    <div class=\"cns-runner-bar\"></div>" +
	"    <div class=\"cns-runner-right\" ng-click=\"setCurPage($event,'next')\">" +
	"        <svg height=\"15\" width=\"15\" class=\"cns-grow-button-container\">" +
	"            <polygon points=\"2,0 15,7.5 2,15\" id=\"cns-gbr\" class=\"cns-grow-button\" />" +
	"        </svg>" +
	"    </div>" +
	"</div>"
);
}]);

angular.module("../src/templates/directives/pagination.html", []).run(["$templateCache", function($templateCache) {
$templateCache.put("../src/templates/directives/pagination.html",
	"<div class=\"cns-container\">" +
	"    <div class=\"cns-scroll-pagination-pages\">" +
	"        <a ng-if=\"!revers\" ng-repeat=\"page in pages track by $index\" href=\"#\" ng-click=\"setCurPage($index + 1)\"" +
	"           ng-class=\"{'cns-scroll-pagination-current': $index + 1 == ngModel}\">{{$index + 1}}</a>" +
	"        <a ng-if=\"revers\" ng-repeat=\"page in pages track by $index\" href=\"#\" ng-click=\"setCurPage(totalPages - $index)\"" +
	"           ng-class=\"{'cns-scroll-pagination-current': totalPages - $index == ngModel}\">{{totalPages - $index}}</a>" +
	"    </div>" +
	"    <div class=\"cns-scroll-pagination-container\">" +
	"        <div class=\"cns-scroll-pagination\">" +
	"            <div class=\"cns-scroll-pagination-bar\"></div>" +
	"            <div class=\"cns-scroll-pagination-button\">" +
	"                <span>" +
	"                    <svg width=\"15\" height=\"15\" id=\"cns-psc\" class=\"cns-pagination-slider-container\">" +
	"                        <polygon id=\"cns-ps\" class=\"cns-pagination-slider\" points=\"7.5,0 0,15 15,15\" />" +
	"                    </svg>" +
	"                </span>" +
	"            </div>" +
	"        </div>" +
	"    </div>" +
	"</div>"
);
}]);

angular.module("../src/templates/directives/runner.html", []).run(["$templateCache", function($templateCache) {
$templateCache.put("../src/templates/directives/runner.html",
	"<div class=\"cns-runner-main\">" +
	"    <div class=\"cns-runner-left\" ng-click=\"setCurPage($event, 'prev')\">" +
	"        <svg height=\"15\" width=\"15\" class=\"cns-runner-button-container\">" +
	"            <polygon points=\"0,7.5 13,0 13,15\" id=\"cns-rbl\" class=\"cns-runner-button\" />" +
	"        </svg>" +
	"    </div>" +
	"    <div class=\"cns-runner-bar\"></div>" +
	"    <div class=\"cns-runner-right\" ng-click=\"setCurPage($event,'next')\">" +
	"        <svg height=\"15\" width=\"15\" class=\"cns-runner-button-container\">" +
	"            <polygon points=\"2,0 15,7.5 2,15\" id=\"cns-rbr\" class=\"cns-runner-button\" />" +
	"        </svg>" +
	"    </div>" +
	"</div>"
);
}]);
