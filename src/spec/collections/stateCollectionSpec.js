describe("Collection :: StateCollection", function() {
    var collection;

    beforeEach(function() {
        var that = this;
        var done = false;

        require(['models/state', 'collections/stateCollection'],
            function(State, StateCollection) {
                that.State = State;
                that.StateCollection = StateCollection;
                done = true;
            }
        );

        waitsFor(function() {
            return done;
        }, 'Collection loaded');
    });

    afterEach(function() {});

    describe('Create', function() {
        it('should create a StateCollection', function() {
            var collection = new this.StateCollection();
            expect(collection).not.toBe(null);
        });
    });

    describe('addState', function() {
        it('should add a state to the collection', function() {
            var mockStateDef = {
                componentID: 0,
                inPorts: [],
                outPorts: []
            }
            var stateCollection = new this.StateCollection();
            var state = new this.State(mockStateDef);
            stateCollection.addState(state);
        });

        it('should throw when an incorrect object is passed', function(){
        	var stateCollection = new this.StateCollection();
        	expect(function(){stateCollection.addState({})}).toThrow();
        })

        it('should throw when a state with the same guid exists in the collection', function(){
        	var mockStateDef = {
                componentID: 0,
                inPorts: [],
                outPorts: []
            }
            var stateCollection = new this.StateCollection();
            var state = new this.State(mockStateDef);
            stateCollection.addState(state);
            expect(function(){stateCollection.addState(state)}).toThrow();
        });
    });

	describe('removeState', function(){
		it('should remove a state from the collection', function(){
			var mockStateDef = {
                componentID: 0,
                inPorts: [],
                outPorts: []
            }
            var stateCollection = new this.StateCollection();
            var state = new this.State(mockStateDef);

            stateCollection.addState(state);
            expect(stateCollection.getLength()).toEqual(1);

            stateCollection.removeState(state);
            expect(stateCollection.getLength()).toEqual(0);
		});

		it('should throw when removing a state not in the collection', function(){
			var mockStateDef = {
                componentID: 0,
                inPorts: [],
                outPorts: []
            }
            var stateCollection = new this.StateCollection();
            var state = new this.State(mockStateDef);

            expect(function(){
            	stateCollection.removeState(state);
            }).toThrow();
		})
	})
});
