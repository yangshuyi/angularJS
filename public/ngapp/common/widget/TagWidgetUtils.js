angular.module("common.component", []).factory("tagWidgetUtils", [function ($timeout, $window) {
    return {


        update: function () {
            var a;
            var b;

            if (active) {
                a = (-Math.min(Math.max(-mouseY, -size), size) / radius ) * tspeed;
                b = (Math.min(Math.max(-mouseX, -size), size) / radius ) * tspeed;
            }
            else {
                a = lasta * 0.98;
                b = lastb * 0.98;
            }

            lasta = a;
            lastb = b;

            if (Math.abs(a) <= 0.01 && Math.abs(b) <= 0.01) {
                return;
            }

            var c = 0;
            sineCosine(a, b, c);
            for (var j = 0; j < mcList.length; j++) {
                var rx1 = mcList[j].cx;
                var ry1 = mcList[j].cy * ca + mcList[j].cz * (-sa);
                var rz1 = mcList[j].cy * sa + mcList[j].cz * ca;

                var rx2 = rx1 * cb + rz1 * sb;
                var ry2 = ry1;
                var rz2 = rx1 * (-sb) + rz1 * cb;

                var rx3 = rx2 * cc + ry2 * (-sc);
                var ry3 = rx2 * sc + ry2 * cc;
                var rz3 = rz2;

                mcList[j].cx = rx3;
                mcList[j].cy = ry3;
                mcList[j].cz = rz3;

                per = d / (d + rz3);

                mcList[j].x = (howElliptical * rx3 * per) - (howElliptical * 2);
                mcList[j].y = ry3 * per;
                mcList[j].scale = per;
                mcList[j].alpha = per;

                mcList[j].alpha = (mcList[j].alpha - 0.6) * (10 / 6);
            }

            doPosition();
            depthSort();
        },

        depthSort: function () {
            var i = 0;
            var aTmp = [];

            for (i = 0; i < aA.length; i++) {
                aTmp.push(aA[i]);
            }

            aTmp.sort
            (
                function (vItem1, vItem2) {
                    if (vItem1.cz > vItem2.cz) {
                        return -1;
                    }
                    else if (vItem1.cz < vItem2.cz) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                }
            );

            for (i = 0; i < aTmp.length; i++) {
                aTmp[i].style.zIndex = i;
            }
        },


        doPosition: function () {
            var l = oDiv.offsetWidth / 2;
            var t = oDiv.offsetHeight / 2;
            for (var i = 0; i < mcList.length; i++) {
                aA[i].style.left = mcList[i].cx + l - mcList[i].offsetWidth / 2 + 'px';
                aA[i].style.top = mcList[i].cy + t - mcList[i].offsetHeight / 2 + 'px';

                aA[i].style.fontSize = Math.ceil(12 * mcList[i].scale / 2) + 8 + 'px';

                aA[i].style.filter = "alpha(opacity=" + 100 * mcList[i].alpha + ")";
                aA[i].style.opacity = mcList[i].alpha;
            }
        },

        sineCosine: function (direction) {
            var dtr = Math.PI / 180;
            direction.sa = Math.sin(direction.a * dtr);
            direction.ca = Math.cos(direction.a * dtr);
            direction.sb = Math.sin(direction.b * dtr);
            direction.cb = Math.cos(direction.b * dtr);
            direction.sc = Math.sin(direction.c * dtr);
            direction.cc = Math.cos(direction.c * dtr);
        },

        positionAll : function (items, $element) {
            var max = items.length;
            var phi;
            var theta;
            for (var i = 1; i < max + 1; i++) {
                var item = items[i - 1];
                var tagEle = $element.find('a')[i - 1];
                if (true) {
                    phi = Math.acos(-1 + (2 * i - 1) / max);
                    theta = Math.sqrt(max * Math.PI) * phi;
                }
                else {
                    phi = Math.random() * (Math.PI);
                    theta = Math.random() * (2 * Math.PI);
                }
                //×ø±ê±ä»»
                item.itemOptions.cx = $scope.radius * Math.cos(theta) * Math.sin(phi);
                item.itemOptions.cy = $scope.radius * Math.sin(theta) * Math.sin(phi);
                item.itemOptions.cz = $scope.radius * Math.cos(phi);

                tagEle.style.left = item.itemOptions.cx + $element.width() / 2 - tagEle.width() / 2 + 'px';
                tagEle.style.top = item.itemOptions.cy + $element.height() / 2 - tagEle.height() / 2 + 'px';
            }
        }
    };
}]);