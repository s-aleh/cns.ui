'use strict';

angular.module('cns.ui', ['cns.ui.templates', 'cns.ui.pagination', 'cns.ui.runner', 'cns.ui.grow', 'cns.ui.scroll']);

angular.module('cns.ui.templates', ['../src/templates/directives/grow.html', '../src/templates/directives/pagination.html', '../src/templates/directives/runner.html', '../src/templates/directives/scroll.html']);



angular.module('cns.ui.grow', [])
    .directive('cnsGrow', ['$timeout', '$document', function($timeout, $document) {
        return {
            link: function(scope, element, attributes) {
                var divMain = angular.element(element[0].querySelector('.cns-grow-main')),
                    divLeft = angular.element(element[0].querySelector('.cns-grow-left')),
                    divRight = angular.element(element[0].querySelector('.cns-grow-right')),
                    divBar = angular.element(element[0].querySelector('.cns-grow-bar'));
                var leftPoints = '0,' + divLeft[0].clientHeight / 2 + ' ' + (divLeft[0].clientWidth - 2) + ',0 ' +
                    (divLeft[0].clientWidth - 2) + ',' + divLeft[0].clientHeight;
                var arrowLeft = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                    '<polygon points="' + leftPoints + '" class="cns-grow-button" />' +
                    '</svg>';
                divLeft.html(arrowLeft);
                var rightPoints = '2,0 ' + divRight[0].clientWidth +',' + divRight[0].clientHeight / 2 + ' ' +
                    '2,' + divRight[0].clientHeight;
                var arrowRight = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                    '<polygon points="' + rightPoints+ '" class="cns-grow-button" />' +
                    '</svg>';
                divRight.html(arrowRight);
                var mainWidth = 0,
                    leftWidth = 0,
                    rightWidth = 0,
                    barWidth = 0;
                function init() {
                    scope.ngModel = Number(scope.ngModel);
                    scope.totalPages = Number(scope.totalPages);
                    scope.ngModel = scope.ngModel > scope.totalPages ? scope.totalPages : scope.ngModel;
                    scope.ngModel = scope.ngModel < 1 ? 1 : scope.ngModel;
                    mainWidth = divMain[0].clientWidth;
                    leftWidth = divLeft[0].clientWidth;
                    rightWidth = divRight[0].clientWidth;
                    barWidth = (mainWidth - leftWidth - rightWidth) / scope.totalPages;
                    divBar.css({left: leftWidth + 'px', width: Math.round(barWidth * scope.ngModel) + 'px'});
                }
                $timeout(init, 0);
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
                scope.$watch("ngModel", init);
                scope.$watch("totalPages", init);
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
    .directive('cnsScrollPagination', ['$timeout', '$document', function($timeout, $document) {
        return {
            link: function(scope, element, attributes) {
                scope.pages = new Array(Number(scope.totalPages));
                scope.revers = angular.isUndefined(attributes.revers) ? false : true;
                var divPages = angular.element(element[0].querySelector('.cns-scroll-pagination-pages')),
                    divScroll = angular.element(element[0].querySelector('.cns-scroll-pagination')),
                    divScrollBar = angular.element(element[0].querySelector('.cns-scroll-pagination-bar')),
                    divScrollButton = angular.element(element[0].querySelector('.cns-scroll-pagination-button')),
                    slider = angular.element(element[0].querySelector('#cns-ps')),
                    containerSlider = angular.element(element[0].querySelector('#cns-psc'));
                var paginationWidth = 0,
                    scrollWidth = 0,
                    scale = 0,
                    scrollBarWidth = 0;
                function init() {
                    paginationWidth = divPages[0].scrollWidth;
                    scrollWidth = divScroll[0].scrollWidth;
                    scale = paginationWidth / scrollWidth;
                    scrollBarWidth = scrollWidth / scale;
                    divScrollBar.css({width: Math.round(scrollBarWidth) + 'px'});
                    divScrollButton.css({width: Math.round(scrollBarWidth) + 'px'});
                    if(x + scrollBarWidth > scrollWidth) {
                        x = scrollWidth - scrollBarWidth;
                        divScrollBar.css({left: Math.round(x) + 'px'});
                        divScrollButton.css({left: Math.round(x) + 'px'});
                    }
                }
                $timeout(init, 0);
                scope.$watch("totalPages", function($old, $new) {
                    scope.pages = new Array(Number(scope.totalPages));
                    $timeout(init, 0);
                });
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
                    divBar = angular.element(element[0].querySelector('.cns-runner-bar'));
                var leftPoints = '0,' + divLeft[0].clientHeight / 2 + ' ' + (divLeft[0].clientWidth - 2) + ',0 ' +
                        (divLeft[0].clientWidth - 2) + ',' + divLeft[0].clientHeight;
                var arrowLeft = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                    '<polygon points="' + leftPoints + '" class="cns-runner-button" />' +
                    '</svg>';
                divLeft.html(arrowLeft);
                var rightPoints = '2,0 ' + divRight[0].clientWidth +',' + divRight[0].clientHeight / 2 + ' ' +
                        '2,' + divRight[0].clientHeight;
                var arrowRight = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                    '<polygon points="' + rightPoints+ '" class="cns-runner-button" />' +
                    '</svg>';
                divRight.html(arrowRight);
                var mainWidth = 0,
                    leftWidth = 0,
                    rightWidth = 0,
                    barWidth = 0;
                function init() {
                    scope.ngModel = Number(scope.ngModel);
                    scope.totalPages = Number(scope.totalPages);
                    scope.ngModel = scope.ngModel > scope.totalPages ? scope.totalPages : scope.ngModel;
                    scope.ngModel = scope.ngModel < 1 ? 1 : scope.ngModel;
                    mainWidth = divMain[0].clientWidth;
                    leftWidth = divLeft[0].clientWidth;
                    rightWidth = divRight[0].clientWidth;
                    barWidth = (mainWidth - leftWidth - rightWidth) / scope.totalPages;
                    if(!move) {
                        divBar.css({
                            left: Math.round(leftWidth + (scope.ngModel - 1) * barWidth) + 'px',
                            width: Math.round(barWidth) + 'px'
                        });
                    }
                }
                $timeout(init, 0);
                var startX = 0, x = 0, move = false;
                divBar.on('mousedown', function(event) {
                    event.preventDefault();
                    move = true;
                    startX = event.screenX - x;
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                });
                function mousemove(event) {
                    if((event.screenX - startX) >= leftWidth && (event.screenX - startX) < mainWidth - rightWidth - barWidth) {
                        x = event.screenX - startX;
                        divBar.css({left: x + 'px'});
                        scope.$apply( function() {
                            scope.ngModel = Math.round((x + 0.5 * barWidth) / barWidth);
                        });
                    }
                }
                function mouseup() {
                    move = false;
                    divBar.css({
                        left: Math.round(leftWidth + (scope.ngModel - 1) * barWidth) + 'px',
                        width: Math.round(barWidth) + 'px'
                    });
                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);
                }
                scope.$watch("ngModel", init);
                scope.$watch("totalPages", init);
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


angular.module('cns.ui.scroll', [])
    .directive('cnsScroll', ['$timeout', '$document', function($timeout, $document) {
        return {
            link: function (scope, element, attributes) {
                scope.vert = angular.isUndefined(attributes.vert) ? false : true;
                scope.hor = angular.isUndefined(attributes.hor) ? false : true;
                if(!(scope.vert || scope.hor)) {
                    scope.vert = true;
                    scope.hor = true;
                }
                scope.pos = {};
                scope.pos.left = angular.isUndefined(attributes.left) ? false : true;
                scope.pos.top = angular.isUndefined(attributes.top) ? false : true;

                $timeout(function() {
                    var scrollContainer = angular.element(element[0].querySelector('.cns-scroll'));
                    var scrollWidth = scrollContainer[0].scrollWidth,
                        scrollHeight = scrollContainer[0].scrollHeight,
                        clientWidth = scrollContainer[0].clientWidth,
                        clientHeight = scrollContainer[0].clientHeight;
                    var divVScroll = angular.element(element[0].querySelector('.cns-scroll-v')),
                        divHScroll = angular.element(element[0].querySelector('.cns-scroll-h'));
                    if(scrollWidth <= clientWidth) {
                        scope.hor = false;
                    }
                    if(scrollHeight <= clientHeight) {
                        scope.vert = false;
                    }
                    var vScroll = {};
                    if(scope.vert) {
                        vScroll.width = divVScroll[0].clientWidth;
                        vScroll.height = divVScroll[0].clientHeight;
                    }
                    var hScroll = {};
                    if(scope.hor) {
                        hScroll.width = divHScroll[0].clientWidth;
                        hScroll.height = divHScroll[0].clientHeight;
                    }
                    if(scope.vert && scope.hor) {
                        vScroll.height = vScroll.height - hScroll.height;
                        hScroll.width = hScroll.width - vScroll.width;
                        if(!scope.left || !scope.top) {
                            divVScroll.css({height: vScroll.height + 'px'});
                            divHScroll.css({width: hScroll.width + 'px'});
                        }
                        if(scope.pos.left && !scope.pos.top)
                        {
                            divVScroll.css({height: vScroll.height + 'px', left: 0, right: ''});
                            divHScroll.css({width: hScroll.width + 'px', left: vScroll.width + 'px', right: ''});
                        }
                        if(scope.pos.left && scope.pos.top)
                        {
                            divVScroll.css({height: vScroll.height + 'px', left: 0, top: hScroll.height + 'px'});
                            divHScroll.css({width: hScroll.width + 'px', left: vScroll.width + 'px', right: '', top: 0, bottom: ''});
                        }
                        if(!scope.pos.left && scope.pos.top)
                        {
                            divVScroll.css({height: vScroll.height + 'px', right: 0, left: '', top: hScroll.height + 'px'});
                            divHScroll.css({width: hScroll.width + 'px', left: 0, right: '', top: 0, bottom: ''});
                        }
                    }
                    scope.divScrollVBar = angular.element(element[0].querySelector('#cns-svb'));
                    scope.divScrollHBar = angular.element(element[0].querySelector('#cns-shb'));
                    scope.startX = 0;
                    scope.startY = 0;
                    scope.x = 0;
                    scope.y = 0;
                    var scaleV = vScroll.height / scrollHeight,
                        barH = scaleV * vScroll.height;
                    scope.divScrollVBar.css({height: Math.ceil(barH) + 'px'});
                    var scaleH = hScroll.width / scrollWidth,
                        barW = scaleH * hScroll.width;
                    scope.divScrollHBar.css({width: Math.ceil(barW) + 'px'});
                    var elem = document.getElementById('cns-scroll');
                    if (elem.addEventListener) {
                        if ('onwheel' in document) {
                            elem.addEventListener ("wheel", mousewheel, false);
                        } else if ('onmousewheel' in document) {
                            elem.addEventListener ("mousewheel", mousewheel, false);
                        } else {
                            elem.addEventListener ("MozMousePixelScroll", mousewheel, false);
                        }
                    } else {
                        elem.attachEvent ("onmousewheel", mousewheel);
                    }
                    function mousewheel(event) {
                        event.preventDefault();
                        var delta = event.wheelDelta,
                            dx = event.wheelDeltaX || event.deltaX,
                            dy = event.wheelDeltaY || event.deltaY || event.wheelDelta;
                        if(dy > 0 && scope.y > 0) {
                            scope.y -= Math.round(barH / 2);
                            if(scope.y < 0) {
                                scope.y = 0;
                            }
                            scope.divScrollVBar.css({top: scope.y + 'px'});
                            var top = Math.ceil(scope.divScrollVBar[0].offsetTop / scaleV);
                            scrollContainer[0].scrollTop = top;
                        }
                        var y = Math.round(vScroll.height - barH);
                        if(dy < 0 && scope.y <= y) {
                            scope.y = scope.y + Math.round(barH / 2);
                            if(scope.y > y) {
                                scope.y = y;
                            }
                            scope.divScrollVBar.css({top: scope.y + 'px'});
                            var top = Math.ceil(scope.divScrollVBar[0].offsetTop / scaleV);
                            scrollContainer[0].scrollTop = top;
                        }
                    }
                    scope.divScrollHBar.on('mousedown', function(event) {
                        event.preventDefault();
                        scope.startX = event.screenX - scope.x;
                        $document.on('mousemove', mousemoveh);
                        $document.on('mouseup', mouseuph);
                    });
                    function mousemoveh(event) {
                        if((event.screenX - scope.startX) >= 0 && (event.screenX - scope.startX) < hScroll.width - barW) {
                            scope.x = event.screenX - scope.startX;
                            scope.divScrollHBar.css({left: scope.x + 'px'});
                            var left = Math.ceil(scope.divScrollHBar[0].offsetLeft / scaleH);
                            scrollContainer[0].scrollLeft = left;
                        }
                    }
                    function mouseuph() {
                        $document.off('mousemove', mousemoveh);
                        $document.off('mouseup', mouseuph);
                    }
                    scope.divScrollVBar.on('mousedown', function(event) {
                        event.preventDefault();
                        scope.startY = event.screenY - scope.y;
                        $document.on('mousemove', mousemovev);
                        $document.on('mouseup', mouseupv);
                    });
                    function mousemovev(event) {
                        if((event.screenY - scope.startY) >= 0 && (event.screenY - scope.startY) < vScroll.height - barH) {
                            scope.y = event.screenY - scope.startY;
                            scope.divScrollVBar.css({top: scope.y + 'px'});
                            var top = Math.ceil(scope.divScrollVBar[0].offsetTop / scaleV);
                            scrollContainer[0].scrollTop = top;
                        }
                    }
                    function mouseupv() {
                        $document.off('mousemove', mousemovev);
                        $document.off('mouseup', mouseupv);
                    }
                }, 0);
            },
            restrict: 'A',
            scope: true,
            templateUrl: '../src/templates/directives/scroll.html',
            transclude: true
        }
    }]);
angular.module("../src/templates/directives/grow.html", []).run(["$templateCache", function($templateCache) {
$templateCache.put("../src/templates/directives/grow.html",
	"<div class=\"cns-grow-main\">" +
	"    <div class=\"cns-grow-left\" ng-click=\"setCurPage($event, 'prev')\"></div>" +
	"    <div class=\"cns-grow-bar\"></div>" +
	"    <div class=\"cns-grow-right\" ng-click=\"setCurPage($event,'next')\"></div>" +
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
	"    <div class=\"cns-runner-left\" ng-click=\"setCurPage($event, 'prev')\"></div>" +
	"    <div class=\"cns-runner-bar\"></div>" +
	"    <div class=\"cns-runner-right\" ng-click=\"setCurPage($event,'next')\"></div>" +
	"</div>"
);
}]);

angular.module("../src/templates/directives/scroll.html", []).run(["$templateCache", function($templateCache) {
$templateCache.put("../src/templates/directives/scroll.html",
	"<div class=\"cns-scroll\" id=\"cns-scroll\">" +
	"    <ng-transclude></ng-transclude>" +
	"</div>" +
	"<div ng-if=\"vert\" class=\"cns-scroll-v\" id=\"cns-sv\">" +
	"    <div class=\"cns-scroll-v-bar\" id=\"cns-svb\"></div>" +
	"</div>" +
	"<div ng-if=\"hor\" class=\"cns-scroll-h\" id=\"cns-sh\">" +
	"    <div class=\"cns-scroll-h-bar\" id=\"cns-shb\"></div>" +
	"</div>"
);
}]);
