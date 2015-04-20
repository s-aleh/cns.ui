'use strict';

angular.module('cns.ui.calendar', [])
    .controller('CalendarCtrl', ['$scope', '$element', '$sce', '$attrs', function($scope, $element, $sce, $attrs) {
        var md = {
            months: [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ],
            shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
            shortDays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            getNameOfMonth: function(month) {
                return this.months[month];
            },
            getShortNameOfMonths: function() {
                return this.shortMonths;
            },
            getShortDays: function() {
                return this.shortDays;
            }
        };
        $scope.arrow = angular.isDefined($attrs.arrow) ? Number($attrs.arrow) : 12;
        var leftPoints = '0,' + $scope.arrow / 2 + ' ' + ($scope.arrow - 2) + ',0 ' + ($scope.arrow - 2) + ',' + $scope.arrow;
        $scope.arrowLeft = $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + $scope.arrow + '" height="' + $scope.arrow + '">' +
            '<polygon points="' + leftPoints + '" class="cns-grow-button" />' +
            '</svg>');
        var rightPoints = '2,0 ' + $scope.arrow +',' + $scope.arrow / 2 + ' ' + '2,' + $scope.arrow;
        $scope.arrowRight = $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + $scope.arrow+ '" height="' + $scope.arrow + '">' +
            '<polygon points="' + rightPoints+ '" class="cns-grow-button" />' +
            '</svg>');

        var calendar = angular.element($element[0].querySelector('.cns-calendar'));
        if (calendar[0].addEventListener) {
            if ('onwheel' in document) {
                calendar[0].addEventListener ("wheel", mousewheel, false);
            } else if ('onmousewheel' in document) {
                calendar[0].addEventListener ("mousewheel", mousewheel, false);
            } else {
                calendar[0].addEventListener ("MozMousePixelScroll", mousewheel, false);
            }
        } else {
            calendar[0].attachEvent ("onmousewheel", mousewheel);
        }
        function mousewheel(event) {
            event.preventDefault();
            var delta = event.wheelDelta,
                dx = event.wheelDeltaX || event.deltaX,
                dy = event.wheelDeltaY || -event.deltaY || event.wheelDelta;
            switch ($scope.view) {
                case 'days':
                    if(dy > 0) {
                        $scope.setMonth('prev');
                    } else {
                        $scope.setMonth('next');
                    }
                    $scope.$apply();
                    break;
                case 'months':
                    if(dy > 0) {
                        $scope.setYear('prev');
                    } else {
                        $scope.setYear('next');
                    }
                    $scope.$apply();
                    break;
                case 'years':
                    if(dy > 0) {
                        $scope.setDecade('prev');
                    } else {
                        $scope.setDecade('next');
                    }
                    $scope.$apply();
                    break;
                case 'decades':
                    if(dy > 0) {
                        $scope.setMillennium('prev');
                    } else {
                        $scope.setMillennium('next');
                    }
                    $scope.$apply();
                    break;
            }
        }
        $scope.shortDays = md.getShortDays();
        $scope.shortMonths = md.getShortNameOfMonths();
        $scope.verifyDate = function(day) {
            var dt = angular.copy($scope.dt),
                ngModel = new Date($scope.ngModel);
            dt.setDate(day);
            if(ngModel.getFullYear() == dt.getFullYear() && ngModel.getMonth() == dt.getMonth() && ngModel.getDate() == dt.getDate()) {
                return true;
            } else {
                return false;
            }
        };
        $scope.verifyMarkDates = function(day) {
            var dt = angular.copy($scope.dt);
            dt.setDate(day);
            for(var date in $scope.dates) {
                var tmpDate = new Date($scope.dates[date]);
                if(tmpDate.getFullYear() == dt.getFullYear() && tmpDate.getMonth() == dt.getMonth() && tmpDate.getDate() == dt.getDate()) {
                    return true;
                }
            }
            return false;
        };
        $scope.setView = function(view) {
            $scope.view = view;
            switch (view) {
                case 'months':
                    $scope.titleMonths = $scope.dt.getFullYear();
                    break;
                case 'years':
                    var start = $scope.dt.getFullYear() - $scope.dt.getFullYear() % 10,
                        end = start + 9;
                    $scope.titleYears = start + ' - ' + end;
                    $scope.years = getYears();
                    break;
                case 'decades':
                    var start = $scope.dt.getFullYear() - $scope.dt.getFullYear() % 100,
                        end = start + 99;
                    $scope.titleDecades = start + ' - ' + end;
                    $scope.decades = getDecades();
                    break;
            }
        };
        $scope.setMillennium = function (millennium) {
            var m = $scope.dt.getFullYear() - $scope.dt.getFullYear() % 100;
            switch (millennium) {
                case 'prev':
                    if(m - $scope.startYear > 0) {
                        $scope.dt.setFullYear(m - 100);
                    } else {
                        $scope.dt.setFullYear($scope.startYear);
                    }
                    break;
                case 'next':
                    if(m + 100 < $scope.endYear) {
                        $scope.dt.setFullYear(m + 100);
                    }
                    break;
            }
            var start = $scope.dt.getFullYear() - $scope.dt.getFullYear() % 100,
                end = start + 99;
            $scope.titleDecades = start + ' - ' + end;
            $scope.decades = getDecades();
        };
        $scope.setDecade = function(decade) {
            switch (decade) {
                case 'prev':
                    if($scope.dt.getFullYear() - $scope.startYear > 10) {
                        $scope.dt.setFullYear($scope.dt.getFullYear() - 10);
                    } else {
                        $scope.dt.setFullYear($scope.startYear);
                    }
                    break;
                case 'next':
                    if($scope.endYear - $scope.dt.getFullYear() > 10) {
                        $scope.dt.setFullYear($scope.dt.getFullYear() + 10);
                    } else {
                        $scope.dt.setFullYear($scope.endYear);
                    }
                    break;
                default:
                    $scope.dt.setFullYear(decade);
                    $scope.setView('years');
                    break;
            }
            var start = $scope.dt.getFullYear() - $scope.dt.getFullYear() % 10,
                end = start + 9;
            $scope.titleYears = start + ' - ' + end;
            $scope.years = getYears();
        };
        $scope.setYear = function (year) {
            switch (year) {
                case 'prev':
                    if($scope.dt.getFullYear() > $scope.startYear) {
                        $scope.dt.setFullYear($scope.dt.getFullYear() - 1);
                        $scope.titleMonths = $scope.dt.getFullYear();
                    }
                    break;
                case 'next':
                    if($scope.dt.getFullYear() < $scope.endYear) {
                        $scope.dt.setFullYear($scope.dt.getFullYear() + 1);
                        $scope.titleMonths = $scope.dt.getFullYear();
                    }
                    break;
                default:
                    $scope.dt.setFullYear(year);
                    $scope.titleMonths = $scope.dt.getFullYear();
                    $scope.setView('months');
                    break;
            }
        };
        $scope.setMonth = function(month) {
            var d = new Date($scope.dt);
            switch (month) {
                case 'prev':
                    d.setMonth(d.getMonth() - 1);
                    if(d.getFullYear() >= $scope.startYear) {
                        $scope.dt.setMonth($scope.dt.getMonth() - 1, 1);
                        $scope.titleDays = md.getNameOfMonth($scope.dt.getMonth()) + ' ' + $scope.dt.getFullYear();
                        $scope.days = getDays();
                    }
                    break;
                case 'next':
                    d.setMonth(d.getMonth() + 1);
                    if(d.getFullYear() <= $scope.endYear) {
                        $scope.dt.setMonth($scope.dt.getMonth() + 1, 1);
                        $scope.titleDays = md.getNameOfMonth($scope.dt.getMonth()) + ' ' + $scope.dt.getFullYear();
                        $scope.days = getDays();
                    }
                    break;
                default:
                    $scope.dt.setMonth(month, 1);
                    $scope.titleDays = md.getNameOfMonth($scope.dt.getMonth()) + ' ' + $scope.dt.getFullYear();
                    $scope.days = getDays();
                    $scope.setView('days');
                    break;
            }
        };
        $scope.setDate = function(day) {
            if(day[1]) {
                $scope.dt.setDate(day[0]);
                var s = $scope.ngModel.indexOf('-') > 0 ? '-' : '/';
                var m = $scope.dt.getMonth() < 9 ? '0' + ($scope.dt.getMonth() + 1) : $scope.dt.getMonth() + 1;
                var d = $scope.dt.getDate() < 10 ? '0' + $scope.dt.getDate() : $scope.dt.getDate();
                $scope.ngModel = m + s + d + s + $scope.dt.getFullYear();
            }
        };
        $scope.$watch('ngModel', function() {
            var expr = /^[0,1][0-9][-,\/][0-3][0-9][-,\/][0-2]\d{3}/;
            if($scope.ngModel.match(expr)) {
                $scope.dt = new Date($scope.ngModel);
                $scope.titleDays = md.getNameOfMonth($scope.dt.getMonth()) + ' ' + $scope.dt.getFullYear();
                $scope.days = getDays();
            }
        });
        function getDecades() {
            var decades = [];
            var start = $scope.dt.getFullYear() - $scope.dt.getFullYear() % 100,
                end = start + 99;
            for(var i = start; i <= end; i+=10) {
                decades.push(i);
            }
            return decades;
        }
        function getYears() {
            var years = [];
            var start = $scope.dt.getFullYear() - $scope.dt.getFullYear() % 10,
                end = start + 9;
            for(var i = start; i <= end; i++) {
                years.push(i);
            }
            return years;
        }
        function getDays() {
            var days = [],
                day = new Date($scope.dt);
            day.setDate(1);
            var numberOfFirstDay = day.getDay();
            var countDays = getLastDayOfMonth($scope.dt.getFullYear(), $scope.dt.getMonth()),
                prevCountDays = getLastDayOfMonth($scope.dt.getFullYear(), $scope.dt.getMonth() - 1);
            day.setDate(countDays);
            var numberOfLastDay = day.getDay();
            for(var i = prevCountDays - numberOfFirstDay + 1; i <= prevCountDays; i++) {
                days.push([i, 0]);
            }
            for(var i = 1; i <= countDays; i++) {
                days.push([i, 1]);
            }
            for(var i = 1; i < 7 - numberOfLastDay; i++) {
                days.push([i, 0]);
            }
            return days;
        }
        function getLastDayOfMonth(year, month) {
            var date = new Date(year, month + 1, 0);
            return date.getDate();
        }
        this.init = function() {
            $scope.shortMonth = md.getNameOfMonth($scope.dt.getMonth());
            $scope.view = 'days';
        };
    }])
    .directive('cnsCalendar', [function() {
    return {
        controller: 'CalendarCtrl',
        link: function(scope, element, attributes, controllers) {
            scope.startYear = angular.isDefined(attributes.startYear) ? Number(attributes.startYear) : 1900;
            scope.endYear = angular.isDefined(attributes.endYear) ? Number(attributes.endYear) : 2099;
            if(!scope.ngModel) {
                scope.dt = new Date();
            } else {
                var expr = /^[0,1][0-9][-,\/][0-3][0-9][-,\/][0-2]\d{3}/;
                if(scope.ngModel.match(expr)) {
                    scope.dt = new Date(scope.ngModel);
                } else {
                    scope.dt = new Date();
                }
            }
            var datepickerCtrl = controllers[0];
            if(!datepickerCtrl) {
                console.log('CalendarCtrl error');
            } else {
                datepickerCtrl.init();
            }
        },
        require: ['cnsCalendar'],
        scope: {
            ngModel: '=',
            dates: '='
        },
        templateUrl: '../src/templates/directives/calendar.html',
        transclude: true
    };
}]);