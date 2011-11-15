$(document).ready(function() {

  var wmc = $("#wmc").attr("href");
  OpenLayers.loadURL(wmc, null, null, onSuccess, onFailure);
  
  function onSuccess(request){
    var format = new OpenLayers.Format.WMC();
    map =  format.read(request.responseText, {map: mapOptions});
    var zoom = new OpenLayers.Control.PanZoomBar();
    map.addControls([zoom]);
    map.addControl(new OpenLayers.Control.LayerSwitcher({'ascending':false}));
    map.zoomTo(9);
    //map.addControl(new OpenLayers.Control.PanZoomBar());
    $('#container').viewer('resizeChooser');
    addSharedControlers();

  }

  function onFailure(request){
    alert(wmc);
  }

});
