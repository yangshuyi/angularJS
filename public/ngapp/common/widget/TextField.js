'use strict';
angular.module('common.widget').directive('textField', [function () {
    return {
        scope: {
            value: '='
        },
        link: function (scope, elem, attrs, ngModel) {

        },
        template: '<input type="text" value="{{value}}">'
    };
}])