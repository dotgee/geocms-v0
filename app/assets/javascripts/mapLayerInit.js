$(document).ready(function() {

  map =  new OpenLayers.Map( 'map', mapOptions );
  var fond_carto = new OpenLayers.Layer.WMS(
    "Fond Cartographique","http://geo.devel.dotgee.fr/geoserver/wms",
    {
      layers: 'region-bretagne_region_2154',
      format: 'image/png'
    },
    {
      singleTile: true,
      transitionEffect: 'resize',
      transparent: true,
      opacity: 0.5,
      displayInLayerSwitcher:false,
      isBaseLayer: true,
      originalID: 'region-bretagne_region_2154',
      uniqueID: 'region-bretagne_region_2154'
    }
  );
  map.addLayer(fond_carto);

  layer = new OpenLayers.Layer.WMS(layerTitle,
                                   layerWmsUrl,
                                   {
                                       layers: layerNames,
                                       transparent: true,
                                   }, {
                                       opacity: 0.8,
                                       singleTile: true,
                                       transitionEffect: 'resize',
                                       uniqueID: layerNames.replace(":", "_"),
                                       modelID: layer_id 
                                   });
  
    map.addLayer(layer);
    $("."+layer.uniqueID).show(300);

    addSharedControlers();
    map.zoomToMaxExtent();

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
