define(["Stapes"], function(Stapes, Connection) {
    var Port = Stapes.subclass({
        init: function(def) {},
        constructor: function(def) {
            //do the initalization here
            this.direction = def.direction;
            this.def = def;
            this.init(def);
        },
        setConnection: function(connection) {
            if (this.connection) {
                throw new Error("connection already set");
            } else {
                this.connection = connection;
                this.emit("connection set");
            }
        },
        dropConnection: function() {
            this.connection = undefined;
            this.emit("connection dropped");
        }
    });

    var InPort = Port.subclass({
        constructor: Port.prototype.constructor,
        init: function(def) {
            if (!def.hasOwnProperty("acceptedTypes")) {
                throw new Error("Must define accepted types for port");
            }
            this.acceptedTypes = def.acceptedTypes;
        }
    });

    var OutPort = Port.subclass({
        constructor: Port.prototype.constructor,
        init: function(def) {
            this.outputType = def.outputType;
        },
    })

    return {
        InPort: InPort,
        OutPort: OutPort
    };
});