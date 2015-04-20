'use strict';

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