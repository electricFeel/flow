define(["Stapes", "lodash", "models/port"], function(Stapes, _, Port) {
    var State = Stapes.subclass({
        constructor: function(def) {
            this.def = def;
            this.componentID = def.componentID;
            //do the initalization here
            var that = this;
            if (def.hasOwnProperty("inPorts")) {
                this.inPorts = [];
                _.forEach(def.inPorts, function(port) {
                    that.inPorts.push(new Port.InPort(port));
                });
            }

            if (def.hasOwnProperty("outPorts")) {
                this.outPorts = [];
                _.forEach(def.outPorts, function(port) {
                    that.outPorts.push(new Port.OutPort(port));
                });
            }
        }
    });
    return State;
});