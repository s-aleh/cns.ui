'use strict';

angular.module('cns.ui.mousewheel', [])
    .directive('cnsMousewheel', [function() {
        return {
            link: function(scope, element) {
                if (element[0].addEventListener) {
                    if ('onwheel' in document) {
                        element[0].addEventListener ("wheel", mousewheel, false);
                    } else if ('onmousewheel' in document) {
                        element[0].addEventListener ("mousewheel", mousewheel, false);
                    } else {
                        element[0].addEventListener ("MozMousePixelScroll", mousewheel, false);
                    }
                } else {
                    element[0].attachEvent ("onmousewheel", mousewheel);
                }
                function mousewheel(event) {
                    event.preventDefault();
                    var delta = event.wheelDelta,
                        dx = event.wheelDeltaX || event.deltaX,
                        dy = event.wheelDeltaY || -event.deltaY || event.wheelDelta;
                    scope.dx = dx;
                    scope.dy = dy;
                    scope.$apply();
                }
            },
            restrict: 'A',
            scope: {
                dx: '=',
                dy: '='
            }
        }
    }]);