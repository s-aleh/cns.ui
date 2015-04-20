'use strict';

angular.module('App', ['cns.ui']);

angular.module('App')
.controller('MainCtrl', ['$scope', function($scope) {
        $scope.currentPage = 1;
        $scope.totalPages = 23;
        $scope.date = "01-29-2013";
        $scope.date = "01/31/2016";
        $scope.dates = ["12/28/2013", "12/03/2013", "11/02/2013"];
        $scope.dx = 0;
        $scope.dy = 0;
    }]);