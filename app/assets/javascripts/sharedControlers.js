function addSharedControlers(map) {

  if(typeof(noresize) == "undefined"){
    $(window).bind("resize", fixSize);
    fixSize(true);
    map.zoomToExtent(bounds);
  }

  /* Controles de mesure */
  var control;
  for(var key in measureControls) {
    control = measureControls[key];
    control.events.on({
      "measure": handleMeasurements,
      "measurepartial": handleMeasurements
    });
    map.addControl(control);
  }

  leftPan.create(map.layers);
  legende.create(map.layers);

  /* Affichage des coordonees */
  map.events.register("mousemove", map, function(e) {
            var pixel = this.events.getMousePosition(e);
            var position = map.getLonLatFromPixel(pixel);
            $("#coords").text("x: "+parseInt(position.lon) + " / y: " + parseInt(position.lat));
  });
  
  // Affichage des features
  var modalBox = $("#modal-feature");
  var featureInfos = new OpenLayers.Control.WMSGetFeatureInfo({
    url: map.layers[0].url, 
    name: "featureInfos",
    queryVisible: true,
    infoFormat: "application/vnd.ogc.gml",
    eventListeners: {
      getfeatureinfo: function(event) {
        output = "";
        if (event.features.length > 0) {
         $.each(event.features, function(i, feature) {
           template = $("#template_"+event.object.layers[0].uniqueID).text();
           output += Mustache.to_html(template,feature.data);
         });
        } 
        if(output != ""){
         modalBox.find("p").html(output);
         modalBox.modal({ backdrop: true });
        } else {
         modalBox.find("p").html("Pas de features à afficher.");
         modalBox.modal({ backdrop: true });
        }
      }
    }
  });
   
  map.addControl(featureInfos);

  $(".slider").slider({
      value: 80,
      orientation: "horizontal",
      range: "min",
      animate: true,
      slide: function(event, ui) {
        var layers = map.getLayersBy("uniqueID", this.id);
        layers[0].setOpacity(ui.value/100);
        $("."+this.id).slider("value", ui.value);
      }
  });

  $( "#btn-geoname" ).autocomplete({
      source: function( request, response ) {
        $.ajax({
          url: "http://ws.geonames.org/searchJSON",
          dataType: "jsonp",
          data: {
            featureClass: "P",
            style: "full",
            maxRows: 10,
            country: "FR",
            adminCode1: "A2",
            name_startsWith: request.term
          },
          success: function( data ) {
            response( $.map( data.geonames, function( item ) {
              return {
                label: item.name + (item.adminName2 ? ", " + item.adminName2 : ""),
                value: item.name,
                lng: item.lng,
                lat: item.lat
              }
            }));
          }
        });
      },
      minLength: 2,
      select: function( event, ui ) {
        var lonlat = new OpenLayers.LonLat(ui.item.lng, ui.item.lat);
        map.setCenter(lonlat.transform(gg, lb), 9);
      },
      create: function() {
        $(".ui-autocomplete").addClass("dropdown-menu").css("cursor", "pointer");
      }
    });

}

function addSlider(element) {
  element.slider({
    value: 80,
    orientation: "horizontal",
    range: "min",
    animate: true,
    slide: function(event, ui) { 
      var layers = map.getLayersBy("uniqueID", this.id);
      layers[0].setOpacity(ui.value/100);
      $("."+this.id).slider("value", ui.value);
    }
  });
}

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
  var element = $('#informations p');
  var out = "";
  if(order == 1) {
      out += "Distance: " + measure.toFixed(3) + " " + units;
  } else {
      out += "Surface: " + measure.toFixed(3) + " " + units + "<sup>2</" + "sup>";
  }
  element.html(out);
}

function fixSize(updateSize) {
  var window_height = $(window).height();
  var offset_map = $("#map").offset().top;
  $('#page-list').height($(window).height());
  $('.tile-page').height($(window).height());
  $("#map").height(window_height - offset_map);
  $('#selected').height( window_height - offset_map);
  if (window.map && (window.map instanceof OpenLayers.Map) && !updateSize) {
    map.updateSize();
  }
}

