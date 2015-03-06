'use strict';

/* Controllers */
var componentControllers = angular.module('componentControllers', ['angularFileUpload','ui.tree','ngResource']);


componentControllers.controller('componentListController', [ '$scope', 'Component', '$location', '$route', '$q', '$timeout',
 function($scope, Component, $location, $route, $q, $timeout) {
      var search = '';
      var pagination = {
        pageNumber:1,
        itemsPerPage:2,
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
          itemsPerPage:2,
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
            $scope.message = message;
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
}]);

componentControllers.controller('componentEditController', [ '$scope', 'Component', '$location', '$route', '$upload', 'AdminVehicle',
 function($scope, Component, $location, $route, $upload, AdminVehicle) {
      var id = $route.current.params['id'];
      var comId = {comId: id};
      Component.findById(comId, function(result) {
        $scope.component = result;
      });
      $scope.back = function() {
        $location.path('/admin/component/list');
      };
      $scope.update = function() {
        Component.update($scope.component, function() {
          $location.path('/admin/component/list');
        });
      };
      $scope.onFileSelect = function($files) {
        var v = $scope.component._id;
        for (var i = 0; i < $files.length; i++) {
          var $file = $files[i];
          $upload.upload({
            url: 'admin/component/update',
            data: {_id: $scope.component._id, comName: $scope.component.comName, comDescription: $scope.component.comDescription},
            file: $file,
            progress: function(e){}
          }).then(function(data, status, headers, config) {
            $scope.uploadInfo='上传成功！';
            // $location.path('/admin/component/list');
          }); 
        }
      };
      $scope.tree1 = AdminVehicle.queryVehicle();
}]);

componentControllers.controller('componentAddController', [ '$scope', '$upload', '$location','Component', '$rootScope', 'AdminVehicle',
 function($scope, $upload, $location, Component, $rootScope, AdminVehicle) {



  $scope.component = {
    comName: '',comDescription:'',vehicles:[]
  };
  $scope.create = function() {
      if(!$scope.form.$valid) {
        $scope.message = '名称必填' + '__' + new Date().getTime();
        return;
      }
      Component.create($scope.component, function() {
        $location.path('/admin/component/list');
      });
  };


 $scope.setFile = function(element) {
  $scope.$apply(function($scope) {
      var fileObject = element.files[0];
      $scope.file.fileType = fileObject.type.toUpperCase().substring(fileObject.type.indexOf("/") + 1);
 
      // Validation
      // if (!$scope.isValidFileType($scope.file.fileType)) {
      //   $scope.myForm.file.$setValidity("size", false);
      // }
 
      // if (fileObject.size > 10000000) {
      //   $scope.myForm.file.$setValidity("size", false);
      // }
    });
 }

	$scope.onFileSelect = function(element, $files) {
     


    for (var i = 0; i < $files.length; i++) {
      var $file = $files[i];
      $upload.upload({
        url: 'admin/component/add',
        data: {comName: $scope.component.comName, comDescription: $scope.component.comDescription},
        file: $file,
        progress: function(e){}
      }).then(function(data, status, headers, config) {
        $scope.uploadInfo='上传成功！';
        // $location.path('/admin/component/list');
      }); 
    }
  }
  $scope.back = function() {
    $location.path('/admin/component/list');
  };
  $scope.tree1 = AdminVehicle.queryVehicle();
  $scope.component.vehicles = [];
  var getRootNodesScope = function() {
      return angular.element(document.getElementById("tree1-root")).scope();
    };
  $scope.collapseAll = function() {
      var scope = getRootNodesScope();
      scope.collapseAll();
    };

    $scope.expandAll = function() {
      var scope = getRootNodesScope();
      scope.expandAll();
    };
}]);
