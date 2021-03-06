angular.module('biblio')
    .controller('Space_Modify_Ctrl', function($scope, $stateParams, $http, $state, space, Alert, $mdDialog) {
        $scope.space = space;
        $scope.submitButton = 'Modifier !';
        $scope.mode = 'modify';

        var spaceSlug = space.name;

        $scope.submitSpace = function(space, imageBase64) {
            var params = {
                'active' : space.active,
                'capacity' : space.capacity,
                'description' : space.description,
                'location' : space.location,
                'name' : space.name,
                'screen' : space.screen,
                'whiteboard' : space.whiteboard,
            };

            if (imageBase64) {
                params.image = imageBase64.base64;
                var sub = imageBase64.filename.split('.');
                params.image_ext = sub[sub.length - 1];
            }

            $http.patch(apiPrefix + 'spaces/' + space.slug, params).success(function(){
                Alert.toast('Modifications prises en compte !');
                if (spaceSlug == space.name) {
                    $state.go('root.spaces.simple', {slug: space.slug});
                } else {
                    $state.go('root.home');
                }

            }).error(function (data) {
                if (typeof data.errors != 'undefined') {
                    $.each(data.errors, function (index, value) {
                        Alert.toast(value);
                    });
                }
                else
                    Alert.toast('Formulaire mal rempli');
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
                $http.delete(apiPrefix + 'spaces/' + $scope.space.slug)
                    .success(function(){
                        Alert.alert('Espace supprimé');
                        $state.go('root.home');
                    })
                    .error(function(){
                        Alert.alert('Impossible de supprimer cet espace');
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
                'active' : space.active,
                'capacity' : space.capacity,
                'description' : space.description,
                'location' : space.location,
                'name' : space.name,
                'screen' : space.screen,
                'whiteboard' : space.whiteboard,
            };

            if (imageBase64) {
                params.image = imageBase64.base64;
                var sub = imageBase64.filename.split('.');
                params.image_ext = sub[sub.length - 1];
            }

            $http.post(apiPrefix + 'spaces', params).success(function(space){
                Alert.toast('Espace créé !');
                $state.go('root.spaces.simple', {slug: space.slug});
            }).error(function (data) {
                if (typeof data.errors != 'undefined') {
                    $.each(data.errors, function (index, value) {
                        Alert.toast(value);
                    });
                }
                else
                    Alert.toast('Formulaire mal rempli');
            });
        };
    })
;
