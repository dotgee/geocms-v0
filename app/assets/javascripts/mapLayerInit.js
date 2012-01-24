$(document).ready(function() {

  map =  new OpenLayers.Map( 'map', mapOptions );
  var fond_carto = new OpenLayers.Layer.WMS(
    "Fond Cartographique",

    gipbeCartoGraphy,
    {
      layers: fondCarteName,
      format: 'image/png'
    },
    {
      isBaseLayer: true,
      transitionEffect: 'resize',
      transparent: true,
      opacity: 0.5,
      displayInLayerSwitcher:false,
      uniqueID: 'region-bretagne_region_2154'
    }
  );
  map.addLayer(fond_carto);
  if(!layerCredits){
    var layerCredits = "";
  }
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

});
