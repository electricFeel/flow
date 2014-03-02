define(["Stapes", "flow/models/port"], function(Stapes, Port) {
    var Connection = Stapes.subclass({
        constructor: function(fromPort, toPort) {
            if (!(fromPort instanceof Port.OutPort)) {
                throw new Error("the fromPort must be an outPort instance")
            }

            if (!(toPort instanceof Port.InPort)) {
                throw new Error("the toPort must be an inPort instance")
            }

            this.from = fromPort;
            this.to = toPort;

            this.from.setConnection(this);
            this.to.setConnection(this);
        },
        /**
         * Drops the connection from the two endpoints
         */
        dropConnection: function() {
            this.from.dropConnection();
            this.to.dropConnection();
        }
    });
    return Connection;
});