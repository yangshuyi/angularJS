'use strict';

/**
 * 电话号码值只允许输入数字还有“-”
 */
angular.module('common.widget').directive('telNoField', [function () {
    return {
        restrict: 'EA',
        scope: {
            ngModel: '='
        },
        link: function ($scope) {
            $scope.$watch('ngModel', function (newVal, oldVal) {
                var pTelNo = /^(\d|\-|\(|\)|\s)*$/;
                if (newVal !== null && newVal !== "" && newVal.trim() !== null) {
                    if (pTelNo.test(newVal)) {
                        $scope.ngModel = newVal;
                    } else {
                        $scope.ngModel = oldVal;
                    }
                }
            });
        },
        template: '<input type="text" ng-model="ngModel"  class="form-control ccc-field"/>'
    };
}]);