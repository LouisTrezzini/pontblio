angular.module('biblio')
    .run(function($rootScope, $state, $auth) {
        //TODO : population des constantes
        if($auth.isAuthenticated()){
            $rootScope.isAdmin = $auth.getPayload().role == 'gestion';
            $rootScope.isModo = $rootScope.isAdmin || $auth.getPayload().role == 'biblio';
        }

        $rootScope.go = function(route) {
            $state.go(route);
        };

        $rootScope.logout = function() {
            $auth.logout();
            $rootScope.isAdmin = false;
            $rootScope.isModo = false;
            $state.go('login');
        };

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if(toState.data) {
                if (toState.data.title) {
                    $rootScope.pageTitle = toState.data.title;
                }
            }
        });
    })
    .config(function($stateProvider) {
        $stateProvider
            .state('root', {
                url: '',
                abstract: true,
                templateUrl: 'views/layout.html',
            })
        ;
    })
;
