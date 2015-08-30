'use strict';
angular.module("common.easyui").directive("easyDialog", ['$templateCache','$compile', function ($templateCache,$compile) {
    var defaultTmplUrl = 'template/common/easyui/Dialog.html';
    $templateCache.put(defaultTmplUrl,
        '<div ng-show="isVisible" style="{{style}}" class="panel panel-default" class="{{panelCls}}">' +
        '   <div ng-mousedown="headMouseDown($event)" class="panel-heading" class="{{headCls}}" style="display:flex;">' +
        '       <div style="flex:1">{{title}}</div>' +
        '       <div>' +
        '           <span ng-if="collapsible?collapsible:true" ng-click="toggle()" ng-class="{true:\'glyphicon glyphicon-triangle-top\',false:\'glyphicon glyphicon-triangle-bottom\'}[collapsed===undefined?false:collapsed]" style="cursor: pointer;"/>' +
        '           <span ng-if="closable?closable:true" ng-click="close()" class="glyphicon glyphicon-remove" style="cursor: pointer;"/>' +
        '       </div>' +
        '   </div>' +
        '   <div class="panel-body" class="{{bodyCls}}" style="{{bodyStyle}};overflow: auto;" ng-show="collapsed===undefined?true:!collapsed">' +
        '       <div ng-transclude>/' +
        '   </div>' +
        '</div>'
    );

    return {
        restrict: 'EA',
        scope: {
            title: '@',
            header: '=', //The panel header
            collapsible: '=',  //Defines if to show collapsible button.
            collapsed: '=', //Defines if the panel is collapsed at initialization.
            closable:'=',
            destoryOnClose: '@',
            panelCls: '@',  //Add a CSS class to the panel.
            headCls: '@',  //Add a CSS class to the panel header.
            bodyCls: '@', //Add a CSS class to the panel body.
            bodyStyle: '@',
            style: '@',  //Add a custom specification style to the panel.

            open:'&',
            close:'&'
        },
        replace: false,
        transclude: true,
        controller: function ($scope, $element) {
            console.log($scope);
        },
        link: function ($scope, $element, attrs) {
            $element.css('position','absolute');
            $scope.dragging = false;
            $scope.isVisible = true;

            $scope.diviation={x:0,y:0};
            $scope.mouseMoveHandler = null;
            $scope.mouseUpHandler = null;
            if(!$scope.autoOpen){
                $scope.isVisible = false;
            }



            //public method
            $scope.headMouseDown = function($event){
                $scope.headMouseUp();

                $scope.dragging = true;

                var headEle = $('.panel-heading', $element);
                headEle.css({'cursor':'move'});
                //设置捕获范围
                if(headEle.setCapture){
                    headEle.setCapture();
                }

                $scope.diviation.x = $event.pageX - $element.offset().left;
                $scope.diviation.y = $event.pageY - $element.offset().top;

                $scope.mouseMoveHandler = $(window).bind('mousemove', function($event){
                    $scope.headMouseMove($event);
                });

                $scope.mouseUpHandler = $(window).bind('mouseup', function($event){
                    $scope.headMouseUp($event);
                })
            };

            $scope.headMouseMove = function($event){
                if(!$scope.dragging){
                    return;
                }

                $element.css('left',$event.pageX - $scope.diviation.x + 'px');
                $element.css('top',$event.pageY - $scope.diviation.y + 'px');
            };

            $scope.headMouseUp = function(){
                $scope.dragging = false;

                var headEle = $('.panel-heading', $element);
                headEle.css({'cursor':'auto'});

                if($scope.mouseMoveHandler!=null){
                    $(window).unbind('mousemove', $scope.mouseMoveHandler);
                    $scope.mouseMoveHandler = null;
                }
                if($scope.mouseUpHandler!=null){
                    $(window).unbind('mouseup', $scope.mouseUpHandler);
                    $scope.mouseUpHandler = null;
                }

                //取消捕获范围
                if(headEle.releaseCapture){
                    headEle.releaseCapture();
                }
            };

            $scope.toggle = function () {
                if ($scope.collapsed) {
                    $scope.expand();
                } else {
                    $scope.collapse();
                }
            };

            $scope.expand = function () {
                $scope.collapsed = false;
            };

            $scope.collapse = function () {
                $scope.collapsed = true;
            };

            $scope.collapseFlag = function () {
                if (typeof  $scope.collapsed === 'undefined') {
                    $scope.collapsed = false;
                }
                return $scope.collapsed;
            };

            $scope.open = function(){
                $scope.isVisible = true;

                if($element.parent()==null){
                    alert('error');
                }
            }

            $scope.close = function(){
                $scope.isVisible = false;

                if($scope.destroyOnClose){
                    $element.remove();
                }
            }

        },
        templateUrl: function (element, attrs) {
            return defaultTmplUrl;
        }
    };
}]);