angular.module('biblio')
    .controller('Space_Modify_Ctrl', function($scope, $stateParams, $http, $state, space, Alert, $mdDialog, Upload) {
        $scope.space = space;
        $scope.submitButton = 'Modifier !';
        $scope.mode = 'modify';
        $scope.image = {};

        var spaceSlug = space.name;

        $scope.selectImage = function (image) {
            $scope.image = image;
        };

        $scope.submitSpace = function(space) {
            var params = {
                'name' : space.name,
                'description' : nl2br(space.description),
                'location' : space.location,
                'active' : space.active,
                'file' : $scope.image[0]
            };

            Upload.upload({
                method: 'PATCH',
                url: apiPrefix + 'spaces/' + space.slug,
                data: params,
            }).success(function(){
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
    .controller('Space_Create_Ctrl', function($scope, $stateParams, $http, $state, Alert, Upload) {
        $scope.space = {};

        $scope.submitButton = 'Créer !';
        $scope.mode = 'create';

        $scope.image = {};

        $scope.selectImage = function (image) {
            $scope.image = image;
        };

        $scope.submitSpace = function(space) {
            var params = {
                'name' : space.name,
                'description' : space.description,
                'location' : space.location,
                'active' : space.active,
                'file' : $scope.image[0]
            };

            Upload.upload({
                method: 'POST',
                url: apiPrefix + 'spaces',
                data: params
            }).success(function(space){
                Alert.toast('Espace créé !');
                $state.go('root.spaces.simple', {slug: space.slug});
            });
        };
    })
;
