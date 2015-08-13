angular
    .module("common.widget.DropDownField", ['ui.select', 'ngSanitize'])
    .directive("dropDownField", ['codeTable', '$q', '$timeout', function (codeTable, $q, $timeout) {
        return {
            require: 'ngModel',
            scope: {
                ngModel: "=",
                codeType: "@",
                ngDisabled: "=",
                changeEvent: '=',
                confirmFunc: '=',
                searchEnabled: '@',
                optionList: "=",
                returnOptionObject: '@',
                lastValue: '=',
                onChange: '&',
                defaultVal: "=",
                groupBy: '@'
            },
            restrict: 'EA',
            replace: false,
            template: '<ui-select ng-model="model.selected" ng-change="changeFunc(model.selected)" theme="select2" append-to-body="true" search-enabled="{{searchEnabled}}" ng-disabled="ngDisabled"' +
            'title="{{model.selected.text}}">' +
            '<ui-select-match placeholder="{{searchTitle}}">{{$select.selected.text}}</ui-select-match>' +
            '<ui-select-choices group-by="\'{{groupBy}}\'" repeat="option in totalOptions | propsFilter: {text: $select.search}">' +
            '<div ng-bind-html="option.text | highlight: $select.search"></div>' +
            '</ui-select-choices>' +
            '</ui-select>',
            link: function ($scope, $elem, attrs, ngModelCtrl) {
                $scope.ngModel = $scope.ngModel || $scope.defaultVal;
                $scope.lastValue = $scope.ngModel;
                $scope.model = {selected: null};
                if (!$scope.ngDisabled) {
                    $scope.title = attrs.title || '请选择';
                    $scope.searchTitle = attrs.searchTitle;
                }
                if (attrs.allowEmpty) {
                    $scope.searchTitle = '请选择';
                }
                //如果是该控件用在查询条件时，下拉框是要显示请选择，其他情况下不显示请选择
                $scope.searchEnabled = $scope.searchEnabled === undefined ? false : true;
                var lastSelectedValue;
                $scope.totalOptions = [];

                function setTotalOptions(array) {
                    _.remove($scope.totalOptions, function () {
                        return true;
                    });
                    if ($scope.searchTitle !== null) {
                        $scope.totalOptions.push({text: $scope.searchTitle, value: null});
                    }
                    if ($scope.optionList || $scope.options) {
                        $scope.totalOptions = $scope.totalOptions.concat($scope.optionList || $scope.options);
                    }
                }

                //var lastSavedItemValue = $scope.itemValue;
                // 根据codeTypeId查询List，存放在options中，刷新DropDownList控件的显示
                var optionsPromise = $q.when(($scope.codeType && !$scope.optionList) ? codeTable.getCodesByType($scope.codeType) : $scope.optionList)
                    .then(function (data) {
                        $scope.options = data;
                        setTotalOptions();
                    });

                function changeSelected(currentValue) {
                    optionsPromise.then(function () {
                        var item = _.find($scope.totalOptions, function (i) {
                            return i.value === currentValue;
                        });
                        if (item) {
                            $scope.model.selected = item;
                        }
                        else {
                            if (!$scope.ngDisabled) {
                                $scope.model.selected = {text: '请选择', value: null};
                            } else {
                                $scope.model.selected = null;
                            }

                        }
                    });
                }

                $scope.$watch('optionList', function (value) {
                    $scope.optionList = value;
                    setTotalOptions();
                    changeSelected(lastSelectedValue);
                });


                $scope.changeFunc = function (item) {
                    // 如果属性绑定on-change事件，则使用此块逻辑执行绑定的change事件
                    if (!angular.isUndefined($scope.onChange)) {
                        $scope.ngModel = $scope.returnOptionObject ? item : item.value;
                        // 至于为什么延迟，不知道。但是不延迟，change事件方法调用是，数据是旧的。
                        $timeout(function () {
                            $scope.onChange();
                            $scope.lastValue = item.value;
                        });

                    }
                    var confirmFunc = $scope.confirmFunc || function () {
                            return true;
                        };
                    var changeEvent = $scope.changeEvent || angular.noop;

                    $q.when(confirmFunc(item.value, true))
                        .then(function (confirmed) {
                            if (confirmed) {
                                lastSelectedValue = item.value;
                                $scope.ngModel = $scope.returnOptionObject ? item : item.value;
                                changeEvent(item.value);

                                $timeout(function () {
                                    $elem.trigger('change');
                                }, 0); // trigger change event, therefore, trigger the validation process
                            }
                            else {
                                changeSelected(lastSelectedValue);
                            }
                        });
                };

                ngModelCtrl.$formatters.push(function (v) {
                    var value = v;
                    if ($scope.returnOptionObject) {
                        value = v ? v.value : undefined;
                    }
                    if (value !== lastSelectedValue) {
                        changeSelected(value);
                        lastSelectedValue = value;
                    }
                    return value;
                });
            }
        };
    }])
    .filter('propsFilter', function () {
        return function (items, props) {
            var out = [];

            if (angular.isArray(items)) {
                items.forEach(function (item) {
                    var itemMatches = false;

                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop]) {
                            if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                                itemMatches = true;
                                break;
                            }
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };
    });