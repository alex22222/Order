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