angular.module('biblio')
    .controller('Home_Ctrl', function ($scope, $rootScope, $http, Alert, home) {
        $scope.home = home;

        $scope.editing = false;
        $scope.isLoading = false;

        $scope.edit = function(){
            $scope.editing = !$scope.editing;
        };

        $scope.save = function () {
            if ($scope.isLoading)
                return;

            $scope.isLoading = true;

            $http.patch(apiPrefix + 'webpages/home', $scope.home)
                .success(function (data) {
                    Alert.toast('Page modifiée !');
                    $scope.home = data;
                    $scope.isLoading = false;
                    $scope.editing = false;
                })
                .error(function (data) {
                    Alert.toast('Erreur...');
                    $scope.isLoading = false;
                })
            ;
        };
    })
    .config(function ($stateProvider) {
        $stateProvider
            .state('root.home', {
                url: '',
                templateUrl: 'views/home.html',
                controller: 'Home_Ctrl',
                resolve: {
                    home: ['$resource', function ($resource) {
                        return $resource(apiPrefix + 'webpages/home').get().$promise;
                    }]
                },
                data: {
                    title: 'Accueil'
                }
            })
        ;
    })
;

