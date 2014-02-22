define(["Stapes", "lodash", "models/port", "models/connection", "views/portView"],
    function(Stapes, _, Port, Connection, PortView) {
        var ConnectionView = Stapes.subclass({
            constructor: function(model) {
                if (!(model instanceof Connection)) {
                    throw new Error("ConnectionView must have a Connection object to bind to");
                }
                this.model = model;
                //todo bind to model events
            },
            render: function(renderer) {
                //make sure that ALL components have a GUID assigned
                //to the DOM. The ConnectionView is going to use
                //this for lookup to draw points.

                //get the port-views
                var toPortView = renderer.select("[data-guid='" + this.model.to._guid + "']").data("view");
                var fromPortView = renderer.select("[data-guid='" + this.model.from._guid + "']").data("view");
                if (!toPortView || !fromPortView) {
                    //there are no port views for those ports
                    console.log("can't find port views");
                    return;
                }
                this.toPortView = toPortView;
                this.fromPortView = fromPortView;
                this.constructElement(renderer);
            },
            constructElement: function(renderer) {
                this.el = renderer.path(this.buildPath()).attr({
                    "class": "connector"
                });
                //add listeners to the ports attached
                this.toPortView.on("moved", this.redraw, this);
                this.fromPortView.on("moved", this.redraw, this);
            },
            buildPath: function() {
                var startLocation = {
                    x: Number(this.fromPortView.circle.attr("cx")),
                    y: Number(this.fromPortView.circle.attr("cy"))
                };
                var endLocation = {
                    x: Number(this.toPortView.circle.attr("cx")),
                    y: Number(this.toPortView.circle.attr("cy"))
                };

                function computeTangentOffset(pt1, pt2) {
                    return (pt2.x - pt1.x) / 2;
                };

                function sourceTangentX(pt1, pt2) {
                    return pt1.x + computeTangentOffset(pt1, pt2);
                }

                function sourceTangentY(pt1, pt2) {
                    return pt1.y;
                }

                function destTangentX(pt1, pt2) {
                    return pt2.x - computeTangentOffset(pt1, pt2);
                }

                function destTangentY(pt1, pt2) {
                    return pt2.y;
                }

                var retPath = "M " + startLocation.x + " " + startLocation.y;
                retPath += " C " + sourceTangentX(startLocation, endLocation) + ", " + startLocation.y;
                retPath += " " + destTangentX(startLocation, endLocation) + ", " + destTangentY(startLocation, endLocation);
                retPath += " " + endLocation.x + ", " + endLocation.y;

                return retPath;
            },
            redraw: function(scope) {
                this.el.attr({
                    "d": this.buildPath()
                });
            }
        });

        return ConnectionView;
    });