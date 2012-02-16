$.widget("ui.mustachu", {
  options: {
  },

  _create: function() {
    var self = this;
  },

  _bindEvents: function(layer){
  },
  _addTwipsy: function(){
    var self = this; 
    var twipsy_info = {
      ".btn-destroy": 'Retirer cette couche de la carte',
      ".btn-check" :"Afficher/masquer cette couche",
      ".btn-features" : "Obtenir des informations sur la couche",
      ".btn-save" : "T&eacute;l&eacute;charger le shp",
      ".btn-metadatas" : "Voir la metadonn&eacute;e",
      ".grippy" : "D&eacute;placer la couche"
    }
    for(var info in twipsy_info){
      self.element.find(info).attr('data-original-title', twipsy_info[info]);
    }
   self.element.find('.btn-destroy, .btn-check, .btn-features, .btn-save, .btn-metadatas').twipsy({delayIn: 300, html : true});
   self.element.find('.grippy').twipsy({delayIn: 300, html : true, placement: 'left'});
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
                          "<div class='node-controls-buttons'>"+
                            //check
                            "<a href='#' class='ui-icon-with-text btn-check {{#visibility}} checked {{/visibility}}' id='check_{{uniqueID}}'><span class='ui-icon'></span></a>"+
                            //info
                            "<a href='#' class='ui-icon-with-text btn-features' id='features_{{uniqueID}}' layer_id='{{uniqueID}}'>"+
                              "<span class='ui-icon ui-icon-info'></span></a>"+
                            //shape
                            "{{#false}}"+
                            "<a href='{{url}}?REQUEST=getFeature&service=wfs&outputFormat=shape-zip&typename={{params.LAYERS}}' target='_blank' class='ui-icon-with-text btn-save' id='save_{{uniqueID}}'><span class='ui-icon ui-icon-disk'></span></a>"+
                            "{{/false}}"+
                            //metadata
                            "{{#metadataLink}}"+
                            "<a target='_blank' href='{{metadataLink}}' class='ui-icon-with-text btn-metadatas' id='metadatas_{{uniqueID}}' layer_id='{{uniqueID}}'>"+
                              "<span class='ui-icon ui-icon-note'></span></a>"+
                            "{{/metadataLink}}"+
                            //remove
                            "<a href='#' class='ui-icon-with-text btn-destroy' id='destroy_{{uniqueID}}' layer_id='{{uniqueID}}'>"+
                              "<span class='ui-icon ui-icon-closethick'></span></a>"+
                           "</div>"+
                           "<div class='slider' id='{{uniqueID}}'></div>"+
                          "</div>"+
                           "{{#credits}}<p class='credits'>Source : {{credits}}</p>{{/credits}}"+
                      "</div>"+
                      "<div class='grippy' id='grip_{{uniqueID}}' ></div>"+
                      "<div class='clear' ></div>"+
                   "</div>";
    $.each(layers, function(i,el){
      node = Mustache.to_html(template, el);
      self.element.prepend(node);
      self.element.find("div:first-child .btn-features").featurable({layer: el});
    });
    self._addTwipsy();
  },

  // Generates the legende 
  legendeNodes: function(layers) {
    var self = this;
    var template = "<div class='legende-node' id='{{uniqueID}}_legende'>"+
                      "<p>{{name}}</p>"+
                      "<img onload=\"$('#legend_container').legend('updateSize',this.width)\" onerror='this.src=\"/assets/error.png\"' src='{{url}}?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER={{params.LAYERS}}' />"+
                   "</div>";
    $.each(layers, function(i,el){
      self.element.prepend(Mustache.to_html(template, el));
    });
  },

  destroyLayer: function(layer) {
    var self = this; 
    self.element.find("#"+layer.uniqueID+"_selected").remove();
  },

  destroy: function() {
    $.Widget.prototype.destroy.apply(this, arguments);
  }
 });
