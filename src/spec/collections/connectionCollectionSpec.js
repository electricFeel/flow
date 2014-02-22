describe("Collection :: ConnectionCollection", function() {

    var mockInPortDef = {
        direction: "in",
        acceptedTypes: ['numeric']
    }

    var mockOutPortDef = {
        direction: "out",
        outputType: "numeric"
    }

    beforeEach(function() {
        var that = this;
        var done = false;

        require(['models/connection', 'models/port', 'collections/connectionCollection', 'models/state'],
            function(Connection, Port, ConnectionCollection, State) {
                that.Connection = Connection;
                that.ConnectionCollection = ConnectionCollection;
                that.State = State;
                that.InPort = Port.InPort;
                that.OutPort = Port.OutPort;
                done = true;
            }
        );

        waitsFor(function() {
            return done;
        }, 'Collection loaded');
    });

    afterEach(function() {});

    describe('Create', function() {
        it('should create a ConnectionCollection', function() {
            var collection = new this.ConnectionCollection();
            expect(collection).not.toBe(null);
        });
    });

    describe('addConnection', function() {
        it('should add a connection to the collection', function() {
            var collection = new this.ConnectionCollection();
            var inPort = new this.InPort(mockInPortDef);
            var outPort = new this.OutPort(mockOutPortDef);
            var connection = new this.Connection(outPort, inPort);
            collection.addConnection(connection);

            expect(collection.getLength()).toEqual(1);
        });

        it('should throw when an incorrect object is passed', function() {
            var collection = new this.ConnectionCollection();
            expect(function() {
                collection.addConnection({})
            }).toThrow();
        })

        it('should throw when a connection with the same guid exists in the collection', function() {
            var collection = new this.ConnectionCollection();
            var inPort = new this.InPort(mockInPortDef);
            var outPort = new this.OutPort(mockOutPortDef);
            var connection = new this.Connection(outPort, inPort);
            collection.addConnection(connection);
            expect(function() {
                collection.addConnection(connection);
            });
        });
    });

    describe('remove connection', function() {
        it('should remove a connection from the collection', function() {
            var collection = new this.ConnectionCollection();
            var inPort = new this.InPort(mockInPortDef);
            var outPort = new this.OutPort(mockOutPortDef);
            var connection = new this.Connection(outPort, inPort);
            collection.addConnection(connection);

            expect(collection.getLength()).toEqual(1);

            collection.removeConnection(connection);

            expect(collection.getLength()).toEqual(0);
        });

        it('should throw when removing a state not in the collection', function() {
            var collection = new this.ConnectionCollection();
            var inPort = new this.InPort(mockInPortDef);
            var outPort = new this.OutPort(mockOutPortDef);
            var connection = new this.Connection(outPort, inPort);

            expect(function() {
                collection.removeConnection(connection);
            }).toThrow();
        })
    })
});
