define(['angular', 'snap'], function(ng, Snap) {
    return {
        name: 'component',
        sig: ["stateCollectionService",
            function(stateCollection) {
                return {
                    restrict: 'E',
                    template: '<a href="" ng-click="click(component)">{{component.name}}</a>',
                    link: function(scope, element) {
                        //add the SVG icon as a component
                        console.log(scope.component.SVGIcon);
                        scope.stateCollection = stateCollection;
                        /*var s = Snap.ajax("http://localhost:5000/icon/" + scope.component.SVGIcon, function(f) {
                                console.log('loaded svg');
                            })*/
                    },
                    controller: function($scope, $element) {
                        $scope.click = function(component) {
                            console.log(component);
                            $scope.stateCollection.add(component);
                        }
                    }
                }
            }
        ]
    }
})