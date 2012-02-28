;(function($) {

    $.controls = function(el, options) {

        var defaults = {

        }

        var plugin = this;

        plugin.settings = {}

        var init = function() {

            plugin.settings = $.extend({}, defaults, options);

            plugin.el = el;

            controlsDispatcher();
            controlsHandler();
        }

        // Handles activation/deactivation of controls
        var controlsHandler = function() {
          plugin.el.find(".activable").click(function(e) {
            e.preventDefault();
            element = $(this);
            var isControl = element.hasClass("uC")
            var control;
            if(isControl) {
              plugin.el.find(".uC").not(element).removeClass("active");
              $.each(measureControls, function(i, el) {
                el.deactivate();
              });
            }
            element.toggleClass("active");
            if(isControl && element.hasClass("active")) {
              measureControls[element.attr("measure_type")].activate();
            } 
          });
        }
        
        var controlsDispatcher = function() {
          var buttons = plugin.el.find(".buttons-container").children();
          $.each(buttons, function(i, el) {
            var element = $(el);
            switch(element.data("control")) {
              case "control":
                toggleLeftPanel(element);
                break;
              case "catalogue":
                toggleCatalogue(element); 
                break;
              case "legende":
                toggleLegende(element); 
                break;
              case "save":
                saveMap(element);
                break;
              case "load":
                loadMap(element);
                break;
              case "world":
                initPos(element);
                break;
              case "print":
                print(element);
                break;
              default:
                break;
            }
          });
        }

        var toggleLeftPanel = function(el) {
          el.click(function(e) {
            e.preventDefault();
            if(el.hasClass("active")) {
              leftPan.close(); 
            } else {
              leftPan.open();
            }
          });
        }

        var toggleCatalogue = function(el) {
          el.click(function(e) {
            e.preventDefault();
            if(el.hasClass("active")) {
              layerFinder.close(); 
            } else {
              layerFinder.open();
            }
          });
        }

        var toggleLegende = function(el) {
          el.click(function(e) {
            e.preventDefault();
            if(el.hasClass("active")) {
              legende.hide(); 
            } else {
              legende.show();
            }
          });
        }

        var saveMap = function(el) {
          modalBox = $("#save_form");
          el.click(function(e) {
            e.preventDefault();
            modalBox.modal({backdrop: true});
          });
          modalBox.find(".primary").click(function(e) {
            e.preventDefault();
            mapName = modalBox.find("#map_name").val();
            if(mapName) {
              $.ajax({
                url: "/geo_contexts/post/",
                data: {wmc: format.write(map)},
                type: "POST",
                success: function(data){
                  window.location = "/gc/"+mapName+"/"+data;
                  el.modal("hide");
                }
              });            
            } else {
              modalBox.find("p").html("Un nom est requis pour l'enregistrement.");
            }
          });
          modalBox.find(".secondary").click(function(e) {
            e.preventDefault();
            modalBox.modal("hide");
          });
        }

        var loadMap = function(el) {
          if($("#load_form").length > 0){
            var uploader = new qq.FileUploader({
              element: $("#load_form .modal-body")[0],
              action: '/geo_contexts/load',
              multiple: false,
              allowedExtensions: ['wmc'],        
              sizeLimit: 0, // max size   
              minSizeLimit: 0, // min size
              debug: false,
              params: {
                authenticity_token: $("#authenticity_token").val()
              },
              messages: {
                typeError: "{file} n'est pas d'une extension valide. Seuls les {extensions} sont autorises.",
                onLeave: "Le fichier est en train d'etre mis en ligne, si vous quittez maintenant, le chargement sera interrompu."
              }, 
              onComplete: function(id, fileName, responseJSON) {
                window.location = "/?wmc="+contextExportUrl+responseJSON.content;
              }
            });
          }
          el.click(function(e) {
            e.preventDefault();
            $("#load_form").modal({backdrop: true});
          });
        }

        var initPos = function(el) {
          el.click(function(e){
            e.preventDefault();
            map.zoomToExtent(bounds);
          });
        }

        var print = function(el) {
          el.click(function(e) {
            e.preventDefault();
            try {
              wmc = format.write(map);
            } catch(e) {
              alert("Une erreur est survenue");
            }
            $.ajax({
              url: "/geo_contexts/post",
              data: "wmc="+format.write(map),
              type: "POST",
              success: function(data){
                window.open("/layers/print?wmc="+data, "_blank");
              }
            });
          });
        }

        init();

    }

})(jQuery);
