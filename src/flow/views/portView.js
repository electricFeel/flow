define(["Stapes", "lodash", "flow/models/port", "flow/models/connection"],
    function(Stapes, _, Port, Connection) {
        var PortView = Stapes.subclass({
            constructor: function(viewOnly) {
                if (viewOnly) {
                    this.viewOnly = viewOnly;
                } else {
                    viewOnly = false;
                }
            },
            render: function(renderer, xPosition, yPosition) {
                //add guid to dom element
                if (!this.el) {
                    this.constructElement(renderer, xPosition, yPosition);
                }
            },
            constructElement: function(renderer, xPosition, yPosition) {
                this.circle = renderer.circle(xPosition, yPosition, this.radius);
                this.circle.attr({
                    "class": this.model.def.cssClass || "port"
                })
                this.el = renderer.g();
                this.el.attr({
                    "data-direction": this.model.direction,
                    "data-guid": this.model._guid,
                });
                this.el.data("view", this);
                this.el.add(this.circle);
                if (!viewOnly) {
                    this.attachEvents();
                }
                this.renderText(renderer);
            },
            attachEvents: function() {},
            move: function(xPosition, yPosition) {
                this.circle.attr({
                    "cx": xPosition,
                    "cy": yPosition
                });
                this.updateTextLocation();
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

                this.circle.hover(onHoverIn, onHoverOut, this, this);
            },
            getConnectorPoint: function() {
                var x = Number(this.el.attr("cx")) - Number(this.el.attr("r")) - 2;
                var y = Number(this.el.attr("cy"));
                return {
                    x: x,
                    y: y
                };
            },
            renderText: function(renderer) {
                var text = this.model.def.text;
                var textEl = renderer.text(10, 10, text).attr({
                    "class": "input-text"
                });
                this.textel = textEl;
                if (this.textel) {
                    this.textel.attr({
                        "y": Number(this.circle.attr("cy")) + Number(this.circle.attr("r")) / 2,
                        "x": Number(this.circle.attr("cx")) + 8
                    });
                }
                this.el.add(this.textel);
            },
            updateTextLocation: function() {
                if (this.textel) {
                    this.textel.attr({
                        "y": Number(this.circle.attr("cy")) + Number(this.circle.attr("r")) / 2,
                        "x": Number(this.circle.attr("cx")) + 8
                    });
                }
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
                this.circle.drag(onDrag, onDragStart, onDragEnd, this, this, this);
            },
            getConnectorPoint: function() {
                var x = Number(this.circle.attr("cx"));
                var y = Number(this.circle.attr("cy"));
                return {
                    x: x,
                    y: y
                };
            },
            renderText: function(renderer) {
                var text = this.model.def.text;
                var textEl = renderer.text(10, 10, text).attr({
                    "class": "output-text"
                });
                this.textel = textEl;
                var bounds = this.textel.getBBox();
                if (this.textel) {
                    this.textel.attr({
                        "y": Number(this.circle.attr("cy")) + Number(this.circle.attr("r")) / 2,
                        "x": Number(this.circle.attr("cx")) - bounds.w - 8
                    });
                }
                this.el.add(this.textel);
            },
            updateTextLocation: function() {
                if (this.textel) {
                    var bounds = this.textel.getBBox();
                    this.textel.attr({
                        "y": Number(this.circle.attr("cy")) + Number(this.circle.attr("r")) / 2,
                        "x": Number(this.circle.attr("cx")) - bounds.w - 8
                    });
                }
            }
        });
        return {
            InPortView: InPortView,
            OutPortView: OutPortView
        }
    });
