'use strict';

/* Controllers */
var componentControllers = angular.module('componentControllers', ['angularFileUpload', 'ui.tree', 'ngResource']);

componentControllers.controller('componentListController', ['$scope', 'Component',
    function($scope, Component) {
        Component.findAll($scope.currentPagination($scope.currentPage), function(result) {
            if (!result.success) {
                $scope.renderError(result.message);
            } else {
                $scope.loadListPage(result);
            }
        });
        $scope.pageChanged = function() {
            Component.findAll($scope.currentPagination($scope.currentPage), function(result) {
                if (!result.success) {
                    $scope.renderError(result.message);
                } else {
                    $scope.loadListPage(result);
                }
            });
        };
        $scope.delete = function(id) {
            if (confirm('确认删除?')) {
                Component.deleteById({
                    comId: id
                }, function(message) {
                    $scope.displayMessage(message);
                });
            }
        };
        $scope.query = function() {
            Component.findAll($scope.currentPagination($scope.currentPage, $scope.searchObj.search_name), function(result) {
                $scope.loadListPage(result);
            });
        };
        $scope.enter = function(ev) {
            if (ev.keyCode == 13) {
                $scope.query();
            }
        };
        $scope.searchObj = {
            searchName: ''
        };
    }
]);

componentControllers.controller('componentEditController', ['$scope', 'Component', '$route', 'AdminVehicle', 'PictureUpload', 'BoardService',
    function($scope, Component, $route, AdminVehicle, PictureUpload, BoardService) {
        $scope.pageTitle = '修改零件';
        $scope.search = {};
        $scope.search.level = '二级';
        var id = $route.current.params['id'];
        var comId = {
            comId: id
        };
        Component.findById(comId, function(result) {
            $scope.component = result;
            var kanban = BoardService.initBoard(null, $scope.component.vehicles);
            $scope.kanbanBoard = BoardService.kanbanBoard(kanban);
        });
        $scope.update = function() {
            $scope.component.vehicles = $scope.kanbanBoard.columns[1].cards;
            Component.update($scope.component, function(message) {
                $scope.displayMessage(message, '/admin/component/list');
            });
        };
        $scope.setSearch = function(obj) {
            $scope.search.level = obj;
        };
        $scope.querySub = function() {
            $scope.kanbanBoard.columns[0].cards = {};
            AdminVehicle.queryVehicles($scope.search, function(result) {
                angular.forEach(result.objectList, function(vehicle) {
                    $scope.kanbanBoard.columns[0].cards.push(vehicle);
                });
            });
        };
        $scope.kanbanSortOptions = BoardService.initOptions($scope.component, $scope.kanbanBoard);
        $scope.removeCard = function(column, card) {
            BoardService.removeCard($scope.kanbanBoard, column, card);
        }
        $scope.removePicture = function() {
            var comId = {
                comId: $scope.component._id
            };
            Component.removePicture(comId, function(message) {
                $scope.displayMessage(message);
            });
        };
        var uploader = $scope.uploader = PictureUpload.init($scope.component);
        uploader.onBeforeUploadItem = function(item) {
            item.formData.push({
                comId: $scope.component._id
            });
        };
    }
]);

componentControllers.controller('componentAddController', ['$scope', 'Component', 'AdminVehicle', 'PictureUpload', 'BoardService',
    function($scope, Component, AdminVehicle, PictureUpload, BoardService) {
        $scope.pageTitle = '新增零件';
        $scope.search = {};
        $scope.search.level = '二级';
        $scope.component = {
            comName: '',
            comDescription: '',
            vehicles: []
        };
        var kanban = BoardService.initBoard();
        $scope.kanbanBoard = BoardService.kanbanBoard(kanban);
        $scope.kanbanSortOptions = BoardService.initOptions($scope.component, $scope.kanbanBoard);
        $scope.removeCard = function(column, card) {
            BoardService.removeCard($scope.kanbanBoard, column, card);
        }
        $scope.update = function() {
            Component.create($scope.component, function(message) {
                $scope.displayMessage(message, '/admin/component/list');
            });
        };

        var uploader = $scope.uploader = PictureUpload.init($scope.component, 'admin/component/add');
        $scope.setLevel = function(obj) {
            $scope.vehicle.level = obj;
        };
        $scope.setSearch = function(obj) {
            $scope.search.level = obj;
        };
        $scope.querySub = function() {
            $scope.kanbanBoard.columns[0].cards = {};
            AdminVehicle.queryVehicles($scope.search, function(result) {
                angular.forEach(result.vehicleList, function(vehicle) {
                    $scope.kanbanBoard.columns[0].cards.push(vehicle);
                });
            });
        };
    }
]);
