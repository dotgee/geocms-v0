$.widget("ui.selectedWidget", {
  options: {
    layers: null 
  },

  _create: function() {
    var self = this;
    self._bindEvents();
    self.createNodes(layers);
  },

  _bindEvents: function(){
  },

  createNodes: function(layers) {
    var view = { layers: layers };
    var template = "{{#layers}}<div class='selected-node' id='{{uniqueID}}_selected'>"+
                      "<div class='node-infos'>"+
                        "<p>{{name}}</p>"+
                        "<span id='template_{{uniqueID}}'></span>"+
                      "</div>"+
                      "<div class='node-controls'>"+
                        "<a href='#' class='ui-icon-with-text btn-check' id='check_{{uniqueID}}'><span class='ui-icon'></span></a>"+
                        "<a href='#' class='ui-icon-with-text btn-features' layer_id='{{uniqueID}}'><span class='ui-icon ui-icon-info'></span></a>"+
                        "<a href='#' class='ui-icon-with-text btn-save' id='save_{{uniqueID}}'><span class='ui-icon ui-icon-disk'></span></a>"+
                        "<div class='slider' id='{{uniqueID}}'></div>"+
                      "</div>"+
                   "</div>{{/layers}}";
    self.element.append(Mustache.to_html(template, view));
  },

  destroy: function() {
    $.Widget.prototype.destroy.apply(this, arguments);
  }
 });
