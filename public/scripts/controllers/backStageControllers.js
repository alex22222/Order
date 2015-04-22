'use strict';

var backStageControllers = angular.module('backStageControllers', []);

backStageControllers.controller('userListController', ['$scope', 'UserService', '$location',
    function($scope, UserService, $location) {
        var search = '';
        var pagination = {
            pageNumber: 1,
            itemsPerPage: defaultItemsPerPage,
            search: search
        };

        UserService.findAll(pagination, function(result) {
            if (!result.success) {
                sessionStorage["message"] = result.message;
                $location.path('/public/error');
            } else {
                $scope.users = result.userList;
                $scope.totalItems = result.page.size;
                $scope.currentPage = result.page.currentPage;
                $scope.itemsPerPage = result.page.itemsPerPage;
            }
        });
        $scope.pageChanged = function() {
            var pagination = {
                pageNumber: $scope.currentPage,
                itemsPerPage: defaultItemsPerPage,
                search: search
            };
            UserService.findAll(pagination, function(result) {
                if (!result.success) {
                    sessionStorage["message"] = result.message;
                    $location.path('/public/error');
                } else {
                    $scope.users = result.userList;
                    $scope.totalItems = result.page.size;
                    $scope.currentPage = result.page.currentPage;
                    $scope.itemsPerPage = result.page.itemsPerPage;
                }
            });
        };

        $scope.edit = function(id) {
            $location.path('/admin/user/edit/' + id);
        };
        $scope.query = function() {
            if ($scope.search_name.length == 0) {
                pagination.search = '';
            } else {
                pagination.search = $scope.search_name;
            }
            UserService.findAll(pagination, function(result) {
                $scope.users = result.userList;
                $scope.totalItems = result.page.size;
                $scope.currentPage = result.page.currentPage;
                $scope.itemsPerPage = result.page.itemsPerPage;
            });
        };
        $scope.clear = function() {
            $scope.search_name = '';
        }
        $scope.enter = function(ev) {
            if (ev.keyCode == 13) {
                $scope.query();
            }
        }
        $scope.delete = function(id) {
            var vehicleId = {
                vehicleId: id
            };
            UserService.deleteById(vehicleId, function(message) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                promise.then(function() {
                    $scope.message = message.message + '__' + new Date().getTime();
                    $scope.success = message.success;
                    var anotherDeferred = $q.defer();
                    $timeout(function() {
                        anotherDeferred.resolve();
                    }, 1000);
                    return anotherDeferred.promise;
                }).then(function() {
                    $route.reload();
                });
                deferred.resolve();
            });
        };
    }
]);