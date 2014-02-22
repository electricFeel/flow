define(["Stapes",
        "lodash",
        "models/state",
        "models/connection",
        "collections/stateCollection",
        "collections/connectionCollection",
        "views/StateView",
        "views/ConnectionView"
    ],
    function(Stapes, _, State, Connection, StateCollection, ConnectionCollection, StateView, ConnectionView) {
        //acts as the main function
        var WorkspaceView = Stapes.subclass({
            constructor: function(renderer) {
                this.renderer = renderer;
                this.el = this.renderer.g().attr({
                    "id": "workspace",
                    "transform": "matrix(1,0,0,1,0,0)"
                });
                this.el.add(this.renderer.g().attr({
                    "id": 'connection-group'
                }));


                this.stateCollection = new StateCollection();
                this.connectionCollection = new ConnectionCollection();

                //bind to the events
                this.stateCollection.on("added", this.onStateAdded, this);
                this.stateCollection.on("removed", this.onStateRemoved, this)
                this.connectionCollection.on("added", this.onConnectionAdded, this);
                this.connectionCollection.on("removed", this.onConnectionRemoved, this);

                this.stateViews = [];
                this.connectionViews = [];
            },
            onStateAdded: function(state, that) {
                //create the new state view
                //ensure the state doesn't already have a view.
                /*if (that.scope.renderer.select("g[data-guid='" + state._guid + "']") !== null) {
                    return true;
                }*/
                var stateView = new StateView(state);
                that.scope.stateViews.push(state);
                stateView.render(that.scope.renderer);
                that.scope.el.add(stateView.el);

                //add ports event listeners
                var onInPortDrag = function(scope) {
                    var dragLine = this.self.renderer.select("line#dragLine");
                    var x = Number(dragLine.attr("x1"));
                    var y = Number(dragLine.attr("y1"));
                    dragLine.attr({
                        "x2": scope.x,
                        "y2": scope.y
                    })
                };

                var onInPortDragStart = function() {
                    if (!self.renderer.select("line#dragLine")) {
                        //create the drag line
                        var connectorPoint = this.portView.getConnectorPoint();
                        self.renderer.line(connectorPoint.x,
                            connectorPoint.y,
                            connectorPoint.x,
                            connectorPoint.y)
                            .attr({
                                "class": "dragLine",
                                "id": "dragLine"
                            }).data("view", this.portView);
                    }
                };
                var onInPortDragEnd = function() {
                    //todo: check if we're hovered over 
                    //and existing port
                    var dragLine = this.self.renderer.select("line#dragLine");
                    var toPort = this.self.hoveredPort;
                    if (toPort) {
                        var fromPort = dragLine.data("view").model;
                        //create a new connection
                        this.self.connectionCollection.addConnection(new Connection(fromPort, toPort));
                    }
                    dragLine.remove();
                }

                var self = that.scope;
                _.forEach(stateView.outPortViews, function(portView) {
                    var context = {
                        self: self,
                        portView: portView
                    };
                    portView.on("dragstarting", onInPortDragStart, context);
                    portView.on("dragending", onInPortDragEnd, context);
                    portView.on("dragging", onInPortDrag, context);
                })

                /* hover listeners */
                var onInPortHoverIn = function(scope) {
                    var dragLine = this.self.renderer.select("line#dragLine");
                    if (dragLine) {
                        //we have a drag line now ensure that this
                        //is a port we can connect to
                        var toPort = this.portView.model;
                        var fromPort = dragLine.data("view").model;

                        if (!toPort.connection) {
                            //create a new connection
                            //todo: type validation

                            this.self.hoveredPort = toPort;
                        }
                    }
                }

                var onInPortHoverOut = function(scope) {
                    self.hoveredPort = undefined;
                }

                _.forEach(stateView.inPortViews, function(portView) {
                    var scope = {
                        self: self,
                        portView: portView
                    };
                    portView.on("hoverin", onInPortHoverIn, scope);
                    portView.on("hoverout", onInPortHoverOut, scope);
                });
            },
            onStateRemoved: function(state, that) {
                //first remove any connections to the ports
                //of this state
                //now remove the state view by looking it up by GUID
                console.log("state removed");
            },
            onConnectionAdded: function(connection, that) {
                //create the new connection
                var connectionView = new ConnectionView(connection);
                connectionView.render(that.scope.renderer);
                var connectionGroup = that.scope.renderer.select("#connection-group");
                connectionGroup.add(connectionView.el);
            },
            onConnectionRemoved: function(connection) {
                //drop the connection from the attached ports

                //remove the connection by looking up
                //the guid
                console.log("connection removed");
            }
        })
        return WorkspaceView
    });