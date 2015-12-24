angular.module('biblio')
    .controller('Space_List_Ctrl', function ($scope, $rootScope, spaces) {
        $scope.spaces = spaces;
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
                    }],
                    bookings: ['$resource', '$stateParams', function ($resource, $stateParams) {
                        return $resource(apiPrefix + 'spaces/:slug/bookings').query({
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
