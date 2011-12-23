$.widget("ui.featurable", {
  options: {
    layer: null
  },
  _create: function() {
    var self = this;
    if(self.options.layer.modelID) {
      self._loadTemplate();
      self._bindEvents();
    } else {
      self._default();
    }
  },
  
  // Binds a click event on the info button
  _bindEvents: function(){
    var self = this;
    self.element.click(function(e) {
      e.preventDefault();
      layer = map.getLayersBy("uniqueID", self.element.attr("layer_id"))[0]; 
      // Modify the features' control and activate it if needed 
      featureControl = map.getControlsBy("name", "featureInfos")[0];
      featureControl.url = layer.url;
      featureControl.layers = [layer];
      if(self.element.hasClass("ui-state-hover")) {
        featureControl.deactivate(); 
        $(".olMap").css("cursor", "");
        $(".btn-features").removeClass("ui-state-hover");
      } else {
        featureControl.activate();
        $(".olMap").css("cursor", "crosshair");
        $(".btn-features").removeClass("ui-state-hover");
        self.element.toggleClass("ui-state-hover");
      }
    });
  },

  // Loads the layer's template
  _loadTemplate: function() {
    var self = this;
    template_div = $("#template_"+self.options.layer.uniqueID);
    if(!template_div.text()) {
      $.get("/layers/"+self.options.layer.modelID,
      function(data) {
       template_div.text(data.template);
      }, "json");
    }
  },

  // Case where the layer doesn't have a modelID
  _default: function() {
    var self = this;
    $("#features_"+self.options.layer.uniqueID).remove();
  },

  destroy: function() {
    $.Widget.prototype.destroy.apply(this, arguments);
  }
 });
