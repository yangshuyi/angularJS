angular.module('core').controller('mainCtrl', ['$scope', '$cookies', function ($scope, $cookies) {
    var COOKIE_USER = "user";

    $scope.onSlideClick = function (slide) {
        console.log(slide.image);
    };

    $scope.loginUser = function () {
        if($scope.user.rememberMe=="1"){
            $cookies.set(COOKIE_USER, $scope.user.name);
        }else{
            $cookies.remove(COOKIE_USER);
        }
    };

    $scope.toRegisterUser = function () {

    };


    $scope.getGridHeight = function(gridId){
        if(gridId == "firstGrid"){
            return 500;
        }
    };



    $scope.initUI = function () {
        var carousel = {
            interval: 500000, nowrap: false, slides: [{
                image: '//placekitten.com/601/300',
                text: '111'
            }, {
                image: '//placekitten.com/602/300',
                text: '222'
            }, {
                image: '//placekitten.com/603/300',
                text: '333'
            }, {
                image: '//placekitten.com/604/300',
                text: '444'
            }]
        };
        $scope.carousel = carousel;

        var userName = $cookies.get(COOKIE_USER);
        if(userName){
            $scope.user.name = userName;
            $scope.user.rememberMe = "1";
        }

        $scope.firstGridOptions = {
            onRegisterApi : function(gridApi) {
                $scope.gridApi = gridApi;
            }
        };

        var gridDataArray = new Array(10);
        for(var i=1;i<100;i++){
            var obj = {id:i,name:'name-'+i,age:i*10,sex:i%2};
            gridDataArray.push(obj);
        }
        $scope.gridApi.setGridData(gridDataArray,1000);

    };


    $scope.initUI();
}]);