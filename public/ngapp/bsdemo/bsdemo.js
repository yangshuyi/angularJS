angular.module('bsdemo', []);

angular.module('bsdemo').controller('bsdemoCtrl', ['$scope', function ($scope) {
    //bootstrap/template/carousel/carousel.html
    //<div ng-mouseenter="pause()" ng-mouseleave="play()" class="carousel" ng-swipe-right="prev()" ng-swipe-left="next()">
    //    <ol class="carousel-indicators" ng-show="slides.length > 1">
    //    <li ng-repeat="slide in slides | orderBy:indexOfSlide track by $index" ng-class="{active: isActive(slide)}" ng-click="select(slide)"></li>
    //    </ol>
    //    <div class="carousel-inner" ng-transclude></div>
    //<a class="left carousel-control" ng-click="prev()" ng-show="slides.length > 1"><span class="glyphicon glyphicon-chevron-left"></span></a>
    //<a class="right carousel-control" ng-click="next()" ng-show="slides.length > 1"><span class="glyphicon glyphicon-chevron-right"></span></a>
    //</div>
    var carousel = {interval:500000, nowrap:false, slides:[{
        image: '//placekitten.com/601/300',
        text: '111'
    },{
        image: '//placekitten.com/602/300',
        text: '222'
    },{
        image: '//placekitten.com/603/300',
        text: '333'
    },{
        image: '//placekitten.com/604/300',
        text: '444'
    }] };
    $scope.carousel = carousel;


    $scope.onSlideClick = function(slide) {
        console.log(slide.image);
    };
}]);