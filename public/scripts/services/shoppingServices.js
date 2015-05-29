'use strict';

/* Services */
var shoppingServices = angular.module('shoppingServices', ['ngResource']);

shoppingServices.factory('DataService', [
    function() {
        var myStore = new store();
        var myCart = new shoppingCart("ycdiyStore");
        //myCart.addCheckoutParameters("PayPal", "paypaluser@youremail.com");
        return {
            store: myStore,
            cart: myCart
        };
    }
]);
