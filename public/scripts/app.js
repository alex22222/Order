'use strict';

/* App Module */
var ycdiyStoreApp = angular.module('ycdiyStoreApp', ['ngRoute', 'ui.bootstrap', 'ui.sortable', 'angularFileUpload',
    'ghiscoding.validation', 'pascalprecht.translate',
    'shoppingControllers', 'componentControllers', 'vehicleControllers', 'NewCardControllers', 'authControllers',
    'publicErrorControllers', 'mainControllerControllers', 'backStageControllers',
    'componentServices', 'userServices', 'adminVehicleServices', 'shoppingServices',
    'ycdiyDirectives', 'BoardDataFactories', 'BoardManipulators', 'BoardServices', 'PictureUploadServices'
]);

ycdiyStoreApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/vehicle', {
            templateUrl: 'views/shopping/landing.html',
            controller: 'landingController'
        }).when('/store/:vid', {
            templateUrl: 'views/shopping/store.htm',
            controller: 'storeController'
        }).when('/products/:vid/:productCode', {
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
        }).when('/user/detail', {
            templateUrl: 'views/user/detail.html',
            controller: 'userDetailController'
        }).when('/admin/component/list', {
            templateUrl: 'views/admin/componentList.html',
            controller: 'componentListController'
        }).when('/admin/vehicle', {
            templateUrl: 'views/admin/vehicle.html',
            controller: 'adminVehicleController'
        }).when('/admin/user/list', {
            templateUrl: 'views/admin/userList.html',
            controller: 'userListController'
        }).when('/admin/user/edit/:id', {
            templateUrl: 'views/admin/userForm.html',
            controller: 'userEditController'
        }).when('/admin/component/add', {
            templateUrl: 'views/admin/componentForm.html',
            controller: 'componentAddController'
        }).when('/admin/component/edit/:id', {
            templateUrl: 'views/admin/componentForm.html',
            controller: 'componentEditController'
        }).when('/admin/task', {
            templateUrl: 'views/admin/tasks.html',
            controller: 'componentEditController'
        }).when('/admin/vehicleEntity/list', {
            templateUrl: 'views/admin/vehicleList.html',
            controller: 'vehicleListController'
        }).when('/admin/vehicleEntity/add', {
            templateUrl: 'views/admin/vehicleForm.html',
            controller: 'vehicleAddController'
        }).when('/admin/vehicleEntity/edit/:id', {
            templateUrl: 'views/admin/vehicleForm.html',
            controller: 'vehicleEditController'
        }).when('/admin/vehicleEntity/bindComponent/:id', {
            templateUrl: 'views/admin/vehicleBindForm.html',
            controller: 'vehicleBindController'
        }).when('/public/error', {
            templateUrl: 'views/error.html',
            controller: 'errorController'
        }).otherwise({
            redirectTo: '/public/error'
        });
    }
])
    .config(['$translateProvider',
        function($translateProvider) {
            $translateProvider.useStaticFilesLoader({
                prefix: 'locales/validation/',
                suffix: '.json'
            });
            $translateProvider.preferredLanguage('cn');
        }
    ]);
