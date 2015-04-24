'use strict';

/* Controllers */
var ycdiyDirectives = angular.module('ycdiyDirectives', []);

ycdiyDirectives.directive('message', function() {
    return {
        restrict: 'AEC',
        template: '<div class="alert alert-success" role="alert" ng-show="success">{{message.split("__")[0]}}</div>' + '<div class="alert alert-warning" role="alert" ng-show="!success">{{message.split("__")[0]}}</div>',
        link: function($scope, element, attrs) {
            $(element).hide();
            $scope.$watch(function() {
                return $scope.message;
            }, function(value) {
                if (value) {
                    var duration = attrs.fadeDuration || 500;
                    $(element).fadeIn(500);
                    $(element).fadeOut(duration);
                }
            });
        }
    };
});

ycdiyDirectives.directive('tabs', function() {
    return {
        restrict: 'E',
        template: '<ul class="nav nav-tabs"><li role="presentation" class="{{activetab1}}"><a ng-click="showSection(\'detail\')">基本信息</a></li><li role="presentation" class="{{activetab2}}"><a ng-click="showSection(\'subVec\')">车型</a></li><li role="presentation" class="{{activetab3}}"><a ng-click="showSection(\'pic\')">上传图片</a></li></ul>',
        link: function($scope, element, attrs) {
            $scope.showSection = function(obj) {
                if ("detail" == obj) {
                    $scope.showDetail = true;
                    $scope.showSubVec = false;
                    $scope.showPic = false;
                    $scope.activetab1 = 'active';
                    $scope.activetab2 = '';
                    $scope.activetab3 = '';
                } else if ("subVec" == obj) {
                    $scope.showDetail = false;
                    $scope.showSubVec = true;
                    $scope.showPic = false;
                    $scope.activetab1 = '';
                    $scope.activetab2 = 'active';
                    $scope.activetab3 = '';
                } else if ("pic" == obj) {
                    $scope.showDetail = false;
                    $scope.showSubVec = false;
                    $scope.showPic = true;
                    $scope.activetab1 = '';
                    $scope.activetab2 = '';
                    $scope.activetab3 = 'active';
                }
            }
            $scope.showDetail = true;
            $scope.showSubVec = false;
            $scope.showPic = false;
            $scope.activetab1 = 'active';
            $scope.activetab2 = '';
            $scope.activetab3 = '';
        }
    };
});

ycdiyDirectives.directive('navigation', function() {
    return {
        restrict: 'E',
        template: '<div id="navbar" class="navbar-collapse collapse"><ul class="nav navbar-nav"><li class="{{activena1}}"><a href="#/admin/component/list"  ng-click="activeTab(\'tab1\')">零件管理</a></li><li  class="{{activena2}}"><a href="#/admin/vehicleEntity/list"  ng-click="activeTab(\'tab2\')">车型管理</a></li><li  class="{{activena3}}"><a href="#/admin/vehicleEntity/list"  ng-click="activeTab(\'tab3\')">订单管理</a></li><li  class="{{activena4}}"><a href="#/admin/user/list"  ng-click="activeTab(\'tab4\')">系统管理</a></li></ul><ul class="nav navbar-nav navbar-right"><li><a href="#/admin/task">分店管理</a></li><li><a href="../navbar-fixed-top/">站内通信</a></li></ul></div>',
        link: function($scope, element, attrs) {
            $scope.activeTab = function(obj) {
                if ("tab1" == obj) {
                    $scope.activena1 = 'active';
                    $scope.activena2 = '';
                    $scope.activena3 = '';
					$scope.activena4 = '';
                } else if ("tab2" == obj) {
                    $scope.activena1 = '';
                    $scope.activena2 = 'active';
                    $scope.activena3 = '';
					$scope.activena4 = '';
                } else if ("tab3" == obj) {
                    $scope.activena1 = '';
                    $scope.activena2 = '';
                    $scope.activena3 = 'active';
					$scope.activena4 = '';
                } else if ("tab4" == obj) {
                    $scope.activena1 = '';
                    $scope.activena2 = '';
                    $scope.activena3 = '';
					$scope.activena4 = 'active';
                }
            }
            $scope.activena1 = 'active';
            $scope.activena2 = '';
            $scope.activena3 = '';
			$scope.activena4 = '';
        }
    };
});
