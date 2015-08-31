'use strict';
angular.module('common.widget').directive('captchaField',  function() {
    return {
        restrict: 'EA',
        scope: {
            ngModel: '=',
            placeholder: '@'
        },
        template:
        '<div style="display:flex;align-items: center;">'+
        '   <input type="{{pwdType}}" ng-model="ngModel" placeholder="{{placeholder}}" class="form-control" style="flex:1"/>'+
        '   <img style="width:50px;height:34px;margin-left:5px;" ng-click="changeCaptcha()"></span>'+
        '</div>',

        link: function ($scope) {
            $scope.pwdType= "password";

            $scope.changeCaptcha = function () {
                //TODO
            };



        }
    }
});