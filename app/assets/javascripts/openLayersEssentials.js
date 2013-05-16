OpenLayers.IMAGE_RELOAD_ATTEMPTS = 2;
//OpenLayers.ImgPath = "http://js.mapbox.com/theme/dark/"; 
OpenLayers.ImgPath = "/assets/openlayers/";
OpenLayers.ProxyHost = openLayersProxy;
//var bzhBounds = new OpenLayers.Bounds(33534.34825,6584909.31255,503163.44995,6897995.38035);
var map, layer, measureControls, mapOptions;
var format = new OpenLayers.Format.WMC();
var gg = new OpenLayers.Projection("EPSG:4326");
var lb = new OpenLayers.Projection("EPSG:2154");
var bounds = new OpenLayers.Bounds(
      34184.0247,6688076.005612,488561.557113,6902847.000747
      //86878.668816,6646251.990767,421205.98828,6925016.840234
                  //95607.334, 6700620.908, 419330.671, 6908799.426
                  //6900086.368579, 6685315.3734442,
                  //475949.43696034, 52051.888087183
            );

var scales = [ 
      34123.673335484,
      60000.00000017669,
      120000.00000035002,
      249999.9999999981,
      449999.99999998155,
      599999.9999999943,
];
var w_width = $(window).width()
if(w_width > 1280){
      scales.push(800000.0000001004)
}else{
  scales.push(1000000.0000001004)
  if(w_width <= 1024) {
    scales.push(1200000.0000001004)
  }
}

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
