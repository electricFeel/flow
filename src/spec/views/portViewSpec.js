describe("View :: PortView", function() {
    var inPort;
    var outPort;

    var mockInPortDef = {
        direction: "in",
        acceptedTypes: ['numeric']
    };

    var mockOutPortDef = {
        direction: "out",
        outputType: "numeric"
    };

    beforeEach(function() {
        var that = this;
        var done = false;
        require(['models/port', 'views/portview', 'snap', 'jquery'], function(Port, PortView, Snap, $) {
            that.InPort = Port.InPort;
            that.OutPort = Port.OutPort;
            that.InPortView = PortView.InPortView;
            that.OutPortView = PortView.OutPortView;
            that.Snap = Snap;
            that.$ = $;

            //append the SVG to the body
            $('body').append('<svg id="workspace" width="100" height="100"></svg>')
            that.renderer = Snap("#workspace");

            done = true;
        })

        waitsFor(function() {
            return done;
        }, "Views loaded");
    });

    afterEach(function() {
        this.renderer = null;
        this.$("#workspace").remove();
    });

    describe("Render View", function() {
        it("Should render the in port at the correct position", function() {
            var port = new this.InPort(mockInPortDef);
            expect(inPort).not.toBe(null);

            var portView = new this.InPortView(port);
            portView.render(this.renderer, 20, 25);
            var id = port._guid;
            var el = this.$("circle[data-guid=" + id + "]");
            expect(el.length).toBe(1);
            expect(Number(el.attr("cx"))).toBe(20);
            expect(Number(el.attr("cy"))).toBe(25);
            expect(el.attr("data-direction")).toBe("in");
        });

        it("should render the out port at the correct position", function() {
            var port = new this.OutPort(mockOutPortDef);
            expect(port).not.toBe(null);

            var portView = new this.OutPortView(port);
            portView.render(this.renderer, 20, 25);
            var id = port._guid;
            var el = this.$("circle[data-guid=" + id + "]");
            expect(el.length).toBe(1);
            expect(Number(el.attr("cx"))).toBe(20);
            expect(Number(el.attr("cy"))).toBe(25);
            expect(el.attr("data-direction")).toBe("out");
        });
    });
});