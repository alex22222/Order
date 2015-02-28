'use strict';

/* Services */
var userServices = angular.module('userServices', ['ngResource']);

userServices.factory('UserService', ['$resource','$location',
  function($resource, $location){
      return {
               login: function(username, password, redirect, callback) {
                  var credential = {};
                  credential["username"] = username;
                  credential["password"] = password;
                  
                  var res = $resource('/user/login',{},{
                    save: {method:'POST', params:{}}
                  });
                  res.save($.parseJSON(JSON.stringify(credential)),function(user) {
                      if(user.err == null) {
                        localStorage["username"] = user.username;
                        if(user.isAdmin){
                          $location.path('/admin/landing');
                        } else {
                          $location.path('/vehicle');
                        }
                        callback(user);
                      } else {
                        callback(user);
                      }
                      
                  });
               },
               registry: function(username, password, redirect, callback) {
                 var credential = {};
                  credential["username"] = username;
                  credential["password"] = password;
                  
                  var res = $resource('/user/registry',{},{
                    save: {method:'POST', params:{}}
                  });
                  res.save($.parseJSON(JSON.stringify(credential)),function(user) {
                      alert(response.err);
                      localStorage["username"] = user.username;
                      $location.path('/vehicle');
                    });
               },
               logout: function(redirectPath, callback) {
                  localStorage["username"] = undefined;
                  $location.path(redirectPath);
                  callback();
               }
            }
  }]);

var pictureServices = angular.module('pictureServices', ['ngResource']);
pictureServices.factory('Picture', ['$resource',
  function($resource){
    return {
       queryComponents: function(pagination,callback) {
          var res = $resource('/admin/pic/list?pageNumber=:pageNumber&itemsPerPage=:itemsPerPage&search=:search', {}, {
              query: {method:'GET', params:pagination}
          });
          return res.query(function(response) {
            callback(response);
          });
       },
       deleteComponent: function(comId, callback) {
          var res = $resource('/admin/pic/delete?comId=:comId', {}, {
              query: {method:'GET', params:comId}
          });
          return res.query(function(response) {
            callback(response);
          });
       },
       queryComponent: function(comId, callback) {
          var res = $resource('/admin/pic/edit?comId=:comId', {}, {
              query: {method:'GET', params:comId}
          });
          return res.query(function(response) {
            callback(response);
          });
       },
       updateComponent: function(component, callback) {
          var res = $resource('/admin/pic/update', {}, {
              save: {method:'POST', params:{}}
          });
          return res.save(component, function(response) {
            callback(response);
          });
       }
    }
  }]);

var adminVehicleServices = angular.module('adminVehicleServices', ['ngResource']);
adminVehicleServices.factory('AdminVehicle', ['$resource',
  function($resource){
    return {
      updateVehicle: function(vehicle, callback) {
          var res = $resource('/admin/vehicle/update',{},{
            save: {method:'POST', params:{}, isArray:true}
          });
          res.save(vehicle, function(response) {
            callback(response);
          });
       },
       queryVehicle: function (callback) {
         var res =  $resource('/admin/vehicle/list', {}, {
            query: {method:'GET', params:{}, isArray:true}
          });
          return res.query(callback);
       }
    }
  }]);

var vehicleServices = angular.module('vehicleServices', ['ngResource']);

vehicleServices.factory('Vehicle', ['$resource',
  function($resource){
      var obj =
     $resource('http://localhost:8080/ycdiy/rest/vehicles/list', {}, {
      query: {method:'GET', params:{}, isArray:true}
    });
      return obj;
  }]);

var componentServices = angular.module('componentServices', ['ngResource']);

componentServices.factory('Component', ['$resource',
  function($resource){
    return $resource('http://localhost:8080/ycdiy/rest/components/list', {}, {
      query: {method:'GET', params:{}, isArray:true}
    });
  }]);

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


