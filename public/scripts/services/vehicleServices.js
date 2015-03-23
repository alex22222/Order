'use strict';

var adminVehicleServices = angular.module('adminVehicleServices', ['ngResource']);
adminVehicleServices.factory('AdminVehicle', ['$resource',
  function($resource){
    return {
      findAll: function(pagination,callback) {
          var res = $resource('/admin/vehicle/list?pageNumber=:pageNumber&itemsPerPage=:itemsPerPage&search=:search', {}, {
              query: {method:'GET', params:pagination}
          });
          return res.query(function(response) {
            callback(response);
          });
       },
      updateVehicle: function(vehicle, callback) {
          var res = $resource('/admin/vehicle/update',{},{
            save: {method:'POST', params:{}, isArray:true}
          });
          res.save(vehicle, function(response) {
            callback(response);
          });
       },
       queryVehicle: function (callback) {
         var res =  $resource('/admin/vehicle/structure', {}, {
            query: {method:'GET', params:{}, isArray:true}
          });
          return res.query(callback);
       }
    }
  }]);