angular.module('biblio').filter('urlFile', function() {
    return function(input) {
        return sitePrefix + input;
    };
});
