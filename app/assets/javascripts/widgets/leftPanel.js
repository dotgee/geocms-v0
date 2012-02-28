;(function($) {

    $.leftPanel = function(el, options) {

        var defaults = {

        }

        var plugin = this;

        plugin.settings = {}

        var init = function() {

            plugin.settings = $.extend({}, defaults, options);

            plugin.el = el;
            
            sortable();            
            checkable();
            destroyable();
        }

        plugin.open = function() {
          $("#selected").animate({
            marginLeft: "0px"
          }, 400);
          $("#map_container").animate({
            marginLeft: "20%"
          }, 400);
        }

        plugin.isOpen = function() {
          return ($("#selected").css("margin-left") == "0px");
        }

        plugin.close = function() {
          $("#selected").animate({
            marginLeft: "-20%"
          }, 400);
          $("#map_container").animate({
            marginLeft: "0px"
          }, 400);
        }

        plugin.create = function(layers) {
          var node;
          var template =
            "<div class='selected-node' id='{{uniqueID}}_selected'>"+
              "<div class='grippy' id='grip_{{uniqueID}}' ></div>"+
              "<div class='node'>"+
                "<div class='node-infos'>"+
                  "<p>{{name}}</p>"+
                  "<span class='template' id='template_{{uniqueID}}'></span>"+
                "</div>"+
                "<div class='node-controls'>"+
                  "<div class='node-controls-buttons'>"+
                    //check
                    "<a href='#' class='ui-icon-with-text btn-check {{#visibility}} checked {{/visibility}}' id='check_{{uniqueID}}'>"+
                      "<span class='ui-icon'></span></a>"+
                    //info
                    "<a href='#' class='ui-icon-with-text btn-features' id='features_{{uniqueID}}' layer_id='{{uniqueID}}'>"+
                      "<span class='ui-icon ui-icon-info'></span></a>"+
                    //shape
                    "<a href='{{url}}?REQUEST=getFeature&service=wfs&outputFormat=shape-zip&typename={{params.LAYERS}}'"+
                    "target='_blank' class='ui-icon-with-text btn-save' id='save_{{uniqueID}}'><span class='ui-icon ui-icon-disk'></span></a>"+
                    //metadata
                    "{{#metadataLink}}"+
                    "<a target='_blank' href='{{metadataLink}}' class='ui-icon-with-text btn-metadatas' id='metadatas_{{uniqueID}}' layer_id='{{uniqueID}}'>"+
                      "<span class='ui-icon ui-icon-note'></span></a>"+
                    "{{/metadataLink}}"+
                    //remove
                    "<a href='#' class='ui-icon-with-text btn-destroy' id='destroy_{{uniqueID}}' layer_id='{{uniqueID}}'>"+
                      "<span class='ui-icon ui-icon-closethick'></span></a>"+
                   "</div>"+
                   "<!-- <div class='slider' id='{{uniqueID}}'></div> -->"+
                  "</div>"+
                   "{{#credits}}<p class='credits'>Cr&eacute;dits: {{credits}}</p>{{/credits}}"+
              "</div>"+
              "<div class='clear' ></div>"+
           "</div>";
          $.each(layers, function(i,el) {
            node = Mustache.to_html(template, el);
            plugin.el.prepend(node);
            plugin.el.find("div:first-child .btn-features").featurable({layer: el});
          });
        }

        plugin.destroy = function(layer) {
          plugin.el.find("#"+layer.uniqueID+"_selected").remove();
        }

        // Binds controls for each layer

        var sortable = function() {
          var nodes, start_pos, end_pos, layer_to_move;
          $( "#selected" ).sortable({
            placeholder: "ui-state-highlight",
            forcePlaceholderSize: true,
            handle: ".grippy",
            start: function(event, ui){
              $(ui.item).find(".grippy").css("cursor", "url('/assets/closedhand.cur'), pointer").tooltip('hide');
              nodes = ui.item.parent().children().length-2;
              start_pos = nodes - ui.item.index();
              ui.item.data('start_pos', start_pos);
            },
            stop: function(event, ui){
            $(".selected-node .grippy").css("cursor", "url('/assets/openhand.cur'), pointer");
          },
          update: function(event, ui){
            var uniqueId = "";
            if(event.srcElement){
              uniqueId = event.srcElement.id
            }else{
              uniqueId = event.target.id;
            }
            uniqueId = uniqueId.substring(uniqueId.indexOf("_")+1);
            start_pos = ui.item.data('start_pos');
            end_pos =  nodes - ui.item.index();
            layer_to_move = map.getLayersBy("uniqueID", uniqueId)[0];
            map.raiseLayer(layer_to_move, (end_pos-start_pos));
          }
        });
        $( ".selected-node .grippy" ).disableSelection();
      }

      var checkable = function() {
        $(".node-controls .btn-check").live("click", function(e) {
          e.preventDefault();
          var self = $(this);
          layer = map.getLayersBy("uniqueID", self.attr("id").substring(self.attr("id").indexOf("_")+1))[0];
          if(layer.getVisibility()) {
            layer.setVisibility(false);
          } else {
            layer.setVisibility(true);
          }
          self.toggleClass("checked");
        });
      }

      var destroyable = function() {
        $(".btn-destroy").live("click", function(e) {
          e.preventDefault();
          var self = $(this);
          layer = map.getLayersBy("uniqueID", self.attr("layer_id"))[0];
          modalBox = $("#dialog-confirm");
          modalBox.modal({ backdrop: true });
          modalBox.find(".primary").click(function(e) {
            e.preventDefault();
            if(layer) {
              // Removes the layer from the map and uncheck it on the list
              layerFinder.destroy(layer); 
              // Removes the layer from the selected list
              leftPan.destroy(layer);
              // Removes the layer from the legend
              legende.destroy(layer);
            }
            modalBox.modal("hide");
          });
          modalBox.find(".secondary").click(function(e) {
            e.preventDefault();
            modalBox.modal("hide");
          });
        });
      }

      init();

    }

})(jQuery);
