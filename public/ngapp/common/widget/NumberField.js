/*
 * ui-ccc-numberField
 *
 * Sample usage: <number-field label='Policy Fee' ng-model="fee" decimal="3" digit="5" unit="万"></number-field>
 * Parameters [
 *      ng-model : 定义angularJs模型绑定.
 *      decimal : 定义保留小数位数
 *      digit : 定义最多可输入整数位数
 *      unit : 定义单位
 *      ng-class : 定义input field的class style
 *      unit-class : 定义单位class style
 * ]
 * Create by Coral on 2015-04-29
 */
angular.module('common.widget.NumberField', [])
    .directive('numberField', [function () {
        return {
            restrict: 'EA',
            require: 'ngModel',
            scope: {
                unit: '@',
                digit: "@",
                decimal: '@',
                fieldClass: '@',
                unitClass: '@',
                fieldDivClass: '@',
                ngModel: '=',
                ngDisabled: "=",
                max: "@",
                min: "@",
                onBlur: "&",
                lastValue: '=',
                confirm: '&'
            },
            link: function (scope, el, attrs, ngModelCtrl) {
                scope.unitStyle = function () {
                    if (typeof scope.unit === 'undefined') {
                        return "ccc-unit-hide";
                    } else {
                        if (typeof scope.unitClass === 'undefined') {
                            if (scope.unit.length === 1) {
                                return "ccc-unit";
                            } else if (scope.unit.length === 2) {
                                return "ccc-unit-2";
                            } else if (scope.unit.length === 4) {
                                return "ccc-unit-4";
                            }
                        } else {
                            return scope.unitClass;
                        }
                    }
                };
                scope.fieldStyle = function () {
                    if (typeof scope.fieldClass === 'undefined') {
                        return "form-control ccc-field";
                    } else {
                        return scope.fieldClass;
                    }
                };
                scope.lastValue = scope.ngModel;

            },
            template: '<div class="{{fieldDivClass || \'form-inline\'}}">' +
            '<input ng-blur="blurEvent()" class="{{fieldStyle()}}" ng-model-options="{allowInvalid: false}" min="{{min}}" max="{{max}}" precision="{{decimal}}" number-filed-input type="text" ng-class="fieldStyle()" ng-model="ngModel" ng-disabled="ngDisabled" title="{{ ngDisabled ? ngModel : null}}">' +
            '<span class="{{unitStyle()}}">({{ unit }})</span>' +
            '</div>'
        };
    }])

    .directive('numberFiledInput', ['$parse', '$q', function ($parse, $q) {
        'use strict';

        var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;

        function link(scope, el, attrs, ngModelCtrl) {
            var precision = 0;
            if (attrs.precision) {
                precision = parseInt(attrs.precision, 10);
            }
            var min = parseInt(attrs.min, 10);
            var max = parseInt(attrs.max, 10);
            var initValue = $parse(attrs.ngModel)(scope);
            var lastMinValidatedValue = initValue;
            var lastMaxValidatedValue = initValue;
            var lastValidValue = initValue;
            var confirm = function () {
                var confirmed = scope.confirm();
                return confirmed === undefined ? true : confirmed;
            };

            /**
             * Returns a rounded number in the precision setup by the directive
             * @param  {Number} num Number to be rounded
             * @return {Number}     Rounded number
             */
            function round(num) {
                var d = Math.pow(10, precision);
                return Math.round(num * d) / d;
            }

            /**
             * Returns a string that represents the rounded number
             * @param  {Number} value Number to be rounded
             * @return {String}       The string representation
             */
            function formatPrecision(value) {
                return parseFloat(value).toFixed(precision);
            }

            function formatViewValue(value) {
                return ngModelCtrl.$isEmpty(value) ? '' : '' + precision ? formatPrecision(value) : value;
            }

            function setViewValue(value) {
                ngModelCtrl.$setViewValue(formatViewValue(value));
                ngModelCtrl.$render();
            }

            function minValidator(value) {
                if (!ngModelCtrl.$isEmpty(value) && value < min) {
                    setViewValue(lastMinValidatedValue);

                } else {
                    lastMinValidatedValue = value;
                }
                return lastMinValidatedValue;
            }

            function maxValidator(value) {
                if (!ngModelCtrl.$isEmpty(value) && value > max) {
                    setViewValue(lastMaxValidatedValue);
                } else {
                    lastMaxValidatedValue = value;
                }
                return lastMaxValidatedValue;
            }

            ngModelCtrl.$parsers.push(function (value) {
                if (angular.isUndefined(value)) {
                    value = '';
                }

                // Handle leading decimal point, like ".5"
                if (value.indexOf('.') === 0) {
                    value = '0' + value;
                }

                // Allow "-" inputs only when min < 0
                if (value.indexOf('-') === 0) {
                    if (min >= 0) {
                        value = null;
                        setViewValue('');
                    } else if (value === '-') {
                        setViewValue('-');
                        value = '-';
                    }
                }

                var empty = ngModelCtrl.$isEmpty(value);
                if (empty || NUMBER_REGEXP.test(value)) {
                    lastValidValue = (value === '') ? null : (empty ? value : parseFloat(value));
                } else {
                    setViewValue(lastValidValue);

                }

                ngModelCtrl.$setValidity('number', true);

                return lastValidValue;
            });

            ngModelCtrl.$formatters.push(function (v) {
                //scope.lastValue = v;
                return formatViewValue(v);
            });

            ngModelCtrl.$parsers.push(minValidator);

            if (angular.isDefined(attrs.max)) {
                ngModelCtrl.$parsers.push(maxValidator);
            }


            // Round off (disabled by "-1")
            if (angular.isDefined(attrs.precision)) {
                ngModelCtrl.$parsers.push(function (value) {
                    if (value) {
                        lastValidValue = round(value);
                    }

                    return lastValidValue;
                });

            }

            scope.blurEvent = function () {
                var value = ngModelCtrl.$viewValue;
                if (ngModelCtrl.$dirty) {
                    $q.when(confirm())
                        .then(function (confirmed) {
                            if (confirmed) {
                                setViewValue(value);
                                scope.lastValue = scope.ngModel;
                            }
                            else {
                                scope.ngModel = scope.lastValue;
                                setViewValue(scope.lastValue);
                            }
                        })
                        .then(function () {
                            scope.onBlur();
                        });
                }
                else {
                    scope.onBlur();
                }

            };
        }

        return {
            restrict: 'A',
            require: 'ngModel',
            link: link
        };
    }]).directive('selectAll', function () {
        return {
            restrict: 'A',
            link: function ($scope, $element) {
                $element.click(function (e) {
                    e.target.select();
                });
            }
        };
    });