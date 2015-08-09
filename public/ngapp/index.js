var mainApp = angular.module("mainApp", ['ngRoute']);

mainApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/login', {
                templateUrl: 'addStudent.html',
                controller: 'AddStudentController'
            }).
            when('/viewStudents', {
                templateUrl: 'viewStudents.html',
                controller: 'ViewStudentsController'
            }).
            otherwise({
                redirectTo: '/addStudent'
            });
    }]);
