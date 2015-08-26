angular.module('main', []);

angular.module('main').controller('mainCtrl', ['$scope','$cookieStore', function ($scope, $cookieStore) {
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