$(document).ready(function() {

  map =  new OpenLayers.Map( 'map', mapOptions );
  var fond_carto = new OpenLayers.Layer.WMS( "Fond Cartographique","http://geo.devel.dotgee.fr/geoserver/wms", { layers: 'region-bretagne_region_2154', format: 'image/png' }, { isBaseLayer: true, singleTile: true, transitionEffect: 'resize', transparent: true, opacity: 0.5, displayInLayerSwitcher:false, uniqueID: 'region-bretagne_region_2154' });


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
  map.addLayer(fond_carto);
  //map.addLayer(layer);
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
              var style = new OpenLayers.Style({
                    pointRadius: "${radius}",
                    fillColor: "${fillColor}",
                    fillOpacity: 0.8,
                    //strokeColor: "#cc6633",
                    //label: "${label}",
                    strokeWidth: 1,
                    graphicZindex: "${zindex}",
                    strokeOpacity: 0.8
                }, {
                    context: {
          
                      zindex: function(feature){
                          return -feature.attributes.count
                      },
                      label: function(feature){
                          return feature.cluster[0].data.thematique;

                      },
                        fillColor: function(feature){
                          return rightColor(feature.cluster[0].data.thematique);
                        },
                        radius: function(feature) {
                          return Math.min(feature.attributes.count, 7) + 3;
                        }
                    }
                });
                var contents = new OpenLayers.Layer.Vector("Contents", {
                    uniqueID : layerNames.replace(":", "_")+"_vector",
                    strategies: [ 
                      new OpenLayers.Strategy.CustomBBOX(),
                      new OpenLayers.Strategy.AttributeCluster({attribute:'thematique'})

                     ],
                    protocol: new OpenLayers.Protocol.HTTP({
                        url: layerWmsUrl,
                        params: {
                            typename: layerNames,
                            format: "WFS",
                            version: "1.1.0",
                            outputFormat: "gml2",
                            service: "WFS",
                            request: "GetFeature",
                            bbox: [41,-7,52,16],
                            srsname: "EPSG:2154"
                        },
                        format: new OpenLayers.Format.GML()
                    }),
                     extractAttributes: true, 
                    styleMap: new OpenLayers.StyleMap({
                        "default": style,
                        "select": {
                            fillColor: "#8aeeef",
                            strokeColor: "#32a8a9"
                        }
                    })
                });
               var select = new OpenLayers.Control.SelectFeature(
                    contents, {hover: true}
                );
                map.addControl(select);
                select.activate();
                contents.events.on({"featureselected": display});
                contents.events.on({"beforefeatureadded": beforefetureadded});
                map.addLayer(contents);
  addSharedControlers(map);
              function display(event){
              }
              function beforefetureadded(feature){
              }

});


OpenLayers.Strategy.CustomBBOX = OpenLayers.Class(OpenLayers.Strategy.BBOX, {
});

OpenLayers.Strategy.AttributeCluster = OpenLayers.Class(OpenLayers.Strategy.Cluster, {
    /**
     * the attribute to use for comparison
     */
    attribute: null,
    /**
     * Method: shouldCluster
     * Determine whether to include a feature in a given cluster.
     *
     * Parameters:
     * cluster - {<OpenLayers.Feature.Vector>} A cluster.
     * feature - {<OpenLayers.Feature.Vector>} A feature.
     *
     * Returns:
     * {Boolean} The feature should be included in the cluster.
     */
    shouldCluster: function(cluster, feature) {
        var cc_attrval = cluster.cluster[0].attributes[this.attribute];
        var fc_attrval = feature.attributes[this.attribute];
        var superProto = OpenLayers.Strategy.Cluster.prototype;
        return cc_attrval === fc_attrval && 
               superProto.shouldCluster.apply(this, arguments);
    },
    CLASS_NAME: "OpenLayers.Strategy.AttributeCluster"
});
function rightColor(thematique){
    var color = "#ffcc66";
  switch(thematique){
    case "Bureau" :
      color = "#99CCCC";
    break;
    case "Commerce":
      color =  "#6699CC"
      break;
    case "Territoires" :
      color = "#996699";
      break;
    case "Green" :
      color = "#B4CA20"
      break;
    case "Hôtels/Loisirs":
      color = "#CCCC99";
      break;
    case "Logement" :
      color = "#009999";
      break;
    case "Logistique" :
      color = "#FF9900" 
      break;
    case "Santé" :
      color = "#99CC99";
      break;
    case "Bourse / Finance" :
      color = "#A9A9A9";
      break;
    case "Carrières" :
      color = "#CC0000";
      break;
    case "Juridique" :
      color = "#A9A9A9";
      break;
    case "Transaction" :
      color = "#CC0000"; 
    break;
  }
  return color;
}
