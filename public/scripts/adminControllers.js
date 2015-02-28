'use strict';

/* Controllers */
var adminControllers = angular.module('adminControllers', ['angularFileUpload','ui.tree','ngResource']);


adminControllers.controller('componentViewController', [ '$scope', 'Picture', '$location', '$route',
 function($scope, Picture, $location, $route) {
      var search = '';
      var pagination = {
        pageNumber:1,
        itemsPerPage:2,
        search:search
      };
      
      Picture.queryComponents(pagination, function(result) {
        $scope.pics = result.pictureList;
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
        Picture.queryComponents(pagination, function(result) {
          $scope.pics = result.pictureList;
          $scope.totalItems = result.page.size;
          $scope.currentPage = result.page.currentPage;
          $scope.itemsPerPage = result.page.itemsPerPage;
        });
      };
      $scope.add = function() {
        $location.path('/admin/upload');
      };
      $scope.delete = function(id) {
        var comId = {comId: id};
        Picture.deleteComponent(comId, function() {
          $route.reload();
        });
      };
      $scope.edit = function(id) {
          $location.path('/admin/edit/' + id);
      };
      $scope.query = function() {
        if($scope.search_name.length == 0) {
          pagination.search = '';
        } else {
          pagination.search = $scope.search_name;
        }
        Picture.queryComponents(pagination, function(result) {
          $scope.pics = result.pictureList;
          $scope.totalItems = result.page.size;
          $scope.currentPage = result.page.currentPage;
          $scope.itemsPerPage = result.page.itemsPerPage;
        });
      };
}]);

adminControllers.controller('componentEditController', [ '$scope', 'Picture', '$location', '$route', '$upload', 'AdminVehicle',
 function($scope, Picture, $location, $route, $upload, AdminVehicle) {
      var id = $route.current.params['id'];
      var comId = {comId: id};
      Picture.queryComponent(comId, function(result) {
        $scope.component = result;
      });
      $scope.back = function() {
        $location.path('/admin/landing');
      };
      $scope.update = function() {
        Picture.updateComponent($scope.component, function() {
          $location.path('/admin/landing');
        });
      };
      $scope.onFileSelect = function($files) {
        var v = $scope.component._id;
        for (var i = 0; i < $files.length; i++) {
          var $file = $files[i];
          $upload.upload({
            url: 'admin/pic/update',
            data: {_id: $scope.component._id, comName: $scope.component.comName, comDescription: $scope.component.comDescription},
            file: $file,
            progress: function(e){}
          }).then(function(data, status, headers, config) {
            $scope.uploadInfo='上传成功！';
            // $location.path('/admin/landing');
          }); 
        }
      };
      $scope.tree1 = AdminVehicle.queryVehicle(
        function (result) {
          if(result.length == 0) {
                $scope.data = [
                  {
                    "id":"1",
                    "title": "默认车型1",
                    "nodes": []
                  }
                ];
              } else {
                $scope.data = vehicleFromDB;
              }
        }
      );
}]);

adminControllers.controller('componentController', [ '$scope', '$upload', '$location','Picture', '$rootScope',
 function($scope, $upload, $location, Picture, $rootScope) {
  $scope.pics = Picture.queryComponents();
  $rootScope.loginName = localStorage["username"];
	$scope.onFileSelect = function($files) {
    for (var i = 0; i < $files.length; i++) {
      var $file = $files[i];
      $upload.upload({
        url: 'admin/upload',
        data: {comName: $scope.comName, comDescription: $scope.comDescription},
        file: $file,
        progress: function(e){}
      }).then(function(data, status, headers, config) {
        $scope.uploadInfo='上传成功！';
        // $location.path('/admin/landing');
      }); 
    }
  }
  $scope.back = function() {
    $location.path('/admin/landing');
  };
}]);

adminControllers.controller('adminVehicleController', [ '$scope', 'AdminVehicle', '$location',
 function($scope,AdminVehicle, $location) {
    $scope.remove = function(scope) {
      scope.remove();
    };

    $scope.toggle = function(scope) {
      scope.toggle();
    };

    $scope.moveLastToTheBegginig = function () {
      var a = $scope.data.pop();
      $scope.data.splice(0,0, a);
    };

    $scope.newSubItem = function(scope) {
      var nodeData = scope.$modelValue;
      nodeData.nodes.push({
        id: nodeData.id * 10 + nodeData.nodes.length,
        title: nodeData.title + '.' + (nodeData.nodes.length + 1),
        nodes: []
      });
    };

    var getRootNodesScope = function() {
      return angular.element(document.getElementById("tree-root")).scope();
    };

    $scope.collapseAll = function() {
      var scope = getRootNodesScope();
      scope.collapseAll();
    };

    $scope.expandAll = function() {
      var scope = getRootNodesScope();
      scope.expandAll();
    };

    var vehicleFromDB = AdminVehicle.queryVehicle(
        function (result) {
          if(result.length == 0) {
                $scope.data = [
                  {
                    "id":"1",
                    "title": "默认车型1",
                    "nodes": []
                  }
                ];
              } else {
                $scope.data = vehicleFromDB;
              }
        }
      );
    
    $scope.updateVehicle = function () {
      var veh = $.parseJSON(JSON.stringify($scope.data));
      AdminVehicle.updateVehicle(veh, function(response) {
        alert(response[0].result);
        $location.path('/admin/vehicle');
      });
    }; 
}]);