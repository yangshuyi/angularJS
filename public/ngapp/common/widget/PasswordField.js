'use strict';
angular.module('common.widget.PasswordField', []).directive('passwordField',  function() {
    return {
        restrict: 'EA',
        scope: {
            ngModel: '=',
            placeholder: '@'
        },
        template: '<div style="position: relative;" class="top-10">\
                        <input type="{{pwdType}}" ng-model="ngModel" placeholder="{{placeholder}}" class="form-control ccc-field"/>\
                        <span ng-class="{passwordDisplay:pictureClass, passwordDisable:!pictureClass}" ng-click="changePwdType()" class="top-5"></span>\
                   </div>',

        link: function ($scope) {
            $scope.pwdType= "password";
            $scope.changePwdType = function () {
                $scope.pictureClass = !$scope.pictureClass;
                $scope.pwdType = $scope.pwdType == "password" ? "text" :"password";
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