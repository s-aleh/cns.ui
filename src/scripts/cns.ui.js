'use strict';

angular.module('cns.ui', ['cns.ui.templates', 'cns.ui.pagination', 'cns.ui.runner', 'cns.ui.grow', 'cns.ui.scroll', 'cns.ui.datepicker',
    'cns.ui.calendar', 'cns.ui.dpl', 'cns.ui.mousewheel']);

angular.module('cns.ui.templates', ['../src/templates/directives/calendar.html', '../src/templates/directives/datepicker.html', '../src/templates/directives/dpl.html', '../src/templates/directives/grow.html', '../src/templates/directives/pagination.html', '../src/templates/directives/runner.html', '../src/templates/directives/scroll.html']);



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

angular.module('cns.ui.datepicker', [])
    .controller('DatepickerCtrl', ['$scope', '$element', '$sce', '$attrs', function($scope, $element, $sce, $attrs) {
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
        var top = $element[0].offsetTop,
            left = $element[0].offsetLeft;
        var datepicker = angular.element($element[0].querySelector('.cns-dp')),
            input = angular.element($element[0].querySelector('input'));
        var height = input[0].offsetHeight;
        input.on('focus', function() {
            datepicker.css({top: top + height + 2 + 'px', left: left + 'px', display: 'block'});
        });
        if ($element[0].addEventListener) {
            if ('onwheel' in document) {
                $element[0].addEventListener ("wheel", mousewheel, false);
            } else if ('onmousewheel' in document) {
                $element[0].addEventListener ("mousewheel", mousewheel, false);
            } else {
                $element[0].addEventListener ("MozMousePixelScroll", mousewheel, false);
            }
        } else {
            $element[0].attachEvent ("onmousewheel", mousewheel);
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
        $scope.close = function() {
            datepicker.css({display: 'none'});
        };
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
                $scope.close();
            }
        };
        $scope.$watch('ngModel', function() {
            var expr = /^[0,1][0-9][-,\/][0-3][0-9][-,\/][0-2]\d{3}/;
            if($scope.ngModel.match(expr)) {
                input.removeClass('cns-dp-input-error');
                $scope.dt = new Date($scope.ngModel);
                $scope.titleDays = md.getNameOfMonth($scope.dt.getMonth()) + ' ' + $scope.dt.getFullYear();
                $scope.days = getDays();
            } else {
                input.addClass('cns-dp-input-error');
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
    .directive('cnsDatepicker', [function() {
    return {
        controller: 'DatepickerCtrl',
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
                console.log('DatepickerCtrl error');
            } else {
                datepickerCtrl.init();
            }
        },
        require: ['cnsDatepicker'],
        scope: {
            ngModel: '='
        },
        templateUrl: '../src/templates/directives/datepicker.html',
        transclude: true
    };
}]);

angular.module('cns.ui.dpl', [])
.controller('DplCtrl', ['$scope', '$element', '$sce', '$attrs', function($scope, $element, $sce, $attrs) {
    var md = {
        months: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ],
        shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        getNameOfMonth: function(month) {
            return this.months[month];
        },
        getShortNameOfMonth: function(month) {
                return this.shortMonths[month];
        }
    };
    $scope.arrow = angular.isDefined($attrs.arrow) ? $attrs.arrow : 18;
    var topPoints = '0,' + $scope.arrow + ' ' + ($scope.arrow / 2) + ',' + $scope.arrow / 2 + ' ' + $scope.arrow + ',' + $scope.arrow;
    $scope.arrowTop = $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + $scope.arrow + '" height="' + $scope.arrow + '">' +
    '<polygon class="cns-dpl-svg" points="' + topPoints + '" class="cns-grow-button" />' +
    '</svg>');
    var bottomPoints = '0,0 ' + $scope.arrow +',0 ' + $scope.arrow / 2 + ',' + $scope.arrow / 2;
    $scope.arrowBottom = $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + $scope.arrow+ '" height="' + $scope.arrow + '">' +
    '<polygon class="cns-dpl-svg" points="' + bottomPoints+ '" class="cns-grow-button" />' +
    '</svg>');
    var divDate = angular.element($element[0].querySelector('.cns-dpl'));
    var top = $element[0].offsetTop,
        left = $element[0].offsetLeft;
    var input = angular.element($element[0].querySelector('input'));
    var height = input[0].offsetHeight;
    input.on('focus', function() {
        divDate.css({top: top + height + 2 + 'px', left: left + 'px', display: 'block'});
    });

    var divM = angular.element($element[0].querySelector('#cns-dpl-month')),
        divD = angular.element($element[0].querySelector('#cns-dpl-date')),
        divY = angular.element($element[0].querySelector('#cns-dpl-year'));
    function addEvt (e, mousewheel) {
        if (e.addEventListener) {
            if ('onwheel' in document) {
                e.addEventListener ("wheel", mousewheel, false);
            } else if ('onmousewheel' in document) {
                e.addEventListener ("mousewheel", mousewheel, false);
            } else {
                e.addEventListener ("MozMousePixelScroll", mousewheel, false);
            }
        } else {
            e.attachEvent ("onmousewheel", mousewheel);
        }
    }
    function mousewheelMonth(event) {
        event.preventDefault();
        var delta = event.wheelDelta,
            dx = event.wheelDeltaX || event.deltaX,
            dy = event.wheelDeltaY || -event.deltaY || event.wheelDelta;
        if(dy < 0) {
            $scope.setMonth(1);
            $scope.$apply();
        }
        if(dy > 0) {
            $scope.setMonth(-1);
            $scope.$apply();
        }
    }
    function mousewheelDate(event) {
        event.preventDefault();
        var delta = event.wheelDelta,
            dx = event.wheelDeltaX || event.deltaX,
            dy = event.wheelDeltaY || -event.deltaY || event.wheelDelta;
        if(dy < 0) {
            $scope.setDate(1);
            $scope.$apply();
        }
        if(dy > 0) {
            $scope.setDate(-1);
            $scope.$apply();
        }
    }
    function mousewheelYear(event) {
        event.preventDefault();
        var delta = event.wheelDelta,
            dx = event.wheelDeltaX || event.deltaX,
            dy = event.wheelDeltaY || -event.deltaY || event.wheelDelta;
        if(dy < 0) {
            $scope.setYear(1);
            $scope.$apply();
        }
        if(dy > 0) {
            $scope.setYear(-1);
            $scope.$apply();
        }
    }
    addEvt(divM[0], mousewheelMonth);
    addEvt(divD[0], mousewheelDate);
    addEvt(divY[0], mousewheelYear);
    $scope.setNewDate = function() {
        $scope.dt.setFullYear($scope.date.year);
        $scope.dt.setMonth($scope.date.month);
        $scope.dt.setDate($scope.date.date);
        var s = $scope.ngModel.indexOf('-') > 0 ? '-' : '/';
        var m = $scope.date.month < 10 ? '0' + $scope.date.month : $scope.date.month;
        var d = $scope.date.date < 10 ? '0' + $scope.date.date : $scope.date.date;
        $scope.ngModel = m + s + d + s + $scope.date.year;
        divDate.css({display: 'none'});
    };
    $scope.cancel = function() {
        divDate.css({display: 'none'});
    };
    $scope.monthView = function(month) {
        switch ($scope.viewMonth) {
            case 'dig':
                return month < 10 ? '0' + month : month;
                break;
            default:
                return md.getShortNameOfMonth(month - 1);
                break;
        }
    };
    $scope.dateView = function(date) {
        return date < 10 ? '0' + date : date;
    };
    $scope.setMonth = function(delta) {
        if(delta < 0) {
            $scope.date.month = $scope.date.month == 1 ? 12 : $scope.date.month + delta;
            $scope.prevDate.month = $scope.date.month == 1 ? 12 : $scope.date.month - 1;
            $scope.nextDate.month = $scope.date.month == 12 ? 1 : $scope.date.month + 1;
        }
        if(delta > 0) {
            $scope.date.month = $scope.date.month == 12 ? 1 : $scope.date.month + delta;
            $scope.prevDate.month = $scope.date.month == 1 ? 12 : $scope.date.month - 1;
            $scope.nextDate.month = $scope.date.month == 12 ? 1 : $scope.date.month + 1;
        }
        var countDay = getLastDayOfMonth($scope.date.year, $scope.date.month - 1);
        if($scope.date.date > countDay) {
            $scope.date.date = countDay;
        }
        $scope.prevDate.date = $scope.date.date == 1 ? countDay : $scope.date.date - 1;
        $scope.nextDate.date = $scope.date.date == countDay ? 1 : $scope.date.date + 1;
    };
    $scope.setYear = function(delta) {
        if(delta < 0 && $scope.date.year > $scope.startYear) {
            $scope.prevDate.year--;
            $scope.date.year--;
            $scope.nextDate.year--;
        }
        if(delta > 0 && $scope.date.year < $scope.endYear) {
            $scope.prevDate.year++;
            $scope.date.year++;
            $scope.nextDate.year++;
        }
        if($scope.date.month == 2) {
            var countDay = getLastDayOfMonth($scope.date.year, $scope.date.month - 1);
            if($scope.date.date > countDay) {
                $scope.date.date = countDay;
            }
            $scope.prevDate.date = $scope.date.date == 1 ? countDay : $scope.date.date - 1;
            $scope.nextDate.date = $scope.date.date == countDay ? 1 : $scope.date.date + 1;
        }
    };
    $scope.setDate = function(delta) {
        var countDay = getLastDayOfMonth($scope.date.year, $scope.date.month - 1);
        if(delta < 0) {
            $scope.nextDate.date = $scope.date.date;
            $scope.date.date = $scope.prevDate.date;
            $scope.prevDate.date = $scope.prevDate.date == 1 ? countDay : $scope.prevDate.date + delta ;
        }
        if(delta > 0) {
            $scope.prevDate.date = $scope.date.date;
            $scope.date.date = $scope.nextDate.date;
            $scope.nextDate.date = $scope.nextDate.date == countDay ? 1 : $scope.nextDate.date + delta;
        }
    };
    $scope.$watch('ngModel', function() {
        $scope.dt = new Date($scope.ngModel);
        $scope.prevDate = getMDY(-1);
        $scope.date = getMDY(0);
        $scope.nextDate = getMDY(1);
    });
    function getMDY(delta) {
        var countDay = getLastDayOfMonth($scope.dt.getFullYear(), $scope.dt.getMonth()),
            countPrevDay = getLastDayOfMonth($scope.dt.getFullYear(), $scope.dt.getMonth() - 1);
        var d = $scope.dt.getDate() + delta,
            m = $scope.dt.getMonth() + delta + 1,
            y = $scope.dt.getFullYear() + delta;
        if(d == 0) {
            d = countPrevDay;
        } else if (d > countDay) {
            d = 1;
        }
        if(m < 1) {
            m = 12;
        } else if(m == 13) {
            m = 1;
        }
        return { month: m, date: d, year: y };
    }
    function getLastDayOfMonth(year, month) {
        var date = new Date(year, month + 1, 0);
        return date.getDate();
    }
    this.init = function() {

    };
}])
.directive('cnsDpl', [function() {
   return {
       controller: 'DplCtrl',
       link: function(scope, element, attributes, controllers) {
           scope.startYear = angular.isDefined(attributes.startYear) ? Number(attributes.startYear) : 1900;
           scope.endYear = angular.isDefined(attributes.endYear) ? Number(attributes.endYear) : 2099;
           scope.viewMonth = angular.isDefined(attributes.viewMonth) ? attributes.viewMonth : null;
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
           var dplCtrl = controllers[0];
           if(!dplCtrl) {
               console.log('DplCtrl error');
           } else {
               dplCtrl.init();
           }
       },
       require: ['cnsDpl'],
       scope: {
           ngModel: '='
       },
       templateUrl: '../src/templates/directives/dpl.html'
    };
}]);

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
angular.module("../src/templates/directives/calendar.html", []).run(["$templateCache", function($templateCache) {
$templateCache.put("../src/templates/directives/calendar.html",
	"<div class=\"cns-calendar\">" +
	"    <div ng-if=\"view == 'days'\">" +
	"        <div class=\"cns-calendar-left\" ng-click=\"setMonth('prev')\" ng-bind-html=\"arrowLeft\"></div>" +
	"        <div class=\"cns-calendar-title\"><span ng-click=\"setView('months')\">{{titleDays}}</span></div>" +
	"        <div class=\"cns-calendar-right\" ng-click=\"setMonth('next')\" ng-bind-html=\"arrowRight\"></div>" +
	"        <div class=\"cns-calendar-short-day\" ng-repeat=\"shortDay in shortDays\">{{shortDay}}</div>" +
	"        <div class=\"cns-calendar-day\" ng-click=\"setDate(day)\" ng-repeat=\"day in days track by $index\"" +
	"                ng-class=\"{'cns-calendar-day-enabled': day[1] && !verifyDate(day[0]) && !verifyMarkDates(day[0])," +
	"                'cns-calendar-day-mark': day[1] && !verifyDate(day[0]) && verifyMarkDates(day[0])," +
	"                'cns-calendar-day-current': day[1] && verifyDate(day[0])," +
	"                'cns-calendar-day-disabled': !day[1]}\">{{day[0]}}</div>" +
	"    </div>" +
	"    <div ng-if=\"view == 'months'\">" +
	"        <div class=\"cns-calendar-left\" ng-click=\"setYear('prev')\" ng-bind-html=\"arrowLeft\"></div>" +
	"        <div class=\"cns-calendar-title\"><span ng-click=\"setView('years')\">{{titleMonths}}</span></div>" +
	"        <div class=\"cns-calendar-right\" ng-click=\"setYear('next')\" ng-bind-html=\"arrowRight\"></div>" +
	"        <div class=\"cns-calendar-close\" ng-click=\"close()\">x</div>" +
	"        <div class=\"cns-calendar-month\" ng-click=\"setMonth($index)\" ng-repeat=\"shortMonth in shortMonths\">{{shortMonth}}</div>" +
	"    </div>" +
	"    <div ng-if=\"view == 'years'\">" +
	"        <div class=\"cns-calendar-left\" ng-click=\"setDecade('prev')\" ng-bind-html=\"arrowLeft\"></div>" +
	"        <div class=\"cns-calendar-title\"><span ng-click=\"setView('decades')\">{{titleYears}}</span></div>" +
	"        <div class=\"cns-calendar-right\" ng-click=\"setDecade('next')\" ng-bind-html=\"arrowRight\"></div>" +
	"        <div class=\"cns-calendar-close\" ng-click=\"close()\">x</div>" +
	"        <div class=\"cns-calendar-month\" ng-click=\"setYear(year)\" ng-repeat=\"year in years\"" +
	"                ng-if=\"year >= startYear && year <= endYear\">{{year}}</div>" +
	"    </div>" +
	"    <div ng-if=\"view == 'decades'\">" +
	"        <div class=\"cns-calendar-left\" ng-click=\"setMillennium('prev')\" ng-bind-html=\"arrowLeft\"></div>" +
	"        <div class=\"cns-calendar-title\">{{titleDecades}}</div>" +
	"        <div class=\"cns-calendar-right\" ng-click=\"setMillennium('next')\" ng-bind-html=\"arrowRight\"></div>" +
	"        <div class=\"cns-calendar-close\" ng-click=\"close()\">x</div>" +
	"        <div class=\"cns-calendar-decade\" ng-click=\"setDecade(decade)\" ng-if=\"decade >= startYear - startYear % 10 && decade <= endYear - endYear % 10\"" +
	"             ng-repeat=\"decade in decades\">{{decade}}- {{decade + 9}}&nbsp;</div>" +
	"    </div>" +
	"</div>"
);
}]);

angular.module("../src/templates/directives/datepicker.html", []).run(["$templateCache", function($templateCache) {
$templateCache.put("../src/templates/directives/datepicker.html",
	"<input type=\"text\" class=\"cns-dp-input\" ng-model=\"ngModel\">" +
	"<div class=\"cns-dp\" id=\"cns-dp\">" +
	"    <div ng-if=\"view == 'days'\">" +
	"        <div class=\"cns-dp-left\" ng-click=\"setMonth('prev')\" ng-bind-html=\"arrowLeft\"></div>" +
	"        <div class=\"cns-dp-title\"><span ng-click=\"setView('months')\">{{titleDays}}</span></div>" +
	"        <div class=\"cns-dp-right\" ng-click=\"setMonth('next')\" ng-bind-html=\"arrowRight\"></div>" +
	"        <div class=\"cns-dp-close\" ng-click=\"close()\">x</div>" +
	"        <div class=\"cns-dp-short-day\" ng-repeat=\"shortDay in shortDays\">{{shortDay}}</div>" +
	"        <div class=\"cns-dp-day\" ng-click=\"setDate(day)\" ng-repeat=\"day in days track by $index\"" +
	"                ng-class=\"{'cns-dp-day-enabled': day[1] && !verifyDate(day[0])," +
	"                'cns-dp-day-current': day[1] && verifyDate(day[0])," +
	"                'cns-dp-day-disabled': !day[1]}\">{{day[0]}}</div>" +
	"    </div>" +
	"    <div ng-if=\"view == 'months'\">" +
	"        <div class=\"cns-dp-left\" ng-click=\"setYear('prev')\" ng-bind-html=\"arrowLeft\"></div>" +
	"        <div class=\"cns-dp-title\"><span ng-click=\"setView('years')\">{{titleMonths}}</span></div>" +
	"        <div class=\"cns-dp-right\" ng-click=\"setYear('next')\" ng-bind-html=\"arrowRight\"></div>" +
	"        <div class=\"cns-dp-close\" ng-click=\"close()\">x</div>" +
	"        <div class=\"cns-dp-month\" ng-click=\"setMonth($index)\" ng-repeat=\"shortMonth in shortMonths\">{{shortMonth}}</div>" +
	"    </div>" +
	"    <div ng-if=\"view == 'years'\">" +
	"        <div class=\"cns-dp-left\" ng-click=\"setDecade('prev')\" ng-bind-html=\"arrowLeft\"></div>" +
	"        <div class=\"cns-dp-title\"><span ng-click=\"setView('decades')\">{{titleYears}}</span></div>" +
	"        <div class=\"cns-dp-right\" ng-click=\"setDecade('next')\" ng-bind-html=\"arrowRight\"></div>" +
	"        <div class=\"cns-dp-close\" ng-click=\"close()\">x</div>" +
	"        <div class=\"cns-dp-month\" ng-click=\"setYear(year)\" ng-repeat=\"year in years\"" +
	"                ng-if=\"year >= startYear && year <= endYear\">{{year}}</div>" +
	"    </div>" +
	"    <div ng-if=\"view == 'decades'\">" +
	"        <div class=\"cns-dp-left\" ng-click=\"setMillennium('prev')\" ng-bind-html=\"arrowLeft\"></div>" +
	"        <div class=\"cns-dp-title\">{{titleDecades}}</div>" +
	"        <div class=\"cns-dp-right\" ng-click=\"setMillennium('next')\" ng-bind-html=\"arrowRight\"></div>" +
	"        <div class=\"cns-dp-close\" ng-click=\"close()\">x</div>" +
	"        <div class=\"cns-dp-decade\" ng-click=\"setDecade(decade)\" ng-if=\"decade >= startYear - startYear % 10 && decade <= endYear - endYear % 10\"" +
	"             ng-repeat=\"decade in decades\">{{decade}}- {{decade + 9}}&nbsp;</div>" +
	"    </div>" +
	"</div>"
);
}]);

angular.module("../src/templates/directives/dpl.html", []).run(["$templateCache", function($templateCache) {
$templateCache.put("../src/templates/directives/dpl.html",
	"<input type=\"text\" class=\"cns-dpl-input\" ng-model=\"ngModel\">" +
	"<div class=\"cns-dpl\">" +
	"    <div class=\"cns-dpl-title\"><span>Set date</span></div>" +
	"    <div class=\"cns-dpl-tbl\">" +
	"        <div class=\"cns-dpl-tr\">" +
	"            <div class=\"cns-dpl-td cns-dpl-arrow-height\" ng-bind-html=\"arrowTop\" ng-click=\"setMonth(-1)\"></div>" +
	"            <div class=\"cns-dpl-td cns-dpl-arrow-height\" ng-bind-html=\"arrowTop\" ng-click=\"setDate(-1)\"></div>" +
	"            <div class=\"cns-dpl-td cns-dpl-arrow-height\" ng-bind-html=\"arrowTop\" ng-click=\"setYear(-1)\" style=\"text-align: center\"></div>" +
	"        </div>" +
	"        <div class=\"cns-dpl-tr\">" +
	"            <div class=\"cns-dpl-td\"><span>{{monthView(prevDate.month)}}</span></div>" +
	"            <div class=\"cns-dpl-td\"><span>{{dateView(prevDate.date)}}</span></div>" +
	"            <div class=\"cns-dpl-td\"><span>{{prevDate.year}}</span></div>" +
	"        </div>" +
	"        <div class=\"cns-dpl-tr\">" +
	"            <div class=\"cns-dpl-td\" id=\"cns-dpl-month\"><span class=\"cns-dpl-border\">{{monthView(date.month)}}</span></div>" +
	"            <div class=\"cns-dpl-td\" id=\"cns-dpl-date\"><span class=\"cns-dpl-border\">{{dateView(date.date)}}</span></div>" +
	"            <div class=\"cns-dpl-td\" id=\"cns-dpl-year\"><span class=\"cns-dpl-border\">{{date.year}}</span></div>" +
	"        </div>" +
	"        <div class=\"cns-dpl-tr\">" +
	"            <div class=\"cns-dpl-td\"><span>{{monthView(nextDate.month)}}</span></div>" +
	"            <div class=\"cns-dpl-td\"><span>{{dateView(nextDate.date)}}</span></div>" +
	"            <div class=\"cns-dpl-td\"><span>{{nextDate.year}}</span></div>" +
	"        </div>" +
	"        <div class=\"cns-dpl-tr\">" +
	"            <div class=\"cns-dpl-td cns-dpl-arrow-height\" ng-bind-html=\"arrowBottom\" ng-click=\"setMonth(1)\"></div>" +
	"            <div class=\"cns-dpl-td cns-dpl-arrow-height\" ng-bind-html=\"arrowBottom\" ng-click=\"setDate(1)\"></div>" +
	"            <div class=\"cns-dpl-td cns-dpl-arrow-height\" ng-bind-html=\"arrowBottom\" ng-click=\"setYear(1)\" style=\"text-align: center\"></div>" +
	"        </div>" +
	"    </div>" +
	"    <div class=\"cns-dpl-cancel\" ng-click=\"cancel()\">Cancel</div>" +
	"    <div class=\"cns-dpl-set\" ng-click=\"setNewDate()\">Set</div>" +
	"</div>"
);
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
	"<div class=\"cns-pagination\">" +
	"    <div class=\"cns-pagination-pages\">" +
	"        <a ng-if=\"!revers\" ng-repeat=\"page in pages track by $index\" href=\"#\" ng-click=\"setCurPage($index + 1)\"" +
	"           ng-class=\"{'cns-pagination-current': $index + 1 == ngModel}\">{{$index + 1}}</a>" +
	"        <a ng-if=\"revers\" ng-repeat=\"page in pages track by $index\" href=\"#\" ng-click=\"setCurPage(totalPages - $index)\"" +
	"           ng-class=\"{'cns-pagination-current': totalPages - $index == ngModel}\">{{totalPages - $index}}</a>" +
	"    </div>" +
	"    <div class=\"cns-pagination-container\">" +
	"        <div class=\"cns-pagination-scroll\">" +
	"            <div class=\"cns-pagination-bar\"></div>" +
	"            <div class=\"cns-pagination-button\">" +
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
