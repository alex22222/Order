'use strict';

var backStageControllers = angular.module('backStageControllers', []);

backStageControllers.controller('userListController', ['$scope', 'UserService', '$location',
    function($scope, UserService, $location) {
        UserService.findAll($scope.currentPagination($scope.currentPage), function(result) {
            if (!result.success) {
                $scope.renderError(result.message);
            } else {
                $scope.loadListPage(result);
            }
        });
        $scope.pageChanged = function() {
            UserService.findAll($scope.currentPagination($scope.currentPage), function(result) {
                if (!result.success) {
                    $scope.renderError(result.message);
                } else {
                    $scope.loadListPage(result);
                }
            });
        };
        $scope.suspend = function(id) {
            UserService.suspendUser({
                userId: id
            }, function(message) {
                $scope.displayMessage(message);
            });
        };
        $scope.query = function() {
            if ($scope.search_name.length == 0) {
                $scope.pagination.search = '';
            } else {
                $scope.pagination.search = $scope.search_name;
            }
            UserService.findAll($scope.currentPagination($scope.currentPage), function(result) {
                $scope.loadListPage(result);
            });
        };

        $scope.delete = function(id) {
            if (confirm('确认删除?')) {
                UserService.deleteById({
                    userId: id
                }, function(message) {
                    $scope.displayMessage(message);
                });
            }
        };

        $scope.searchObj = {
            searchName: ''
        };
    }
]);

backStageControllers.controller('userEditController', ['$scope', 'UserService', '$location', '$route',
    function($scope, UserService, $location, $route) {
        var id = $route.current.params['id'];
        var userId = {
            userId: id
        };
        UserService.findById(userId, function(result) {
            $scope.user = result;
        });

        $scope.update = function() {
            UserService.update($scope.user, function(message) {
                $scope.displayMessage(message);
            });
        };

    }
]);
