angular.module('biblio')
    .run(function ($rootScope, $state, $auth, $http) {

        $http.get(sitePrefix + 'enums')
            .success(function (enums) {
                $rootScope.enums = enums;
            })
        ;


        if ($auth.isAuthenticated()) {
            var payload = $auth.getPayload();
            $rootScope.isAdmin = payload.role == 'gestion';
            $rootScope.isModo = $rootScope.isAdmin || payload.role == 'biblio';
            $rootScope.username = payload.username;
        }

        $rootScope.go = function (route) {
            $state.go(route);
        };

        $rootScope.logout = function () {
            $auth.logout();
            $rootScope.isAdmin = false;
            $rootScope.isModo = false;
            $state.go('login');
        };

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (toState.data) {
                if (toState.data.title) {
                    $rootScope.pageTitle = toState.data.title;
                }
            }
        });
    })
    .config(function ($stateProvider) {
        $stateProvider
            .state('root', {
                url: '',
                abstract: true,
                templateUrl: 'views/layout.html',
            })
        ;
    })
;
