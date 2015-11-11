angular.module('biblio')
    .controller('Space_List_Ctrl', function ($scope, $rootScope, spaces, $http) {
        $scope.spaces = spaces;
        $scope.modo = false;

        $scope.toggleModo = function () {
            $scope.modo = !$scope.modo;
        };

        $scope.isLoading = false;

        $scope.toggleSpace = function (space) {
            if ($scope.isLoading) {
                return;
            }
            $scope.isLoading = true;

            $http.patch(apiPrefix + 'spaces/' + space.slug, {active: space.active}).success(function () {
                $scope.isLoading = false;
            });
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
                    }],
                    bookings: ['$resource', '$stateParams', function ($resource, $stateParams) {
                        return $resource(apiPrefix + 'spaces/:slug/bookings').query({
                            slug: $stateParams.slug
                        }).$promise;
                    }]
                }
            })
            .state('root.spaces.list', {
                url: '',
                templateUrl: 'views/spaces.html',
                data: {
                    title: 'Espaces de travail'
                },
                controller: 'Space_List_Ctrl',
                resolve: {
                    spaces: ['$resource', function ($resource) {
                        return $resource(apiPrefix + 'spaces').query().$promise;
                    }]
                }
            });
    });
