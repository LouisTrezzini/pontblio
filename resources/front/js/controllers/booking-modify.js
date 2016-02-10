angular.module('biblio')
    .controller('Booking_Modify_Ctrl', function ($scope, $stateParams, $http, $state, $mdDialog, booking, spaces, Alert) {
        $scope.booking = booking;
        $scope.spaces = spaces;

        var startMom = moment($scope.booking.start_date * 1000);
        var endMom = moment($scope.booking.end_date * 1000);

        $scope.booking.date = startMom.toDate();

        $scope.booking.start_hour = startMom.hours();
        $scope.booking.start_minute = startMom.minutes();

        $scope.booking.end_hour = endMom.hours();
        $scope.booking.end_minute = endMom.minutes();

        $scope.submitButton = 'Modifier !';

        $scope.searchResults = [];

        $scope.capacities = {};

        for(var i = 0; i < spaces.length; i++){
            $scope.capacities[spaces[i].slug] = spaces[i].capacity;
        }

        $scope.weekdays = function(date){
            return moment(date).isoWeekday() != 6 && moment(date).isoWeekday() != 7;
        };

        $scope.getUsers = function(searchText){
            $http.post(apiPrefix + 'search/users', {searchText: searchText})
                .success(function(data){
                    $scope.searchResults = data;
                })
        };

        $scope.submitBooking = function () {
            var params = {
                'space_slug': $scope.booking.space_slug,
                'user_count': $scope.booking.user_count,
                'object': $scope.booking.object,
                'work_type': $scope.booking.work_type,
            };

            var mom = moment($scope.booking.date);

            mom.hours($scope.booking.start_hour);
            mom.minutes($scope.booking.start_minute);
            params.start_date = mom.unix();

            mom.hours($scope.booking.end_hour);
            mom.minutes($scope.booking.end_minute);
            params.end_date = mom.unix();

            if($scope.booking.booker) {
                params.booker_username = $scope.booking.booker.username;
            }

            $http.patch(apiPrefix + 'bookings/' + booking.id, params).success(function () {
                Alert.toast('Modification prise en compte !');
                $state.go('root.spaces.simple', {slug: booking.space_slug});
            }).error(function () {
                if (typeof data.errors != 'undefined') {
                    $.each(data.errors, function (index, value) {
                        Alert.toast(value[0]);
                    });
                }
                else
                    Alert.toast('Formulaire mal rempli');
            });
        };

        $scope.delete = function() {
            // On demande confirmation
            var confirm = $mdDialog.confirm()
                .title('Suppression d\'une réservation')
                .content('Es-tu bien sûr de vouloir supprimer ta réservation ?')
                .ariaLabel('Suppression d\'une réservation')
                .ok('Oui')
                .cancel('Non')
                .theme('alert');

            $mdDialog.show(confirm).then(function() {
                $http.delete(apiPrefix + 'bookings/' + $scope.booking.id)
                    .success(function(){
                        Alert.alert('Réservation supprimée');
                        $state.go('root.home');
                    })
                    .error(function(){
                        Alert.alert('Impossible de supprimer la réservation');
                    });
            }, function() {
                Alert.toast('Réservation maintenue');
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

        $scope.capacities = {};

        for(var i = 0; i < spaces.length; i++){
            $scope.capacities[spaces[i].slug] = spaces[i].capacity;
        }

        $scope.weekdays = function(date){
            return moment(date).isoWeekday() != 6 && moment(date).isoWeekday() != 7;
        };

        $scope.getUsers = function(searchText){
            $http.post(apiPrefix + 'search/users', {searchText: searchText})
            .success(function(data){
                $scope.searchResults = data;
            })
        };

        $scope.submitBooking = function () {
            var params = {
                'space_slug': $scope.booking.space_slug,
                'user_count': $scope.booking.user_count,
                'object': $scope.booking.object,
                'work_type': $scope.booking.work_type,
            };

            var mom = moment($scope.booking.date);

            mom.hours($scope.booking.start_hour);
            mom.minutes($scope.booking.start_minute);
            params.start_date = mom.unix();

            mom.hours($scope.booking.end_hour);
            mom.minutes($scope.booking.end_minute);
            params.end_date = mom.unix();

            if($scope.booking.booker) {
                params.booker_username = $scope.booking.booker.username;
            }

            $http.post(apiPrefix + 'bookings', params).success(function () {
                Alert.toast('Réservation prise en compte !');
                $state.go('root.spaces.simple', {slug: $scope.booking.space_slug});
            }).error(function (data) {
                if (typeof data.errors != 'undefined') {
                    $.each(data.errors, function (index, value) {
                        Alert.toast(value[0]);
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
