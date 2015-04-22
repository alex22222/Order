'use strict';

var adminVehicleServices = angular.module('adminVehicleServices', ['ngResource']);
adminVehicleServices.factory('AdminVehicle', ['$resource',
    function($resource) {
        return {
            findAll: function(pagination, callback) {
                var res = $resource('/admin/vehicleEntity/list?pageNumber=:pageNumber&itemsPerPage=:itemsPerPage&search=:search', {}, {
                    query: {
                        method: 'GET',
                        params: pagination
                    }
                });
                return res.query(function(response) {
                    callback(response);
                });
            },
            updateVehicle: function(vehicle, callback) {
                var res = $resource('/admin/vehicle/update', {}, {
                    save: {
                        method: 'POST',
                        params: {},
                        isArray: true
                    }
                });
                res.save(vehicle, function(response) {
                    callback(response);
                });
            },
            queryVehicle: function(callback) {
                var res = $resource('/admin/vehicle/structure', {}, {
                    query: {
                        method: 'GET',
                        params: {},
                        isArray: true
                    }
                });
                return res.query(callback);
            },
            create: function(vehicle, callback) {
                var res = $resource('/admin/vehicleEntity/create', {}, {
                    save: {
                        method: 'POST',
                        params: {}
                    }
                });
                return res.save(vehicle, function(response) {
                    callback(response);
                });
            },
            queryVehicles: function(search, callback) {
                var res = $resource('/admin/vehicleEntity/list?search=:search', {}, {
                    query: {
                        method: 'GET',
                        params: search
                    }
                });
                return res.query(callback);
            },
            findById: function(comId, callback) {
                var res = $resource('/admin/vehicleEntity/edit?comId=:comId', {}, {
                    query: {
                        method: 'GET',
                        params: comId
                    }
                });
                return res.query(function(response) {
                    callback(response);
                });
            },
            update: function(component, callback) {
                var res = $resource('/admin/vehicleEntity/update', {}, {
                    save: {
                        method: 'POST',
                        params: {}
                    }
                });
                return res.save(component, function(response) {
                    callback(response);
                });
            },
            deleteById: function(vehicleId, callback) {
                var res = $resource('/admin/vehicleEntity/delete?vehicleId=:vehicleId', {}, {
                    query: {
                        method: 'GET',
                        params: vehicleId
                    }
                });
                return res.query(function(response) {
                    callback(response);
                });
            },
            removePicture: function(vehicleId, callback) {
                var res = $resource('/admin/vehicleEntity/deletePicture?vehicleId=:vehicleId', {}, {
                    query: {
                        method: 'GET',
                        params: vehicleId
                    }
                });
                return res.query(function(response) {
                    callback(response);
                });
            }
        }
    }
]);