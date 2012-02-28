;(function($) {

    $.layerFinder = function(el, options) {

        var defaults = {

        }

        var plugin = this;

        plugin.settings = {}

        var init = function() {

            plugin.settings = $.extend({}, defaults, options);

            plugin.el = el;
  
            bindAddEvent();

        }

        plugin.add = function(title, wms, name, meta, credits, modelID) {
          layer = new OpenLayers.Layer.WMS(title,
                                           wms,
                                           { layers: name,
                                             transparent: true
                                           },
                                           {
                                             opacity: 0.8,
                                             singleTile: true,
                                             uniqueID: name.replace(":", "_"),
                                             metadataLink : meta,
                                             credits: credits, 
                                             modelID: modelID 
                                           });

          map.addLayer(layer);
          leftPan.create([layer]);
          legende.create([layer]);
          return layer;
        }

        plugin.destroy = function(layer){
          console.log(layer);
          plugin.el.find("."+layer.uniqueID).find("a").removeClass("active");
          map.removeLayer(layer); 
        }

        plugin.open = function() {
          if(leftPan.isOpen()) {
            left = "20%";
          } else {
            left = "0%";
            $("#layer-finder").width("100%");
          }
          $("#layer-finder").animate({
            left: left
          }, 500);
        }

        plugin.close = function() {
          $("#layer-finder").animate({
            left: '100%'
          }, 500);
        }

        var bindAddEvent = function() {
          $(".layer_btn").click(function(e) {
            e.preventDefault();
            var self = $(this);
            var div = $(this).parent();
            var l = div.data("layer");
            var layer = map.getLayer(div.data("layer_id"));
            // Layer is not added yet
            if(!layer) {
              layer = plugin.add(l.title, l.wms_url, l.name, l.metadata_link, l.credits, l.id);
              div.data("layer_id", layer.id);
            } else if(self.hasClass("active")) {
            // Layer is added and shown
              layer.setVisibility(false);
              $("#"+layer.uniqueID+"_legende").hide();
              $("#"+layer.uniqueID+"_selected").hide();
            } else {
            // Layer is added but not shown
              layer.setVisibility(true);   
              $("#"+layer.uniqueID+"_legende").show();
              $("#"+layer.uniqueID+"_selected").show();
            }
            self.toggleClass("active");
          });
        }

        init();

    }

})(jQuery);
