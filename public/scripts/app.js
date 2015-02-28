'use strict';

/* App Module */
var ycdiyStoreApp = angular.module('ycdiyStoreApp', [ 'ngRoute', 'ui.bootstrap',
 'vehicleServices', 'shoppingControllers','componentServices','orderServices','userServices','adminControllers','pictureServices',
 'adminVehicleServices']);

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
    }).when('/admin/landing', {
        templateUrl: 'views/admin/admin.html',
        controller: 'componentViewController'
    }).when('/admin/componentgrid', {
        templateUrl: 'views/admin/componentgrid.html',
        controller: 'componentController'
    }).when('/admin/vehicle', {
        templateUrl: 'views/admin/vehicle.html',
        controller: 'adminVehicleController'
    }).when('/admin/upload', {
        templateUrl: 'views/admin/upload.html',
        controller: 'componentController'
    }).when('/admin/edit/:id', {
        templateUrl: 'views/admin/edit.html',
        controller: 'componentEditController'
    }).when('/admin/task', {
        templateUrl: 'views/admin/tasks.html',
        controller: 'componentEditController'
    }).otherwise({
		redirectTo : '/admin/landing'
	});
} ]);

