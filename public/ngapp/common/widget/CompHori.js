'use strict';
angular.module("common.widget").directive("compHori", function () {
    return {
        restrict: 'EA',
        scope: {
            style: '@',  //Add a custom specification style to the panel.
            caption:'@',
            captionWidth:'@',
            captionAlign:'@'
        },
        replace: false,
        transclude: true,
        controller: function ($scope, $element) {
        },
        link: function ($scope, $elem, attrs) {
            //public method

        },
        template: '' +
        '<div style="display:flex;align-items: center;justify-content: center;">' +
        '   <label class="caption" style="width:{{captionWidth||\'100px\'}};text-align:{{captionAlign||\'left\'}};">{{caption}}</label>' +
        '   <div style="flex:1" ng-transclude>' +
        '   </div>' +
        '</div>'
    };
})