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

componentControllers.controller('componentEditController', ['$scope', 'Component', '$route', 'AdminVehicle', 'FileUploader', '$location', 'BoardService',
    function($scope, Component, $route, AdminVehicle, FileUploader, $location, BoardService) {
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

        $scope.removePicture = function() {
            var comId = {
                comId: $scope.component._id
            };
            Component.removePicture(comId, function(message) {
                $scope.displayMessage(message);
            });
        };

        var uploader = $scope.uploader = new FileUploader({
            url: 'admin/component/addPicture'
        });
        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/ , options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        uploader.onBeforeUploadItem = function(item) {
            var v_string = '';
            for (var i = 0; i < $scope.component.vehicles.length; i++) {
                v_string = v_string + $scope.component.vehicles[i]._id + '|' + $scope.component.vehicles[i].title + ',';
            }
            item.formData.push({
                comId: $scope.component._id,
                comName: $scope.component.comName,
                comDescription: $scope.component.comDescription,
                vehicles: v_string
            });
        };
        uploader.onCompleteAll = function() {
            $location.path('/admin/component/list');
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
                angular.forEach(result.objectList, function(vehicle) {
                    $scope.kanbanBoard.columns[0].cards.push(vehicle);
                });
            });
        };
    }
]);
