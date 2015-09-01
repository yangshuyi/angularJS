'use strict';
angular.module("common.easyui").directive("easyPanel", ['$templateCache', function ($templateCache) {
    var defaultTmplUrl = 'template/common/easyui/Panel.html';
    $templateCache.put(defaultTmplUrl,
        '<div style="{{panelStyle}};width:{{width}};height:{{height}};" class="panel panel-default" class="{{panelCls}}">' +
        '   <div ng-if="!noHeader" class="panel-heading" class="{{headCls}}" style="display:flex;">' +
        '       <div style="flex:1">{{title}}</div>' +
        '       <div>' +
        '           <span ng-if="collapsible" ng-click="toggle()" ng-class="{true:\'glyphicon glyphicon-triangle-top\',false:\'glyphicon glyphicon-triangle-bottom\'}[collapsed]" style="cursor: pointer"/>' +
        '       </div>' +
        '   </div>' +
        '   <div class="panel-body" class="{{bodyCls}}" style="{{bodyStyle}};overflow: auto;" ng-show="!collapsed">' +
        '       <div ng-transclude/>' +
        '   </div>' +
        '</div>'
    );

    return {
        restrict: 'EA',
        scope: {
            title: '@',
            header: '=', //The panel header
            collapsible: '@',  //Defines if to show collapsible button.
            collapsed: '@', //Defines if the panel is collapsed at initialization.
            panelCls: '@',  //Add a CSS class to the panel.
            headCls: '@',  //Add a CSS class to the panel header.
            bodyCls: '@', //Add a CSS class to the panel body.
            bodyStyle: '@',
            panelStyle: '@',  //Add a custom specification style to the panel.
            noHeader: '@' //If set to true, the panel header will not be created.
        },
        replace: false,
        transclude: true,
        controller: function ($scope, $element) {
        },
        link: function ($scope, $elem, attrs) {
            //Options
            if (!attrs.title) {
                attrs.$set('title', '');
            }
            if (!attrs.noHeader) {
                attrs.$set('noHeader', false);
            }
            if (!attrs.collapsible) {
                attrs.$set('collapsible', true);
            }
            if (!attrs.collapsed) {
                attrs.$set('collapsed', false);
            }
            if (!attrs.panelCls) {
                attrs.$set('panelCls', '');
            }
            if (!attrs.headCls) {
                attrs.$set('headCls', '');
            }

            if (!attrs.bodyCls) {
                attrs.$set('bodyCls', '');
            }
            if (!attrs.bodyStyle) {
                attrs.$set('bodyStyle', '');
            }
            if (!attrs.panelStyle) {
                attrs.$set('panelStyle', '');
            }

            if (!attrs.height) {
                attrs.$set('height', '300px');
            }
            if (!attrs.width) {
                attrs.$set('width', '100%');

            }

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
        templateUrl: defaultTmplUrl
    };
}]);