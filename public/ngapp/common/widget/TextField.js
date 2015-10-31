'use strict';
angular.module('common.widget').directive('textField', [function () {
    return {
        scope: {
            ngModel: '=',
            placeholder: '@'
        },
        link: function (scope, elem, attrs, ngModel) {

        },
        template: '<input type="text" value="{{value}}" placeholder="{{placeholder}}" class="form-control">'
    };
}])