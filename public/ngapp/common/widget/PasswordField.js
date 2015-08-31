'use strict';
angular.module('common.widget').directive('passwordField',  function() {
    return {
        restrict: 'EA',
        scope: {
            ngModel: '=',
            placeholder: '@'
        },
        template:
        '<div class="input-field">'+
        '   <input type="{{pwdType}}" ng-model="ngModel" placeholder="{{placeholder}}" class="form-control"/>'+
        '   <span ng-class="{\'suffix glyphicon glyphicon-eye-open\':showPwd, \'suffix glyphicon glyphicon-eye-close\':!showPwd}" ng-click="togglePwd()"></span>'+
        '</div>',

        link: function ($scope) {
            $scope.showPwd = false;
            $scope.pwdType= "password";

            $scope.togglePwd = function () {
                if($scope.showPwd){
                    $scope.showPwd = false;
                    $scope.pwdType = 'password';
                }else{
                    $scope.showPwd = true;
                    $scope.pwdType = 'text';
                }

            };
            //输入框限制UI STANDARD中所描述的8个特殊字符 \ / : * ?' '|
            $scope.$watch('ngModel', function(newVal, oldVal){
                var password =/[\\/:*?'|]/;
                if (newVal != null && newVal != "" && newVal.trim() != null) {
                    if (!password.test(newVal)) {
                        $scope.ngModel = newVal;
                    }else{
                        $scope.ngModel = oldVal;
                    }
                }
            });

        }
    }
});