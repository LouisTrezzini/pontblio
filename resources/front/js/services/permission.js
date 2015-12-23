angular.module('biblio')
    .factory('Permissions', function($rootScope, $http, Storage, jwtHelper, $state, Alert) {
        remove = function() {
            $rootScope.isLogged = false;
            Storage.remove('token');
            Storage.remove('roles');
        };

        // Charge les permissions à partir du token stocké dans le Storage
        load = function() {
            if (Storage.get('token') && !jwtHelper.isTokenExpired(Storage.get('token'))) {
                $rootScope.isLogged = true;
            } else {
                remove();
            }
        };

        return {
            load: function() {
                load();
            },

            set: function(token, roles, username) {
                Storage.set('token', token);
                Storage.set('roles', roles);
                load();

                if (typeof $rootScope.urlRef !== 'undefined' && $rootScope.urlRef !== null && $rootScope.urlRef != '/') {
                    window.location.href = $rootScope.urlRef;
                    $rootScope.urlRef = null;
                } else {
                    $state.go('root.dashboard');
                }

                // On récupère les données utilisateur
                $http
                    .get(apiPrefix + 'users/' + username)
                    .success(function(data){
                        $rootScope.me = data;
                    })
                ;
                Alert.toast('Connecté avec succès !');
            },

            remove: function() {
                remove();
            },

            username: function() {
                return jwtHelper.decodeToken(Storage.get('token')).username;
            }
        };
    })
;
