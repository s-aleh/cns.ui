'use strict';

angular.module('cns.ui.runner', [])
    .directive('cnsRunner', ['$timeout', '$document', function($timeout, $document) {
        return {
            link: function(scope, element, attributes) {
                var divMain = angular.element(element[0].querySelector('.cns-runner-main')),
                    divLeft = angular.element(element[0].querySelector('.cns-runner-left')),
                    divRight = angular.element(element[0].querySelector('.cns-runner-right')),
                    divBar = angular.element(element[0].querySelector('.cns-runner-bar'));
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
