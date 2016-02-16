angular.module('biblio')
    .controller('Space_List_Ctrl', function ($scope, $rootScope, $http, $sce, Alert, home, spaces) {
        $scope.spaces = spaces;

        $scope.home = home;

        $scope.editing = false;
        $scope.isLoading = false;

        $scope.bindable = $sce.trustAsHtml($scope.home.content);

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
                    $scope.bindable = $sce.trustAsHtml($scope.home.content);
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
            .state('root.spaces', {
                url: '/spaces',
                abstract: true,
                template: '<div ui-view></div>',
                data: {
                    title: 'Espaces de travail'
                }
            })
            .state('root.spaces.create', {
                url: '/create',
                templateUrl: 'views/space-modify.html',
                controller: 'Space_Create_Ctrl',
                data: {
                    title: 'Création d\'un espace'
                }
            })
            .state('root.spaces.simple', {
                url: '/:slug',
                templateUrl: 'views/space.html',
                controller: 'Space_Simple_Ctrl',
                data: {
                    title: 'Vue détaillée d\'un espace de travail'
                },
                resolve: {
                    space: ['$resource', '$stateParams', function ($resource, $stateParams) {
                        return $resource(apiPrefix + 'spaces/:slug').get({
                            slug: $stateParams.slug
                        }).$promise;
                    }]
                }
            })
            .state('root.spaces.modify', {
                url: '/:slug/modify',
                templateUrl: 'views/space-modify.html',
                controller: 'Space_Modify_Ctrl',
                data: {
                    title: 'Édition d\'un espace'
                },
                resolve: {
                    space: ['$resource', '$stateParams', function($resource, $stateParams) {
                        return $resource(apiPrefix + 'spaces/:slug').get({
                            slug: $stateParams.slug
                        }).$promise;
                    }]
                }
            })
            .state('root.home', {
                url: '',
                templateUrl: 'views/spaces.html',
                data: {
                    title: 'Accueil'
                },
                controller: 'Space_List_Ctrl',
                resolve: {
                    home: ['$resource', function ($resource) {
                        return $resource(apiPrefix + 'webpages/home').get().$promise;
                    }],
                    spaces: ['$resource', function ($resource) {
                        return $resource(apiPrefix + 'spaces').query().$promise;
                    }]
                }
            });
    });
