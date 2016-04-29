angular.module('biblio')
    .controller('Login_Ctrl', function($scope, $rootScope, $auth, $state, Alert) {
        $scope.login = function(username, password) {
            var credentials = {
                username: username,
                password: password
            };

            // Use Satellizer's $auth service to login
            $auth.login(credentials).then(function (response) {
                var payload = $auth.getPayload();
                $rootScope.isAdmin = payload.role == 'gestion';
                $rootScope.isModo = $rootScope.isAdmin || payload.role == 'biblio';
                $rootScope.username = payload.username;

                // If login is successful, redirect to the users state
                $state.go('root.home');
            }, function(response) {
                if(response.data.error == 'invalid_credentials')
                    Alert.toast('Identifiants incorrects');
                else
                    Alert.toast('Une erreur est survenue');
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
