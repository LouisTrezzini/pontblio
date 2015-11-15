angular.module('biblio')
    .controller('Bookings_List_Ctrl', function($rootScope, $scope, $http, $resource, bookings, spaces, Alert, $mdDialog) {
        $scope.bookings = bookings;
        $scope.spaces = {};
        for(var i = 0; i < spaces.length; i++){
            $scope.spaces[spaces[i].slug] = spaces[i];
        }

        $scope.delete = function(booking) {
            // On demande confirmation
            var confirm = $mdDialog.confirm()
                .title('Suppression d\'une réservation')
                .content('Es-tu bien sûr de vouloir supprimer ta réservation du ' + moment.unix(booking.start_date).calendar() + ' ?')
                .ariaLabel('Suppression d\'une réservation')
                .ok('Oui')
                .cancel('Non')
                .theme('alert');

            $mdDialog.show(confirm).then(function() {
                $http.delete(apiPrefix + 'bookings/' + booking.slug)
                    .success(function(){
                        Alert.alert('Réservation supprimée');
                        $resource(apiPrefix + 'own/bookings').query(function(data){
                            $scope.bookings = data;
                        });
                    })
                    .error(function(){
                        Alert.alert('Impossible de supprimer la réservation');
                    });
            }, function() {
                Alert.toast('Réservation maintenue');
            });
        };
    })
    .config(function($stateProvider) {
        $stateProvider
            .state('root.bookings', {
                url: '/bookings',
                abstract: true,
                template: '<div ui-view></div>',
                data: {
                    title: 'Réservations',
                }
            })
            .state('root.bookings.list', {
                url: '',
                controller: 'Bookings_List_Ctrl',
                templateUrl: 'views/bookings.html',
                resolve: {
                    bookings: function ($resource) {
                        return $resource(apiPrefix + 'own/bookings').query().$promise;
                    },
                    spaces: function ($resource) {
                        return $resource(apiPrefix + 'spaces').query().$promise;
                    }
                },
                data: {
                    title: 'Mes réservations'
                }
            });
    });
