'use strict';

/* Controllers */
var ycdiyDirectives = angular.module('ycdiyDirectives', []);

ycdiyDirectives.directive('message', function() {
  return {
    restrict: 'AEC',
    template: '<div class="alert alert-success" role="alert" ng-show="success">{{message.split("__")[0]}}</div>'
              +  '<div class="alert alert-warning" role="alert" ng-show="!success">{{message.split("__")[0]}}</div>',
    link: function($scope, element, attrs) {
      $(element).hide();
      $scope.$watch(function() {
              return $scope.message;
          }, function(value) {
        if (value) {
          var duration = attrs.fadeDuration || 2000;
        	$(element).fadeIn(500);
        	$(element).fadeOut(duration);
        }
      });
     }
   };
});

ycdiyDirectives.directive('ngThumb', ['$window', function($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }]);