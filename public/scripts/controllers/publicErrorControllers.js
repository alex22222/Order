'use strict';

var publicErrorControllers = angular.module('publicErrorControllers', []);

publicErrorControllers.controller('errorController', ['$scope',
    function($scope) {
		$scope.message = sessionStorage["message"];
    }
]);