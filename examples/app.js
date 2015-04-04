'use strict';

angular.module('App', ['cns.ui']);

angular.module('App')
.controller('MainCtrl', ['$scope', function($scope) {
        $scope.currentPage = 1;
        $scope.totalPages = 23;
    }]);