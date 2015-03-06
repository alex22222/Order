'use strict';

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