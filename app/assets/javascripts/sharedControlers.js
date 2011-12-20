function addSharedControlers() {
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

  $('#hand_control, #zoomin, #ruler_measure, #square_measure').click(function(e){
    e.preventDefault();
    var btn = $(this);
    $('.measure_control').not(btn).each(function(i,el){
          $(el).removeClass('control_selected');
    });
    btn.addClass('control_selected');
     for(key in measureControls) {
        var control = measureControls[key];
        if($(this).attr('measure_type') == key ){
          control.activate();
        }else{
          control.deactivate();
        }
      }
  });


  /* Retour a la position initiale */

  $('#position_btn').click(function(e){
    e.preventDefault();
    map.zoomToExtent(bounds);  
  });
  
  /* Retour a la position initiale */

  $('#print_btn').click(function(e){
    e.preventDefault();
    try {
      wmc = format.write(map);
    } catch(e) {
      alert("Impossible de creer le WMC");
    }
    $.ajax({
      url: "/geo_contexts/post",
      data: "wmc="+format.write(map),
      type: "POST",
      success: function(data){
            window.location = "/layers/print?wmc="+data;
      }
    });
  });

  $('#realprint_btn').click(function(e){
    e.preventDefault();
    print();
  });

  $('#mapfishapp_btn').click(function(e){
    e.preventDefault();
    $.ajax({
      url: "/geo_contexts/post",
      data: "wmc="+format.write(map),
      type: "POST",
      success: function(data){
            window.location = "http://geobretagne.fr/mapfishapp/?wmc=http://geocms.devel.dotgee.fr/gc/"+data;
      }
    });
  });

  /* Affichage des coordonees */

  map.events.register("mousemove", map, function(e) {
            var pixel = this.events.getMousePosition(e);
            var position = map.getLonLatFromPixel(pixel);
            $("#coords").text("x: "+parseInt(position.lon) + " / y: " + parseInt(position.lat));
  });
  
  
  /* Bouton d'aide */

  $("#help_btn").click(function(e){
    e.preventDefault();
    $.get("/aide",
          function(data) {
            $("<div>"+data.content+"</div>").dialog({width: 500, height: 300, title: "Aide"});
          }, "json");
  });

  // Ajout de la legende et des carte selectionnes
  addLegende(map.layers);
  addSelected(map.layers);

  /* GetFeaturesInfo */

  // Highlight de la carte
  
  select = new OpenLayers.Layer.Vector("Selection", {styleMap: 
                  new OpenLayers.Style(OpenLayers.Feature.Vector.style["select"])
          });
  map.addLayer(select);
  getFeatures = new OpenLayers.Control.GetFeature({
                protocol: OpenLayers.Protocol.WFS.fromWMSLayer(map.layers[0]),
                box: false,
                hover: false,
                multipleKey: "shiftKey",
                toggleKey: "ctrlKey"
            });  
  
  getFeatures.events.register("featureselected", this, function(e) {
      select.addFeatures([e.feature]);
  });
  getFeatures.events.register("featureunselected", this, function(e) {
      select.removeFeatures([e.feature]);
  });
  
  // Affichage de la popup
  var dialog;
  var featureInfos = new OpenLayers.Control.WMSGetFeatureInfo({
    url: map.layers[0].url, 
    queryVisible: true,
    infoFormat: "application/vnd.ogc.gml",
    eventListeners: {
      getfeatureinfo: function(event) {
           if (dialog) {
              dialog.dialog("destroy");
           }
           output = "";
           if (event.features.length > 0) {
            event.features.forEach(function(feature) {
              template = $("#template_"+event.object.layer.uniqueID).text();
              output += Mustache.to_html(template,feature.data);
            });
           } 
           if(output != ""){
              dialog = $("<div title='Feature Info'>" + output + "</div>").dialog();
            } else {
            dialog = $("<div title='Pas de features'>Pas de features &agrave; afficher !</div>").dialog();
          }
        }
      }
    });
   
  // Activation des commandes au click bouton
  map.addControls([featureInfos, getFeatures]);

  $(".btn-features").live("click", function(e){
    e.preventDefault();
    if(featureInfos.active) {
      featureInfos.deactivate();
      getFeatures.deactivate();
      $(".olMap").css("cursor", "");
    } else {
      layer = map.getLayersBy("uniqueID",$(this).attr("layer_id"))[0]; 
      if(layer) {
        featureInfos.url = layer.url;
        featureInfos.layer = layer;
        featureInfos.activate();
        getFeatures.protocol = OpenLayers.Protocol.WFS.fromWMSLayer(layer);
        getFeatures.activate();
        $(".olMap").css("cursor", "crosshair");
      }       
    }
  });


  // Accordeon maison pour les sous categories
  $('.right-menu h3').not('.parent').click(function(e) {
      e.preventDefault();
      $(".children:visible").not($(this).next()).hide("slow");
      $(this).next().slideToggle();
      return false;
    }).next().hide();

  // Tabs bootstrap
  $('#tabs').tabs();
  $('#tabs').bind('change', function(e){
    //pour la légende
    if(e.target.hash && e.relatedTarget.hash){ //nÃ©cessaire sinon bind les checkboxs
      var visible = $('#available .category_description.visible');
      if(visible.length > 0){
        var new_left;
        var legend = $('#legend_container');
        if(e.target.hash == "#selected"){
          new_left =  -(visible.first().outerWidth());
        }else{
          new_left =  visible.first().width();
        }
        legend.legend('move', new_left);
      }
    }
  });
  
  // Affichage des sliders

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

  $(".node-controls .btn-check").live("click", function(e) {
    e.preventDefault();
    var self = $(this);
    layer = map.getLayersBy("uniqueID", self.attr("id").substring(self.attr("id").indexOf("_")+1))[0];
    if(layer.getVisibility()) {
      layer.setVisibility(false);
    } else {
      layer.setVisibility(true);
    }
    self.toggleClass("unchecked");
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
        map.setCenter(lonlat.transform(gg, lb), 6);
      },
      open: function() {
        $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
      },
      close: function() {
        $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
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
// Generation de la legende
function addLegende(layers) {

  var view = { layers: layers, request: '?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=' };
  var template = "{{#layers}}<div class='legende-node' id='{{uniqueID}}_legende'>"+
                    "<p>{{name}}</p>"+
                    "<img onerror='this.src=\"/assets/error.png\"' src='{{url}}{{request}}{{params.LAYERS}}'/>"+
                 "</div>{{/layers}}";
  $("#legende").append(Mustache.to_html(template, view));

}

// Generation des couches selectionnees
function addSelected(layers) {
  var view = { layers: layers };
  var template = "{{#layers}}<div class='selected-node' id='{{uniqueID}}_selected'>"+
                    "<div class='node-infos'>"+
                      "<p>{{name}}</p>"+
                      "<span id='template_{{uniqueID}}'></span>"+
                    "</div>"+
                    "<div class='node-controls'>"+
                      "<a href='#' class='ui-icon-with-text btn-check' id='check_{{uniqueID}}'><span class='ui-icon'></span></a>"+
                      "<a href='#' class='ui-icon-with-text btn-features' layer_id='{{uniqueID}}'><span class='ui-icon ui-icon-info'></span></a>"+
                      "<a href='#' class='ui-icon-with-text btn-save' id='save_{{uniqueID}}'><span class='ui-icon ui-icon-disk'></span></a>"+
                      "<div class='slider' id='{{uniqueID}}'></div>"+
                    "</div>"+
                 "</div>{{/layers}}";
  $("#selected").append(Mustache.to_html(template, view));  
}
