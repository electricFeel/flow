require.config({
    baseUrl: "../",
    //urlArgs: 'cb=' + Math.random(),
    paths: {
        jquery: '../../bower_components/jquery/dist/jquery',
        lodash: '../../bower_components/lodash/dist/lodash',
        Stapes: '../../bower_components/stapes/stapes',
        jasmine: '../spec/lib/jasmine',
        'jasmine-html': '../spec/lib/jasmine-html',
        spec: '../spec',
        snap: '../../bower_components/snap.svg/dist/snap.svg',
        "jasmine-jquery": '../../bower_components/jasmine-jquery/lib/jasmine-jquery'
    },
    shim: {
        jquery: {
            exports: "jquery"
        },
        lodash: {
            exports: "_"
        },
        jasmine: {
            exports: "jasmine"
        },
        'jasmine-html': {
            deps: ['jasmine'],
            exports: 'jasmine'
        },
        'jasmine-jquery': {
            deps: ['jasmine'],
            exports: 'jasmine'
        }
    }
});

require(['lodash', 'jquery', 'jasmine-html', 'jasmine-jquery'], function(_, $, jasmine, jjquery) {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };

    var specs = [];

    specs.push("spec/models/portSpec");
    specs.push("spec/models/connectionSpec");
    specs.push("spec/models/stateSpec");
    specs.push("spec/collections/stateCollectionSpec");
    specs.push("spec/collections/connectionCollectionSpec");
    specs.push("spec/views/portViewSpec");
    specs.push("spec/views/stateViewSpec");

    $(function() {
        require(specs, function() {
            jasmineEnv.execute();
        });
    });
});