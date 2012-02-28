;(function($) {
    $.tabbed = function(el, options) {

        var defaults = {
          current: "Carte"
        }

        var plugin = this;

        // myplugin.settings.propertyName from outside the plugin
        // where "myplugin" is an instance of the plugin
        plugin.settings = {}

        var init = function() {

            plugin.settings = $.extend({}, defaults, options);

            plugin.el = el;

            bindSwitch();
        }
        
        // Binds click on the tabswitcher
        var bindSwitch = function() {
          $('li.dot').click(function() { 
            var target = $(this).find("input").val();
            if(target != plugin.settings.current) {
              if(target == "Catalogue") {
                moveToCatalogue();
              } else if (target == "Carte") {
                moveToCarte();
              }
            }
          }); 
        }
        // Move to applications
        var moveToCatalogue = function() {
          $("#layer-finder").animate({
            left: "20%"
          }, 500);
          // Visual feedback of the click 
          $(".dot").toggleClass("activated");
          plugin.settings.current = "Catalogue";
        }

        // Move to workspace
        var moveToCarte = function() {
          $("#layer-finder").animate({
            left: '100%'
          }, 500);
          // Visual feedback of the click 
          $(".dot").toggleClass("activated");
          plugin.settings.current = "Carte";
        }

        // call the "constructor" method
        init();

    }

})(jQuery);
