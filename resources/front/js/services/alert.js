angular.module('biblio')
    .factory('Alert', function($mdToast) {
        return {
            toast: function(content) {
                $mdToast.show(
                  $mdToast.simple()
                    .content(content)
                    .position('bottom right')
                    .hideDelay(3000)
                );
            },
            alert: function(content) {
                $mdToast.show(
                    $mdToast.simple()
                        .content(content)
                        .position('bottom right')
                        .hideDelay(3000)
                        .theme('alert')
                );
            },
        };
    })
;
