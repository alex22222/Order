'use strict';
var vehicleControllers = angular.module('vehicleControllers', ['angularFileUpload', 'ui.tree', 'ngResource']);

var defaultItemsPerPage = 5;
vehicleControllers.controller('vehicleListController', ['$scope', 'AdminVehicle',
    function($scope, AdminVehicle) {
        $scope.search = {};
        AdminVehicle.findAll($scope.currentPagination($scope.currentPage), function(result) {
            if (!result.success) {
                $scope.renderError(result.message);
            } else {
                $scope.loadListPage(result);
            }
        });
        $scope.pageChanged = function() {
            AdminVehicle.findAll($scope.currentPagination($scope.currentPage), function(result) {
                if (!result.success) {
                    $scope.renderError(result.message);
                } else {
                    $scope.loadListPage(result);
                }
            });
        };

        $scope.query = function() {
            if ($scope.search.level1 && $scope.search.level2) {
                var parent = {
                    parent: $scope.search.level2_id
                };
                AdminVehicle.findByParent(parent, function(result) {
                    if (!result.success) {
                        $scope.renderError(result.message);
                    } else {
                        $scope.items = result.objectList;
                        $scope.totalItems = 1;
                        $scope.currentPage = 1;
                        $scope.itemsPerPage = 100;
                    }
                });
            } else {
                AdminVehicle.findAll($scope.currentPagination($scope.currentPage, $scope.search.search_name), function(result) {
                    $scope.items = result.objectList;
                    $scope.totalItems = result.page.size;
                    $scope.currentPage = result.page.currentPage;
                    $scope.itemsPerPage = result.page.itemsPerPage;
                });
            }
        };
        $scope.enter = function(ev) {
            if (ev.keyCode == 13) {
                $scope.query();
            }
        }
        $scope.delete = function(id) {
            if (confirm('确认删除?')) {
                var vehicleId = {
                    vehicleId: id
                };
                AdminVehicle.deleteById(vehicleId, function(message) {
                    $scope.displayMessage(message);
                });
            }
        };
        $scope.queryLevel1 = function() {
            var level = {
                level: '一级'
            };
            AdminVehicle.findByLevel(level, function(result) {
                if (!result.success) {
                    $scope.renderError(result.message);
                } else {
                    $scope.items_l1 = result.objectList;
                }
            });
        };
        $scope.setLevel1 = function(obj) {
            $scope.search.level1 = obj.title;
            $scope.search.level1_id = obj._id;
            var parent = {
                parent: obj._id
            };
            AdminVehicle.findByParent(parent, function(result) {
                if (!result.success) {
                    $scope.renderError(result.message);
                } else {
                    $scope.items_l2 = result.objectList;
                }
            });
        };
        $scope.setLevel2 = function(obj) {
            $scope.search.level2 = obj.title;
            $scope.search.level2_id = obj._id;
        };
        $scope.clear = function() {
            $scope.search = {};
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
                angular.forEach(result.objectList, function(vehicle) {
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

vehicleControllers.controller('vehicleEditController', ['$scope', '$location', '$route', 'AdminVehicle', '$q', 'BoardService', 'BoardDataFactory', '$timeout', 'FileUploader', 'DataService',
    function($scope, $location, $route, AdminVehicle, $q, BoardService, BoardDataFactory, $timeout, FileUploader, DataService) {
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

            $scope.myInterval = 5000;
            var slides = $scope.slides = [];
            slides.push({
                image: 'images/vehicle/' + result.name
            });


        });
        $scope.back = function() {
            $location.path('/admin/vehicleEntity/list');
        };
        $scope.update = function() {
            $scope.vehicle.children = $scope.kanbanBoard.columns[1].cards;
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
                angular.forEach(result.objectList, function(vehicle) {
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
            url: 'admin/vehicleEntity/addPicture?vehicleId=' + id
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
                children: subVehicleIds,
                vehicleId: id
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

vehicleControllers.controller('vehicleBindController', ['$scope', '$location', '$route', 'AdminVehicle', '$q', 'BoardService', 'BoardDataFactory', '$timeout', 'Component',
    function($scope, $location, $route, AdminVehicle, $q, BoardService, BoardDataFactory, $timeout, Component) {
        $scope.pageTitle = '绑定零件';
        $scope.showAdd = false;
        $scope.search = {};
        $scope.search.comType = '';
        $scope.componentToSelect = [];
        var id = $route.current.params['id'];
        var comId = {
            comId: id
        };
        AdminVehicle.findById(comId, function(result) {
            $scope.vehicle = result;
            $scope.componentGrid1 = getComponentByType('空气滤清', result.components);
            $scope.componentGrid2 = getComponentByType('机油滤清', result.components);
            $scope.componentGrid3 = getComponentByType('空调滤清', result.components);
        });
        $scope.back = function() {
            $location.path('/admin/vehicleEntity/list');
        };
        $scope.queryComponent = function() {
            var comType = {
                comType: $scope.search.comType
            };
            Component.findByType(comType, function(result) {
                $scope.componentToSelect = result.objectList;
            });
        };
        $scope.removeCard = function(column, card) {
            BoardService.removeCard($scope.kanbanBoard, column, card);
        };
		$scope.addComponent = function(component) {


		};
        $scope.update = function() {
            $scope.vehicle.components = $scope.kanbanBoard.columns[1].cards;
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
    }
]);

function getComponentByType(type, components) {
    var coms = [];
    angular.forEach(components, function(component) {
        if (component.comType == type) {
            coms.push(component);
        }
    });
    return coms;
}
