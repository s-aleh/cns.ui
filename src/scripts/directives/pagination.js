'use strict';

angular.module('cns.ui.pagination', [])
    .directive('cnsPagination', ['$timeout', '$document', function($timeout, $document) {
        return {
            link: function(scope, element, attributes) {
                scope.pages = new Array(Number(scope.totalPages));
                scope.revers = angular.isUndefined(attributes.revers) ? false : true;
                var pagination = element[0],
                    divPages = angular.element(element[0].querySelector('.cns-pagination-pages')),
                    divScroll = angular.element(element[0].querySelector('.cns-pagination-scroll')),
                    divScrollBar = angular.element(element[0].querySelector('.cns-pagination-bar')),
                    divScrollButton = angular.element(element[0].querySelector('.cns-pagination-button')),
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
                if (pagination.addEventListener) {
                    if ('onwheel' in document) {
                        pagination.addEventListener ("wheel", mousewheel, false);
                    } else if ('onmousewheel' in document) {
                        pagination.addEventListener ("mousewheel", mousewheel, false);
                    } else {
                        pagination.addEventListener ("MozMousePixelScroll", mousewheel, false);
                    }
                } else {
                    pagination.attachEvent ("onmousewheel", mousewheel);
                }
                function mousewheel(event) {
                    event.preventDefault();
                    var delta = event.wheelDelta,
                        dx = event.wheelDeltaX || event.deltaX,
                        dy = event.wheelDeltaY || - event.deltaY || event.wheelDelta;
                    if(dy < 0) {
                        if(Math.round(x + scrollBarWidth) < Math.round(scrollWidth - scrollBarWidth)) {
                            x += Math.round(scrollBarWidth);
                            setPos();
                        } else {
                            x = Math.round(scrollWidth - scrollBarWidth);
                            setPos();
                        }
                    }
                    if(dy > 0) {
                        if(Math.round(x - scrollBarWidth) > 0) {
                            x -= Math.round(scrollBarWidth);
                            setPos();
                        } else {
                            x = 0;
                            setPos();
                        }
                    }
                }
                $timeout(init, 0);
                scope.$watch("totalPages", function() {
                    scope.pages = new Array(Number(scope.totalPages));
                    $timeout(init, 0);
                });
                var startX = 0, x = 0;
                function setPos () {
                    divScrollBar.css({left: x + 'px'});
                    divScrollButton.css({left: x + 'px'});
                    var left = Math.ceil( paginationWidth / x * scale);
                    divPages[0].scrollLeft = Math.ceil(x * scale);
                }
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

