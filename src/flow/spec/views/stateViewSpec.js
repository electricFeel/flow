describe("View :: StateView", function() {
    var stateDef = {};

    beforeEach(function() {
        var that = this;
        var done = false;
        require(['models/state', 'views/stateView', 'views/portView', 'snap', 'jquery'],
            function(State, StateView, PortView, Snap, $) {
                that.State = State;
                that.StateView = StateView;
                that.InPortView = PortView.InPortView;
                that.OutPortView = PortView.OutPortView;
                that.Snap = Snap;
                that.$ = $;

                $('body').append('<svg id="workspace" width="100" height="100"></svg>');
                that.renderer = Snap("#workspace");

                stateDef.inPorts = [{
                    direction: "in",
                    acceptedTypes: ['numeric']
                }];

                stateDef.outPorts = [{
                    direction: "out",
                    outputType: "numeric"
                }, {
                    direction: "out",
                    outputType: "numeric"
                }]

                done = true;
            })

        waitsFor(function() {
            return done;
        }, "View loaded")
    });

    afterEach(function() {
        this.renderer = null;
        this.$("#workspace").remove();
    });

    describe("Render View", function() {
        it("should render the state in the correct position", function() {
            var state = new this.State(stateDef);
            var stateView = new this.StateView(state);
            stateView.render(this.renderer, 20, 25);
            var id = state._guid;
            var el = this.$("g[data-guid=" + id + "]").children("rect");
            expect(el.length).toBe(1);
            expect(Number(el.attr("x"))).toBe(20);
            expect(Number(el.attr("y"))).toBe(25);
        });

        it("should render correct number of inPorts and outPorts", function() {
            var state = new this.State(stateDef);
            var stateView = new this.StateView(state);
            stateView.render(this.renderer, 20, 25);
            var id = state._guid;

            var el = this.$("g[data-outports=true]").children("circle");
            expect(el.length).toBe(2);

            el = this.$("g[data-inports=true]").children("circle");
            expect(el.length).toBe(1);
        });

        it("should render the ports in the correct positions", function() {
            //expect(null).not.toBe(null);
        });
    });
})