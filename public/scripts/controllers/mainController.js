'use strict';

var mainControllerControllers = angular.module('mainControllerControllers', []);

mainControllerControllers.controller('mainController', ['$scope', '$location',
    function($scope, $location) {
        $scope.$on('$routeChangeStart', function(scope, next, current) {
            if (!localStorage["username"] && $location.url() != '/vehicle') {
                sessionStorage["message"] = '没有权限访问！请先登入！';
                $location.path('/public/error');
            }
        });
    }
]);