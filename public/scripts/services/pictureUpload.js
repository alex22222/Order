/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */

'use strict';

var PictureUploadServices = angular.module('PictureUploadServices', []);
PictureUploadServices.service('PictureUpload', ['FileUploader', '$location',
    function(FileUploader, $location) {

        return {
            init: function(component, url) {
                var instance = new FileUploader({
                    url: url
                });
                instance.filters.push({
                    name: 'imageFilter',
                    fn: function(item /*{File|FileLikeObject}*/ , options) {
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                    }
                });
                instance.onBeforeUploadItem = function(item) {
                    item.formData.push({
						comId: component._id,
                        comName: component.comName,
                        comDescription: component.comDescription
                    });
                };
                instance.onCompleteAll = function() {
                    $location.path('/admin/component/list');
                };
                return instance;
            }
        };
    }
]);
