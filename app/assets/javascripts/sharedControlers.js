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
  
  /* Affichage de la projection */

  $("#projection").text(map.getProjection());
  
  /* Bouton d'aide */

  $("#help_btn").click(function(e){
    e.preventDefault();
    $.get("/aide",
          function(data) {
            $("<div>"+data.content+"</div>").dialog({width: 500, height: 300, title: "Aide"});
          }, "json");
  });

  // Ajout de la legende initiale
  var data = {'layers' : map.layers,
              'url' : '?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER='}
      directive = {
        'div' : {
          'layer<-layers' : {
            '@id' : 'layer.uniqueID',
            'p'    : 'layer.name',
            'img@src' : '#{layer.url}#{url}#{layer.params.LAYERS}'
          }
        }
      }
  $("#legende").render(data, directive); 

  var direct = {
    'div' : {
      'layer<-layers' : {
        '@id'                     : '#{layer.uniqueID}_selected',
        'p'                       : 'layer.name',
        'span.template@id'        : 'template_#{layer.uniqueID}',
        'span.slider@id'          : 'layer.uniqueID',
        'input@id'                : 'check_#{layer.uniqueID}',
        'a.btn-features@layer_id' : 'layer.uniqueID'
      }
    }
  }
  $("div#selected").render(data, direct);

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

  $(".check_layer").live("click", function(e) {
    var self = $(this);
    layers = map.getLayersBy("uniqueID", self.attr("id").substring(self.attr("id").indexOf("_")+1));
    if(self.attr("checked")) {
      layers[0].setVisibility(true);
    } else {
      layers[0].setVisibility(false);
    }
  });

  $('#btn-geoname').keypress(function(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if(code == 13) { 
      var searchUrl = 'http://ws.geonames.org/searchJSON?featureClass=P&maxRows=10';
      searchUrl += '&name_startsWith=' + $(this).val();
      $.getJSON(searchUrl, function(data) {
          var place = data.geonames[0];
          var lonlat = new OpenLayers.LonLat(place.lng, place.lat);
          map.setCenter(lonlat.transform(gg, lb), 10);
      });
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
