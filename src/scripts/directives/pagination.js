'use strict';

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

