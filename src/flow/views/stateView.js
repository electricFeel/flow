define(["Stapes", "models/state", "views/PortView"], function(Stapes, State, PortView) {
    var StateView = Stapes.subclass({
        constructor: function(model) {
            if (!(model instanceof State)) {
                throw new Error("StateView must have an instance of State to bind to in the constructor");
            }
            this.model = model;
            this._guid = model._guid;
            this.viewMode = "collapsed";
            //todo: bind to model events
            //create the port views
            var self = this;
            self.inPortViews = [];
            _.forEach(this.model.inPorts, function(port) {
                var inPort = new PortView.InPortView(port);
                self.inPortViews.push(inPort);
            });

            self.outPortViews = [];
            _.forEach(this.model.outPorts, function(port) {
                var outPort = new PortView.OutPortView(port);
                self.outPortViews.push(outPort);
            });
        },
        render: function(renderer, xPosition, yPosition) {
            //renders the view
            if (!this.el) {
                //we need to create the element
                this.constructElement(renderer, xPosition, yPosition);
            }
        },
        constructElement: function(renderer, xPosition, yPosition) {
            this.el = renderer.g().attr({
                "data-guid": this._guid,
                "data-componentid": this.model.def.componentID
            });

            var maxLen = Math.max(this.outPortViews.length, this.inPortViews.length);
            var height = (maxLen * 25);
            var rect = renderer.rect().attr({
                "class": this.model.def.cssClass || "state",
                "x": xPosition || 10,
                "y": yPosition || 10,
                "width": this.model.def.width || 50,
                "height": height,
                "rx": 5,
                "ry": 5,
                "data-background": "true"
            });
            //add the rect to the group

            this.el.add(rect);
            var self = this;
            //height of the state should be defined by the 
            //longest list.
            //

            var outPortGroup = renderer.g().attr({
                "data-outports": "true"
            });

            var inPortGroup = renderer.g().attr({
                "data-inports": "true"
            });

            var x = Number(rect.attr("x"));
            var y = Number(rect.attr("y"));
            this.populatePortViews(renderer, x, y, this.outPortViews, outPortGroup);
            this.populatePortViews(renderer, x, y, this.inPortViews, inPortGroup);
            this.el.add(inPortGroup);
            this.el.add(outPortGroup);
            this.attachEvents();
        },
        populatePortViews: function(renderer, xPosition, yPosition, portViews, group) {
            if (portViews.length <= 0) {
                return;
            }
            var x = xPosition;
            if (portViews[0].model.direction === "out") {
                x += Number(this.el.select("rect").attr("width"));
            }
            var y = yPosition + 15;
            _.forEach(portViews, function(portView) {
                portView.render(renderer, x, y);
                group.add(portView.el);
                y += 25;
            })
        },
        attachEvents: function() {
            var onDragStart = function() {
                var rect = this.el.select("rect[data-background=true]");
                var portViews = this.inPortViews.concat(this.outPortViews);
                rect.attr({
                    "original-x": rect.attr("x"),
                    "original-y": rect.attr("y"),
                })
                _.forEach(portViews, function(port) {
                    port.el.attr({
                        "original-x": port.el.attr("cx"),
                        "original-y": port.el.attr("cy")
                    })
                })
                //todo: stop all animations
            };
            var onDragEnd = function() {
                var rect = this.el.select("rect[data-background=true]");
                var portViews = this.inPortViews.concat(this.outPortViews);
                rect.attr({
                    "original-x": "",
                    "original-y": ""
                })
                _.forEach(portViews, function(port) {
                    port.el.attr({
                        "original-x": "",
                        "original-y": ""
                    })
                })
            }
            var onDrag = function(dx, dy, x, y) {
                var rect = this.el.select("rect[data-background=true]")

                var ox = Number(rect.attr("original-x"));
                var oy = Number(rect.attr("original-y"));

                var m = rect.transform().globalMatrix.clone().invert();

                var lx = dx + ox;
                var ly = dy + oy;

                var x = m.x(lx, ly);
                var y = m.y(lx, ly);


                rect.attr({
                    "x": lx,
                    "y": ly
                });
                var portViews = this.inPortViews.concat(this.outPortViews);
                _.forEach(portViews, function(port) {
                    var x = port.el.attr("original-x");
                    var y = port.el.attr("original-y");
                    var lx = dx + Number(x);
                    var ly = dy + Number(y);
                    port.move(lx, ly);
                })
            }
            this.el.select("rect[data-background=true]")
                .drag(onDrag, onDragStart, onDragEnd, this, this, this);


            //listen to events coming from the port

        }
    });
    return StateView;
});