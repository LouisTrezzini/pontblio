angular.module('biblio')
    .controller('Space_Simple_Ctrl', function($scope, space, bookings) {
        $scope.space = space;

        $scope.events = [];

        //TODO
        for (var i = 0; i < bookings.length; i++) {
            $scope.events.push({
                start: new Date(bookings[i].start_date*1000),
                end: new Date(bookings[i].end_date*1000),
                title: bookings[i].reason + " (" + bookings[i].user_count + " personnes)",
                overlap:false,

             });
        }

        $scope.uiConfig = {
            calendar:{
                schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
                editable: false,
                header:{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                height: 820,
                lang: 'fr',
                defaultView : 'agendaWeek',
                minTime: '08:00:00',
                maxTime: '23:00:00',
                slotLabelFormat: 'HH:mm',
                slotLabelInterval: {hours:1},
                slotDuration: {minutes:30},
                allDaySlot: false

                //eventClick: $scope.alertOnEventClick,
                //eventDrop: $scope.alertOnDrop,
                //eventResize: $scope.alertOnResize,
                //eventRender: $scope.eventRender
            }
        };

        $scope.eventSources = [$scope.events];
    })
;
