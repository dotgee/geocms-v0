$(document).ready(function(){
 var map;
 var format = new OpenLayers.Format.WMC();
 $.ajax({
        url : "/gc/"+wmc+"?single_tile=true",
        error: function(jqXHR, textStatus, error){
        },
        success: function(data, status, jqXHR){
            map = format.read(data, {map: mapOptions});
           $('#map').html('<h2> Veuillez Patienter pendant le chargement de l\'image...<div id="spinner"></div></h2>');
           $('#spinner').spin();
           LoadImageMap();
            map.removeControl(map.controls[1]);
            for(var i in map.controls){
              map.controls[i].deactivate();
            }
            $.each(map.layers, function(i, layer) {
              $.ajax({
                url: "/layers/"+layer.params.LAYERS+"/find.json",
                type: "GET",
                success: function(data) {
                   if(data) {
                     if(data.credits) {
                       $("#credits").append("<div>"+layer.name+": "+data.credits+"</div>");
                     }
                   }
                },
                dataType: "json"
              });
            });
            $("#legende").mustachu().mustachu("legendeNodes", map.layers);
            $('#realprint_btn').click(function(e){
              e.preventDefault();
              print();
            });
        }
  });

  var print_wait_win = null;
  function LoadImageMap() {

      var size  = map.getSize();
      var tiles = [];
      var x,y,width,height;
      for (layername in map.layers) {
          // if the layer isn't visible at this range, or is turned off, skip it
          var layer = map.layers[layername];
          if (!layer.getVisibility()) continue;
          if (!layer.calculateInRange()) continue;
          // iterate through their grid's tiles, collecting each tile's extent and pixel location at this moment
          for (tilerow in layer.grid) {
              for (tilei in layer.grid[tilerow]) {
                  var tile     = layer.grid[tilerow][tilei]
                  var url      = layer.getURL(tile.bounds);
                  var position = tile.position;
                  var opacity  = layer.opacity ? parseInt(100*layer.opacity) : 100;
                  tiles[tiles.length] = {url:url, opacity:opacity};
                  x = position.x;
                  y = position.y;
              }
          }
      }

    $.ajax({
      url: "/geo_contexts/print_img",
      type: "POST",
      data: { tiles: tiles,
        x : x,
        y : y,
        width: map.getSize().w,
        height: map.getSize().h
      },
      success: function(data){
        var img = $('<img />').attr('src', "/"+data); 
        $("#map").html(img);
      }
    });
  }

});
