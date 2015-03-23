'use strict';

/* App Module */
var ycdiyStoreApp = angular.module('ycdiyStoreApp', [ 'ngRoute', 'ui.bootstrap',
 'vehicleServices', 'shoppingControllers','componentServices','orderServices','userServices','componentControllers', 'vehicleControllers',
 'adminVehicleServices', 'ycdiyDirectives', 'angularFileUpload']);

ycdiyStoreApp.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/vehicle', {
		templateUrl : 'views/shopping/vehicle.html',
		controller : 'vehicleController'
	}).when('/store', {
        templateUrl: 'views/shopping/store.htm',
        controller: 'storeController'
    }). when('/products/:productCode', {
        templateUrl: 'views/shopping/product.htm',
        controller: 'storeController'
    }).when('/cart', {
        templateUrl: 'views/shopping/shoppingCart.htm',
        controller: 'storeController'
    }).when('/commit', {
        templateUrl: 'views/shopping/commit.html',
        controller: 'commitController'
    }).when('/feedback', {
        templateUrl: 'views/shopping/feedback.html',
        controller: 'commitController'
    }).when('/login', {
        templateUrl: 'views/login.html',
        controller: 'loginController'
    }).when('/registry', {
        templateUrl: 'views/registry.html',
        controller: 'registryController'
    }).when('/admin/component/list', {
        templateUrl: 'views/admin/componentList.html',
        controller: 'componentListController'
    }).when('/admin/vehicle', {
        templateUrl: 'views/admin/vehicle.html',
        controller: 'adminVehicleController'
    }).when('/admin/component/add', {
        templateUrl: 'views/admin/componentAdd.html',
        controller: 'componentAddController'
    }).when('/admin/component/edit/:id', {
        templateUrl: 'views/admin/componentEdit.html',
        controller: 'componentEditController'
    }).when('/admin/task', {
        templateUrl: 'views/admin/tasks.html',
        controller: 'componentEditController'
    }).when('/admin/vehicle/list', {
        templateUrl: 'views/admin/vehicleList.html',
        controller: 'vehicleListController'
    }).otherwise({
		redirectTo : '/admin/component/list'
	});
} ]);

