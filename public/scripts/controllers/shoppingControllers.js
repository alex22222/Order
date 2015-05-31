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

shoppingControllers.controller('commitController', ['$scope', '$routeParams', 'DataService', '$resource', '$location', 'UserService', 'Order',
    function($scope, $routeParams, DataService, $resource, $location, UserService, Order) {
        $scope.cart = {};
        var id = localStorage["userId"];
        var userId = {
            userId: id
        };
        UserService.findById(userId, function(user) {
            $scope.user = user;
        });
        $scope.newAddress = false;
        $scope.activeAddr = function(index) {
            angular.forEach($scope.user.addresses, function(address) {
                address.active = false;
            });
            $scope.user.addresses[index].active = true;
            $scope.newAddressActive = false;
            $scope.newAddress = false;
        };
        $scope.activeNewAddr = function(index) {
            $scope.newAddress = true;
            angular.forEach($scope.user.addresses, function(address) {
                address.active = false;
            });
            $scope.newAddressActive = true;
        };
        $scope.addTodo = function() {
            var order = {};
            order["totalPrice"] = DataService.cart.getTotalPrice();
            order["deliveryDate"] = $scope.cart.datetime;
            order["comments"] = $scope.cart.comment;
            order["user"] = localStorage["userId"];
            for (var i = 0; i < DataService.cart.items.length; i++) {
                var item = DataService.cart.items[i];
                var ctr = i + 1;
                order["item_id_" + ctr] = item.id;
                order["item_price_" + ctr] = item.price.toFixed(2);
                order["item_quantity_" + ctr] = item.quantity;
                order["count"] = ctr;
            }
            Order.create($.parseJSON(JSON.stringify(order)), function(result) {
                DataService.cart.clearItems();
                $location.path('/confirm/' + result.code);
            });
        };

    }
]);

shoppingControllers.controller('orderController', ['$scope', '$routeParams', 'DataService', '$resource', '$location', 'UserService', 'Order',
    function($scope, $routeParams, DataService, $resource, $location, UserService, Order) {
        Order.findMyOrder($scope.currentPagination($scope.currentPage), function(result) {
            if (!result.success) {
                $scope.renderError(result.message);
            } else {
                $scope.loadListPage(result);
            }
        });
        $scope.pageChanged = function() {
            Order.findMyOrder($scope.currentPagination($scope.currentPage), function(result) {
                if (!result.success) {
                    $scope.renderError(result.message);
                } else {
                    $scope.loadListPage(result);
                }
            });
        };

        $scope.delete = function(id) {
            if (confirm('确认删除?')) {
//                Order.deleteById({
//                    orderId: id
//                }, function(message) {
//                    $scope.displayMessage(message);
//                });
            }
        };

        $scope.searchObj = {
            searchName: ''
        };
    }
]);

shoppingControllers.controller('feedbackController', ['$scope', '$routeParams',
    function($scope, $routeParams) {
		$scope.orderCode = $routeParams["orderCode"];
    }
]);
