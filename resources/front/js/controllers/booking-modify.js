angular.module('biblio')
    .controller('Booking_Modify_Ctrl', function ($scope, $stateParams, $http, $state, booking, spaces, Alert) {
        $scope.booking = booking;
        $scope.spaces = spaces;
        $scope.booking.start_date *= 1000;
        $scope.booking.end_date *= 1000;

        $scope.submitButton = 'Modifier !';

        $scope.searchResults = [];

        $scope.getUsers = function(searchText){
            $http.post(apiPrefix + 'search/users', {searchText: searchText})
                .success(function(data){
                    $scope.searchResults = data;
                })
        };

        $scope.submitBooking = function (booking) {
            var params = {
                'space_slug': booking.space_slug,
                'user_count': booking.user_count,
                'object': booking.object,
                'work_type': booking.work_type,
                'start_date': moment(booking.start_date).unix(),
                'end_date': moment(booking.end_date).unix(),
            };

            if(booking.booker) {
                params.booker_username = booking.booker.username;
            }

            $http.patch(apiPrefix + 'bookings/' + booking.id, params).success(function () {
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
    .controller('Booking_Create_Ctrl', function ($scope, $stateParams, $http, $state, spaces, Alert) {
        $scope.booking = {
            object: 'group',
        };
        $scope.spaces = spaces;

        $scope.booking.user_count = 1;
        $scope.submitButton = 'Réserver !';

        if ($stateParams.space)
            $scope.booking.space_slug = $stateParams.space;

        $scope.searchResults = [];

        $scope.getUsers = function(searchText){
            $http.post(apiPrefix + 'search/users', {searchText: searchText})
            .success(function(data){
                $scope.searchResults = data;
            })
        };

        $scope.submitBooking = function (booking) {
            var params = {
                'space_slug': booking.space_slug,
                'user_count': booking.user_count,
                'object': booking.object,
                'work_type': booking.work_type,
                'start_date': moment(booking.start_date).unix(),
                'end_date': moment(booking.end_date).unix(),
            };

            if(booking.booker) {
                params.booker_username = booking.booker.username;
            }


            $http.post(apiPrefix + 'bookings', params).success(function () {
                Alert.toast('Réservation prise en compte !');
                $state.go('root.spaces.simple', {slug: booking.space_slug});
            }).error(function (data) {
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
            .state('root.bookings.create', {
                url: '/new',
                templateUrl: 'views/booking-modify.html',
                controller: 'Booking_Create_Ctrl',
                data: {
                    title: 'Nouvelle réservation'
                },
                resolve: {
                    spaces: function ($resource) {
                        return $resource(apiPrefix + 'spaces').query().$promise;
                    }
                }
            })
            .state('root.bookings.modify', {
                url: '/:id/modify',
                templateUrl: 'views/booking-modify.html',
                controller: 'Booking_Modify_Ctrl',
                data: {
                    title: 'Modification d\'une réservation'
                },
                resolve: {
                    booking: function ($resource, $stateParams) {
                        return $resource(apiPrefix + 'bookings/:id').get({
                            id: $stateParams.id
                        }).$promise;
                    },
                    spaces: function ($resource) {
                        return $resource(apiPrefix + 'spaces').query().$promise;
                    }
                }
            })
            .state('root.spaces.booking', {
                url: '/:space/booking',
                templateUrl: 'views/booking-modify.html',
                controller: 'Booking_Create_Ctrl',
                data: {
                    title: 'Nouvelle réservation'
                },
                resolve: {
                    spaces: function ($resource) {
                        return $resource(apiPrefix + 'spaces').query().$promise;
                    }
                }
            });
    }]);
