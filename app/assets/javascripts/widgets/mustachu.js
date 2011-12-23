$.widget("ui.mustachu", {
  options: {
  },

  _create: function() {
    var self = this;
  },

  _bindEvents: function(layer){
  },

  // Generates the selected layers
  selectedNodes: function(layers) {
    var self = this;
    var node;
    var template = "<div class='selected-node' id='{{uniqueID}}_selected'>"+
                      "<div class='node'>"+
                        "<div class='node-infos'>"+
                          "<p>{{name}}</p>"+
                          "<span class='template' id='template_{{uniqueID}}'></span>"+
                        "</div>"+
                        "<div class='node-controls'>"+
                          "<a href='#' class='ui-icon-with-text btn-check {{#visibility}} checked {{/visibility}}' id='check_{{uniqueID}}'><span class='ui-icon'></span></a>"+
                          "<a href='#' class='ui-icon-with-text btn-features' id='features_{{uniqueID}}' layer_id='{{uniqueID}}'>"+
                          "<span class='ui-icon ui-icon-info'></span></a>"+
                          "<a href='{{url}}?REQUEST=getFeature&service=wfs&outputFormat=shape-zip&typename={{params.LAYERS}}' target='_blank' class='ui-icon-with-text btn-save' id='save_{{uniqueID}}'><span class='ui-icon ui-icon-disk'></span></a>"+
                          "<div class='slider' id='{{uniqueID}}'></div>"+
                        "</div>"+
                      "</div>"+
                      "<div class='grippy' id='grip_{{uniqueID}}'></div>"+
                   "</div>";
    $.each(layers, function(i,el){
      node = Mustache.to_html(template, el);
      self.element.prepend(node);
      self.element.find("div:first-child .btn-features").featurable({layer: el});
    });
  },

  // Generates the legende 
  legendeNodes: function(layers) {
    var self = this;
    var template = "<div class='legende-node' id='{{uniqueID}}_legende'>"+
                      "<p>{{name}}</p>"+
                      "<img onerror='this.src=\"/assets/error.png\"' src='{{url}}{{request}}{{params.LAYERS}}'/>"+
                   "</div>";
    $.each(layers, function(i,el){
      el['request'] = '?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=';
      self.element.prepend(Mustache.to_html(template, el));
    });
  },

  destroy: function() {
    $.Widget.prototype.destroy.apply(this, arguments);
  }
 });
