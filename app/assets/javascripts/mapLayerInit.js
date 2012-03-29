$(document).ready(function() {
  var wmc ;
  wmc = getURLParameter("wmc");
  if(wmc == "null") {
    wmc = $("#wmc").attr("href");
  }
  OpenLayers.loadURL(wmc, null, null, onSuccess, onFailure);

  function onSuccess(request){
    var format = new OpenLayers.Format.WMC();
    map =  format.read(request.responseText, {map: mapOptions});
    $('#container').viewer('resizeChooser');
    $.each(map.layers,function(i,y) {
      y.uniqueID = y.params.LAYERS.replace(":", "_");
    });

  layer = new OpenLayers.Layer.WMS(layerTitle,
                                   layerWmsUrl,
                                   {
                                       layers: layerNames,
                                       transparent: true,
                                   }, {
                                       opacity: 0.8,
                                       transitionEffect: 'resize',
                                       uniqueID: layerNames.replace(":", "_"),
                                       metadataLink: layer_metadata_link,
                                       modelID: layer_id, 
                                       credits: layerCredits
                                   });
  
    map.addLayer(layer);
    $("."+layer.uniqueID).show(300);

    addSharedControlers(map);
    map.zoomToExtent(bounds);

    //choix des couches
    $.each(map.layers, function(i, layer){
      var class_name = '.'+layer.uniqueID;
      $(class_name).each(function(i,el){
          $(el).addClass('added_layer');
          $(el).attr('layer_id', layer.id);
        });
    });
    $('#container').viewer('resizeChooser');
  }

  function onFailure(request){ }

});
