angular.module('biblio')
    .controller('Booking_Modify_Ctrl', function ($scope, $stateParams, $http, $state, booking, spaces, Alert) {
        $scope.user = user;

        $scope.submit = function (user) {
            var params = {
                'departement': booking.departement,
                'user_profile': booking.user_profile,
                'user_profile_details': booking.user_profile_details,
            };

            $http.patch(apiPrefix + 'users/' + booking.username, params).success(function () {
                Alert.toast('Modification prise en compte !');
                $state.go('root.spaces.simple', {slug: booking.space_slug});
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
                    title: 'Réservations',
                }
            })
            .state('root.users.modify', {
                url: '/:id/modify',
                templateUrl: 'views/user-modify.html',
                controller: 'User_Modify_Ctrl',
                data: {
                    title: 'Édition du profil'
                },
                resolve: {
                    user: function ($resource, $stateParams) {
                        return $resource(apiPrefix + 'users/:username').get({
                            username: $stateParams.username
                        }).$promise;
                    }
                }
            })
    }]);
