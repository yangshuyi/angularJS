angular.module('common.component').directive('header', ['$templateCache', function ($templateCache) {
    var defaultTmplUrl = 'template/common/component/header.html';
    $templateCache.put(defaultTmplUrl,
        '<div class="row" style="background: black;height:60px; line-height: 60px; text-align: center;">'+
        '   <div class="col-xs-1"></div>'+
        '   <div class="col-xs-2">'+
        '       <div style="color:white;"> DRP </div>'+
        '   </div>'+
        '   <div class="col-xs-1"></div>'+
        '   <div class="col-xs-5">' +
        '           <ul class="nav nav-pills">'+
    '<li role="presentation" class="active"><a href="#">Home</a></li>'+
    '<li role="presentation"><a href="#">Profile</a></li>'+
    '<li role="presentation"><a href="#">Messages</a></li>'+
    '</ul>'+

    '   </div>'+
        '   <div class="col-xs-1"></div>'+
        '</div>');

    return {
        restrict: 'EA',
        replace: false,
        scope: {},
        link: function (scope, el, attrs, ngModelCtrl) {

        },
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || defaultTmplUrl;
        },
    };
}]);
