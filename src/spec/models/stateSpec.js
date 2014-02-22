describe("Model :: State", function() {
    var mockStateDef = {};

    beforeEach(function() {
        var that = this;
        var done = false;
        require(['models/port', 'models/connection', 'models/state'], function(Port, Connection, State) {
            that.InPort = Port.InPort;
            that.OutPort = Port.OutPort;
            that.Connection = Connection;
            that.State = State;
            done = true;
        })

        waitsFor(function() {
            return done;
        }, "Model lodaded");

        mockStateDef = {
            componentID: 0,
            inPorts: [],
            outPorts: []
        }
    });
    afterEach(function() {
        mockStateDef = {};
    });

    describe('Create', function() {
        it('should create a state', function() {
            var state = new this.State(mockStateDef);
            console.log("going");
            expect(state).not.toBe(null);
            expect(state.inPorts).toBeDefined();
            expect(state.outPorts).toBeDefined();
        });

        it('should create ports', function() {
            mockStateDef.inPorts = [{
                direction: "in",
                acceptedTypes: ['numeric']
            }];

            mockStateDef.outPorts = [{
                direction: "out",
                outputType: "numeric"
            },
            {
                direction: "out",
                outputType: "numeric"
            }]

            var state = new this.State(mockStateDef);
            expect(state).toBeDefined();
            expect(state.inPorts.length).toBe(1);
            expect(state.outPorts.length).toBe(2);
        });
    });
});
