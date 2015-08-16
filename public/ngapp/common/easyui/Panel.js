'use strict';
angular
    .module("common.easyui")
    .directive("easyPanel", function () {
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
                style: '@',  //Add a custom specification style to the panel.
                noHeader: '@' //If set to true, the panel header will not be created.
            },
            replace: false,
            transclude: true,
            controller: function($scope, $element){
                $element.attr('head-cls','panel-heading');
            },
            link: function ($scope, $elem, attrs) {
                console.log('EasyPanel');
                //init
                $scope.title = 'aaa';
                $scope.header = $scope.header || null;
                $scope.collapsible = $scope.collapsible || true;
                $scope.collapsed = $scope.collapsed || false;
                $scope.panelCls = $scope.panelCls || 'panel panel-default';
                $scope.headCls = $scope.headCls || 'panel-heading';
                attrs['body-cls'] = attrs['body-cls'] || 'panel-body';
                $scope.style = $scope.style || '';
                $scope.noHeader = $scope.noHeader || false;

                //public method
                $scope.toggle = function () {
                    if ($scope.collapsed) {
                        $scope.expand();
                    } else {
                        $scope.collapse();
                    }
                }

                $scope.expand = function () {
                    $scope.collapsed = false;
                }

                $scope.collapse = function () {
                    $scope.collapsed = true;
                }
            }
            ,
            template: '' +
            '<div style="{{style}}" class="{{panelCls}}">' +
            '   <div class="{{headCls}}" style="display:flex;">' +
            '       <div style="flex:1">{{title}}</div>' +
            '       <div>' +
            '           <span ng-if="collapsible" ng-click="toggle()" ng-class="{true:\'glyphicon glyphicon-triangle-top\',false:\'glyphicon glyphicon-triangle-bottom\'}[collapsed]"/>' +
            '       </div>' +
            '   </div>' +
            '   <div class="{{bodyCls}}" ng-show="!collapsed">' +
            '       <div ng-transclude>/' +
            '   </div>' +
            '</div>'
            ,
        }
    })