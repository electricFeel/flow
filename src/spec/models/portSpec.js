describe("Model :: Port", function() {
    var mockInPortDef = {
        direction: "in",
        acceptedTypes: ['numeric']
    }

    var mockOutPortDef = {
        direction: "out",
        outputType: "numeric"
    }

    var InPort;
    var OutPort;

    beforeEach(function() {
        var that = this;
        var done = false;
        require(['models/port', 'models/connection'], function(Port, Connection) {
            that.InPort = Port.InPort;
            that.OutPort = Port.OutPort;
            that.Connection = Connection;
            done = true;
        })

        waitsFor(function() {
            return done;
        }, "Model loaded");
    });

    afterEach(function() {});

    describe('Create', function() {
        it('should create an in port', function() {
            var inPort = new this.InPort(mockInPortDef);
            expect(inPort).not.toBe(null);
            expect(inPort.direction).not.toBe(null);
            expect(inPort.direction).toBe("in");
            expect(inPort.acceptedTypes).toBeDefined();
            expect(inPort.acceptedTypes).toContain('numeric');
        });

        it('should create an out port', function() {
            var outPort = new this.OutPort(mockOutPortDef);
            expect(outPort).not.toBe(null);
            expect(outPort.direction).toBe("out");
            expect(outPort.outputType).toBe("numeric");
        });
    });

    describe('AddConnection', function() {
        it("should add a connection to the port", function() {
            var inPort = new this.InPort(mockInPortDef);
            var outPort = new this.OutPort(mockOutPortDef);
            var connection = new this.Connection(outPort, inPort);

            expect(inPort.connection).toBe(connection);
            expect(outPort.connection).toBe(connection);
        })
    })

    describe('DropConnection', function() {
        it("should drop the connection from the ports", function() {
            var inPort = new this.InPort(mockInPortDef);
            var outPort = new this.OutPort(mockOutPortDef);
            var connection = new this.Connection(outPort, inPort);

            expect(inPort.connection).toBe(connection);
            expect(outPort.connection).toBe(connection);

            inPort.dropConnection();
            outPort.dropConnection();

            expect(inPort.connection).toBeUndefined();
            expect(outPort.connection).toBeUndefined();
        });
    })

});