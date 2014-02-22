describe("Model :: Connection", function() {
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
    var Connection;

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
        it('should create a connection', function() {
            var inPort = new this.InPort(mockInPortDef);
            var outPort = new this.OutPort(mockOutPortDef);
            var connection = new this.Connection(outPort, inPort);

            expect(connection).not.toBe(null);
            expect(connection.from).toBe(outPort);
            expect(connection.to).toBe(inPort);

            expect(inPort.connection).toBe(connection);
            expect(outPort.connection).toBe(connection);
        });

        it('should throw when the the wrong types are passed', function() {
            var inPort = new this.InPort(mockInPortDef);
            var outPort = new this.OutPort(mockOutPortDef);
            var that = this;
            expect(function() {
                new that.Connection(inPort, outPort)
            }).toThrow(Error("the fromPort must be an outPort instance"));
        })
    });

    describe('DropConnection', function(){
        it('should drop the connection from both ports', function(){
            var inPort = new this.InPort(mockInPortDef);
            var outPort = new this.OutPort(mockOutPortDef);
            var that = this;
            var connection = new this.Connection(outPort, inPort);

            expect(connection).not.toBe(null);
            expect(connection.from).toBe(outPort);
            expect(connection.to).toBe(inPort);

            connection.dropConnection();

            expect(inPort.connection).toBe(undefined);
            expect(outPort.connection).toBe(undefined);


        });
    });
})
