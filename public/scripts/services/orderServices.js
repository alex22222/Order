'use strict';

/* Services */
var orderServices = angular.module('orderServices', ['ngResource']);

orderServices.factory('Order', ['$resource', '$location',
    function($resource, $location) {
        return {
            create: function(order, callback) {
                var res = $resource('/order/create', {}, {
                    save: {
                        method: 'POST',
                        params: {}
                    }
                });
                res.save(order, function(order) {
                    callback(order);
                });
			},
            findMyOrder: function(pagination, callback) {
                var res = $resource('/order/myList?pageNumber=:pageNumber&itemsPerPage=:itemsPerPage&search=:search', {}, {
                    query: {
                        method: 'GET',
                        params: pagination
                    }
                });
                return res.query(function(response) {
                    callback(response);
                });
            },
			findAll: function(pagination, callback) {
                var res = $resource('/order/list?pageNumber=:pageNumber&itemsPerPage=:itemsPerPage&search=:search', {}, {
                    query: {
                        method: 'GET',
                        params: pagination
                    }
                });
                return res.query(function(response) {
                    callback(response);
                });
            },
            deleteById: function(orderId, callback) {
                var res = $resource('/order/delete?orderId=:orderId', {}, {
                    query: {
                        method: 'GET',
                        params: orderId
                    }
                });
                return res.query(function(response) {
                    callback(response);
                });
            },
            updateStatus: function(orderId, status, callback) {
                var res = $resource('/admin/order/updateStatus?orderId=:orderId', {}, {
                    query: {
                        method: 'GET',
                        params: orderId
                    }
                });
                return res.query(function(user) {
                    callback(user);
                });
            }
        }
    }
]);
