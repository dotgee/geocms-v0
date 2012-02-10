$.widget("ui.sliderLink", {
  options: {
    position: "right",
    panelHeight: 200,
    parent: null,
    visiblePanel: false
  },
  _create: function() {
    var self = this;
    self.category_slider = self.options.parent;
    self.visiblePanel = self.options.visiblePanel;
    self.element.addClass('ui-sliderLink');
    self.panel = self.element.next('.category_description').sliderPanel({
                                                                height: self.options.panelHeight,
                                                                position: self.options.position,
                                                                title: self.element.html()
                                                                });
    self.element.addClass('ui-accordion-header ui-helper-reset ui-state-default ui-corner-all');
    self._addIcon();
    self._bindEvents();
  },
  filtered: function(selector){
    var self = this;
    self._layerContainers().each(function(i, el){
      var element = $(el);
      var will_hide = true;
      for(var sel in selector){
        if(element.is(selector[sel])){
          will_hide = false;
          element.removeClass('filtered_layer')
        }
      }
      if(will_hide){
        element.addClass('filtered_layer');
      }
    });
  },
  unfilter: function(){
    var self = this;
    self._layerContainers().each(function(i, el){
      $(el).removeClass('filtered_layer').show();
    });
  },
  hideFilteredLayers: function(){
    var self = this;
    self._description().find('.category_layer_container').each(function(i,el){
        var elt =$(el);
      if(elt.is('.filtered_layer')){
        elt.hide();
      }else{
        elt.show();
      }
    
    });
    if(self._layerContainers().length == self._description().find('.filtered_layer').length){
        self.element.slideUp();
      }else{
        self.element.slideDown();
      }
  },
  updateLayersCount: function(){
    var self = this;
    var nb = self.element.find(".nb_layers").first();
    nb.html("("+self.nbLayers()+")");
    self.panel.sliderPanel('updateLayersCount');
  },
  nbLayers: function(){
    var self = this;
    return self.panel.sliderPanel('nbNotFilteredLayer');
  },
  _layerContainers : function(){
    var self = this;
    var cat_desc = self._description();
    if(!self.layerContainers){
      if(cat_desc){
        self.layerContainers =  cat_desc.find('.category_layer_container');
      }else{
        self.layerContainers = []; 
      }
    }
    return self.layerContainers;
  
  },
  _description: function(){
    var self = this;
    if(!self.description){
      self.description = self.element.next('.category_description').first();
    }
    return self.description
  },
  _showPanel: function(){
    var self = this; 
    self._showArrow();
    self.panel.sliderPanel('show');
    //if (self.element.is('h3')){
      self.element.addClass('selected');
    //}else{
    //  self.element.parent().prev('h3').addClass('selected');
    //}
    self.visiblePanel = true;
  },
  _hidePanel: function(){
    var self = this; 
    self._hideArrow();
    self.panel.sliderPanel('hide');
    self.element.removeClass('selected');
    self.visiblePanel = false;
  },
  _showArrow: function(){
      this.icon.addClass('ui-icon-triangle-1-w').removeClass('ui-icon-triangle-1-e');
  },
  _hideArrow: function(){
      this.icon.addClass('ui-icon-triangle-1-e').removeClass('ui-icon-triangle-1-w');
  },
  _bindEvents: function(){
    var self = this;
    self.element.click(function(e){
      e.preventDefault();
      if(self.visiblePanel){
        self._hidePanel();
      }else{
        $(self.category_slider).categorySlider('willShow',self.element);
        self._showPanel();
      }
    });
  },
  openPanel: function(){
    var self = this;
    this._showPanel();
  },
  closePanel: function(){
    var self = this;
    this._hidePanel();
  },
  _addIcon: function(){
      var self = this;
      var icon = $('<span class="ui-icon ui-icon-triangle-1-e"></span>'); 
      this.element.prepend(icon);
      self.icon = self.element.find('.ui-icon').first();
  },
  destroy: function() {
    $.Widget.prototype.destroy.apply(this, arguments);
  }
 });
