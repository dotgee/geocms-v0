;(function($) {

    $.legend = function(el, options) {

        var defaults = {

            propertyName: 'value',

            onSomeEvent: function() {}

        }

        var plugin = this;

        plugin.settings = {}

        var init = function() {

            plugin.settings = $.extend({}, defaults, options);

            plugin.el = el;

        }

        plugin.show = function() {
          plugin.el.fadeIn(300);
        }

        plugin.hide = function() {
          plugin.el.fadeOut(300);
        }

        plugin.create = function(layers) {
          var template = "<div class='legende-node' id='{{uniqueID}}_legende'>"+
                            "<p>{{name}}</p>"+
                            "<img onerror='this.src=\"/assets/error.png\"' src='{{url}}?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER={{params.LAYERS}}' />"+
                         "</div>";
          $.each(layers, function(i,el){
            plugin.el.prepend(Mustache.to_html(template, el));
          });
        }

        plugin.destroy = function(layer) {
          plugin.el.find("#"+layer.uniqueID+"_selected").remove();
        }

        init();

    }

})(jQuery);
