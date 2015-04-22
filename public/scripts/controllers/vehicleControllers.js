'use strict';
var vehicleControllers = angular.module('vehicleControllers', ['angularFileUpload', 'ui.tree', 'ngResource']);
vehicleControllers.controller('adminVehicleController', ['$scope', 'AdminVehicle', '$location',
    function($scope, AdminVehicle, $location) {
        $scope.remove = function(scope) {
            scope.remove();
        };

        $scope.toggle = function(scope) {
            scope.toggle();
        };

        $scope.moveLastToTheBegginig = function() {
            var a = $scope.data.pop();
            $scope.data.splice(0, 0, a);
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
            function(result) {
                if (result.length == 0) {
                    $scope.data = [{
                        "id": "1",
                        "title": "默认车型",
                        "nodes": []
                    }];
                } else {
                    $scope.data = vehicleFromDB;
                }
            }
        );

        var vehicleEntities = AdminVehicle.findAll(
            function(result) {
                if (result.length == 0) {
                    $scope.data = [{
                        "id": "1",
                        "title": "默认车型",
                        "nodes": []
                    }];
                } else {
                    $scope.data = vehicleEntities;
                }
            }
        );

        $scope.updateVehicle = function() {
            var veh = $.parseJSON(JSON.stringify($scope.data));
            AdminVehicle.updateVehicle(veh, function(response) {
                $scope.message = response[0].message + '__' + new Date().getTime();
                $scope.success = response[0].success;
            });
        };
        $scope.back = function() {
            $location.path('/admin/vehicleEntity/list');
        };
    }
]);


var defaultItemsPerPage = 5;
vehicleControllers.controller('vehicleListController', ['$scope', 'AdminVehicle', '$location', '$route', '$q', '$timeout',
    function($scope, AdminVehicle, $location, $route, $q, $timeout) {
        var search = '';
        var pagination = {
            pageNumber: 1,
            itemsPerPage: defaultItemsPerPage,
            search: search
        };

        AdminVehicle.findAll(pagination, function(result) {
            if (!result.success) {
                sessionStorage["message"] = result.message;
                $location.path('/public/error');
            } else {
                $scope.vehicles = result.vehicleList;
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
            AdminVehicle.findAll(pagination, function(result) {
                if (!result.success) {
                    sessionStorage["message"] = result.message;
                    $location.path('/public/error');
                } else {
                    $scope.vehicles = result.vehicleList;
                    $scope.totalItems = result.page.size;
                    $scope.currentPage = result.page.currentPage;
                    $scope.itemsPerPage = result.page.itemsPerPage;
                }
            });
        };
        $scope.add = function() {
            $location.path('/admin/vehicleEntity/add');
        };

        $scope.edit = function(id) {
            $location.path('/admin/vehicleEntity/edit/' + id);
        };
        $scope.query = function() {
            if ($scope.search_name.length == 0) {
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
        $scope.clear = function() {
            $scope.search_name = '';
        }
        $scope.enter = function(ev) {
            if (ev.keyCode == 13) {
                $scope.query();
            }
        }
        $scope.delete = function(id) {
            var vehicleId = {
                vehicleId: id
            };
            AdminVehicle.deleteById(vehicleId, function(message) {
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
    }
]);


vehicleControllers.controller('vehicleAddController', ['$scope', '$location', 'AdminVehicle', '$rootScope',
    '$q', '$timeout', 'FileUploader', 'BoardService', 'BoardDataFactory',
    function($scope, $location, AdminVehicle, $rootScope, $q, $timeout, FileUploader, BoardService, BoardDataFactory) {
        $scope.pageTitle = '新增车型';
        $scope.search = {};
        $scope.search.level = '二级';
        $scope.vehicle = {
            title: '',
            description: '',
            level: '一级'
        };

        var kanban = {};
        kanban.name = 'Kanban Board';
        kanban.numberOfColumns = 2;
        var kanbanCols = new Array();
        var column = {};
        column.name = '可加子车型';
        column.cards = [];
        kanbanCols.push(column);
        var column2 = {};
        column2.name = '已加子车型';
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

                AdminVehicle.create($scope.vehicle, function(message) {
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
                        $location.path('/admin/vehicleEntity/list');
                    });
                    deferred.resolve();
                });
            }

        };

        var uploader = $scope.uploader = new FileUploader({
            url: 'admin/vehicleEntity/add'
        });
        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/ , options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        uploader.onBeforeUploadItem = function(item) {
            var subVehicleIds = '';
            angular.forEach($scope.vehicle.children, function(vehicle) {
                subVehicleIds = subVehicleIds + vehicle._id + '|'
            });
            item.formData.push({
                title: $scope.vehicle.title,
                description: $scope.vehicle.description,
                level: $scope.vehicle.level,
                children: subVehicleIds
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
                $location.path('/admin/vehicleEntity/list');
            });
            deferred.resolve();
        };
        $scope.back = function() {
            $location.path('/admin/vehicleEntity/list');
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
                $scope.vehicle.children = $scope.kanbanBoard.columns[1].cards;
            },
            orderChanged: function(event) {},
            containment: '#board'
        };

        $scope.removeCard = function(column, card) {
            BoardService.removeCard($scope.kanbanBoard, column, card);
        }
    }
]);

vehicleControllers.controller('vehicleEditController', ['$scope', '$location', '$route', 'AdminVehicle', '$q', 'BoardService', 'BoardDataFactory', '$timeout', 'FileUploader',
    function($scope, $location, $route, AdminVehicle, $q, BoardService, BoardDataFactory, $timeout, FileUploader) {
        $scope.pageTitle = '修改车型';
        $scope.search = {};
        $scope.search.level = '二级';
        var id = $route.current.params['id'];
        var comId = {
            comId: id
        };
        AdminVehicle.findById(comId, function(result) {
            $scope.vehicle = result;
            var kanban = {};
            kanban.name = 'Kanban Board';
            kanban.numberOfColumns = 2;
            var kanbanCols = new Array();
            var column = {};
            column.name = '可加子车型';
            column.cards = [];
            kanbanCols.push(column);
            var column2 = {};
            column2.name = '已加子车型';
            column2.cards = [];
            angular.forEach($scope.vehicle.children, function(vehicle) {
                column2.cards.push(vehicle);
            });
            kanbanCols.push(column2);
            kanban.columns = kanbanCols;
            $scope.kanbanBoard = BoardService.kanbanBoard(kanban);
        });
        $scope.back = function() {
            $location.path('/admin/vehicleEntity/list');
        };
        $scope.update = function() {
            if (!$scope.form.$valid) {
                $scope.message = '名称必填' + '__' + new Date().getTime();
                $scope.success = false;
                return;
            }
            AdminVehicle.update($scope.vehicle, function(message) {
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
                    $location.path('/admin/vehicleEntity/list');
                });
                deferred.resolve();
            });
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
                $scope.vehicle.children = $scope.kanbanBoard.columns[1].cards;
            },
            orderChanged: function(event) {},
            containment: '#board'
        };

        $scope.removeCard = function(column, card) {
            BoardService.removeCard($scope.kanbanBoard, column, card);
        }
        var uploader = $scope.uploader = new FileUploader({
            url: 'admin/vehicleEntity/add'
        });

        $scope.removePicture = function() {
            var vehicleId = {
                vehicleId: $scope.vehicle._id
            };
            AdminVehicle.removePicture(vehicleId, function(message) {
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

        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/ , options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        uploader.onBeforeUploadItem = function(item) {
            var subVehicleIds = '';
            angular.forEach($scope.vehicle.children, function(vehicle) {
                subVehicleIds = subVehicleIds + vehicle._id + '|'
            });
            item.formData.push({
                title: $scope.vehicle.title,
                description: $scope.vehicle.description,
                level: $scope.vehicle.level,
                children: subVehicleIds
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
                $location.path('/admin/vehicleEntity/list');
            });
            deferred.resolve();
        };
    }
]);