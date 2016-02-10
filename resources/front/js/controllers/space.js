angular.module('biblio')
    .controller('Space_Simple_Ctrl', function ($scope, $sce, space, bookings) {
        $scope.space = space;

        $scope.bindable = $sce.trustAsHtml($scope.space.description);

        $scope.events = [];

        //TODO
        for (var i = 0; i < bookings.length; i++) {
            $scope.events.push({
                start: new Date(bookings[i].start_date * 1000),
                end: new Date(bookings[i].end_date * 1000),
                title: bookings[i].booker_name + " (" + bookings[i].user_count + " personne" + (bookings[i].user_count > 1 ? "s" : "" ) + ")",
                overlap: false,

            });
        }

        $scope.uiConfig = {
            calendar: {
                allDaySlot: false,
                defaultView: 'agendaWeek',
                editable: false,
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                height: 820,
                lang: 'fr',
                minTime: '08:00:00',
                maxTime: '23:00:00',
                schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
                slotDuration: {minutes: 30},
                slotLabelFormat: 'HH:mm',
                slotLabelInterval: {hours: 1},
                weekends: false,

                //eventClick: $scope.alertOnEventClick,
                //eventDrop: $scope.alertOnDrop,
                //eventResize: $scope.alertOnResize,
                //eventRender: $scope.eventRender
            }
        };

        $scope.eventSources = [$scope.events];
    })
;
