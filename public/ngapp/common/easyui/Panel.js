'use strict';
angular.module("common.easyui").directive("easyPanel", function () {
    return {
        restrict: 'E',
        scope: {
            title: '@',
            header: '=', //The panel header
            collapsible: '=',  //Defines if to show collapsible button.
            collapsed: '=', //Defines if the panel is collapsed at initialization.
            panelCls: '@',  //Add a CSS class to the panel.
            headCls: '@',  //Add a CSS class to the panel header.
            bodyCls: '@', //Add a CSS class to the panel body.
            bodyStyle: '@',
            style: '@',  //Add a custom specification style to the panel.
            noHeader: '@' //If set to true, the panel header will not be created.
        },
        replace: false,
        transclude: true,
        controller: function ($scope, $element) {
        },
        link: function ($scope, $elem, attrs) {
            //public method
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
        },
        template: '' +
        '<div style="{{style}}" class="panel panel-default" class="{{panelCls}}">' +
        '   <div ng-if="!noHeader || true" class="panel-heading" class="{{headCls}}" style="display:flex;">' +
        '       <div style="flex:1">{{title}}</div>' +
        '       <div>' +
        '           <span ng-if="collapsible || true" ng-click="toggle()" ng-class="{true:\'glyphicon glyphicon-triangle-top\',false:\'glyphicon glyphicon-triangle-bottom\'}[collapsed===undefined?false:collapsed]"/>' +
        '       </div>' +
        '   </div>' +
        '   <div class="panel-body" class="{{bodyCls}}" style="{{bodyStyle}};overflow: auto;" ng-show="collapsed===undefined?true:!collapsed">' +
        '       <div ng-transclude>/' +
        '   </div>' +
        '</div>'
    };
})