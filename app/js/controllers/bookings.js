angular.module('biblio')
    .controller('Bookings_List_Ctrl', function($rootScope, $scope, $http, $resource, bookings, spaces, Alert) {
        $scope.bookings = bookings;
        $scope.spaces = {};
        for(var i = 0; i < spaces.length; i++){
            $scope.spaces[spaces[i].slug] = spaces[i];
        }

        $scope.delete = function(booking) {
            // On demande confirmation
            alertify.confirm('Es-tu bien sûr de vouloir supprimer ta réservation du ' + moment.unix(booking.start_date).calendar()
                //+ ' dans l\'espace ' + $scope.spaces[booking.space_slug].name
                + ' ?', function(e){

                if (e) {
                    $http.delete(apiPrefix + 'bookings/' + booking.slug)
                        .success(function(){
                            Alert('Réservation supprimée !');
                            $resource(apiPrefix + 'own/bookings').query(function(data){
                                $scope.bookings = data;
                            });
                        })
                        .error(function(){
                            alertify.error('Erreur...');
                        });
                }
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
