angular.module('biblio')
    .controller('Login_Ctrl', function($scope, $rootScope, $http, Permissions, Alert) {
        $scope.login = function(username, password) {
            $http
                .post(apiPrefix + 'login', {
                    username: username,
                    password: password
                })
                .success(function(data, status, headers, config) {
                    Permissions.set(data.token, data.data.roles);
                })
                .error(function(data, status, headers, config) {
                    // Supprime tout token en cas de mauvaise identification
                    Permissions.remove();
                    Alert.toast(data.reason);
                })
            ;
        };
    })
    .config(function($stateProvider) {
        $stateProvider
            .state('login', {
                url: '',
                templateUrl: 'views/login.html',
                controller: 'Login_Ctrl'
            })
        ;
    })
;
