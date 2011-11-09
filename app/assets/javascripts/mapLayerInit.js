// increase reload attempts 
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 2;
// Définitions des bords de la Bretagne
var bzhBounds = new OpenLayers.Bounds(33534.34825,6584909.31255,503163.44995,6897995.38035);

var map, layer, measureControls;

//style pour les mesures

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
measureControls = {
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
  $("#map").height(window_height - offset_map);

  var bounds = new OpenLayers.Bounds(
                    145607.334, 6740620.908,
                    389330.671, 6868799.426
                );

  var mapOptions = {
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
            new OpenLayers.Control.ZoomPanel(),
            new OpenLayers.Control.Navigation()
    ]
  };

  map =  new OpenLayers.Map( 'map', mapOptions ); // format.read(request.responseText, {map: mapOptions});
  var fond_carto = new OpenLayers.Layer.WMS(
    "Fond Cartographique","http://geo.devel.dotgee.fr/geoserver/wms",
    {
      layers: 'region-bretagne_region_2154',
      format: 'image/png'
    },
    {
      transitionEffect: 'resize',
      singleTile: true,
      transparent: true,
      opacity: 0.5,
      displayInLayerSwitcher:false,
      isBaseLayer: true
    }
  );
  map.addLayer(fond_carto);

  layer = new OpenLayers.Layer.WMS(layerTitle,
                                   layerWmsUrl,
                                   {
                                       layers: layerNames,
                                       transparent: true
                                   }, {
                                       opacity: 0.8,
                                       singleTile: true
                                   });
  
    map.addLayer(layer); var controls = [
    new OpenLayers.Control.PanZoomBar()
    
    ];
    map.addControls(controls);
    var control;
    for(var key in measureControls) {
      control = measureControls[key];
      control.events.on({
        "measure": handleMeasurements,
        "measurepartial": handleMeasurements
      });
      map.addControl(control);
    }
    $('#ruler_measure, #square_measure').click(function(e){
      e.preventDefault();
       for(key in measureControls) {
          var control = measureControls[key];
          if($(this).attr('measure_type') == key ){
            control.activate();
          }else{
            control.deactivate();
          }
        }
    });

    $('#hand_control').click(function(e){
      e.preventDefault();
       for(key in measureControls) {
          var control = measureControls[key];
          control.deactivate();
        }
    });
    map.zoomToMaxExtent();
    //choix des couches
    $.each(map.layers, function(i, layer){
      var class_name = '.'+uniq_identifier_from_layer(layer);
      $(class_name).each(function(i,el){
          $(el).addClass('added_layer');
          $(el).attr('layer_id', layer.id);
        });
    });
    $('#container').viewer('resizeChooser');

});

function uniq_identifier_from_layer(layer){
  var name = layer.url+"_" +layer.params.LAYERS 
  name = $.trim(name).replace(/[^A-Za-z0-9_]/g,'_');
  return name;
}
