'use strict';

/* Controllers */
var componentControllers = angular.module('componentControllers', ['angularFileUpload', 'ui.tree', 'ngResource']);

var defaultItemsPerPage = 5;
componentControllers.controller('componentListController', ['$scope', 'Component', '$location', '$route', '$q', '$timeout',
    function($scope, Component, $location, $route, $q, $timeout) {
        var search = '';
        var pagination = {
            pageNumber: 1,
            itemsPerPage: defaultItemsPerPage,
            search: search
        };

        Component.findAll(pagination, function(result) {
            if (!result.success) {
				sessionStorage["message"] = result.message;
                $location.path('/public/error');
            } else {
                $scope.components = result.componentList;
                $scope.totalItems = result.page.size;
                $scope.currentPage = result.page.currentPage;
                $scope.itemsPerPage = result.page.itemsPerPage;
            }
        });
        $scope.pageChanged = function() {
            var pagination = {
                pageNumber: $scope.currentPage,
                itemsPerPage: defaultItemsPerPage,
                search: search
            };
            Component.findAll(pagination, function(result) {
                if (!result.success) {
					sessionStorage["message"] = result.message;
                    $location.path('/public/error');
                } else {
                    $scope.components = result.componentList;
                    $scope.totalItems = result.page.size;
                    $scope.currentPage = result.page.currentPage;
                    $scope.itemsPerPage = result.page.itemsPerPage;
                }
            });
        };
        $scope.add = function() {
            $location.path('/admin/component/add');
        };

        $scope.delete = function(id) {
            var comId = {
                comId: id
            };
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
            if ($scope.search_name.length == 0) {
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
        $scope.clear = function() {
            $scope.search_name = '';
        }
        $scope.enter = function(ev) {
            if (ev.keyCode == 13) {
                $scope.query();
            }
        }
    }
]);

componentControllers.controller('componentEditController', ['$scope', 'Component', '$location', '$route', 'AdminVehicle', '$q', '$timeout', 'FileUploader', 'BoardService', 'BoardDataFactory',
    function($scope, Component, $location, $route, AdminVehicle, $q, $timeout, FileUploader, BoardService, BoardDataFactory) {
        $scope.pageTitle = '修改零件';
        $scope.search = {};
        $scope.search.level = '二级';
        var id = $route.current.params['id'];
        var comId = {
            comId: id
        };
        Component.findById(comId, function(result) {
            $scope.component = result;
            var kanban = {};
            kanban.name = 'Kanban Board';
            kanban.numberOfColumns = 2;
            var kanbanCols = new Array();
            var column = {};
            column.name = '可加车型';
            column.cards = [];
            kanbanCols.push(column);
            var column2 = {};
            column2.name = '已加车型';
            column2.cards = [];
            angular.forEach($scope.component.vehicles, function(vehicle) {
                column2.cards.push(vehicle);
            });
            kanbanCols.push(column2);
            kanban.columns = kanbanCols;
            $scope.kanbanBoard = BoardService.kanbanBoard(kanban);
        });
        $scope.back = function() {
            $location.path('/admin/component/list');
        };
        $scope.update = function() {
            if (!$scope.form.$valid) {
                $scope.message = '名称必填' + '__' + new Date().getTime();
                $scope.success = false;
                return;
            }
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
        $scope.kanbanSortOptions = {
            itemMoved: function(event) {
                event.source.itemScope.modelValue.status = event.dest.sortableScope.$parent.column.name;
                $scope.component.vehicles = $scope.kanbanBoard.columns[1].cards;
            },
            orderChanged: function(event) {},
            containment: '#board'
        };

        $scope.removeCard = function(column, card) {
            BoardService.removeCard($scope.kanbanBoard, column, card);
        }
        $scope.removePicture = function() {
            var comId = {
                comId: $scope.component._id
            };
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
            fn: function(item /*{File|FileLikeObject}*/ , options) {
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
    }
]);

componentControllers.controller('componentAddController', ['$scope', '$location', 'Component', '$rootScope', 'AdminVehicle', '$q', '$timeout', 'FileUploader', 'BoardService', 'BoardDataFactory',
    function($scope, $location, Component, $rootScope, AdminVehicle, $q, $timeout, FileUploader, BoardService, BoardDataFactor) {
        $scope.pageTitle = '新增零件';
        $scope.search = {};
        $scope.search.level = '二级';
        $scope.component = {
            comName: '',
            comDescription: '',
            vehicles: []
        };

        var kanban = {};
        kanban.name = 'Kanban Board';
        kanban.numberOfColumns = 2;
        var kanbanCols = new Array();
        var column = {};
        column.name = '可加车型';
        column.cards = [];
        kanbanCols.push(column);
        var column2 = {};
        column2.name = '已加车型';
        column2.cards = [];
        kanbanCols.push(column2);
        kanban.columns = kanbanCols;
        $scope.kanbanBoard = BoardService.kanbanBoard(kanban);
        $scope.create = function() {
            if (!$scope.form.$valid) {
                $scope.message = '名称必填' + '__' + new Date().getTime();
                $scope.success = false;
                return;
            }
            if ($scope.uploader.queue.length > 0) {
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
        $scope.kanbanSortOptions = {
            itemMoved: function(event) {
                event.source.itemScope.modelValue.status = event.dest.sortableScope.$parent.column.name;
                $scope.component.vehicles = $scope.kanbanBoard.columns[1].cards;
            },
            orderChanged: function(event) {},
            containment: '#board'
        };

        $scope.removeCard = function(column, card) {
            BoardService.removeCard($scope.kanbanBoard, column, card);
        }
    }
]);
