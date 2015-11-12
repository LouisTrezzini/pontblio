var apiPrefix = 'http://localhost/api/';

Highcharts.setOptions({
    lang: {
        months: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
        weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        shortMonths: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Déc'],
        loading: 'Chargement en cours...',
        resetZoom: 'Réinitialiser le zoom',
        resetZoomTitle: 'Réinitialiser le zoom au niveau 1:1',
        thousandsSep: ' ',
        decimalPoint: ',',
        drillUpText: 'Retour à {series.name}'
    }
});

angular
    .module('biblio', [
        'angular-jwt',
        'naif.base64',
        'ngAnimate',
        'ngMaterial',
        'ngMessages',
        'ngResource',
        'ui.router',
        'ui.calendar',
        'md.data.table'
    ])
    // Setup theme
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('red')
            //.dark()
        ;
    })
    // Setup routes
    .config(function($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $locationProvider) {
        $urlMatcherFactoryProvider.strictMode(false);
        $urlRouterProvider.otherwise('/404');

        $stateProvider
            .state('404', {
                url: '/404',
                templateUrl: 'views/404.html'
            })
            .state('418', {
                url: '/418',
                templateUrl: 'views/418.html'
            })
        ;
    })
    // Setup interceptor
    .factory('ErrorCodes_Interceptor', function($rootScope, $location, $q, Storage) {
        return {
            responseError: function(response) {
                switch (response.status) {
                case 401:
                    Storage.remove('token');
                    Storage.remove('roles');
                    $rootScope.isLogged = false;
                    $location.path('/');
                    break;
                case 403:
                    $location.path('/403');
                    break;
                case 404:
                    $location.path('/404');
                    break;
                case 500:
                    $location.path('/erreur');
                    break;
                case 503:
                    if (response.data.until)
                        Storage.set('maintenance', response.data.until);
                    else
                        Storage.remove('maintenance');
                    $location.path('/maintenance');
                    $rootScope.maintenance = true;
                    break;
                }
                return $q.reject(response);
            }
        };
    })
    .config(function($httpProvider, jwtInterceptorProvider) {
        jwtInterceptorProvider.tokenGetter = function(Permissions, Storage, config, jwtHelper, $rootScope, $q) {
            // On n'envoie pas le token pour les templates
            if (config.url.substr(config.url.length - 5) == '.html')
                return null;

            if (Storage.get('token') && jwtHelper.isTokenExpired(Storage.get('token'))) {
                Permissions.remove('token');
                return $q.reject(config);
            }
            return Storage.get('token');
        };

        $httpProvider.interceptors.push('jwtInterceptor');
        $httpProvider.interceptors.push('ErrorCodes_Interceptor');
    })
    .config(function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })
;
