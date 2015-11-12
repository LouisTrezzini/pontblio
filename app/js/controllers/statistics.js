angular.module('biblio')
    .controller('Statistics_Ctrl', function($scope, $window, $timeout, stats) {
        $scope.chartBookingsStatus = {
            chart: {
                renderTo: 'bookingsStatus',
                backgroundColor:'rgba(255, 255, 255, 0)',
                type: 'column'
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            title: {
                text: 'Status des réservations'
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: 'Nombre'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y}'
                    }
                }
            },
            series: [{
                name: 'Nombre',
                colorByPoint: true,
                data: stats.bookings.types
            }]
        };

        $scope.chartBookingsLocations = {
            chart: {
                renderTo: 'bookingsModes',
                backgroundColor:'rgba(255, 255, 255, 0)',
                type: 'column'
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            title: {
                text: 'Mode de réservation'
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: 'Nombre'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y}'
                    }
                }
            },
            series: [{
                name: 'Nombre',
                colorByPoint: true,
                data: stats.bookings.modes
            }]
        };

        $scope.chartBookingsAheadPlan = {
            chart: {
                renderTo: 'bookingsAheadPlan',
                backgroundColor:'rgba(255, 255, 255, 0)',
                type: 'column'
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            title: {
                text: 'Temps entre la réservation et la date réservée'
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: 'Nombre'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y}'
                    }
                }
            },
            series: [{
                name: 'Nombre',
                colorByPoint: true,
                data: stats.bookings.aheadplan
            }]
        };

        $timeout(function(){ angular.element($window).triggerHandler('resize') });
    })
    .config(function($stateProvider) {
        $stateProvider
            .state('root.statistics', {
                url: '/statistics',
                templateUrl: 'views/statistics.html',
                controller: 'Statistics_Ctrl',
                resolve: {
                    stats: ['$resource', function ($resource) {
                        return $resource(apiPrefix + 'statistics/booking').get().$promise;
                    }]
                },
                data: {
                    title: 'Statistiques'
                }
            })
        ;
    })
;
