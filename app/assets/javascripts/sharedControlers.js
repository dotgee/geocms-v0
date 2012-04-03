$(document).ready(function(){
  $('#visualisor_link').tooltip({ html: true});
})

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
  $('#fullscreen-btn').click(function(e){
    e.preventDefault();
    var content = $('#content');
    var btn = $(this);
    if(content.is('.full_screen')){
      content.removeClass('full_screen');
      btn.removeClass('full_screen_btn').attr('data-original-title','Passer en affichage plein &eacute;cran');

    }else{
      content.addClass('full_screen');
      btn.addClass('full_screen_btn').attr('data-original-title','Revenir &agrave; l\'affichage normal');
    }
      btn.trigger('mouseout');
    fixSize();
  });
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
  var nodes, start_pos, end_pos, layer_to_move;
  $( "#selected" ).sortable({
    placeholder: "ui-state-highlight",
    forcePlaceholderSize: true,
    handle: ".grippy",
    start: function(event, ui){
     $(ui.item).find(".grippy").css("cursor", "url('/assets/closedhand.cur'), pointer").tooltip('hide');  
     nodes = ui.item.parent().children().length-2;
     start_pos = nodes - ui.item.index();
     ui.item.data('start_pos', start_pos);
    },
    stop: function(event, ui){
     $(".selected-node .grippy").css("cursor", "url('/assets/openhand.cur'), pointer");  
    },
    update: function(event, ui){
      var uniqueId = "";
      if(event.srcElement){
        uniqueId = event.srcElement.id
      }else{
        uniqueId = event.target.id;
      }
      uniqueId = uniqueId.substring(uniqueId.indexOf("_")+1);
      start_pos = ui.item.data('start_pos');
      end_pos =  nodes - ui.item.index();
      layer_to_move = map.getLayersBy("uniqueID", uniqueId)[0];
      map.raiseLayer(layer_to_move, (end_pos-start_pos)); 
    }
  });
  $( ".selected-node .grippy" ).disableSelection();

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
            window.open("/layers/print?wmc="+data, "_blank");
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
            var url = "http://geobretagne.fr/mapfishapp/?wmc="+contextExportUrl+data;
            window.open(url, "_blank");
      }
    });
  });

   
   $("#save_btn").click(function(e) {
    e.preventDefault();
    $("#save_form").dialog({
      height: 150,
      width: 400,
      modal: true,
      buttons: {
        "Sauvegarder": function() {
          saveDialog = $(this);
          mapName = saveDialog.find("#map_name").val();
          if(mapName) {
            $.ajax({
              url: "/geo_contexts/post/",
              data: {wmc: format.write(map)},
              type: "POST",
              success: function(data){
                window.location = "/gc/"+mapName+"/"+data;
                saveDialog.dialog("close");
              }
            });          
          } else {
            saveDialog.find("p").html("Un nom est requis pour l'enregistrement.");
          }
        },
        "Annuler": function() {
          $( this ).dialog("close");  
        }
      }
    });
  });
  if($("#load_form").length > 0){
  var uploader = new qq.FileUploader({
    element: $("#load_form")[0],
    action: '/geo_contexts/load',
    multiple: false,
    allowedExtensions: ['wmc'],        
    sizeLimit: 0, // max size   
    minSizeLimit: 0, // min size
    debug: false,
    params: {
      authenticity_token: $("#authenticity_token").val()
    },
    messages: {
      typeError: "{file} n'est pas d'une extension valide. Seuls les {extensions} sont autorises.",
      onLeave: "Le fichier est en train d'etre mis en ligne, si vous quittez maintenant, le chargement sera interrompu."
    }, 
    onComplete: function(id, fileName, responseJSON) {
      window.location = "/?wmc="+contextExportUrl+responseJSON.content;
    }
  });
  }
  $("#load_btn").click(function(e) {
    e.preventDefault();
    $("#load_form").dialog({
      height: 150,
      width: 400,
      modal: true
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
  $("#legende").mustachu().mustachu("legendeNodes", map.layers);
  $("#selected").mustachu().mustachu("selectedNodes", map.layers);

  /* GetFeaturesInfo */

  // Highlight de la carte
 /* 
  select = new OpenLayers.Layer.Vector("Selection", {
    styleMap: new OpenLayers.Style(OpenLayers.Feature.Vector.style["select"])
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
  */
  // Affichage de la popup
  var dialog;
  
  var featureInfos = new OpenLayers.Control.WMSGetFeatureInfo({
    url: map.layers[0].url, 
    name: "featureInfos",
    queryVisible: true,
    infoFormat: "application/vnd.ogc.gml",
    eventListeners: {
      beforegetfeatureinfo: function(event) {
        if (dialog) {
           dialog.dialog("open");
           dialog.text("");
        } else {
           dialog = $("<div title='Informations sur la couche'></div>").dialog({width: 'auto'});
        }
      },
      getfeatureinfo: function(event) {
          output = "";
          if (event.features.length > 0) {
           $.each(event.features, function(i, feature) {
             template = $("#template_"+event.object.layers[0].uniqueID).text();
             output += Mustache.to_html(template,feature.data);
           });
          } 
          if(output != ""){
           dialog.html(output);
          } else {
           dialog.html("Pas de features &agrave; afficher");  
          }
        }
      }
    });
   
  map.addControl(featureInfos);

  // Accordeon maison pour les sous categories
  //
  $('.right-menu h3').click(function(e) {
    e.preventDefault();
    $('.right-menu h3.grand_parent').next(".children").find("h4:visible").not('.selected').slideToggle();
    $(this).next(".children").find("h4").not(":visible").slideToggle();
  });
   // Tabs bootstrap
  $('#tabs').tab();
  $('#tabs').bind('show', function(e){
    //pour la l?gende
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
    self.toggleClass("checked");
  });
  $(".btn-destroy").live("click", function(e) {
    e.preventDefault();
    var self = $(this);
    layer = map.getLayersBy("uniqueID", self.attr("layer_id"))[0];
    $( "#dialog-confirm" ).dialog({
      resizable: false,
      height:140,
      modal: true,
      buttons: {
        "Confirmer": function() {
          if(layer) {
            // Removes the layer from the map and uncheck it on the list
            $("#content").viewer("destroyLayer", layer);
            // Removes the layer from the selected list
            $("#selected").mustachu("destroyLayer", layer); 
            // Removes the layer from the legend
            $("#legend_container").legend("destroyLayer", layer);      
          }
          $( this ).dialog( "close" );
        },
        "Annuler": function() {
          $( this ).dialog( "close" );
        }
      }
    });
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
