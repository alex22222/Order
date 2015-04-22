'use strict';

/* Controllers */
var shoppingControllers = angular.module('shoppingControllers', []);
 
shoppingControllers.controller('vehicleController', [ '$scope', 'Vehicle',
		function($scope, Vehicle) {
			var username = "";
			if(localStorage["username"] == null) {
				var random = Math.floor(Math.random() * ( 10000 + 1));
				username = '游客' + random;
			} else {
				username = localStorage["username"];
			}
			$scope.username = username;
			$scope.vehicles = Vehicle.query();
			
		} ]);

shoppingControllers.controller('storeController', [ '$scope', '$routeParams', 'DataService', 'Component','$location',
		function($scope, $routeParams, DataService, Component, $location) {
		    // get store and cart from service
		    $scope.store = DataService.store;
		    $scope.cart = DataService.cart;
		    $scope.store.products = Component.query(function(){
		    	DataService.store = $scope.store.products;
		    	if ($routeParams.productCode != null) {
		        	$scope.product = getProduct($routeParams.productCode, $scope.store.products);
		    	}
		    });
		    $scope.goToCommitPage = function () {
		    	$location.path('/commit');
		    };
		} ]);

function getProduct(code, products) {
	for (var i = 0; i < products.length; i++) {
        if (products[i].code == code)
            return products[i];
    }
    return null;
}

shoppingControllers.controller('commitController', [ '$scope', '$routeParams', 'DataService', 'Order','$resource','$location', '$rootScope',
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
				    var res = $resource('http://localhost:8080/ycdiy/rest/orders/create',{},{
				      save: {method:'POST', params:{}}
				    });
        			res.save($.parseJSON(JSON.stringify(data)),function(response) {
        				$rootScope.orderCode = response.orderCode;
        				DataService.cart.clearItems();
						$location.path('/feedback');
        			});
				};
			
		} ]);