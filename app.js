(function () {
    'use strict';
    angular.module('restaurantApp', ['ngRoute'])
        .config(function ($routeProvider) {
            $routeProvider
                .when('/signup', {
                    templateUrl: 'signup.html',
                    controller: 'SignUpController'
                })
                .when('/myinfo', {
                    templateUrl: 'myinfo.html',
                    controller: 'MyInfoController'
                })
                .otherwise({
                    redirectTo: '/signup'
                });
        })
        .controller('MainController', function ($scope, $location) {
            $scope.goToSignUp = function () {
                $location.path('/signup');
            };
        })
        .controller('SignUpController', function ($scope, $http, $location, RegistrationService) {
            $scope.user = {};
            $scope.message = "";

            // Function to check if menu number exists
            $scope.checkMenuNumber = function () {
                const menuUrl = 'https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/' + 
                                $scope.user.favoriteMenuNumber.charAt(0) + 
                                '/menu_items/' + $scope.user.favoriteMenuNumber + '.json';
                $http.get(menuUrl).then(function (response) {
                    if (response.data === null) {
                        $scope.message = "No such menu number exists.";
                    } else {
                        $scope.message = "";
                    }
                });
            };

            // Submit form
            $scope.submitForm = function () {
                if ($scope.signupForm.$valid && !$scope.message) {
                    RegistrationService.saveUserInfo($scope.user);
                    $scope.savedMessage = "Your information has been saved.";
                    $location.path('/myinfo');
                }
            };
        })
        .controller('MyInfoController', function ($scope, RegistrationService) {
            $scope.user = RegistrationService.getUserInfo();
            if (!$scope.user) {
                $scope.message = "Not Signed Up Yet. <a href='#/signup'>Sign up Now!</a>";
            }
        })
        .service('RegistrationService', function () {
            var userInfo = null;

            this.saveUserInfo = function (user) {
                userInfo = user;
            };

            this.getUserInfo = function () {
                return userInfo;
            };
        });
})();
