require.config({
    //baseUrl: "",
    //urlArgs: 'cb=' + Math.random(),
    paths: {
        jquery: '../../bower_components/jquery/dist/jquery',
        lodash: '../../bower_components/lodash/dist/lodash',
        Stapes: '../../bower_components/stapes/stapes',
        snap: '../../bower_components/snap.svg/dist/snap.svg',
        //"snap-zoompan": "plugins/snap-zoompan"
    },
    shim: {
        jquery: {
            exports: "jquery"
        },
        lodash: {
            exports: "_"
        },
        /*"snap-zoompan": {
            depends: ["snap"],
            exports: "snap-zoompan"
        }*/
    }
});

require(['lodash',
        'snap',
        'views/workspaceView',
        'models/state',
        'models/connection',
        'jquery'
    ],
    function(_, Snap, WorkspaceView, State, Connection, $) {
        String.prototype.width = function(font) {
            var f = font || '12px arial',
                o = $('<div>' + this + '</div>')
                    .css({
                        'position': 'absolute',
                        'float': 'left',
                        'white-space': 'nowrap',
                        'visibility': 'hidden',
                        'font': f,
                        //'font-size': 'xx-small'
                    })
                    .appendTo($('body')),
                w = o.width();

            o.remove();

            return w;
        }

        window.flow = {};
        //console.log(zoomPan);
        //Snap.plugin(zoomPan);
        window.snap = Snap("#workspace");
        window.flow.WorkSpace = new WorkspaceView(window.snap);
        window.flow.State = State;
        window.flow.Connection = Connection;

        var stateDef = {
            componentID: 0,
            inPorts: [],
            outPorts: []
        };
        stateDef.inPorts = [{
            direction: "in",
            text: "example input",
            acceptedTypes: ['numeric']
        }];

        stateDef.outPorts = [{
            direction: "out",
            text: "example output",
            outputType: "numeric"
        }, {
            direction: "out",
            text: "example output",
            outputType: "numeric"
        }]

        var stateDef2 = {
            componentID: 1,
            inPorts: [{
                direction: "in",
                text: "number in",
                acceptedTypes: ['numeric', 'string']
            }],
            outPorts: [{
                direction: "out",
                text: "multiplied number",
                outputType: "string"
            }],
            x: 100,
            y: 150
        }

        window.s = new flow.State(stateDef);
        flow.WorkSpace.stateCollection.addState(s);
        flow.WorkSpace.stateCollection.addState(new flow.State(stateDef2));
    }
);