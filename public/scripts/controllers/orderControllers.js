'use strict';

var orderControllers = angular.module('orderControllers', []);

orderControllers.controller('orderListController', ['$scope', 'Order', '$location',
    function($scope, Order, $location) {
        Order.findAll($scope.currentPagination($scope.currentPage), function(result) {
            if (!result.success) {
                $scope.renderError(result.message);
            } else {
                $scope.loadListPage(result);
            }
        });
        $scope.pageChanged = function() {
            Order.findAll($scope.currentPagination($scope.currentPage), function(result) {
                if (!result.success) {
                    $scope.renderError(result.message);
                } else {
                    $scope.loadListPage(result);
                }
            });
        };
        $scope.updateStatus = function(status) {
            Order.updateStatus({
                status: status
            }, function(message) {
                $scope.displayMessage(message);
            });
        };
        $scope.abort = function() {
            if (confirm('确认作废?')) {
                Order.updateStatus({
                    status: 'cancel'
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
