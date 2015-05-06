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
        $scope.pageTitle = '用户信息';
        $scope.showPass = false;
        $scope.showAddr = false;
        var id = localStorage["userId"];
        var userId = {
            userId: id
        };
        UserService.findById(userId, function(user) {
            if (user.success == 'false') {
                sessionStorage["message"] = user.message;
                $location.path('/public/error');
            }
            $scope.user = user;
        });
        $scope.changePass = function() {
            $scope.showPass = !$scope.showPass;
        };
        $scope.showAddrForm = function() {
            $scope.newAddress = {};
            $scope.newAddress.country = '中国';
            $scope.newAddress.city = '上海市';
            $scope.newAddress.active = false;
            $scope.showAddr = !$scope.showAddr;
        };
        $scope.addAddr = function() {
            var addr = {};
            addr.country = $scope.newAddress.country;
            addr.city = $scope.newAddress.city;
            addr.line1 = $scope.newAddress.line1;
            addr.district = $scope.newAddress.district;
            addr.contact = $scope.newAddress.contact;
            addr.contactPhone = $scope.newAddress.contactPhone;
            addr.active = false;
            $scope.user.addresses.push(addr);
            $scope.newAddress = {};
            $scope.newAddress.country = '中国';
            $scope.newAddress.city = '上海市';
            $scope.showAddr = !$scope.showAddr;
        };
        $scope.back = function() {
            $location.path('/vehicle');
        };
        $scope.deleteAddr = function(ind) {
            $scope.user.addresses.splice(ind, 1);
        };
        $scope.update = function() {
            UserService.update($scope.user, function(message) {
                $scope.displayMessage(message);
                $location.reload();
            });
        };
        $scope.activeAddr = function(index) {
            angular.forEach($scope.user.addresses, function(address) {
                address.active = false;
            });
            $scope.user.addresses[index].active = true;
        };

    }
]);
