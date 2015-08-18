angular.module('common.component').directive('header', ['$templateCache', function ($templateCache) {
    var defaultTmplUrl = 'template/common/component/header.html';
    $templateCache.put(defaultTmplUrl,
        '<div class="row">' +
        '   <div class="col-12" style="background: pink">Header</div>' +
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
