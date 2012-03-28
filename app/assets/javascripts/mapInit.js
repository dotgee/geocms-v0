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
    addSharedControlers(map);
     map.zoomToExtent(bounds);
  }

  function onFailure(request){
    //alert(wmc);
  }

});
