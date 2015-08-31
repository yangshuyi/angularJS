'use strict';
angular.module('common.component').directive('paginationGrid', ['$timeout', '$window', '$templateCache', 'gridUtils', function ($timeout, $window, $templateCache, gridUtils) {
    var TEMPLATE_PAGINATION_GRID = 'template/common/component/grid/PaginationGrid.html';

    var GRID_PAGINATION_PART_HEAD =
        "       <thead>" +
        "           <tr>" +
        "               <th ng-if='showRowCheckbox()' class='grid-checkbox-cell'>" +
        "                   <input type='checkbox' ng-click='selectAll(isSelectAll)' ng-model='isSelectAll' ng-checked='selectAllFlag'>" +
        "               </th>" +
        "               <th ng-repeat='col in options.columns' ng-if='col.headerColSpan>0' colspan = '{{col.headerColSpan}}' ng-class='col.enableSorting ? \"sortable-head\" : \"\"' style='{{col.headStyle}}' ng-click='sortData(col, columns)'>" +
        "                   <div ng-if='col.headTemplate' compile='col.headTemplate' cell-template-scope='col.headTemplateScope'></div>" +
        "                   <div ng-if='!col.headTemplate' style='display:inline;'>{{col.headTemplate || col.displayName || col.field}}</div>" +
        "                   <div ng-if='col.sort == \"asc\"' style='display:inline;'><i class='glyphicon' ng-class='\"glyphicon glyphicon-triangle-bottom\"'></i></div>" +
        "                   <div ng-if='col.sort == \"desc\"' style='display:inline;'><i class='glyphicon' ng-class='\"glyphicon glyphicon-triangle-top\"'></i></div>" +
        "               </th>" +
        "           </tr>" +
        "       </thead>";

    var GRID_PAGINATION_PART_BODY =
        "       <tbody>" +
        "           <tr ng-repeat='row in options.data' ng-dblclick='rowDoubleClick(item)' ng-class='row.rowHighlight ? \"row-highlight\" : \"\"' ng-click='rowSelect(row)'>" +
        "               <td ng-if='showRowCheckbox()' class='grid-checkbox-cell'><input type='checkbox' ng-model='row.selection' class='childChk' ng-click='rowCheck(row)'></td>" +
        "               <td ng-repeat='col in options.columns' style='{{col.cellStyle}}'>" +
        "                   <div ng-if='col.cellTemplate' compile='col.cellTemplate' cell-template-scope='col.cellTemplateScope'></div>" +
        "                   <div ng-if='!col.cellTemplate' title='{{ row[col.field] }}'>{{ col.filter ? $filter(col.filter)(item[col.field]) : item[col.field] }}</div>" +
        "               </td>" +
        "           </tr>" +
        "           <tr ng-if='options.data == null || options.data.length == 0'>" +
        "               <td colspan='{{columnNumber}}' class='no-data'>{{options.noDataMessage}}</td>" +
        "           </tr>" +
        "       </tbody>";

    var GRID_PAGINATION_PART_FOOT =
        "       <tfoot>" +
        "           <tr>" +
        "               <td colspan='{{columnNumber}}'>" +
        "                   <div paged-grid-bar></div>" +
        "               </td>" +
        "           </tr>" +
        "       </tfoot>"

    var GRID_PAGINATION_STRUCTURE =
        "<div class='table-responsive table-bordered bs-grid' style='overflow-x:hidden;'>" +
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
            options: '=',
            onPaginationChange: '=',
            onRowDoubleClick: '&',
            onRowCheck: '&',
            onRowSelect: '&',
            onSortChanged: '&'
        },
        link: function (scope, element, attrs) {
            scope.appScope = scope.$parent;
            scope.totalItems = 0;

            scope.options.noDataMessage = scope.options.noDataMessage || '没有找到匹配的结果。';

            scope.options.onDoubleClick = scope.options.onDoubleClick || null;

            scope.selectAllFlag = false;


            if (scope.options.enableRowSelection) {
                scope.columnNumber = scope.options.columnDefs.length + 1; //FIXME it remove the hidden column and selection function.
            } else {
                scope.columnNumber = scope.options.columnDefs.length;
            }
            //处理ColSpan,
            var initColumns = function (columns) {
                gridUtils.initDefaultSetting(columns);
                gridUtils.initHeadColSpan(columns);
            }

            initColumns(scope.columns);

            /*** BEGIN ***/
            scope.selectAll = function (isSelectAll) {
                var rows = scope.options.data;
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    row.selection = isSelectAll;
                }
                scope.selectAllFlag = isSelectAll;
            };

            scope.checkRow = function (row) {
                if (scope.onSelect) {
                    scope.onSelect(row);
                }
                //checkbox的全选和全不选的问题
                var uncheckedRow = _.find(scope.options.data, function (row) {
                    return row.selection === false || row.selection == null;
                });
                scope.selectAllFlag = (uncheckedRow == null);
            };

            scope.selectRow = function (row) {
                if (scope.onSelect) {
                    scope.onSelect(row);
                }
                //checkbox的全选和全不选的问题
                var uncheckedRow = _.find(scope.options.data, function (row) {
                    return row.selection === false || row.selection == null;
                });
                scope.selectAllFlag = (uncheckedRow == null);
            };

            scope.sortData = function (currentCol, columns) {
                gridUtils.buildColumnSort(currentCol, columns);

                if (scope.onSortChanged) {
                    scope.onSortChanged(scope.options.currentPage, scope.options.paginationPageSize, currentCol.field, currentCol.sort);
                }
            }
            /*** END ***/




            var init = function (col, columns) {
                _.forEach(columns, function (otherCol) {
                    if (col.field != otherCol.field) {

                        otherCol.sort = null;
                    }
                });
            }

            scope.getSelectedRows = function () {
                var selectedRows = [];
                _.forEach(scope.options.data, function (item) {
                    if (item.selection) {
                        selectedRows.push(item);
                    }
                });
                return selectedRows;
            }

            // init explore api
            if (scope.options.onRegisterApi) {
                scope.options.onRegisterApi({
                    getSelectedRows: function () {
                        return scope.getSelectedRows();
                    },
                    setGridData: function (gridData, totalrecord) {
                        scope.options.data = gridData;
                        scope.dataBackup = angular.copy(scope.options.data);
                        scope.options.totalItems = totalrecord;

                        $timeout(function () {
                            if (scope.options.fixedHeight) {
                                scope.calcGridSize(scope.options.fixedHeight);
                            } else {
                                scope.calcGridSize();
                            }
                        }, 0);

                    },
                    forceCalcGridSize: function () {
                        scope.calcGridSize();
                    },
                });
            }

            scope.showRowCheckbox = function () {
                return scope.selectOnCheck || scope.checkOnSelect;
            }

            scope.getVisibleColumnCount = function () {
                return scope.showRowCheckbox() ? scope.options.columns + 1 : scope.options.columns;
            }

            scope.rowCheck = function (row) {
                scope.onRowCheck(row);
            }

            scope.rowSelect = function (row) {

                scope.onRowSelect(row);
            }

            scope.rowDoubleClick = function (row) {
                scope.onRowDoubleClick(row);
            }

            scope.calcGridSize = function (gridHeight) {
                $timeout(function () {
                    var definedGridHeight = 0;
                    if (scope.appScope != null && scope.appScope.getGridHeight != null) {
                        definedGridHeight = scope.appScope.getGridHeight(scope.gridId);
                    }

                    var gridHolderElement = element.parent().children('div');
                    gridUtils.calcGridSize(gridHolderElement, definedGridHeight);
                }, 0);
            };

            scope.getTemplate = function () {
                return TEMPLATE_PAGINATION_GRID;
            };

            //如果是FixedGrid,需要计算GridSize，并监听resize事件
            scope.calcGridSize();

            $(window).resize(function (e) {
                if (e.target != window) {
                    //避免jQueryUI dialog的resize
                    return;
                }
                scope.calcGridSize();
            });
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
            '   <a href="javascript:void(0)" class="glyphicon glyphicon-step-backward paged-grid-ctrl-link paged-grid-link" ng-click="first()" ng-class="options.currentPage==1?\'not-active\':\'\'"></a>' +
            '   <a href="javascript:void(0)" class="glyphicon glyphicon-triangle-left paged-grid-ctrl-link2 paged-grid-link" ng-click="previous()" ng-class="options.currentPage==1?\'not-active\':\'\'"></a>' +
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