angular.module('biblio')
    .controller('Booking_Modify_Ctrl', function($scope, $stateParams, $http, $state, booking, spaces) {
        $scope.booking = booking;
        $scope.spaces = spaces;
        $scope.booking.start_date *= 1000;
        $scope.booking.end_date *= 1000;

        $scope.submitButton = 'Modifier !';

        $scope.submitBooking = function(booking) {
            var params = {
                'space' : booking.space_slug,
                'userCount' : booking.user_count,
                'reason' : booking.reason
            };

            params.startDate = moment(booking.start_date).unix();
            params.endDate = moment(booking.end_date).unix();

            $http.patch(apiPrefix + 'bookings/' + booking.slug, params).success(function(){
                Alert.toast('Modification prise en compte !');
                $state.go('root.users.biblio.spaces.simple', {slug: booking.space_slug});
            });
        };
    })
    .controller('Booking_Create_Ctrl', function($scope, $stateParams, $http, $state, spaces) {
        $scope.booking = {};
        $scope.spaces = spaces;

        $scope.booking.user_count = 1;
        $scope.submitButton = 'Réserver !';

        if($stateParams.space)
            $scope.booking.space_slug = $stateParams.space;

        $scope.submitBooking = function(booking) {
            var params = {
                'space' : booking.space_slug,
                'userCount' : booking.user_count,
                'reason' : booking.reason
            };

            params.startDate = moment(booking.start_date).unix();
            params.endDate = moment(booking.end_date).unix();

            $http.post(apiPrefix + 'bookings', params).success(function(){
                Alert.toast('Réservation prise en compte !');
                $state.go('root.users.biblio.spaces.simple', {slug: booking.space_slug});
            });
        };
    })
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('root.bookings.create', {
                url: '/new',
                templateUrl: 'views/booking-modify.html',
                controller: 'Booking_Create_Ctrl',
                data: {
                    title: 'Nouvelle réservation'
                },
                resolve: {
                    spaces: function($resource) {
                        return $resource(apiPrefix + 'spaces').query().$promise;
                    }
                }
            })
            .state('root.bookings.modify', {
                url: '/:slug/modify',
                templateUrl: 'views/booking-modify.html',
                controller: 'Booking_Modify_Ctrl',
                data: {
                    title: 'Modification d\'une réservation'
                },
                resolve: {
                    booking: function($resource, $stateParams) {
                        return $resource(apiPrefix + 'bookings/:slug').get({
                            slug: $stateParams.slug
                        }).$promise;
                    },
                    spaces: function($resource) {
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
                    spaces: function($resource) {
                        return $resource(apiPrefix + 'spaces').query().$promise;
                    }
                }
            });
    }]);
