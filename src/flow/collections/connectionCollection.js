define(["Stapes", "lodash", "flow/models/connection"], function(Stapes, _, Connection) {
    var ConnectionCollection = Stapes.subclass({
        constructor: function() {
            this.connections = [];
        },

        addConnection: function(connection) {
            if (!(connection instanceof Connection)) {
                throw new Error("Can only add Connection instances to the ConnectionCollection");
            }
            //ensure the connection isn't already in the collection
            if (_.some(this.connections, {
                "_guid": connection._guid
            })) {
                throw new Error("Only on instance of the connection may be added to the collection");
            }

            //other wise add and emit the connection added event
            this.connections.push(connection);
            this.emit("added", connection);
        },

        removeConnection: function(connection) {
            if (!_.some(this.connections, {
                "_guid": connection._guid
            })) {
                throw new Error("Connection not found in collection");
            }
            _.remove(this.connections, connection);
            this.emit("removed", connection);
        },

        getLength: function() {
            return this.connections.length;
        }
    });

    return ConnectionCollection;
});