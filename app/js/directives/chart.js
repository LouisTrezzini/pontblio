angular.module('biblio').directive('highchart', function() {
    return {
        priority: 10001,
        scope: {
            config: '='
        },
        link: {
            post: function(scope, element, args){
                if (!empty(scope.config)) {
                    element.attr('id', scope.config.chart.renderTo);
                    scope.chart = new Highcharts.Chart(scope.config);
                }
            }
        },
        template: '<div></div>',
    };
});
