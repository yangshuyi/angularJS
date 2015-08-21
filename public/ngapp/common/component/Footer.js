'use strict';
angular.module('common.component').directive('footer', ['$templateCache', function ($templateCache) {
    var defaultTmplUrl = 'template/common/component/footer.html';
    $templateCache.put(defaultTmplUrl,
    '<div class="container">'+
    '    <div class="row">'+
    '       <div class="col-sm-6">&copy; 2013 <a target="_blank" href="{{url}}" title="{{footName}}">{{footName}}</a>. All Rights Reserved.</div>'+
    '       <div class="col-sm-6">'+
    '           <ul class="pull-right">'+
    '               <li><a href="#">Home</a></li>'+
    '               <li><a href="#">About Us</a></li>'+
    '               <li><a href="#">Faq</a></li>'+
    '               <li><a href="#">Contact Us</a></li>'+
    '           </ul>'+
    '       </div>'+
    '   </div>'+
    '</div>'
    );

    return {
        restrict: 'EA',
        replace: false,
        scope: {},
        link: function (scope, el, attrs, ngModelCtrl) {
            scope.url='http://shapebootstrap.net/';
            scope.footName='Free Twitter Bootstrap WordPress Themes and HTML templates'
        },
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || defaultTmplUrl;
        },
    };
}]);
