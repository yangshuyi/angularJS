angular.module("common.component").factory("gridUtils", ["$timeout", '$window', function ($timeout, $window) {
    return {
        calcGridSize: function (gridHolderElement, definedGridHeight) {
            var gridDiv = gridHolderElement.parent().children('div');
            var headerTbl = gridDiv.find('.table-head');
            var footerTbl = gridDiv.find('.table-foot');
            var bodyTbl = gridDiv.find('.table-body');
            var bodyDiv = bodyTbl.parent();
            var headerCols = headerTbl.find("th");
            var bodyCols = bodyTbl.find("th");

            var availableGridHeight = 0;
            if (definedGridHeight > 0) {
                availableGridHeight = definedGridHeight;
            } else {
                //自动计算Body的高度
                var bodyHeight = $(document).outerHeight() > $(window).height() ? $(document).outerHeight() : $(document.body).outerHeight();
                availableGridHeight = $(window).height() - (bodyHeight - gridDiv.outerHeight());

                if (availableGridHeight <= 0) {
                    availableGridHeight = 200;
                }
            }
            //Grid Body 高度
            var bodyDivHeight = 0;
            if (footerTbl) {
                bodyDivHeight = availableGridHeight - headerTbl.outerHeight() - footerTbl.outerHeight() - 2;
            } else {
                bodyDivHeight = availableGridHeight - headerTbl.outerHeight() - 2;
            }
            var headerTblHeight = 0 - headerTbl.outerHeight();
            bodyTbl.css("margin-top", headerTblHeight);
            bodyDiv.height(bodyDivHeight);

            console.log('1');
            $timeout(function () {
                console.log('2');
                for (var colIdx = 0; colIdx < bodyCols.length; colIdx++) {
                    if (colIdx != bodyCols.length - 1) {
                        $(headerCols[colIdx]).width($(bodyCols[colIdx]).width());
                    } else {
                        //计算滚动条宽度
                        $(headerCols[colIdx]).width($(bodyCols[colIdx]).width() + (bodyDiv[0].offsetWidth - bodyDiv[0].clientWidth) + "px");
                    }
                }
                console.log('3');
            }, 0);
        },

        initDefaultSetting: function (columns) {
            var defaultColSetting = {
                displayName: '',
                field: '',
                sortable: false,
                sort: 'asc',
                resizable: false,
                cellTemplate: null,
                cellTemplateScope: null,
                headStyle: '',
                cellStyle: '',
                headColSpan: 1,
                hidden: false
            };

            _.forEach(columns, function (col) {
                col = angular.merge({}, col, defaultColSetting);
            });

            //处理隐藏列
            _.remove(columns, {hidden: true});
        },

        initHeadColSpan: function (columns) {
            var headerColSpan = 1;
            _.forEach(columns, function (col) {
                //处理ColSpan, ColSpan的列不支持排序
                if (headerColSpan > 1) {
                    //被之前的列融合
                    headerColSpan--;
                    col.headerColSpan = -1;
                } else {
                    //没有被之前的列融合
                    if (col.headerColSpan == null) {
                        col.headerColSpan = 1;
                    }
                    if (col.headerColSpan > 1) {
                        headerColSpan = col.headerColSpan;
                    }
                }
            });
        },

        buildColumnSort: function (currentCol, columns) {
            if (!currentCol.enableSorting) {
                return;
            }

            var COL_SORT_ASC = 'asc';
            var COL_SORT_DESC = 'desc';

            _.forEach(columns, function (col) {
                if (col == currentCol) {
                    if (col.sort == null || col.sort == COL_SORT_DESC) {
                        col.sort = COL_SORT_ASC;
                    } else {
                        col.sort = COL_SORT_DESC;
                    }
                } else {
                    col.sort = null;
                }
            });
        }
    };
}])
    .directive('compile', [
        '$compile',
        function ($compile) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    scope.cellTemplateScope = scope.$eval(attrs.cellTemplateScope);
                    // Watch for changes to expression.
                    scope.$watch(attrs.compile, function (new_val) {
                        var new_element = angular.element(new_val);
                        element.append(new_element);
                        $compile(new_element)(scope);
                    });
                }
            };
        }
    ]);