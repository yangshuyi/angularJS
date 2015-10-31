'use strict';
angular.module('common.component').directive('header', ['$templateCache', function ($templateCache) {
    var defaultTmplUrl = 'template/common/component/header.html';
    $templateCache.put(defaultTmplUrl,
    '<div class="top-bar">'+
    '   <div class="container">'+
    '       <div class="row">'+
    '           <div class="col-sm-12 col-xs-12">'+
    '               <div class="search">'+
    '                   <form role="form">'+
    '                       <input type="text" class="form-control" autocomplete="off" placeholder="Search">'+
    '                       <span class="glyphicon glyphicon-search"></span>'+
    '                   </form>'+
    '               </div>'+
    '           </div>'+
    '       </div>'+
    '   </div>'+
    '</div>'+
    '<nav class="navbar navbar-inverse" role="banner">'+
    '    <div class="container">'+
    '       <div class="col-sm-3 col-xs-3 logo">'+
    '           <img src="images/logo.png" alt="logo">'+
    '       </div>'+
    '       <div class="col-sm-9 col-xs-9 navbar-right">'+
    '           <ul class="nav navbar-nav">'+
    '               <li ng-repeat="menu in menus" ng-mouseover="showSubMenu($event)" ng-mouseleave="hideSubMenu($event)">'+
    '                   <a ng-if="menu.menus==null" href="{{menu.url}}">{{menu.name}}</a>'+
    '                   <a ng-if="menu.menus!=null" data-toggle="dropdown" >{{menu.name}}</a>'+
    '                   <ul ng-if="menu.menus!=null" class="dropdown-menu" >'+
    '                       <li ng-repeat="subMenu in menu.menus"><a href="{{subMenu.url}}}">{{subMenu.name}}</a></li>'+
    '                   </ul>'+
    '               </li>'+
    '           </ul>'+
    '       </div>'+
    '   </div>'+
    '</nav>'
    );

    return {
        restrict: 'EA',
        replace: false,
        scope: {},
        link: function (scope, el, attrs, ngModelCtrl) {
            scope.showSubMenu = function($event) {
                $($event.currentTarget).addClass('open');
            };
            scope.hideSubMenu = function($event) {
                $($event.currentTarget).removeClass('open');
            };
            scope.menus = [
                {
                    id:1001,
                    name:'BSDemo',
                    url:'#bsdemo'
                },
                {
                    id:1002,
                    name:'Topic',
                    url:'#topic'
                },
                {
                    id:1003,
                    name:'Module3',
                    url:'#module3',
                    menus:[
                        {
                            id:1006,
                            name:'Module3.1',
                            url:'#module3'
                        },
                        {
                            id:1007,
                            name:'Module3.2',
                            url:'#module3'
                        }
                    ]
                },
                {
                    id:1004,
                    name:'Module4',
                    url:'#module4'
                },
                {
                    id:1005,
                    name:'Module5',
                    url:'#module5'
                }

            ];
        },
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || defaultTmplUrl;
        },
    };
}]);
