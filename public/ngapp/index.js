var mainApp = angular.module("mainApp", ['ui.router','userService']);

mainApp.config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('main', {
                url:'/main',
                templateUrl: 'main/main.html',
                controller: ['$scope','Restangular','userService', '$rootScope',
                    function($scope, Restangular, userService, $rootScope) {
                    
					//load user info and menus
                    $rootScope.user = currentUser;
                }],
                resolve: {
                    currentUser: ['userService', function(userUtils) {
                        return userService.getCurrentUser();
                    }]
                }
            })
    }]);