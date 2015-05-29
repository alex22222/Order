'use strict';

/* Controllers */
var shoppingControllers = angular.module('shoppingControllers', []);

shoppingControllers.controller('landingController', ['$scope', 'AdminVehicle',
    function($scope, AdminVehicle) {
        $scope.search = {};
        $scope.query = function() {
            if ($scope.search.level1 && $scope.search.level2) {
                var parent = {
                    parent: $scope.search.level2_id
                };
                AdminVehicle.findByParent(parent, function(result) {
                    if (!result.success) {
                        $scope.renderError(result.message);
                    } else {
                        $scope.items = result.objectList;
                        $scope.totalItems = 1;
                        $scope.currentPage = 1;
                        $scope.itemsPerPage = 100;
                    }
                });
            } else {
                AdminVehicle.findAll($scope.currentPagination($scope.currentPage, $scope.search.search_name), function(result) {
                    $scope.items = result.objectList;
                    $scope.totalItems = result.page.size;
                    $scope.currentPage = result.page.currentPage;
                    $scope.itemsPerPage = result.page.itemsPerPage;
                });
            }
        };
        $scope.queryLevel1 = function() {
            var level = {
                level: '一级'
            };
            AdminVehicle.findByLevel(level, function(result) {
                if (!result.success) {
                    $scope.renderError(result.message);
                } else {
                    $scope.items_l1 = result.objectList;
                }
            });
        };
        $scope.setLevel1 = function(obj) {
            $scope.search.level1 = obj.title;
            $scope.search.level1_id = obj._id;
            var parent = {
                parent: obj._id
            };
            AdminVehicle.findByParent(parent, function(result) {
                if (!result.success) {
                    $scope.renderError(result.message);
                } else {
                    $scope.items_l2 = result.objectList;
                }
            });
        };
        $scope.setLevel2 = function(obj) {
            $scope.search.level2 = obj.title;
            $scope.search.level2_id = obj._id;
        };
        $scope.clear = function() {
            $scope.search = {};
        };
    }
]);

shoppingControllers.controller('storeController', ['$scope', '$routeParams', 'DataService', 'AdminVehicle', '$location',
    function($scope, $routeParams, DataService, AdminVehicle, $location) {
        $scope.vehicleId = $routeParams.vid;
		var store = {

		};
		store.products = [];
        $scope.store = store;
        $scope.cart = DataService.cart;

        var id = {
            id: $scope.vehicleId
        };

        AdminVehicle.findComponents(id, function(result) {
            $scope.store.products = result.objectList;
            DataService.store = $scope.store.products;
            if ($routeParams.productCode != null) {
                $scope.product = getProduct($routeParams.productCode, $scope.store.products);
            }
        });
        $scope.return = function() {
            $location.path('/store/' + $scope.vehicleId);
        };

        $scope.goToCommitPage = function() {
            $location.path('/commit');
        };

    }
]);

function getProduct(code, products) {
    for (var i = 0; i < products.length; i++) {
        if (products[i]._id == code)
            return products[i];
    }
    return null;
}

shoppingControllers.controller('commitController', ['$scope', '$routeParams', 'DataService', 'Order', '$resource', '$location', '$rootScope',
    function($scope, $routeParams, DataService, Order, $resource, $location, $rootScope) {
        $scope.addTodo = function() {
            var data = {};
            data["totalPrice"] = DataService.cart.getTotalPrice();
            data["deliveryAddress"] = $scope.cart.address;
            data["deliveryContact"] = $scope.cart.contact;
            data["deliveryDatetime"] = $scope.cart.datetime;
            data["deliveryMobile"] = $scope.cart.mobile;
            data["deliveryComment"] = $scope.cart.comment;
            for (var i = 0; i < DataService.cart.items.length; i++) {
                var item = DataService.cart.items[i];
                var ctr = i + 1;
                data["item_id_" + ctr] = item.id;
                data["item_price_" + ctr] = item.price.toFixed(2);
                data["item_quantity_" + ctr] = item.quantity;
                data["count"] = ctr;
            }
            var res = $resource('http://localhost:8080/ycdiy/rest/orders/create', {}, {
                save: {
                    method: 'POST',
                    params: {}
                }
            });
            res.save($.parseJSON(JSON.stringify(data)), function(response) {
                $rootScope.orderCode = response.orderCode;
                DataService.cart.clearItems();
                $location.path('/feedback');
            });
        };

    }
]);
