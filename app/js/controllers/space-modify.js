angular.module('biblio')
    .controller('Space_Modify_Ctrl', function($scope, $stateParams, $http, $state, space, Alert) {
        $scope.space = space;

        var spaceSlug = space.name;

        $scope.submitSpace = function(space, imageBase64) {
            var params = {
                'name' : space.name,
                'description' : nl2br(space.description),
                'location' : space.location
            };


            if (imageBase64) {
                params.image = imageBase64.base64;
            }

            $http.patch(apiPrefix + 'spaces/' + space.slug, params).success(function(){
                Alert('Modifications prises en compte !');
                if (spaceSlug == space.name) {
                    $state.go('root.spaces.simple', {slug: space.slug});
                } else {
                    $state.go('root.spaces.list');
                }

            });
        };
    })
    .controller('Space_Create_Ctrl', function($scope, $stateParams, $http, $state, Alert) {
        $scope.space = {};

        $scope.submitSpace = function(space, imageBase64) {
            var params = {
                'name' : space.name,
                'description' : space.description,
                'location' : space.location
            };


            if (imageBase64) {
                params.image = imageBase64.base64;
            }

            $http.post(apiPrefix + 'spaces', params).success(function(space){
                Alert('Espace créé !');
                $state.go('root.spaces.simple', {slug: space.slug});
            });
        };
    })
    .config(function($stateProvider) {
        $stateProvider
            .state('root.spaces.modify', {
                url: '/spaces/:slug/modify',
                templateUrl: 'views/space-modify.html',
                controller: 'Space_Modify_Ctrl',
                data: {
                    top: true
                },
                resolve: {
                    space: ['$resource', '$stateParams', function($resource, $stateParams) {
                        return $resource(apiPrefix + 'spaces/:slug').get({
                            slug: $stateParams.slug
                        }).$promise;
                    }]
                }
            });
    })
    .config(function($stateProvider) {
        $stateProvider
            .state('root.spaces.create', {
                url: '/create',
                templateUrl: 'views/space-modify.html',
                controller: 'Space_Create_Ctrl',
                data: {
                    title: 'Édition d\'un espace'
                }
            });
    });
