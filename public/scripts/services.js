'use strict';

/* Services */

var vehicleServices = angular.module('vehicleServices', ['ngResource']);

vehicleServices.factory('Vehicle', ['$resource',
  function($resource){
      var obj =
     $resource('http://localhost:8080/ycdiy/rest/vehicles/list', {}, {
      query: {method:'GET', params:{}, isArray:true}
    });
      return obj;
  }]);

// var componentServices = angular.module('componentServices', ['ngResource']);

// componentServices.factory('Component', ['$resource',
//   function($resource){
//     return $resource('http://localhost:8080/ycdiy/rest/components/list', {}, {
//       query: {method:'GET', params:{}, isArray:true}
//     });
//   }]);

var orderServices = angular.module('orderServices', ['ngResource']);
orderServices.factory('Order', ['$resource',
  function($resource){
    var self=this;
      self.add=function(order){
        var res = $resource('http://localhost:8080/ycdiy/rest/orders/create',{});
        res.save(item);
      };
  }]);

ycdiyStoreApp.factory("DataService", function () {
    var myStore = new store();
    var myCart = new shoppingCart("ycdiyStore");
    //myCart.addCheckoutParameters("PayPal", "paypaluser@youremail.com");
    return {
        store: myStore,
        cart: myCart
    };
});


