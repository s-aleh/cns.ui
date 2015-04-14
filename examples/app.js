'use strict';

angular.module('App', ['cns.ui']);

angular.module('App')
.controller('MainCtrl', ['$scope', function($scope) {
        $scope.currentPage = 1;
        $scope.totalPages = 23;
        $scope.date = "01-29-2013";
        $scope.date = "12/27/2013";
    }]);