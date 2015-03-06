'use strict';

/* Controllers */
var ycdiyDirectives = angular.module('ycdiyDirectives', []);

ycdiyDirectives.directive('darthFader', function() {
  return {
    restrict: 'AEC',
    link: function($scope, element, attrs) {
      $(element).hide();
      $scope.$watch(function() {
              return $scope.message;
          }, function(value) {
        if (value) {
          var duration = attrs.fadeDuration || 3000;
        	$(element).fadeIn(duration);
        	$(element).fadeOut(duration);
        }
      });
     }
   };
});