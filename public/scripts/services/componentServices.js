'use strict';

var componentServices = angular.module('componentServices', ['ngResource']);
componentServices.factory('Component', ['$resource',
  function($resource){
    return {
       findAll: function(pagination,callback) {
          var res = $resource('/admin/component/list?pageNumber=:pageNumber&itemsPerPage=:itemsPerPage&search=:search', {}, {
              query: {method:'GET', params:pagination}
          });
          return res.query(function(response) {
            callback(response);
          });
       },
       deleteById: function(comId, callback) {
          var res = $resource('/admin/component/delete?comId=:comId', {}, {
              query: {method:'GET', params:comId}
          });
          return res.query(function(response) {
            callback(response);
          });
       },
       findById: function(comId, callback) {
          var res = $resource('/admin/component/edit?comId=:comId', {}, {
              query: {method:'GET', params:comId}
          });
          return res.query(function(response) {
            callback(response);
          });
       },
       update: function(component, callback) {
          var res = $resource('/admin/component/update', {}, {
              save: {method:'POST', params:{}}
          });
          return res.save(component, function(response) {
            callback(response);
          });
       },
       create: function(component, callback) {
          var res = $resource('/admin/component/create', {}, {
              save: {method:'POST', params:{}}
          });
          return res.save(component, function(response) {
            callback(response);
          });
       },
       removePicture: function(comId, callback) {
          var res = $resource('/admin/component/deletePicture?comId=:comId', {}, {
              query: {method:'GET', params:comId}
          });
          return res.query(function(response) {
            callback(response);
          });
       }
  }}]);