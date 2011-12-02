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

  /* Retour a la position initiale */

  $('#position_btn').click(function(e){
    e.preventDefault();
    map.zoomToMaxExtent();  
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
  
  /* Affichage de la projection */

  $("#projection").text(map.getProjection());

  // Ajout de la legende initiale
  var data = {'layers' : map.layers,
              'url' : 'http://geo.devel.dotgee.fr/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER='}
      directive = {
        'div' : {
          'layer<-layers' : {
            '@id' : 'layer.name',
            'p'    : 'layer.name',
            'img@src' : '#{url}#{layer.name}'
          }
        }
      }
  $("#legende").render(data, directive); 

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
  var popup = null;
  var featureInfos = new OpenLayers.Control.WMSGetFeatureInfo({
    url: map.layers[0].url, 
    queryVisible: true,
    infoFormat: "application/vnd.ogc.gml",
    eventListeners: {
      getfeatureinfo: function(event) {
           console.log(event);
           if (popup != null) {
              popup.destroy();
           }
           if (event.features.length > 0) {
            event.features.forEach(function(feature) {
              console.log(feature.data);
              keys = Object.keys(feature.data);
              output = "";
              for(var i=keys.length; i--;) {
                output += keys[i]+": "+feature.data[keys[i]];
                output += "<br/>"
              }
              dialog = $("<div title='Feature Info'>" + output + "</div>").dialog();
            });
           /* popup = new OpenLayers.Popup.FramedCloud(
                        "featuresPopup", 
                        map.getLonLatFromPixel(event.xy),
                        null,
                        event.text,
                        null,
                        true
                    );
            map.addPopup(popup);*/

          }
        }
      }
    });

  // Activation des commandes au click bouton
  map.addControls([featureInfos, getFeatures]);

  $("#btn-features").click(function(e){
    if(featureInfos.active) {
      featureInfos.deactivate();
      getFeatures.deactivate();
      $(".olMap").css("cursor", "");
    } else {
      featureInfos.activate();
      getFeatures.activate();
      $(".olMap").css("cursor", "crosshair");
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

  // Accordeon maison pour les sous categories
  $('.right-menu h3').not('.parent').click(function(e) {
      e.preventDefault();
      $(".children:visible").not($(this).next()).hide("slow");
      $(this).next().slideToggle();
      return false;
    }).next().hide();

  $('.fg-buttonset a').click(function(){
    $(this).removeClass("ui-state-hover").addClass("ui-state-hover");
  });
};
