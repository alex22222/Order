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