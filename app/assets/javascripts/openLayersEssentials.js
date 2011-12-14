OpenLayers.IMAGE_RELOAD_ATTEMPTS = 2;
//OpenLayers.ImgPath = "http://js.mapbox.com/theme/dark/"; 
OpenLayers.ImgPath = "/assets/openlayers/";
OpenLayers.ProxyHost = "http://geocms.devel.dotgee.fr/proxy.php?url=";
//var bzhBounds = new OpenLayers.Bounds(33534.34825,6584909.31255,503163.44995,6897995.38035);
var map, layer, measureControls, mapOptions;
var format = new OpenLayers.Format.WMC();
var gg = new OpenLayers.Projection("EPSG:4326");
var lb = new OpenLayers.Projection("EPSG:2154");

// Mesures 
var sketchSymbolizers = {
    "Point": {
        pointRadius: 3,
        graphicName: "square",
        fillColor: "white",
        fillOpacity: 1,
        strokeWidth: 1,
        strokeOpacity: 1,
        strokeColor: "#333333"
    },
    "Line": {
        strokeWidth: 2,
        strokeOpacity: 1,
        strokeColor: "#666666",
        strokeDashstyle: "dash"
    },
    "Polygon": {
        strokeWidth: 2,
        strokeOpacity: 1,
        strokeColor: "#666666",
        fillColor: "white",
        fillOpacity: 0.3
    }
};
var style = new OpenLayers.Style();
style.addRules([ new OpenLayers.Rule({symbolizer: sketchSymbolizers}) ]);

var styleMap = new OpenLayers.StyleMap({"default": style});
var renderer = OpenLayers.Layer.Vector.prototype.renderers;
measureControls =
 {
              line: new OpenLayers.Control.Measure(
                  OpenLayers.Handler.Path, {
                      persist: true,
                      handlerOptions: {
                          layerOptions: {
                              renderers: renderer,
                              styleMap: styleMap
                          }
                      }
                  }
              ),
              polygon: new OpenLayers.Control.Measure(
                  OpenLayers.Handler.Polygon, {
                      persist: true,
                      handlerOptions: {
                          layerOptions: {
                              renderers: renderer,
                              styleMap: styleMap
                          }
                      }
                  }
              )
 };
          
function handleMeasurements(event) {
    var geometry = event.geometry;
    var units = event.units;
    var order = event.order;
    var measure = event.measure;
    var element = document.getElementById('output_measure');
    var out = "";
  console.log(event);
    if(order == 1) {
        out += "Distance: " + measure.toFixed(3) + " " + units;
    } else {
        out += "Surface: " + measure.toFixed(3) + " " + units + "<sup>2</" + "sup>";
    }
    element.innerHTML = out;
} 

$(document).ready(function() {

  var window_height = $(window).height();
  var offset_map = $("#map").offset().top;
  $('#content').viewer({ map: map, accordionPosition: "right"});
  $("#map, #tabs").height(window_height - offset_map);

  var bounds = new OpenLayers.Bounds(
                    145607.334, 6740620.908,
                    389330.671, 6868799.426
                );

  mapOptions = {
    div: "map",
    allOverlays: true,
    transitionEffect: "resize",
    maxExtent: bounds,
    projection: "EPSG:2154",
    // maxResolution: 952.0442851562499,
    resolutions:  [
        156543.0339, 78271.51695, 39135.758475, 19567.8792375, 9783.93961875, 4891.969809375, 2445.9849046875, 1222.99245234375, 611.4962261718748,
        305.7481130859374, 152.87405654296887, 76.43702827148444, 38.21851413574208, 19.10925706787104, 9.55462853393552, 4.77731426696776, 2.38865713348388,
        1.1943285667420798, 0.5971642833710399, 0.29858214168551994
    ],
    units: "m",
    theme: null,
    controls: [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.Navigation()
    ]
  };
});
