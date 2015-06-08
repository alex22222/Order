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
		$scope.editable = true;
        var id = $route.current.params['id'];
        var comId = {
            comId: id
        };
        Component.findById(comId, function(result) {
            $scope.component = result;
        });
        $scope.update = function() {
            Component.update($scope.component, function(message) {
                $scope.displayMessage(message, '/admin/component/list');
            });
        };
        $scope.setSearch = function(obj) {
            $scope.search.level = obj;
        };

        $scope.removePicture = function(pictureId) {
            var comId = {
                comId: $scope.component._id,
				pictureId: pictureId
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

            item.formData.push({
                comId: $scope.component._id,
                comName: $scope.component.comName,
                comDescription: $scope.component.comDescription

            });
        };
        uploader.onCompleteAll = function() {
            $location.path('/admin/component/list');
        };
    }
]);

componentControllers.controller('componentAddController', ['$scope', 'Component', 'AdminVehicle', 'PictureUpload', 'BoardService',
    function($scope, Component, AdminVehicle, PictureUpload, BoardService) {
		$scope.editable = false;
        $scope.pageTitle = '新增零件';
        $scope.search = {};
        $scope.component = {
            comName: '',
            comDescription: '',
            price: 0
        };

        $scope.update = function() {
            Component.create($scope.component, function(message) {
                $scope.displayMessage(message, '/admin/component/list');
            });
        };

        var uploader = $scope.uploader = PictureUpload.init($scope.component, 'admin/component/add');
    }
]);
