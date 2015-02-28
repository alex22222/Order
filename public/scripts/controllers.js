'use strict';

/* Controllers */
var shoppingControllers = angular.module('shoppingControllers', []);

shoppingControllers.directive('darthFader', function() {
  return {
    restrict: 'AEC',

    link: function($scope, element, attrs) {
      
      $(element).fadeOut("slow");
      // $scope.$watch($scope.fadedIn, function(value) {
      	
      //   if (value) {
      //   	$(element).fadeIn(duration);
      //   }
      //   else {
      //   	$(element).fadeOut(duration);
      //   }
      // });
     }
   };
});

shoppingControllers.controller('loginController', [ '$scope', 'UserService', '$location', '$rootScope',
		function($scope, UserService, $location, $rootScope) {
			$rootScope.fadedIn = false;
			$scope.login = function() {
				var username = $scope.username;
				var password = $scope.password;
				UserService.login(username, password, '/admin/landing', function(user) {
					if(user.err != null) {
						$rootScope.err = user.err;
						// $rootScope.showerr=true;
						$rootScope.fadedIn = true;
						// $location.path('/vehicle');
					} else {
						setLoginStatus($scope);
						$rootScope.loginName = username;
					}
				});
			};
			$scope.logout = function() {
				localStorage.clear();
				$scope.in=false;
				$scope.username = '';
				$scope.password = '';
				$location.path('/vehicle');
			};
			setLoginStatus($scope, $rootScope);
			$scope.enter = function (ev) {
				 if (ev.keyCode == 13) {
				 	$scope.login();
				}
			}
		} ]);

function setLoginStatus($scope, $rootScope) {

	if(localStorage["username"] == undefined) {
		$scope.in=false;
		$rootScope.loginName = '您';
	} else {
		$scope.in=true;
	}
}

shoppingControllers.controller('registryController', [ '$scope', 'UserService',
		function($scope, UserService) {
			$scope.registry = function() {
				var username = $scope.username;
				var password = $scope.password;
				var password_confirm = $scope.password_confirm;
				if(password != password_confirm) {
					alert('密码不一致!');
				} else {
					UserService.registry(username, password);
				}
			};
		} ]);

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