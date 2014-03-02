define(
    ['angular', 
     'palette-box/controllers/palettecontroller', 
     'palette-box/directives/componentDirective',
     'flow/module'],
    function(ng, PaletteCtrl, ComponentDirective, flow) {
        var module = angular.module('palette', ['ng','flow']);
        module.controller(PaletteCtrl.name, PaletteCtrl.sig);
        module.directive(ComponentDirective.name, ComponentDirective.sig);
    });
