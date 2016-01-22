var apiPrefix = sitePrefix + 'api/';

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
        'md.data.table',
        'naif.base64',
        'ngAnimate',
        'ngMaterial',
        'ngMessages',
        'ngResource',
        'ngSanitize',
        'ui.calendar',
        'ui.router',
        'satellizer',
        'ngQuill'
    ])
    // Setup theme
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('red')
        ;

        $mdThemingProvider.theme('alert')
            .primaryPalette('red')
            .accentPalette('orange')
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
            .state('500', {
                url: '/500',
                templateUrl: 'views/500.html'
            })
        ;
    })
    .config(['$urlRouterProvider', '$authProvider', function($urlRouterProvider, $authProvider) {
        $authProvider.loginUrl = apiPrefix + 'login';

    }])
    .config(['$stateProvider', '$urlRouterProvider', '$authProvider', '$httpProvider', '$provide', function($stateProvider, $urlRouterProvider, $authProvider, $httpProvider, $provide) {
        $provide.factory('redirectWhenLoggedOut', function ($q, $injector) {
            return {
                responseError: function (rejection) {

                    var $state = $injector.get('$state');
                    var $rootScope = $injector.get('$rootScope');

                    var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];

                    angular.forEach(rejectionReasons, function (value, key) {
                        angular.forEach(rejection.data.errors, function (valueError, keyError) {
                            if (valueError === value) {
                                $rootScope.logout();
                            }
                        });
                    });

                    return $q.reject(rejection);
                }
            };
        });

        $httpProvider.interceptors.push('redirectWhenLoggedOut');
    }])
    // Setup interceptor
    //.factory('ErrorCodes_Interceptor', function($rootScope, $location, $q, Storage) {
    //    return {
    //        responseError: function(response) {
    //            switch (response.status) {
    //            case 403:
    //                $location.path('/403');
    //                break;
    //            case 404:
    //                $location.path('/404');
    //                break;
    //            case 500:
    //                $location.path('/500');
    //                break;
    //            case 503:
    //                $location.path('/maintenance');
    //                break;
    //            }
    //            return $q.reject(response);
    //        }
    //    };
    //})
    //.config(function($httpProvider, jwtInterceptorProvider) {
    //    $httpProvider.interceptors.push('ErrorCodes_Interceptor');
    //})
    .value('scDateTimeConfig', {
        defaultTheme: 'biblio',
        autosave: true,
        defaultMode: 'date',
        defaultDate: undefined, //should be date object!!
        displayMode: 'full',
        defaultOrientation: false,
        displayTwentyfour: true,
        compact: false
    })
    .value('scDateTimeI18n', {
        previousMonth: "Mois précédent",
        nextMonth: "Mois suivant",
        incrementHours: "Increment Hours",
        decrementHours: "Decrement Hours",
        incrementMinutes: "Increment Minutes",
        decrementMinutes: "Decrement Minutes",
        switchAmPm: "Switch AM/PM",
        now: "Maintenant",
        cancel: "Annuler",
        save: "Sauvegarder",
        weekdays: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
        switchTo: 'Switch to',
        clock: 'Horloge',
        calendar: 'Calendrier'
    })
;
