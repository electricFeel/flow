define(["Stapes", "lodash" ,"models/state"], function(Stapes, _, State){
	var StateCollection = Stapes.subclass({
		constructor: function(){
			this.states = [];
		},

		addState: function(state){
			if(!(state instanceof State)){
				throw new Error("Can only add State instances to the StateCollection");
			}
			//ensure the state isn't already in the collection
			if(_.some(this.states, {"_guid": state._guid})){
				throw new Error("Only on instance of the state may be added to the collection");
			}

			//other wise add and emit the state added event
			this.states.push(state);
			this.emit("added", state);
		},

		removeState: function(state){
			if(!_.some(this.states, {"_guid": state._guid})){
				throw new Error("State not found in collection");
			}
			console.log("removing state from collection");
			_.remove(this.states, state);
			this.emit("removed", state);
		},

		getLength: function(){
			return this.states.length;
		}
	});

	return StateCollection;
});