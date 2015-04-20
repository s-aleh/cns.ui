'use strict';

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
                            dy = event.wheelDeltaY || -event.deltaY || event.wheelDelta;
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