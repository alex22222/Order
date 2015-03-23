'use strict';

/* Controllers */
var componentControllers = angular.module('componentControllers', ['angularFileUpload','ui.tree','ngResource']);

var defaultItemsPerPage = 5;
componentControllers.controller('componentListController', [ '$scope', 'Component', '$location', '$route', '$q', '$timeout',
 function($scope, Component, $location, $route, $q, $timeout) {
      var search = '';
      var pagination = {
        pageNumber:1,
        itemsPerPage:defaultItemsPerPage,
        search:search
      };
      
      Component.findAll(pagination, function(result) {
        $scope.components = result.componentList;
        $scope.totalItems = result.page.size;
        $scope.currentPage = result.page.currentPage;
        $scope.itemsPerPage = result.page.itemsPerPage;
      });
      $scope.pageChanged = function() {
        var pagination = {
          pageNumber:$scope.currentPage,
          itemsPerPage:defaultItemsPerPage,
          search:search
        };
        Component.findAll(pagination, function(result) {
          $scope.components = result.componentList;
          $scope.totalItems = result.page.size;
          $scope.currentPage = result.page.currentPage;
          $scope.itemsPerPage = result.page.itemsPerPage;
        });
      };
      $scope.add = function() {
        $location.path('/admin/component/add');
      };

      $scope.delete = function(id) {
        var comId = {comId: id};
        Component.deleteById(comId, function(message) {
          var deferred = $q.defer();
          var promise = deferred.promise;
          promise.then(function() {
            $scope.message = message.message + '__' + new Date().getTime();
            $scope.success = message.success;
            var anotherDeferred = $q.defer();
            $timeout(function() {
              anotherDeferred.resolve();
            }, 1000);
            return anotherDeferred.promise;
          }).then(function() {
            $route.reload();
          });
          deferred.resolve();
        });
      };
      $scope.edit = function(id) {
          $location.path('/admin/component/edit/' + id);
      };
      $scope.query = function() {
        if($scope.search_name.length == 0) {
          pagination.search = '';
        } else {
          pagination.search = $scope.search_name;
        }
        Component.findAll(pagination, function(result) {
          $scope.components = result.componentList;
          $scope.totalItems = result.page.size;
          $scope.currentPage = result.page.currentPage;
          $scope.itemsPerPage = result.page.itemsPerPage;
        });
      };
      $scope.clear = function () {
         $scope.search_name='';
      }
      $scope.enter = function (ev) {
         if (ev.keyCode == 13) {
          $scope.query();
        }
      }
}]);

componentControllers.controller('componentEditController', [ '$scope', 'Component', '$location', '$route', 'AdminVehicle', '$q', 
  '$timeout', 'FileUploader',
 function($scope, Component, $location, $route, AdminVehicle, $q, $timeout, FileUploader) {
      var id = $route.current.params['id'];
      var comId = {comId: id};
      Component.findById(comId, function(result) {
        var vehicles = AdminVehicle.queryVehicle(function(res) {
          $scope.component = result;
          $scope.tree1  = getVehiclesToBind(getLeafVehicle(vehicles), result.vehicles);
        });
        
      });
      $scope.back = function() {
        $location.path('/admin/component/list');
      };
      $scope.update = function() {
        Component.update($scope.component, function(message) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        promise.then(function() {
          $scope.message = message.message + '__' + new Date().getTime();
          $scope.success = message.success;
          var anotherDeferred = $q.defer();
          $timeout(function() {
            anotherDeferred.resolve();
          }, 1000);
          return anotherDeferred.promise;
        }).then(function() {
          $location.path('/admin/component/list');
        });
        deferred.resolve();       
        });
      };
      $scope.removePicture = function() {
        var comId = {comId: $scope.component._id};
        Component.removePicture(comId, function(message) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        promise.then(function() {
          $scope.message = message.message + '__' + new Date().getTime();
          $scope.success = message.success;
          var anotherDeferred = $q.defer();
          $timeout(function() {
            anotherDeferred.resolve();
          }, 1000);
          return anotherDeferred.promise;
        }).then(function() {
          $route.reload();
        });
        deferred.resolve();       
        });
      };
      var uploader = $scope.uploader = new FileUploader({
          url: 'admin/component/addPicture'
      });
      uploader.filters.push({
          name: 'imageFilter',
          fn: function(item /*{File|FileLikeObject}*/, options) {
              var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
              return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
          }
      });
      uploader.onBeforeUploadItem = function(item) {
        item.formData.push({
                comId: $scope.component._id
        });
      };
      uploader.onCompleteAll = function() {
          var deferred = $q.defer();
          var promise = deferred.promise;
          promise.then(function() {
            $scope.message = '图片新增成功' + '__' + new Date().getTime();
            $scope.success = true;
            var anotherDeferred = $q.defer();
            $timeout(function() {
              anotherDeferred.resolve();
            }, 1000);
            return anotherDeferred.promise;
          }).then(function() {
            $route.reload();
          });
          deferred.resolve();       
      };
     $scope.addAll = function() {
        var l = $scope.tree1.length;
        for(var i =0; i< l; i++) {
          $scope.component.vehicles.push($scope.tree1[i]);
        }
        $scope.tree1 = [];
      };

      $scope.removeAll = function() {
        var l = $scope.component.vehicles.length;
        for(var i =0; i< l; i++) {
          $scope.tree1.push($scope.component.vehicles[i]);
        }
        $scope.component.vehicles = [];
      };
}]);

componentControllers.controller('componentAddController', [ '$scope', '$location','Component', '$rootScope', 'AdminVehicle', 
  '$q', '$timeout', 'FileUploader', 
 function($scope, $location, Component, $rootScope, AdminVehicle, $q, $timeout, FileUploader) {

  $scope.component = {
    comName: '',comDescription:'',vehicles:[]
  };
  $scope.create = function() {
      if(!$scope.form.$valid) {
        $scope.message = '名称必填' + '__' + new Date().getTime();
        $scope.success = false;
        return;
      }
      if ($scope.uploader.queue.length >0) {
        $scope.uploader.uploadAll();
      } else {
          Component.create($scope.component, function(message) {
          var deferred = $q.defer();
          var promise = deferred.promise;
          promise.then(function() {
            $scope.message = message.message + '__' + new Date().getTime();
            $scope.success = message.success;
            var anotherDeferred = $q.defer();
            $timeout(function() {
              anotherDeferred.resolve();
            }, 1000);
            return anotherDeferred.promise;
          }).then(function() {
            $location.path('/admin/component/list');
          });
          deferred.resolve();       
        });
      }
      
  };

 var uploader = $scope.uploader = new FileUploader({
      url: 'admin/component/add'
 });
  uploader.filters.push({
      name: 'imageFilter',
      fn: function(item /*{File|FileLikeObject}*/, options) {
          var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
          return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
  });
  uploader.onBeforeUploadItem = function(item) {
    var v_string = '';
    for(var i =0 ; i<$scope.component.vehicles.length; i++) {
      v_string = v_string + $scope.component.vehicles[i]._id + '|' + $scope.component.vehicles[i].title + ',';
    }
    item.formData.push({
            comName: $scope.component.comName,
            comDescription: $scope.component.comDescription,
            vehicles: v_string
    });
  };
  uploader.onCompleteAll = function() {
          var deferred = $q.defer();
          var promise = deferred.promise;
          promise.then(function() {
            $scope.message = '新增成功' + '__' + new Date().getTime();
            $scope.success = true;
            var anotherDeferred = $q.defer();
            $timeout(function() {
              anotherDeferred.resolve();
            }, 1000);
            return anotherDeferred.promise;
          }).then(function() {
            $location.path('/admin/component/list');
          });
          deferred.resolve();       
  };
  $scope.back = function() {
    $location.path('/admin/component/list');
  };
  var vehicles = AdminVehicle.queryVehicle(function(res) {
    $scope.tree1  = getLeafVehicle(vehicles);
    // $scope.tree1 = vehicles;
  });
  
  
  $scope.component.vehicles = [];
  var getRootNodesScope = function() {
      return angular.element(document.getElementById("tree1-root")).scope();
    };
  $scope.addAll = function() {
    var l = $scope.tree1.length;
    for(var i =0; i< l; i++) {
      $scope.component.vehicles.push($scope.tree1[i]);
    }
    $scope.tree1 = [];
  };

  $scope.removeAll = function() {
    var l = $scope.component.vehicles.length;
    for(var i =0; i< l; i++) {
      $scope.tree1.push($scope.component.vehicles[i]);
    }
    $scope.component.vehicles = [];
  };
}]);

function getVehiclesToBind(all, has) {
  for(var i=0; i<has.length; i++) {
    var v = has[i];
    for(var j=0; j< all.length; j++) {
      var _v = all[j];
      if(_v._id == v._id) {
        all.splice(j,1);
      }
    }
  }
  return all;
}

function getLeafVehicle(parents) {
  var vs = new Array();
  for(var j =0; j<parents.length; j++) {
    getLeaf(parents[j], vs);
  }
  return vs;
}

function getLeaf(parent, array) {
  if(parent.nodes.length == 0) {
    array.push(parent);
  }
  for(var i = 0; i < parent.nodes.length; i ++) {
    getLeaf(parent.nodes[i], array);
  }
}