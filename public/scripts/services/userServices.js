'use strict';

/* Services */
var userServices = angular.module('userServices', ['ngResource']);

userServices.factory('UserService', ['$resource', '$location',
    function($resource, $location) {
        return {
            login: function(username, password, callback) {
                var credential = {};
                credential["username"] = username;
                credential["password"] = password;
                var res = $resource('/user/login', {}, {
                    save: {
                        method: 'POST',
                        params: {}
                    }
                });
                res.save($.parseJSON(JSON.stringify(credential)), function(user) {
                    callback(user);
                });
            },
            registry: function(username, password, callback) {
                var credential = {};
                credential["username"] = username;
                credential["password"] = password;

                var res = $resource('/user/signup', {}, {
                    save: {
                        method: 'POST',
                        params: {}
                    }
                });
                res.save($.parseJSON(JSON.stringify(credential)), function(user) {
                    callback(user);
                });
            },
            logout: function(callback) {
                var res = $resource('/user/logout', {}, {
                    query: {
                        method: 'GET'
                    }
                });
                return res.query(function() {
                    callback();
                });
            },
            findById: function(userId, callback) {
                var res = $resource('/user/edit?userId=:userId', {}, {
                    query: {
                        method: 'GET',
                        params: userId
                    }
                });
                return res.query(function(user) {
                    callback(user);
                });
            },
            findAll: function(pagination, callback) {
                var res = $resource('/admin/user/list?pageNumber=:pageNumber&itemsPerPage=:itemsPerPage&search=:search', {}, {
                    query: {
                        method: 'GET',
                        params: pagination
                    }
                });
                return res.query(function(response) {
                    callback(response);
                });
            },
            suspendUser: function(userId, callback) {
                var res = $resource('/user/suspend?userId=:userId', {}, {
                    query: {
                        method: 'GET',
                        params: userId
                    }
                });
                return res.query(function(user) {
                    callback(user);
                });
            },
            deleteById: function(userId, callback) {
                var res = $resource('/admin/user/delete?userId=:userId', {}, {
                    query: {
                        method: 'GET',
                        params: userId
                    }
                });
                return res.query(function(response) {
                    callback(response);
                });
            },
            update: function(user, callback) {
                var res = $resource('/user/update', {}, {
                    save: {
                        method: 'POST',
                        params: {}
                    }
                });
                return res.save(user, function(response) {
                    callback(response);
                });
            },
            resetPass: function(user, callback) {
                var res = $resource('/user/resetPass', {}, {
                    save: {
                        method: 'POST',
                        params: {}
                    }
                });
                return res.save(user, function(response) {
                    callback(response);
                });
            }
        }
    }
]);
