define(['angular', 'lodash'], function(ng, _) {
    return {
        name: 'PaletteCtrl',
        sig: ['$scope', '$http',
            function($scope, $http) {
                'use strict'
                //var injector = angular.injector(['flow']);
                //$scope.stateCollection = angular.get('stateCollectionService');
                $scope.palletes = [];
                $scope.visibleComponents = [];
                $scope.$watch('palletes', function() {
                    //update the view whenever this is called
                    console.log('palettes updated');
                });
                /**
                 * Loads a palette from the webserver
                 */
                $scope.loadPalettes = function() {
                    console.log("loading palettes");
                    $http({
                        method: 'GET',
                        url: 'http://localhost:5000/palette'
                    }).
                    success(function(data, status, headers, config) {
                        $scope.palletes = data;
                        console.log(data)
                    }).
                    error(function(data, status, headers, config) {
                        console.log("error!")
                    })
                }

                $scope.unloadPallete = function(id) {
                    //todo: unload the pallete 
                    console.log("unload the pallete");
                }

                $scope.visiblePalette = function(palette) {
                    $scope.visibleComponents = palette.components;
                    console.log($scope.visibleComponents);
                }

                $scope.loadPalettes();

            }

        ]
    }
});