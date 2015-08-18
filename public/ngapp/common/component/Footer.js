angular.module('common.component').directive('footer', ['$templateCache', function ($templateCache) {
    var defaultTmplUrl = 'template/common/component/footer.html';
    $templateCache.put(defaultTmplUrl,
        '<div class="container" style="text-align: center;border-top:1px solid grey">' +
        '   &copy; 2015' +
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
