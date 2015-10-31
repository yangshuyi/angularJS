app.directive('customInclude', ['$http', '$compile', '$timeout', customInclude]);
function customInclude($http, $compile, $timeout) {
    return {
        restrict: 'A',
        link: function link($scope, elem, attrs) {
            //if url is not empty
            if (attrs.url) {
                $http({ method: 'GET', url: attrs.url, cache: true }).then(function (result) {
                    elem.append($compile(angular.element(result.data))($scope));
                    //after sometime we add width and height of modal
                    $timeout(function () {
                        //write your own code
                    }, 1, false);
                });
            }
        }
    };
}