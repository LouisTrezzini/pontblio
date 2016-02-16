angular.module('biblio')
    .controller('Space_Simple_Ctrl', function ($scope, $resource,  $sce, space) {
        $scope.space = space;
        $scope.events = [];
        $scope.bindable = $sce.trustAsHtml($scope.space.description);

        $scope.init = function (view, element) {
            $resource(apiPrefix + 'spaces/:slug/bookings/:date/:mode').query({
                date: view.start.unix(),
                slug: $scope.space.slug,
                mode: view.name.toLowerCase().replace('basic', '').replace('agenda', '')
            }).$promise.then(function(bookings) {
                $scope.events.splice(0, $scope.events.length);
                for (var i = 0; i < bookings.length; i++) {
                    $scope.events.push({
                        start: new Date(bookings[i].start_date * 1000),
                        end: new Date(bookings[i].end_date * 1000),
                        title: bookings[i].booker_name + " (" + bookings[i].user_count + ")",
                        overlap: false,

                    });
                }
            }, null)


        };

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
                viewRender: $scope.init,
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
