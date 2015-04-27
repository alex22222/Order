'use strict';

var authControllers = angular.module('authControllers', []);

authControllers.controller('signupController', ['$scope', 'UserService', '$location',
    function($scope, UserService, $location) {
        $scope.user = {
            isIn: false,
            username: ''
        };
        $scope.signup = function() {
            var username = $scope.user.username;
            var password = $scope.user.password;
            var password_confirm = $scope.user.password_confirm;
            if (password != password_confirm) {
                alert('密码不一致!');
            } else {
                UserService.registry(username, password, function(user) {
                    localStorage.clear();
                    localStorage["username"] = user.username;
                    localStorage["isIn"] = true;
                    localStorage["userId"] = user._id;
                    $scope.username = localStorage["username"];
                    $scope.user.isIn = localStorage["isIn"];
                    $location.path('/vehicle');
                    alert("注册成功");
                });
            }
        };
        $scope.logon = function() {
            var username = $scope.user.username;
            var password = $scope.user.password;
            UserService.login(username, password, function(user) {
                if (user.err) {
                    $scope.renderError(user.err);
                    $scope.cleanUserData();
                }
                if (user) {
                    $scope.user.isIn = true;
                    localStorage["username"] = user.username;
                    localStorage["isIn"] = true;
                    localStorage["userId"] = user._id;
                    $scope.username = localStorage["username"];
                    $scope.user.isIn = localStorage["isIn"];
                    if (user.isAdmin) {
                        $location.path('/admin/component/list');
                    } else {
                        $location.path('/vehicle');
                    }
                } else {
                    $scope.renderError('登入失败！');
                    $scope.cleanUserData();
                }
            });
        };
        $scope.logout = function() {
            $scope.cleanUserData($scope.user);
            UserService.logout(function() {
                $location.path('/vehicle');
            });
        };
		$scope.enter = function(ev) {
            if (ev.keyCode == 13) {
                $scope.logon();
            }
        }
        $scope.username = localStorage["username"];
        $scope.user.isIn = localStorage["isIn"];
    }
]);

authControllers.controller('userDetailController', ['$scope', 'UserService', '$location',
    function($scope, UserService, $location) {
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
            $scope.address = {};
            $scope.address.country = '中国';
            $scope.address.city = '上海';
            $scope.showAddr = !$scope.showAddr;
        };
        $scope.setDistrict = function(district) {
            $scope.address.district = district;
        };
        $scope.addAddr = function(address) {
            $scope.user.addresses.push(address);
        };
        $scope.back = function() {
            $location.path('/vehicle');
        };
    }
]);
