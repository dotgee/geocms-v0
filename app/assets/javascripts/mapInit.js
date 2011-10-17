var map;
// increase reload attempts 
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 2;
// Définitions des bords de la Bretagne
var bzhBounds = new OpenLayers.Bounds(33534.34825,6584909.31255,503163.44995,6897995.38035);

$(document).ready(function() {
  var window_height = $(window).height();  
  var offset_map = $("#map").offset().top;
  $('#container').viewer({ map : map});
  $('#category_chooser').resizable({handles : 'e'});
  $("#map").height(window_height - offset_map);
  var mapOptions = {
    div: "map",
    allOverlays: true,
    transitionEffect: "resize",
    maxExtent: bzhBounds,
    resolutions:
      [
        156543.0339, 78271.51695, 39135.758475, 19567.8792375, 9783.93961875, 4891.969809375, 2445.9849046875, 1222.99245234375, 611.4962261718748,
        305.7481130859374, 152.87405654296887, 76.43702827148444, 38.21851413574208, 19.10925706787104, 9.55462853393552, 4.77731426696776, 2.38865713348388,
        1.1943285667420798, 0.5971642833710399, 0.29858214168551994
      ],
    units: "m", 
    theme: null,
    controls:
      [
        new OpenLayers.Control.Attribution(),
        new OpenLayers.Control.ZoomPanel(),
        new OpenLayers.Control.Navigation()
      ]
  };

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

  }

  function onFailure(request){
    alert(wmc);
  }
});

$("#plus").click(function(){
    map.zoomIn();
});

$("#minus").click(function(){
    map.zoomOut();
});

