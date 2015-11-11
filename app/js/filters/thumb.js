angular.module('biblio').filter('thumb', function() {
    return function(path) {
        return path.replace(/images/, 'thumbnails');
    };
});
