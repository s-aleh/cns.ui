'use strict';

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
