define(['angular',
        'flow/views/workspaceView',
        'flow/collections/stateCollection',
        'flow/collections/connectionCollection'
    ],
    function(ng, workspaceView, stateCollection, connectionCollection) {
        //todo assemble the module. 
        //create services for the state collection and the connection collection
        var module = angular.module('flow', []);
        module.factory('stateCollectionService', function() {
            return {
                instance: null,
                /**
                 * Adds a state to the state collectio to be reflected
                 * by the WorkspaceView
                 * @param {json} definition Basic component definition
                 * @param {objec} position   Position information for the newly added component. Can be null.
                 */
                add: function(definition, position) {
                    this.instance.addState(definition);
                },
                remove: function(definition, position) {
                    this.instance.removeState(definition);
                }
            }
        });
        module.factory('workspaceView', function() {
            return {
                WorkspaceView: workspaceView
            }
        })
        module.directive('flow', ['workspaceView', 'stateCollectionService',
            function(ws, stateCollection) {
                return {
                    restrict: 'A',
                    controller: function($scope, $element, $attrs) {
                        var s = Snap("#" + $attrs.id);
                        $scope.workspace = new ws.WorkspaceView(s);
                        stateCollection.instance = $scope.workspace.stateCollection;
                    }
                }
            }
        ])
    }
);