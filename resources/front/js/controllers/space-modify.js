angular.module('biblio')
    .controller('Space_Modify_Ctrl', function($scope, $stateParams, $http, $state, space, Alert, $mdDialog) {
        $scope.space = space;
        $scope.submitButton = 'Modifier !';
        $scope.mode = 'modify';

        var spaceSlug = space.name;

        $scope.submitSpace = function(space, imageBase64) {
            var params = {
                'name' : space.name,
                'description' : nl2br(space.description),
                'location' : space.location,
                'active' : space.active
            };


            if (imageBase64) {
                params.image = imageBase64.base64;
            }

            $http.patch(apiPrefix + 'spaces/' + space.slug, params).success(function(){
                Alert.toast('Modifications prises en compte !');
                if (spaceSlug == space.name) {
                    $state.go('root.spaces.simple', {slug: space.slug});
                } else {
                    $state.go('root.spaces.list');
                }

            });
        };

        $scope.delete = function() {
            // On demande confirmation
            var confirm = $mdDialog.confirm()
                .title('Suppression d\'un espace')
                .content('Êtes-vous bien sûr de vouloir supprimer l\'espace "' + $scope.space.name + '" ?')
                .ariaLabel('Suppression d\'un espace')
                .ok('Oui')
                .cancel('Non')
                .theme('alert');

            $mdDialog.show(confirm).then(function() {
                $http.delete(apiPrefix + 'spaces/' + booking.slug)
                    .success(function(){
                        Alert.alert('Espace supprimé');
                    })
                    .error(function(){
                        Alert.alert('Impossible de supprimer la réservation');
                    });
            }, function() {
                Alert.toast('Espace conservé');
            });
        };
    })
    .controller('Space_Create_Ctrl', function($scope, $stateParams, $http, $state, Alert) {
        $scope.space = {};

        $scope.submitButton = 'Créer !';
        $scope.mode = 'create';

        $scope.submitSpace = function(space, imageBase64) {
            var params = {
                'name' : space.name,
                'description' : space.description,
                'location' : space.location,
                'active' : space.active
            };


            if (imageBase64) {
                params.image = imageBase64.base64;
            }

            $http.post(apiPrefix + 'spaces', params).success(function(space){
                Alert.toast('Espace créé !');
                $state.go('root.spaces.simple', {slug: space.slug});
            });
        };
    })
;
