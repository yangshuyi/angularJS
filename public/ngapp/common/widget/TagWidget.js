'use strict';
//http://www.cnblogs.com/Leo_wl/p/4418781.html
angular.module('common.widget').directive('tagWidget', ['tagWidgetUtils', function (tagWidgetUtils) {
    return {
        restrict: 'EA',
        scope: {
            ngModel: '=',
            placeholder: '@',
            cls: '@'
        },
        template: '<div style="position:relative;width:200px;height:200px" class="{{cls}}">' +
        '   <a ng-repeat="item in ngModel" href="{{item.url}}" style="position:absolute;padding:2px;">{{item.text}}</a>' +
        '</div>',

        link: function ($scope, $element, attrs, ngModelCtrl) {
            $scope.radius = 60;
            $scope.active = false;
            $scope.deviation={x:0,y:0};
            var options = {

                d: 300,
                mcList: [],
                active: false,
                lasta: 1,
                lastb: 1,
                tspeed: 10,
                size: 200,
                mouseX: 0,
                mouseY: 0,
                howElliptical: 1,
                aA: null,
                oDiv: null,

                direction: {
                    a: 0,
                    b: 0,
                    c: 0
                }
            };

            $scope.defaultItemOptions = {
                cx: 0,
                cy: 0,
                cz: 0
            }

            $element.mouseover(function ()
            {
                $scope.active=true;
            });

            $element.mouseout(function ()
            {
                $scope.active=false;
            });

            $element.mousemove(function (ev)
            {
                var oEvent=window.event || ev;

                var x=oEvent.clientX-($element.offset().left+$element.width()/2);
                var y=oEvent.clientY-($element.offset().top+$element.height()/2);

                mouseX/=5;
                mouseY/=5;
            });


                //用于当model修改时，触发该pipeline，来修改directive的展现
                ngModelCtrl.$formatters.push(function () {
                    if($scope.ngModel==null){
                        return;
                    }
                    //计算角度
                    tagWidgetUtils.sineCosine(options.direction);
                    //计算坐标
                    tagWidgetUtils.positionAll($scope.ngModel, $element);
                });


            }
        };
}]);