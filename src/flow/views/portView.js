define(["Stapes", "lodash", "models/port", "models/connection"],
    function(Stapes, _, Port, Connection) {
        var PortView = Stapes.subclass({
            constructor: function() {

            },
            render: function(renderer, xPosition, yPosition) {
                //add guid to dom element
                if (!this.el) {
                    this.constructElement(renderer, xPosition, yPosition);
                }
            },
            constructElement: function(renderer, xPosition, yPosition) {
                this.el = renderer.circle(xPosition, yPosition, this.radius);
                this.el.attr({
                    "data-direction": this.model.direction,
                    "data-guid": this.model._guid,
                    "class": this.model.def.cssClass || "port"
                });
                this.el.data("view", this);
                this.attachEvents();
            },
            attachEvents: function() {},
            move: function(xPosition, yPosition) {
                this.el.attr({
                    "cx": xPosition,
                    "cy": yPosition
                });
                console.log("moving");
                this.emit("moved");
            }
        });
        var InPortView = PortView.subclass({
            constructor: function(model) {
                if (!(model instanceof Port.InPort)) {
                    throw new Error("InPortView must have a InPort object to bind to");
                }
                this.model = model;
                this.radius = this.model.radius || 5;
                //todo bind to model events
            },
            attachEvents: function() {
                /* Hover Events */
                var onHoverIn = function() {
                    this.emit("hoverin", this);
                }

                var onHoverOut = function() {
                    this.emit("hoverout", this);
                }

                this.el.hover(onHoverIn, onHoverOut, this, this);
            },
            getConnectorPoint: function() {
                var x = Number(this.el.attr("cx")) - Number(this.el.attr("r")) - 2;
                var y = Number(this.el.attr("cy"));
                return {
                    x: x,
                    y: y
                };
            }
        });
        var OutPortView = PortView.subclass({
            constructor: function(model) {
                if (!(model instanceof Port.OutPort)) {
                    throw new Error("InPortView must have a InPort object to bind to");
                }
                this.model = model;
                this.radius = this.model.radius || 5;
                //todo bind to model events
            },
            attachEvents: function() {
                /* Drag events */
                var onDrag = function(dx, dy, x, y) {
                    var position = {
                        dx: dx,
                        dy: dy,
                        x: x,
                        y: y
                    };
                    this.emit("dragging", position);
                };
                var onDragStart = function() {
                    this.emit("dragstarting");
                };
                var onDragEnd = function() {
                    this.emit("dragending");
                }
                this.el.drag(onDrag, onDragStart, onDragEnd, this, this, this);
            },
            getConnectorPoint: function() {
                var x = Number(this.el.attr("cx"));
                var y = Number(this.el.attr("cy"));
                return {
                    x: x,
                    y: y
                };
            }
        });
        return {
            InPortView: InPortView,
            OutPortView: OutPortView
        }
    }
);
