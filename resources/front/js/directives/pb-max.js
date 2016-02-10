function isEmpty(value) {
    return angular.isUndefined(value) || value === '' || value === null || value !== value;
}

angular.module('biblio')
    .directive('pbMax', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            scope.$watch(attr.pbMax, function(){
                ctrl.$setViewValue(ctrl.$viewValue);
            });
            var maxValidator = function(value) {
                var max = scope.$eval(attr.pbMax);
                if (!isEmpty(value) && value > max) {
                    ctrl.$setValidity('pbMax', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('pbMax', true);
                    return value;
                }
            };

            ctrl.$parsers.push(maxValidator);
            ctrl.$formatters.push(maxValidator);
        }
    };
});
