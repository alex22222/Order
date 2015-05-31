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
					localStorage["isAdmin"] = user.isAdmin;
                    $scope.username = localStorage["username"];
                    $scope.user.isIn = localStorage["isIn"];
					$scope.user.isAdmin = user.isAdmin;
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
        $scope.resetPass = function() {
            if ($scope.user.password_new != $scope.user.password_confirm) {
                $scope.displayMessage({
                    message: '新密码必须和确认密码一致！',
                    success: false
                });
            }
			if (!$scope.user.password_new) {
                $scope.displayMessage({
                    message: '新密码必填！',
                    success: false
                });
            }
			if (!$scope.user.password_confirm) {
                $scope.displayMessage({
                    message: '确认密码必填！',
                    success: false
                });
            }
			if (!$scope.user.password_old) {
                $scope.displayMessage({
                    message: '原密码必填！',
                    success: false
                });
            }
			UserService.resetPass($scope.user, function(message) {
				$scope.displayMessage(message);
			});
        };
    }
]);
