angular.module('biblio')
    .controller('Bookings_Dashboard_Ctrl', function ($scope, $rootScope, $state, spaces, bookings) {
        $scope.spaces = spaces;
        $scope.bookings = bookings;

        $scope.spacesNames = {};
        for (var i = 0; i < spaces.length; i++) {
            $scope.spacesNames[spaces[i].slug] = spaces[i].name;
        }

        $scope.resources = [];
        $scope.events = [];

        for (var i = 0; i < bookings.length; i++) {
            $scope.events.push({
                start: new Date(bookings[i].start_date * 1000),
                end: new Date(bookings[i].end_date * 1000),
                title: bookings[i].booker_name + " (" + bookings[i].user_count + ")",
                overlap: false,
                resourceId: bookings[i].space_slug,
                bookingId: bookings[i].id
            });
        }

        for (var i = 0; i < spaces.length; i++) {
            if(spaces[i].active){
                $scope.resources.push({
                    id: spaces[i].slug,
                    title: spaces[i].name
                });
            }
        }

        $scope.onEventClick = function(calEvent, jsEvent, view) {
            $state.go('root.bookings.modify', {id: calEvent.bookingId});
        };

        $scope.onDayClick = function(date, jsEvent, view, resourceObj) {
            $state.go('root.bookings.create', {date: date, space: resourceObj.id});
        };

        $scope.uiConfig = {
            calendar: {
                allDaySlot: false,
                contentHeight: 800,
                dayClick: $scope.onDayClick,
                defaultView: 'agendaWeek',
                editable: false,
                eventClick: $scope.onEventClick,
                groupByDateAndResource: true,
                header:{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                lang: 'fr',
                minTime: '08:00:00',
                maxTime: '23:00:00',
                resourceAreaWidth: '10%',
                resourceLabelText: 'Espaces',
                resources: $scope.resources,
                schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
                slotLabelFormat: 'HH:mm',
                slotLabelInterval: {hours: 1},
                slotDuration: {minutes:15},
                slotWidth: 15,
                weekends: false,
            }
        };

        $scope.eventSources = [$scope.events];
    })
    .config(function($stateProvider) {
        $stateProvider
            .state('root.bookings.dashboard', {
                url: '/dashboard',
                templateUrl: 'views/bookings-dashboard.html',
                controller: 'Bookings_Dashboard_Ctrl',
                resolve: {
                    spaces: ['$resource', function ($resource) {
                        return $resource(apiPrefix + 'spaces').query().$promise;
                    }],
                    bookings: ['$resource', function ($resource) {
                        return $resource(apiPrefix + 'bookings').query().$promise;
                    }]
                },
                data: {
                    title: 'Réserver'
                }
            })
        ;
    })
;

