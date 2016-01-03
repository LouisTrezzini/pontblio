angular.module('biblio').directive('pbDatetimepicker', function () {
    return {
        scope: {
            result: '='
        },
        controller: ['$scope', '$resource', function($scope, $resource) {
            $scope.update = function(){
                $scope.result = moment($scope.date)
                    .hours($scope.hours)
                    .minutes($scope.minutes)
                    .toDate();
            };

            if($scope.result) {
                $scope.date = moment($scope.result).toDate();
                $scope.hours = moment($scope.result).hours();
                $scope.minutes = moment($scope.result).minutes();
            }

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
