angular.module('biblio')
    .controller('Dashboard_Ctrl', function ($scope, $rootScope, spaces, bookings) {
        $scope.spaces = spaces;
        $scope.bookings = bookings;
        $scope.resources = [];
        $scope.events = [];

        for (var i = 0; i < bookings.length; i++) {
            $scope.events.push({
                start: new Date(bookings[i].start_date * 1000),
                end: new Date(bookings[i].end_date * 1000),
                title: bookings[i].reason + " (" + bookings[i].user_count + " personnes)",
                overlap: false,
                resourceId: bookings[i].space_slug
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

        $scope.uiConfig = {
            calendar: {
                allDaySlot: false,
                contentHeight: 800,
                defaultView: 'timelineDay',
                editable: false,
                header:{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,timelineDay'
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
                //eventClick: $scope.alertOnEventClick,
                //eventDrop: $scope.alertOnDrop,
                //eventResize: $scope.alertOnResize,
                //eventRender: $scope.eventRender
            }
        };

        $scope.eventSources = [$scope.events];
    })
    .config(function($stateProvider) {
        $stateProvider
            .state('root.dashboard', {
                url: '/dashboard',
                templateUrl: 'views/dashboard.html',
                controller: 'Dashboard_Ctrl',
                resolve: {
                    spaces: ['$resource', function ($resource) {
                        return $resource(apiPrefix + 'spaces').query().$promise;
                    }],
                    bookings: ['$resource', function ($resource) {
                        return $resource(apiPrefix + 'bookings').query().$promise;
                    }]
                },
                data: {
                    title: 'Dashboard'
                }
            })
        ;
    })
;
