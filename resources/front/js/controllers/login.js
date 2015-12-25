angular.module('biblio')
    .controller('Login_Ctrl', function($scope, $auth, $state) {
        $scope.login = function(username, password) {
            var credentials = {
                username: username,
                password: password
            };

            // Use Satellizer's $auth service to login
            $auth.login(credentials).then(function (data) {
                // If login is successful, redirect to the users state
                $state.go('root.home');
            });
        };
    })
    .config(function($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'Login_Ctrl'
            })
        ;
    })
;
