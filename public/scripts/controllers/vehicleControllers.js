'use strict';
var vehicleControllers = angular.module('vehicleControllers', ['angularFileUpload','ui.tree','ngResource']);
vehicleControllers.controller('adminVehicleController', [ '$scope', 'AdminVehicle', '$location',
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
                    "title": "默认车型",
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
        $scope.message = response[0].message + '__' + new Date().getTime();
        $scope.success = response[0].success;
      });
    }; 
    $scope.back = function() {
        $location.path('/admin/component/list');
    };
}]);


var defaultItemsPerPage = 5;
vehicleControllers.controller('vehicleListController', [ '$scope', 'AdminVehicle', '$location', '$route', '$q', '$timeout',
 function($scope, AdminVehicle, $location, $route, $q, $timeout) {
      var search = '';
      var pagination = {
        pageNumber:1,
        itemsPerPage:defaultItemsPerPage,
        search:search
      };
      
      AdminVehicle.findAll(pagination, function(result) {
        $scope.vehicles = result.vehicleList;
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
        AdminVehicle.findAll(pagination, function(result) {
          $scope.vehicles = result.vehicleList;
          $scope.totalItems = result.page.size;
          $scope.currentPage = result.page.currentPage;
          $scope.itemsPerPage = result.page.itemsPerPage;
        });
      };
      $scope.edit = function(id) {
          $location.path('/admin/vehicle/edit/' + id);
      };
      $scope.query = function() {
        if($scope.search_name.length == 0) {
          pagination.search = '';
        } else {
          pagination.search = $scope.search_name;
        }
        AdminVehicle.findAll(pagination, function(result) {
          $scope.vehicles = result.vehicleList;
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