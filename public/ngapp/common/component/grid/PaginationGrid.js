'use strict';
angular.module('common.component').directive('paginationGrid', ['$timeout', '$window', '$templateCache', 'gridUtils', function ($timeout, $window, $templateCache, gridUtils) {
    var TEMPLATE_PAGINATION_GRID = 'template/common/component/grid/PaginationGrid.html';

    var GRID_PAGINATION_PART_HEAD =
        "       <thead>" +
        "           <tr>" +
        "               <th ng-if='hasRowCheckbox()' class='grid-checkbox-cell'>" +
        "                   <input type='checkbox' ng-click='checkAllRows(checkAllFlag)' ng-checked='checkAllFlag'>" +
        "               </th>" +
        "               <th ng-repeat='col in ::columns' ng-if='col.headerColSpan>0' colspan = '{{col.headerColSpan}}' ng-class='col.enableSorting ? \"sortable-head\" : \"\"' style='{{col.headStyle}}' ng-click='sortData(col, columns)'>" +
        "                   <div ng-if='col.headTemplate' compile='col.headTemplate' cell-template-scope='col.headTemplateScope'></div>" +
        "                   <div ng-if='!col.headTemplate' style='display:inline;'>{{::col.displayName||col.field}}</div>" +
        "                   <div ng-if='col.sort == \"asc\"' style='display:inline;'><i class='glyphicon' ng-class='\"glyphicon glyphicon-triangle-bottom\"'></i></div>" +
        "                   <div ng-if='col.sort == \"desc\"' style='display:inline;'><i class='glyphicon' ng-class='\"glyphicon glyphicon-triangle-top\"'></i></div>" +
        "               </th>" +
        "           </tr>" +
        "       </thead>";

    var GRID_PAGINATION_PART_BODY =
        "       <tbody>" +
        "           <tr ng-repeat='row in ::ngModel.data' ng-click='rowClick(row)' ng-dblclick='rowDblClick(row)' ng-class='row.$selected?\"grid-row-selected\":\"\"' >" +
        "               <td ng-if='hasRowCheckbox()' class='grid-checkbox-cell'><input type='checkbox' ng-click='rowCheck(row)' ng-checked='col.checked'></td>" +
        "               <td ng-repeat='col in columns' style='{{col.cellStyle}}'>" +
        "                   <div ng-if='col.cellTemplate' compile='col.cellTemplate' cell-template-scope='col.cellTemplateScope'></div>" +
        "                   <div ng-if='!col.cellTemplate' title='{{::row[col.field]}}'>{{::row[col.field]}}</div>" +
        "               </td>" +
        "           </tr>" +
        "           <tr ng-if='ngModel.data == null || ngModel.data.length == 0'>" +
        "               <td colspan='{{getVisibleColumnCount()}}' class='no-data'>{{noDataMessage}}</td>" +
        "           </tr>" +
        "       </tbody>";

    var GRID_PAGINATION_PART_FOOT =
        "       <tfoot>" +
        "           <tr>" +
        "               <td colspan='{{getVisibleColumnCount()}}'>" +
        "                   <div></div>" +
        "               </td>" +
        "           </tr>" +
        "       </tfoot>";

    var GRID_PAGINATION_STRUCTURE =
        "<div class='table-responsive table-bordered pagination-grid' style='overflow-x:hidden;'>" +
        "   <table class='table table-head table-bordered table-hover table-striped' style='margin-bottom:0px; width:auto;'>" +
        GRID_PAGINATION_PART_HEAD +
        "   </table>" +
        "   <div style='overflow-y:auto;'>" +
        "   <table class='table table-body table-bordered table-hover table-striped' style='margin-bottom:0px;'>" +
        GRID_PAGINATION_PART_HEAD +
        GRID_PAGINATION_PART_BODY +
        "   </table>" +
        "   </div>" +
        "   <table class='table table-foot table-bordered table-hover table-striped' style='margin-bottom:0px;'>" + GRID_PAGINATION_PART_FOOT + "</table>" +
        "</div>";

    $templateCache.put(TEMPLATE_PAGINATION_GRID, GRID_PAGINATION_STRUCTURE);

    return {
        restrict: 'E',
        replace: true,
        scope: {
            gridId: '@',
            checkOnSelect: '@',
            selectOnCheck: '@',
            noDataMessage: '@',
            options: '=',
            columns: '=',
            ngModel: '=',

            onLoad:'&',
            onPaginationChange: '&',
            onRowCheck: '&',
            onRowClick: '&',
            onRowSelect: '&',
            onRowDblClick: '&',
            onCellClick: '&',
            onSortChanged: '&',

            api: '='
        },
        require: 'ngModel',
        link: function ($scope, element, attrs, ngModelCtrl) {
            //Options
            if (!attrs.gridId) {
                attrs.$set('gridId', 'easy-grid-pagination_' + (new Date()).getTime());
            }

            if (!attrs.singleSelect) {
                attrs.$set('singleSelect', false);
            }

            if (!attrs.checkOnSelect) {
                attrs.$set('checkOnSelect', false);
            }

            if (!attrs.selectOnCheck) {
                attrs.$set('selectOnCheck', false);
            }

            if (!attrs.noDataMessage) {
                attrs.$set('noDataMessage', '没有找到匹配的结果。');
            }
            //
            //if (!attrs.columns) {
            //    attrs.$set('columns', '[]');
            //}

            $scope.columns = $scope.columns || [];
            $scope.api = $scope.api || {};


            /*** BEGIN ***/

            $scope.sortData = function (currentCol, columns) {
                gridUtils.buildColumnSort(currentCol, columns);

                if ($scope.onSortChanged) {
                    $scope.onSortChanged($scope.options.currentPage, $scope.options.paginationPageSize, currentCol.field, currentCol.sort);
                }
            }

            $scope.getCheckedRows = function () {
                var checkedRows = _.filter($scope.ngModel.data, {$checked:true});
                return checkedRows;
            }

            $scope.hasRowCheckbox = function () {
                return $scope.selectOnCheck || $scope.checkOnSelect;
            }

            $scope.getVisibleColumnCount = function () {
                var visibleColumnCount = $scope.hasRowCheckbox() ? $scope.columns.length + 1 : $scope.columns.length;
                return visibleColumnCount;
            }

            $scope.checkAllRows = function (isCheckAllRows) {
                _.forEach($scope.ngModel.data, function(row){
                    $scope.rowCheck(row, isCheckAllRows);
                });
            };

            $scope.rowCheck = function (checkedRow, defaultValue) {
                var uncheckedRow = _.filter($scope.ngModel.data, {$checked:false});

                $scope.checkAllFlag = uncheckedRow.length===0;

                $scope.onRowCheck(checkedRow, checkedRow.$checked);

                if($scope.selectOnCheck && checkedRow.$checked){
                    $scope.rowSelect(checkedRow);
                }
            };

            $scope.rowClick = function (clickedRow) {
                $scope.onRowClick(clickedRow);

                $scope.rowSelect(clickedRow);
            }

            $scope.rowSelect = function (selectedRow) {
                var previousSelectedRow = _.filter($scope.ngModel.data, {$selected:true});
                if(previousSelectedRow!=null){
                    if(previousSelectedRow != selectedRow){
                        previousSelectedRow.$selected = false;
                        $scope.onRowSelect(selectedRow, false);

                        selectedRow.$selected = true;
                    }else{
                        return;
                    }
                }else{
                    selectedRow.$selected = true;
                }

                $scope.onRowSelect(selectedRow, true);

                if($scope.selectOnCheck){
                    $scope.rowCheck(selectedRow, true);
                }
            }

            $scope.rowDblClick = function (row) {
                $scope.onRowDblClick(row);
            }

            $scope.cellClick = function(row, field, value){
                $scope.onCellClick(row, field, value);
            }

            $scope.calcGridSize = function (gridHeight) {
                $timeout(function () {
                    var definedGridHeight = 0;
                    if ($scope.appScope != null && $scope.appScope.getGridHeight != null) {
                        definedGridHeight = $scope.appScope.getGridHeight($scope.gridId);
                    }

                    var gridHolderElement = element.parent().children('div');
                    gridUtils.calcGridSize(gridHolderElement, definedGridHeight);
                }, 0);
            };

            /*** api ***/
            $scope.api.getCheckedRows = function () {
                return $scope.getCheckedRows();
            };


            $scope.api.forceCalcGridSize = function () {
                $scope.calcGridSize();
            };


            /*** init ***/
            var init = function () {
                $scope.appScope = $scope.$parent;
                $scope.totalItems = 0;
                $scope.checkAllFlag = false;

                //initColumns
                gridUtils.initDefaultSetting($scope.columns);
                gridUtils.initHeadColSpan($scope.columns);


                //用于当用户输入时，触发该pipeline，可以来修改model
                ngModelCtrl.$parsers.push( function(){

                });


                //用于当model修改时，触发该pipeline，来修改directive的展现
                ngModelCtrl.$formatters.push( function(){

                    $scope.calcGridSize();
                });

                $(window).resize(function (e) {
                    if (e.target != window) {
                        //避免jQueryUI dialog的resize
                        return;
                    }
                    $scope.calcGridSize();
                });

                $scope.onLoad();
            };

            init();
        },
        templateUrl: function (element, attrs) {
            return TEMPLATE_PAGINATION_GRID;
        },
    };
}])
    .directive('pagedGridBar', function () {
        return {
            restrict: 'A',
            link: function link(scope, el, attrs) {
                scope.options.currentPage = 1;
                scope.options.currentGroup = 0;


                scope.$watch('options.totalItems', function (data) {
                    pageChange();
                }, true);

                scope.$watch('options.paginationPageSize', function (data) {
                    scope.options.currentPage = 1;
                    scope.options.currentGroup = 0;
                    scope.paged(scope.options.currentPage);
                    pageChange();
                }, true);

                var pageChange = function () {
                    scope.options.paginationPageSizes = scope.options.paginationPageSizes || [10, 25, 50];
                    scope.options.paginationPageSize = scope.options.paginationPageSize || 10;
                    scope.options.totalItems = scope.options.totalItems || 0;
                    var maxSize = scope.options.totalItems / scope.options.paginationPageSize;
                    if (parseInt(maxSize) == maxSize) {
                        scope.maxNum = parseInt(maxSize);
                    } else {
                        scope.maxNum = parseInt(maxSize) + 1;
                    }
                    /*console.log('scope.maxNum is ' + scope.maxNum)*/
                    var numArray = [], itemArray = [], groupId = 0, itemId = 1, loopId = 1;
                    while (itemId <= scope.maxNum) {
                        itemArray.push(itemId++);
                        loopId++;
                        if (itemId > scope.maxNum) {
                            numArray.push(itemArray);
                        } else {
                            if (loopId == 11) {
                                groupId++;
                                loopId = 1;
                                numArray.push(itemArray);
                                itemArray = [];
                            }
                        }
                    }
                    scope.maxGroup = groupId;
                    scope.pageNums = numArray;
                    scope.itemNumberStart = function () {
                        if (scope.options.totalItems == 0) {
                            return 0;
                        }
                        return (scope.options.currentPage - 1) * scope.options.paginationPageSize + 1;
                    }
                    scope.itemNumberEnd = function () {
                        var endNum = (scope.options.currentPage - 1) * scope.options.paginationPageSize + scope.options.paginationPageSize;
                        if (endNum > scope.options.totalItems) {
                            return scope.options.totalItems;
                        } else {
                            return endNum;
                        }
                    }
                    scope.paged = function (pageNum) {
                        scope.options.currentPage = pageNum;
                        if (!angular.isUndefined(scope.onPaginationChange)) {
                            scope.onPaginationChange(scope.options.currentPage, scope.options.paginationPageSize);
                        }
                    }
                    var getGroup = function (page) {
                        var returnGroup = 0, group = 0;
                        _.forEach(scope.pageNums, function (groups) {
                            if (_.includes(groups, page)) {
                                returnGroup = group;
                            }
                            group++;
                        });
                        return returnGroup;
                    }
                    scope.previous = function () {
                        scope.options.currentPage--;
                        scope.options.currentGroup = getGroup(scope.options.currentPage);
                        scope.paged(scope.options.currentPage);
                    }
                    scope.next = function () {
                        scope.options.currentPage++;
                        scope.options.currentGroup = getGroup(scope.options.currentPage);
                        scope.paged(scope.options.currentPage);
                    }
                    scope.first = function () {
                        scope.options.currentGroup = 0;
                        scope.paged(1);
                    }
                    scope.last = function () {
                        /*scope.options.currentPage = scope.maxNum;*/
                        scope.options.currentGroup = scope.maxGroup;
                        scope.paged(scope.maxNum);
                    }
                    scope.nextGroup = function () {
                        scope.options.currentGroup++;
                        scope.paged(scope.options.currentGroup * 10 + 1);
                    }
                    scope.previousGroup = function () {
                        scope.paged(scope.options.currentGroup * 10);
                        scope.options.currentGroup--;
                    }
                };
            },
            template: '<div class="grid-page-bar">' +
            '   <a href="javascript:void(0)" class="glyphicon glyphicon-step-backward paged-grid-ctrl-link paged-grid-link" ng-click="first()" ng-class="ngModel.pagination.currentPage==1?\'not-active\':\'\'"></a>' +
            '   <a href="javascript:void(0)" class="glyphicon glyphicon-triangle-left paged-grid-ctrl-link2 paged-grid-link" ng-click="previous()" ng-class="ngModel.pagination.currentPage==1?\'not-active\':\'\'"></a>' +
            '   <a href="javascript:void(0)" class="paged-grid-num-link paged-grid-link" ng-if="options.currentGroup > 0" ng-click="previousGroup()">...</a>' +
            '   <a href="javascript:void(0)" class="paged-grid-num-link paged-grid-link" ng-repeat="pageNum in pageNums[options.currentGroup]" ng-click="paged(pageNum)" ng-class="pageNum == options.currentPage ? \'paged-grid-link-active\' : \'\'">{{pageNum}}</a>' +
            '   <a href="javascript:void(0)" class="paged-grid-num-link paged-grid-link" ng-if="options.currentGroup < maxGroup" ng-click="nextGroup()">...</a>' +
            '   <a href="javascript:void(0)" class="glyphicon glyphicon-triangle-right paged-grid-ctrl-link3 paged-grid-link" ng-click="next()" ng-class="(options.currentPage == maxNum || maxNum == 0)?\'not-active\':\'\'"></a>' +
            '   <a href="javascript:void(0)" class="glyphicon glyphicon-step-forward paged-grid-ctrl-link paged-grid-link" ng-click="last()" ng-class="(options.currentPage==maxNum || maxNum == 0)?\'not-active\':\'\'"></a>' +
            '   <span class="data-count-desc">当前 {{itemNumberStart()}} - {{itemNumberEnd()}} 条，总共 {{options.totalItems}} 条</span>' +
            '    <div class="pull-right paged-display-list">' +
            '   <span>每页显示</span>' +
            '        <select ng-model="options.paginationPageSize" ng-options="di for di in options.paginationPageSizes"></select>' +
            '    </div>' +
            '</div>'
        };
    });