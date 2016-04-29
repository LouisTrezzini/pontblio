angular.module('biblio')
    .controller('Statistics_Ctrl', function ($scope, $window, $timeout, stats) {
        $scope.chartSpacesBookings = {
            options: {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Réservations par espace'
                },
                xAxis: {
                    categories: stats.spaces_bookings.x_axis
                },
                yAxis: {
                    title: {
                        text: 'Nombre'
                    }
                },
                tooltip: {
                    formatter: function () {
                        var s = '<b>' + this.x + '</b>',
                            sum = 0;
                        $.each(this.points, function (i, point) {
                            s += '<br/>' + point.series.name + ' : ' +
                                point.y;
                            sum += point.y;
                        });
                        s += '<br/><b>Total : ' + sum + '</b>'
                        return s;
                    },
                    shared: true
                }

            },
            series: stats.spaces_bookings.series,
            func: function(chart) {
                $timeout(function() {
                    chart.reflow();
                }, 0);
            }
        };
    })
    .config(function ($stateProvider) {
        $stateProvider
            .state('root.statistics', {
                url: '/statistics',
                templateUrl: 'views/statistics.html',
                controller: 'Statistics_Ctrl',
                resolve: {
                    stats: ['$resource', function ($resource) {
                        return $resource(apiPrefix + 'statistics/main').get().$promise;
                    }]
                },
                data: {
                    title: 'Statistiques'
                }
            })
        ;
    })
;
