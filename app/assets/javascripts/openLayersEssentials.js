OpenLayers.IMAGE_RELOAD_ATTEMPTS = 2;
//OpenLayers.ImgPath = "http://js.mapbox.com/theme/dark/"; 
OpenLayers.ImgPath = "/assets/openlayers/";
OpenLayers.ProxyHost = "http://geocms.gipbe.dotgee.fr/proxy.php?url=";
//var bzhBounds = new OpenLayers.Bounds(33534.34825,6584909.31255,503163.44995,6897995.38035);
var map, layer, measureControls, mapOptions;
var format = new OpenLayers.Format.WMC();
var gg = new OpenLayers.Projection("EPSG:4326");
var lb = new OpenLayers.Projection("EPSG:2154");
var bounds = new OpenLayers.Bounds(
                  //95607.334, 6700620.908,
                  //419330.671, 6908799.426
                  98037, 6703422,
                  402476, 6886148
            );

var scales = [ 
      266.591197934,
      533.182395867,
      1066.364791734,
      2132.729583468,
      4265.459166936,
      8530.918333871,
      17061.836667742,
      34123.673335484,
      68247.346670968,
      136494.693341936,
      272989.386683873,
      545978.773367746,
      1091957.546735491,
      2183915.093470982,
      4367830.186941965,
      8735660.373883929
];
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
              ),
              zoomin: new OpenLayers.Control.ZoomBox(
                {title:"Zoom in box", out: false}
              )
              /*,
              zoomout: new OpenLayers.Control.ZoomBox(
                {title:"Zoom out box", out: true}
              )
              */
 };
          
function handleMeasurements(event) {
    var geometry = event.geometry;
    var units = event.units;
    var order = event.order;
    var measure = event.measure;
    var element = document.getElementById('output_measure');
    var out = "";
    if(order == 1) {
        out += "Distance: " + measure.toFixed(3) + " " + units;
    } else {
        out += "Surface: " + measure.toFixed(3) + " " + units + "<sup>2</" + "sup>";
    }
    element.innerHTML = out;
} 

function fixSize(updateSize) {
  var window_height = $(window).height();
  var offset_map = $("#map").offset().top;
  $("#map").height(window_height - offset_map);
  $('#tabs .content').height( window_height - offset_map - $('#tabs ul').outerHeight()-10);
  if (window.map && (window.map instanceof OpenLayers.Map) && !updateSize) {
    map.updateSize();
  }
}

$(document).ready(function() {

  $('#content').viewer({ map: map, accordionPosition: "right"});

  mapOptions = {
    div: "map",
    allOverlays: true,
    transitionEffect: "resize",
    projection: "EPSG:2154",
    scales: scales,
    fractionalZoom: true,
    maxExtent: bounds,
    units: "m",
    theme: null,
    controls: [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.Navigation()
    ]
  };
});
