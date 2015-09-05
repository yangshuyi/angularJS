'use strict';
angular.module('common.widget').directive('numberField', ['$filter', function ($filter) {
    return {
        scope: {
            ngModel: '=',
            placeholder: '@',
            unit: '@',  //单位后缀
            fractionSize: '', //精度小数位数
            max: '@',//最大值
            min: '@',//最小值
            defaultValue: '@'//默认值
        },
        require: 'ngModel',
        link: function ($scope, elem, attrs, ngModelCtrl) {
            var setViewValue = function (value) {
                var fractionSize = null;
                if (!angular.$isEmpty($scope.fractionSize)) {
                    fractionSize = $scope.fractionSize;
                }

                if (fractionSize) {
                    value = $filter('number')(value, $scope.fractionSize);
                }

                //在回调时设置$viewValue并执行digest循环
                ngModelCtrl.$setViewValue(value);
                //将数据值转换为合适的显示或者视图值
                //ngModelCtrl.$render();
            };

            var validateInput = function (value) {
                var min = parseFloat($scope.min, 10);
                var max = parseFloat($scope.max, 10);
                var defaultValue = 0 || parseFloat($scope.defaultValue);

                if (angular.$isEmpty(value)) {
                    value = defaultValue;
                }

                // Handle leading decimal point, like ".5"
                if (value.indexOf('.') === 0) {
                    value = '0' + value;
                }

                value = parseFloat(value);

                if (value < min) {
                    setViewValue(min);
                }
                if (value > max) {
                    setViewValue(max);
                }
            };

            //用于当用户输入时，触发该pipeline，可以来修改model
            ngModelCtrl.$parsers.push(validateInput);


            //用于当model修改时，触发该pipeline，来修改directive的展现
            ngModelCtrl.$formatters.push(setViewValue);
        },
        template: '<div class="input-field">' +
        '   <input type="number" ng-model="ngModel" ng-model-options="{updateOn:\'default blur\',debounce:{ \'default\':500,\'blur\':0}}" max="{{max}}" min="{{min}}" placeholder="{{placeholder}}" class="form-control"/>' +
        '   <span ng-if="unit!=null" class="suffix">{{unit}}</span>' +
        '</div>',
    };
}])