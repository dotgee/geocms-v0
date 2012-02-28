OpenLayers.IMAGE_RELOAD_ATTEMPTS = 2;
OpenLayers.ImgPath = "/assets/openlayers/";
OpenLayers.ProxyHost = openLayersProxy;
var map, layer, measureControls, mapOptions;
var format = new OpenLayers.Format.WMC();
var gg = new OpenLayers.Projection("EPSG:4326");
var lb = new OpenLayers.Projection("EPSG:2154");
var bounds = new OpenLayers.Bounds(
                  98037, 6703422,
                  402476, 6886148
            );

var scales = [
      266.591197934,
      533.182395867,
      1066.364791734,
      2132.729583468,
      4265.459166936,
      8530.918333871,
      17061.836667742,
      34123.673335484,
      68247.346670968,
      136494.693341936,
      272989.386683873,
      545978.773367746,
      1091957.546735491,
      2183915.093470982,
      4367830.186941965,
      8735660.373883929
];

$(document).ready(function() {

  mapOptions = {
    div: "map",
    allOverlays: true,
    transitionEffect: "resize",
    projection: "EPSG:2154",
    scales: scales,
    fractionalZoom: true,
    maxExtent: bounds,
    units: "m",
    theme: null,
    controls: [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.Navigation()
    ]
  };
  
  var wmc ;
  wmc = getURLParameter("wmc");
  if(wmc == "null") {
    wmc = $("#wmc").attr("href");
  }
  OpenLayers.loadURL(wmc, null, null, onSuccess, onFailure);
  
  function onSuccess(request){
    
    // Chargement du WMC
    map =  format.read(request.responseText, {map: mapOptions});

    // Chargement du layer si besoin
    if(window.gon !== undefined) {
      layer = new OpenLayers.Layer.WMS(gon.layer.title,
                                       gon.layer.wms_url,
                                       {
                                         layers: gon.layer.name,
                                         transparent: true,
                                       },
                                       {
                                         opacity: 0.8,
                                         transitionEffect: 'resize',
                                         uniqueID: gon.layer.name.replace(":", "_"),
                                         metadataLink: gon.layer.metadata_link,
                                         modelID: gon.layer.id,
                                         credits: gon.layer.credits
                                       });
      map.addLayer(layer);
    }
   
    //choix des couches
    $.each(map.layers, function(i, layer){
      layer.uniqueID = layer.params.LAYERS.replace(":", "_");
      var className = '.'+layer.uniqueID;
      $(className).each(function(i,el){
        $(el).find("a").addClass('active');
        $(el).attr('layer_id', layer.id);
      });
    });

    addSharedControlers(map);
    map.zoomToExtent(bounds);
  }

  function onFailure(request){
    alert("Impossible de charger le contexte"); 
  }

});

function getURLParameter(name) {
  return decodeURI(
    (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
  );
}
