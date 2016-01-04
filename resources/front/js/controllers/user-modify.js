angular.module('biblio')
    .controller('User_Modify_Ctrl', function ($scope, $stateParams, $http, $state, user, Alert) {
        $scope.user = user;

        $scope.submit = function (user) {
            var params = {
                'departement': user.departement,
                'user_profile': user.user_profile,
                'user_profile_details': user.user_profile_details,
            };

            $http.patch(apiPrefix + 'users/' + user.username, params).success(function () {
                Alert.toast('Modification prise en compte !');
                $state.go('root.home');
            }).error(function () {
                if (typeof data.errors != 'undefined') {
                    $.each(data.errors, function (index, value) {
                        Alert.toast(value);
                    });
                }
                else
                    Alert.toast('Formulaire mal rempli');
            });
        };
    })
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('root.users', {
                url: '/users',
                abstract: true,
                template: '<div ui-view></div>',
                data: {
                    title: 'Utilisateurs',
                }
            })
            .state('root.users.modify', {
                url: '/:username/modify',
                templateUrl: 'views/user-modify.html',
                controller: 'User_Modify_Ctrl',
                data: {
                    title: 'Édition du profil'
                },
                resolve: {
                    user: function ($resource, $stateParams, $rootScope) {
                        return $resource(apiPrefix + 'users/:username').get({
                            username: $stateParams.username ? $stateParams.username : $rootScope.username
                        }).$promise;
                    }
                }
            })
    }]);
