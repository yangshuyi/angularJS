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
            $scope.tspeed= 10;
            $scope.active = false;
            $scope.mouseAction={x:0,y:0};
            $scope.diviation={x:0,y:0};
            $scope.direction = {
                a: 0,
                b: 0,
                c: 0,
                sa: 0,
                ca: 0,
                sb: 0,
                cb: 0,
                sc: 0,
                cc: 0
            };

            $scope.size= 200;
            var options = {

                d: 300,

                lasta: 1,
                lastb: 1,


                howElliptical: 1,
                aA: null,
                oDiv: null,


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
                ev=window.event || ev;

                var x=ev.clientX-($element.offset().left+$element.width()/2);
                var y=ev.clientY-($element.offset().top+$element.height()/2);

                $scope.mouseAction = x/5;
                $scope.mouseAction=y/5;
            });

            var updateTagPosition = $interval(function(){
                if ($scope.active) {
                    $scope.direction.a = (-Math.min(Math.max(-$scope.mouseAction.x, -$scope.size), $scope.size) / $scope.radius ) * $scope.tspeed;
                    $scope.direction.b = (Math.min(Math.max(-$scope.mouseAction.y, -$scope.size), $scope.size) / $scope.radius ) * $scope.tspeed;
                }
                else {
                    $scope.direction.a = $scope.diviation.x * 0.98;
                    $scope.direction.b = $scope.diviation.y * 0.98;
                }

                $scope.diviation.x = $scope.direction.a;
                $scope.diviation.y = $scope.direction.b;


                if (Math.abs(a) <= 0.01 && Math.abs(b) <= 0.01) {
                    return;
                }

                var c = 0;
                tagWidgetUtils.sineCosine($scope.direction);
                for (var j = 0; j < $scope.ngModel.length; j++) {
                    var tag = $scope.ngModel[j];
                    var rx1 = tag.itemOptions.cx;
                    var ry1 = tag.itemOptions.cy * tag.itemOptions.ca + tag.itemOptions.cz * (-$scope.direction.sa);
                    var rz1 = tag.itemOptions.cz * tag.itemOptions.ca + tag.itemOptions.cy * $scope.direction.sa;

                    var rx2 = rx1 * tag.itemOptions.cb + rz1 * sb;
                    var ry2 = ry1;
                    var rz2 = rx1 * (-sb) + rz1 * cb;

                    var rx3 = rx2 * cc + ry2 * (-sc);
                    var ry3 = rx2 * sc + ry2 * cc;
                    var rz3 = rz2;

                    tag.itemOptions.cx = rx3;
                    tag.itemOptions.cy = ry3;
                    tag.itemOptions.cz = rz3;

                    per = d / (d + rz3);

                    mcList[j].x = (howElliptical * rx3 * per) - (howElliptical * 2);
                    mcList[j].y = ry3 * per;
                    mcList[j].scale = per;
                    mcList[j].alpha = per;

                    mcList[j].alpha = (mcList[j].alpha - 0.6) * (10 / 6);
                }

                doPosition();
                depthSort();
            },100);

            $scope.$on('$destroy',function(){
                $interval.cancel(updateTagPosition);
            }



                ngModelCtrl.$formatters.push(function () {
                    if($scope.ngModel==null){
                        return;
                    }

                    tagWidgetUtils.sineCosine(options.direction);

                    tagWidgetUtils.positionAll($scope.ngModel, $element);
                });


            }
        };
}]);