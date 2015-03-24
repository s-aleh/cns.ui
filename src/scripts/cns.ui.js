'use strict';

angular.module('cns.ui', ['cns.ui.templates', 'cns.ui.pagination']);
angular.module('cns.ui.templates', ['templates/directives/pagination.html']);

angular.module('cns.ui.pagination', [])
    .directive('cnsScrollPagination', ['$timeout', '$document', function($timeout, $document){
        return {
            link: function(scope, element, attributes, controllers) {
                scope.pages = new Array(Number(scope.totalPages));
                var divPages = angular.element(element[0].querySelector('.cns-scroll-pagination-pages')),
                    divScroll = angular.element(element[0].querySelector('.cns-scroll-pagination')),
                    divScrollBar = angular.element(element[0].querySelector('.cns-scroll-pagination-bar')),
                    divScrollButton = angular.element(element[0].querySelector('.cns-scroll-pagination-button'));
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
            templateUrl: 'templates/directives/pagination.html'
        }
    }]);

angular.module('templates/directives/pagination.html', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('templates/directives/pagination.html',
        "<div class=\"cns-container\">" +
        "   <div class=\"cns-scroll-pagination-pages\">" +
        "       <a ng-repeat=\"page in pages track by $index\" href=\"#\" ng-click=\"setCurPage($index + 1)\"" +
        "           ng-class=\"{'cns-scroll-pagination-current': $index + 1 == ngModel}\">{{$index + 1}}</a>" +
        "   </div>" +
        "   <div class=\"cns-scroll-pagination-container\">" +
        "       <div class=\"cns-scroll-pagination\">" +
        "           <div class=\"cns-scroll-pagination-bar\"></div>" +
        "           <div class=\"cns-scroll-pagination-button\">" +
        "               <span id=\"cns-scroll-pagination-icon\">" +
        "                   <svg height=\"15\" width=\"15\">" +
        "                       <polygon points=\"7,0 8,0 0,15 15,15\" class=\"cns-slider\" />" +
        "                   </svg>" +
        "               </span>" +
        "           </div>" +
        "       </div>" +
        "   </div>" +
        "</div>"
    );
}]);
