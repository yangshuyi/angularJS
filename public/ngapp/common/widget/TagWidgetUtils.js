angular.module("common.component", []).factory("tagWidgetUtils", [function ($timeout, $window) {
    return {


        update: function () {

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

        positionAll : function (tags, $element) {
            var max = tags.length;
            var phi;
            var theta;
            for (var i = 1; i < max + 1; i++) {
                var tag = tags[i - 1];
                var tagEle = $element.find('a')[i - 1];
                if (true) {
                    phi = Math.acos(-1 + (2 * i - 1) / max);
                    theta = Math.sqrt(max * Math.PI) * phi;
                }
                else {
                    phi = Math.random() * (Math.PI);
                    theta = Math.random() * (2 * Math.PI);
                }
                //���任
                tag.itemOptions.cx = $scope.radius * Math.cos(theta) * Math.sin(phi);
                tag.itemOptions.cy = $scope.radius * Math.sin(theta) * Math.sin(phi);
                tag.itemOptions.cz = $scope.radius * Math.cos(phi);

                tagEle.style.left = tag.itemOptions.cx + $element.width() / 2 - tagEle.width() / 2 + 'px';
                tagEle.style.top = tag.itemOptions.cy + $element.height() / 2 - tagEle.height() / 2 + 'px';
            }
        }
    };
}]);