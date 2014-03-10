define(["Stapes", "flow/models/state", "flow/views/PortView"], function(Stapes, State, PortView) {
    var StateView = Stapes.subclass({
        constructor: function(model, viewOnly) {
            if (!(model instanceof State)) {
                throw new Error("StateView must have an instance of State to bind to in the constructor");
            }

            if (viewOnly) {
                this.viewOnly = viewOnly;
            } else {
                viewOnly = false;
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
                if (!xPosition) {
                    if (this.model.def.x) {
                        xPosition = Number(this.model.def.x);
                    }
                }

                if (!yPosition) {
                    if (this.model.def.y) {
                        yPosition = Number(this.model.def.y);
                    }
                }
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
            var maxLeft = 0;
            _.forEach(this.inPortViews, function(port) {
                maxLeft = Math.max(maxLeft, port.model.def.text.width('Helvetica, sans-serif'));
            });

            var maxRight = 0;
            _.forEach(this.outPortViews, function(port) {
                maxRight = Math.max(maxRight, port.model.def.text.width('Helvetica, sans-serif'));
            });


            var rect = renderer.rect().attr({
                "class": this.model.def.cssClass || "state",
                "x": xPosition || 10,
                "y": yPosition || 10,
                "width": maxLeft + maxRight || this.model.def.width,
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
            if (!viewOnly) {
                this.attachEvents();
            }
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
                    port.circle.attr({
                        "original-x": port.circle.attr("cx"),
                        "original-y": port.circle.attr("cy")
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
                    port.circle.attr({
                        "original-x": "",
                        "original-y": ""
                    })
                })
            }
            var onDrag = function(dx, dy, x, y) {
                var rect = this.el.select("rect[data-background=true]");

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
                    var x = port.circle.attr("original-x");
                    var y = port.circle.attr("original-y");
                    var lx = dx + Number(x);
                    var ly = dy + Number(y);
                    port.move(lx, ly);
                })
            }

            var toggleSelect = function() {
                var rect = this.el.select("rect[data-background=true]");
                if (!rect.hasClass('selected')) {
                    this.select();
                } else {
                    this.unselect();
                }
            }

            var rect = this.el.select("rect[data-background=true]");
            rect.drag(onDrag, onDragStart, onDragEnd, this, this, this);
            rect.dblclick(toggleSelect, this);
            //listen to events coming from the port

        },
        select: function() {
            var rect = this.el.select("rect[data-background=true]");
            rect.addClass('selected');
            this.emit('selected');
        },
        unselect: function() {
            var rect = this.el.select("rect[data-background=true]");
            if (rect.hasClass("selected")) {
                rect.removeClass('selected');
                this.emit('unselected');
            }
        }
    });
    return StateView;
});
