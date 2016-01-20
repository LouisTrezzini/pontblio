angular.module('biblio').directive('pbDatetimepicker', function () {
    return {
        scope: {
            result: '='
        },
        controller: ['$scope', '$resource', function($scope, $resource) {
            $scope.update = function(){
                var mom = moment($scope.date);
                mom.hours($scope.hours);
                mom.minutes($scope.minutes);
                $scope.result = mom.toDate();
            };

            if(!$scope.result) {
                var mom = moment();
                mom.hours(mom.hours() + 1);
                mom.minutes(0);
                $scope.result = mom;
            }

            $scope.date = moment($scope.result).toDate();
            $scope.hours = moment($scope.result).hours();
            $scope.minutes = moment($scope.result).minutes();

            $scope.$watch('hours', function(value) {
                $scope.update();
            });

            $scope.$watch('minutes', function(value) {
                $scope.update();
            });
        }],
        templateUrl: 'views/pb-datetimepicker.html'
    };
});
